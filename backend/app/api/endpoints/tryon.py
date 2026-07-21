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


async def process_gemini_hijab(request: TryOnRequest, api_key: str):
    """
    Process Hijab transfer using Gemini 3 Pro Image editing capabilities.
    """
    async with httpx.AsyncClient(timeout=120.0) as client:
        def strip_prefix(b64: str):
            if "," in b64:
                return b64.split(",")[1]
            return b64
            
        prompt = (
            "You are an expert AI image editor. I am providing you with two images: "
            "1. A portrait of a woman. "
            "2. A reference image of a hijab. "
            "Your task is to edit the portrait image. You must preserve the woman's identity, "
            "preserve her exact facial features, preserve her expression, and preserve the original lighting and background. "
            "You must transfer ONLY the hijab style, color, folds, and fabric from the reference image onto her head. "
            "Do not alter her body, her existing clothing (like her shirt), or anything else. "
            "Return ONLY the generated image."
        )

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {"text": prompt},
                        {
                            "inline_data": {
                                "mime_type": "image/jpeg",
                                "data": strip_prefix(request.model_image)
                            }
                        },
                        {
                            "inline_data": {
                                "mime_type": "image/jpeg",
                                "data": strip_prefix(request.garment_image)
                            }
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2
            }
        }
        
        # We use the generateContent endpoint as seen in the user's error log
        res = await client.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent?key={api_key}",
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        if res.status_code != 200:
            print("Gemini API Error:", res.text)
            raise HTTPException(status_code=res.status_code, detail=f"Gemini API Error: {res.text}")
            
        data = res.json()
        
        # Attempt to extract image data from the response parts
        try:
            parts = data["candidates"][0]["content"]["parts"]
            image_b64 = None
            for part in parts:
                if "inlineData" in part:
                    image_b64 = part["inlineData"]["data"]
                    break
                # Some alpha models might return the image in a different field
                if "executableCode" in part:
                    pass
            
            if image_b64:
                return {"output": [f"data:image/jpeg;base64,{image_b64}"]}
            else:
                # If the model didn't return an image, fallback or error
                text_response = parts[0].get("text", "No image returned")
                print("Gemini returned text instead of image:", text_response)
                raise HTTPException(status_code=500, detail="Gemini returned text instead of an image.")
                
        except (KeyError, IndexError) as e:
            print("Failed to parse Gemini response:", data)
            raise HTTPException(status_code=500, detail="Invalid response format from Gemini API")


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
        gemini_key = os.environ.get("GEMINI_API_KEY")
        if not gemini_key:
            # MOCK MODE FOR HIJAB
            await asyncio.sleep(3)
            return {
                "output": [random.choice(DEMO_RESULTS_HIJAB)],
                "isDemo": True,
                "message": "Mock Mode — GEMINI_API_KEY is missing. Returning a stock demo image."
            }
        return await process_gemini_hijab(request, gemini_key)
        
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
