from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import httpx
import asyncio
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


async def process_fal_hijab(request: TryOnRequest, fal_key: str):
    """
    Process Hijab transfer using Fal.ai.
    We use Flux PuLID (Identity Preserving) to generate the user with the hijab,
    passing the hijab as an image prompt.
    """
    async with httpx.AsyncClient(timeout=120.0) as client:
        # Fal.ai generally accepts data URIs
        model_image_uri = request.model_image if request.model_image.startswith("data:") else f"data:image/jpeg;base64,{request.model_image}"
        garment_image_uri = request.garment_image if request.garment_image.startswith("data:") else f"data:image/jpeg;base64,{request.garment_image}"
        
        payload = {
            "prompt": "A photorealistic portrait of this person wearing the specific hijab style and fabric from the reference image. High quality, detailed, natural lighting, seamless integration.",
            "reference_images": [
                {
                    "image_url": model_image_uri,
                    "type": "identity", # PuLID identity preservation
                    "weight": 1.0
                },
                {
                    "image_url": garment_image_uri,
                    "type": "style", # Style transfer for the hijab
                    "weight": 0.8
                }
            ],
            "num_inference_steps": 28,
            "guidance_scale": 3.5,
            "width": 768,
            "height": 1024
        }
        
        res = await client.post(
            "https://queue.fal.run/fal-ai/flux-pulid",
            headers={
                "Authorization": f"Key {fal_key}",
                "Content-Type": "application/json"
            },
            json=payload
        )
        if res.status_code != 200:
            raise HTTPException(status_code=res.status_code, detail=res.text)
            
        # Fal.run queue gives us a status URL
        request_id = res.json().get("request_id")
        
        for _ in range(60):
            status_res = await client.get(
                f"https://queue.fal.run/fal-ai/flux-pulid/requests/{request_id}/status",
                headers={"Authorization": f"Key {fal_key}"}
            )
            if status_res.status_code == 200:
                data = status_res.json()
                if data.get("status") == "COMPLETED":
                    # Get final result
                    result_res = await client.get(
                        f"https://queue.fal.run/fal-ai/flux-pulid/requests/{request_id}",
                        headers={"Authorization": f"Key {fal_key}"}
                    )
                    images = result_res.json().get("images", [])
                    if images:
                        return {"output": [images[0]["url"]]}
                    break
                elif data.get("status") == "IN_QUEUE" or data.get("status") == "IN_PROGRESS":
                    await asyncio.sleep(1)
                    continue
                else:
                    raise HTTPException(status_code=500, detail="Fal API processing failed")
                    
        raise HTTPException(status_code=504, detail="Fal API timeout")


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
        fal_key = settings.FAL_KEY
        if not fal_key:
            # MOCK MODE FOR HIJAB
            await asyncio.sleep(3)
            return {
                "output": [random.choice(DEMO_RESULTS_HIJAB)],
                "isDemo": True,
                "message": "Mock Mode — Fal.ai API key is missing. Returning a stock demo image."
            }
        return await process_fal_hijab(request, fal_key)
        
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
