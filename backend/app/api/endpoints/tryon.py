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
    Process Hijab transfer using Hugging Face's free Inference API
    with the instruct-pix2pix model for image-to-image editing.
    """
    import base64
    import json
    
    async with httpx.AsyncClient(timeout=180.0) as client:
        def strip_prefix(b64: str):
            if "," in b64:
                return b64.split(",")[1]
            return b64

        # Decode the model (person) image from base64 to raw bytes
        model_image_b64 = strip_prefix(request.model_image)
        image_bytes = base64.b64decode(model_image_b64)

        # The instruction prompt for instruct-pix2pix
        prompt = (
            "Add a beautiful, elegant hijab headscarf to the woman in this photo. "
            "Wrap the hijab neatly around her head and neck. "
            "Keep her face, expression, and identity perfectly preserved. "
            "Make it look natural and realistic."
        )

        print("[HuggingFace] Sending image to instruct-pix2pix model...")

        # HuggingFace image-to-image API: send image as raw bytes
        # with prompt in the parameters via query or headers
        headers = {
            "Authorization": f"Bearer {hf_token}",
            "Content-Type": "application/octet-stream",
            "X-Wait-For-Model": "true",
        }
        
        # Send raw image bytes as body, with prompt as query parameter
        api_url = "https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix"
        
        # Method: Send as multipart with parameters
        import io
        
        # Build the request with image bytes and parameters
        res = await client.post(
            api_url,
            headers={
                "Authorization": f"Bearer {hf_token}",
                "Accept": "image/png",
            },
            json={
                "inputs": {
                    "image": model_image_b64,
                    "prompt": prompt,
                },
                "parameters": {
                    "image_guidance_scale": 1.5,
                    "guidance_scale": 7.5,
                    "num_inference_steps": 30
                }
            },
            timeout=180.0
        )

        # If the model needs to wake up (cold start), wait and retry
        if res.status_code == 503:
            print("[HuggingFace] Model is loading, waiting...")
            try:
                wait_time = res.json().get("estimated_time", 30)
            except Exception:
                wait_time = 30
            await asyncio.sleep(min(wait_time, 60))
            
            # Retry
            res = await client.post(
                api_url,
                headers={
                    "Authorization": f"Bearer {hf_token}",
                    "Accept": "image/png",
                },
                json={
                    "inputs": {
                        "image": model_image_b64,
                        "prompt": prompt,
                    },
                    "parameters": {
                        "image_guidance_scale": 1.5,
                        "guidance_scale": 7.5,
                        "num_inference_steps": 30
                    }
                },
                timeout=180.0
            )

        if res.status_code != 200:
            error_detail = res.text
            print(f"[HuggingFace] API Error ({res.status_code}): {error_detail}")
            raise HTTPException(
                status_code=res.status_code, 
                detail=f"HuggingFace API Error: {error_detail}"
            )

        # Check if response is an image (binary) or JSON error
        content_type = res.headers.get("content-type", "")
        if "image" in content_type:
            # Success! Response is raw image bytes
            result_b64 = base64.b64encode(res.content).decode("utf-8")
            print("[HuggingFace] Successfully generated hijab image!")
            return {"output": [f"data:image/png;base64,{result_b64}"]}
        else:
            # Response might be JSON with an error or a base64 image
            try:
                data = res.json()
                if isinstance(data, list) and len(data) > 0 and "generated_image" in data[0]:
                    return {"output": [f"data:image/png;base64,{data[0]['generated_image']}"]}
                else:
                    print(f"[HuggingFace] Unexpected response: {data}")
                    raise HTTPException(status_code=500, detail=f"Unexpected HF response: {json.dumps(data)[:500]}")
            except Exception as e:
                # If it's not JSON either, try treating the raw content as an image
                result_b64 = base64.b64encode(res.content).decode("utf-8")
                return {"output": [f"data:image/png;base64,{result_b64}"]}


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
