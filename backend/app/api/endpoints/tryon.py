from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import httpx
import asyncio
import os
from app.core.config import settings

router = APIRouter()

class TryOnRequest(BaseModel):
    # Common
    task_type: str = "clothing" # "clothing" or "hijab"
    model_image: str # Base64
    garment_image: str # Base64
    
    # Fashn specific
    garment_photo_type: str = "auto"
    category: str = "auto"
    mode: str = "balanced"
    segmentation_free: bool = True
    seed: int = 0
    num_samples: int = 1
    api_key: str = None
    model_name: str = "tryon-v1.6"

async def process_fashn(request: TryOnRequest, api_key: str):
    async with httpx.AsyncClient(timeout=120.0) as client:
        # Fashn expects raw base64 without data URI prefix
        def strip_prefix(b64: str):
            if "," in b64:
                return b64.split(",")[1]
            return b64
            
        payload = {
            "model_name": request.model_name,
            "inputs": {
                "model_image": strip_prefix(request.model_image),
                "garment_image": strip_prefix(request.garment_image),
                "category": request.category,
                "garment_photo_type": request.garment_photo_type,
                "mode": request.mode,
                "segmentation_free": request.segmentation_free,
                "seed": request.seed,
                "num_samples": request.num_samples
            }
        }
        
        # 1. Start prediction
        run_res = await client.post(
            "https://api.fashn.ai/v1/run",
            headers={"Authorization": f"Bearer {api_key}"},
            json=payload
        )
        if run_res.status_code != 200:
            raise HTTPException(status_code=run_res.status_code, detail=run_res.text)
            
        pred_id = run_res.json().get("id")
        if not pred_id:
            raise HTTPException(status_code=500, detail="Failed to get Fashn prediction ID")
            
        # 2. Poll for status
        for _ in range(90): # 3 minutes max (2s intervals)
            status_res = await client.get(
                f"https://api.fashn.ai/v1/status/{pred_id}",
                headers={"Authorization": f"Bearer {api_key}"}
            )
            if status_res.status_code == 200:
                data = status_res.json()
                if data["status"] == "completed":
                    return {"output": data["output"]}
                elif data["status"] == "failed":
                    raise HTTPException(status_code=500, detail=data.get("error", "Fashn generation failed"))
            await asyncio.sleep(2)
            
        raise HTTPException(status_code=504, detail="Fashn API timeout")


async def process_huggingface_hijab(request: TryOnRequest, hf_token: str):
    """
    Process Hijab transfer using Hugging Face's official Python SDK.
    Uses the InferenceClient for reliable image-to-image editing.
    """
    import base64
    import traceback
    from io import BytesIO
    from PIL import Image
    
    def strip_prefix(b64: str):
        if "," in b64:
            return b64.split(",")[1]
        return b64

    try:
        # Step 1: Decode image
        print("[HuggingFace] Step 1: Decoding base64 image...")
        model_image_b64 = strip_prefix(request.model_image)
        image_bytes = base64.b64decode(model_image_b64)
        input_image = Image.open(BytesIO(image_bytes)).convert("RGB")
        print(f"[HuggingFace] Step 1 OK: Image decoded, size={input_image.size}")
        
        # Step 2: Resize if too large
        max_size = 512
        if input_image.width > max_size or input_image.height > max_size:
            input_image.thumbnail((max_size, max_size), Image.LANCZOS)
            print(f"[HuggingFace] Step 2: Resized image to {input_image.size}")

        # Step 3: Prepare prompt
        prompt = (
            "Add a beautiful, elegant hijab headscarf to the woman in this photo. "
            "Wrap the hijab neatly around her head and neck. "
            "Keep her face, expression, and identity perfectly preserved. "
            "Make it look natural and realistic."
        )

        # Step 4: Convert image to bytes for the API
        print("[HuggingFace] Step 3: Converting image to bytes for API...")
        img_buffer = BytesIO()
        input_image.save(img_buffer, format="JPEG", quality=85)
        img_buffer.seek(0)
        img_bytes_for_api = img_buffer.read()
        print(f"[HuggingFace] Step 3 OK: Image bytes size = {len(img_bytes_for_api)}")

        # Step 5: Call HuggingFace API directly with raw bytes
        print(f"[HuggingFace] Step 4: Calling API with token starting with {hf_token[:10]}...")
        
        async with httpx.AsyncClient(timeout=180.0) as client:
            # Send image as raw bytes with prompt in parameters
            res = await client.post(
                "https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix",
                headers={
                    "Authorization": f"Bearer {hf_token}",
                    "X-Wait-For-Model": "true",
                },
                content=img_bytes_for_api,
                timeout=180.0
            )
            
            print(f"[HuggingFace] Step 4 Response: status={res.status_code}, content-type={res.headers.get('content-type', 'unknown')}, size={len(res.content)}")

            if res.status_code != 200:
                error_text = res.text[:1000]
                print(f"[HuggingFace] API Error: {error_text}")
                raise HTTPException(status_code=500, detail=f"HuggingFace API Error ({res.status_code}): {error_text}")

            # Check if response is an image
            content_type = res.headers.get("content-type", "")
            if "image" in content_type or len(res.content) > 1000:
                result_b64 = base64.b64encode(res.content).decode("utf-8")
                print("[HuggingFace] SUCCESS! Image generated!")
                return {"output": [f"data:image/png;base64,{result_b64}"]}
            else:
                error_text = res.text[:500]
                print(f"[HuggingFace] Non-image response: {error_text}")
                raise HTTPException(status_code=500, detail=f"HF returned non-image: {error_text}")

    except HTTPException:
        raise
    except Exception as e:
        full_error = traceback.format_exc()
        print(f"[HuggingFace] FULL ERROR TRACEBACK:\n{full_error}")
        raise HTTPException(status_code=500, detail=f"HuggingFace Error: {type(e).__name__}: {str(e)}")


import random

DEMO_RESULTS_CLOTHING = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
]

DEMO_RESULTS_HIJAB = [
    "https://images.unsplash.com/photo-1609430528048-8e6a9d0a3e17?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?q=80&w=800&auto=format&fit=crop",
]

@router.post("/")
async def generate_tryon(request: TryOnRequest):
    """
    AI Router Endpoint:
    Routes requests to the appropriate AI model based on the task type.
    Falls back to a Mock Backend if API keys are missing.
    """
    if request.task_type == "hijab":
        hf_token = os.environ.get("HF_API_KEY")
        if not hf_token:
            # MOCK MODE FOR HIJAB
            await asyncio.sleep(3)
            return {
                "output": [random.choice(DEMO_RESULTS_HIJAB)],
                "isDemo": True,
                "message": "Mock Mode — HF_API_KEY is missing. Returning a stock demo image."
            }
        return await process_huggingface_hijab(request, hf_token)
        
    else:
        api_key = request.api_key or settings.FASHN_API_KEY
        if not api_key:
            # MOCK MODE FOR CLOTHING
            await asyncio.sleep(3)
            return {
                "output": [random.choice(DEMO_RESULTS_CLOTHING)],
                "isDemo": True,
                "message": "Mock Mode — FASHN API key is missing. Returning a stock demo image."
            }
        return await process_fashn(request, api_key)
