from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import httpx
from app.core.config import settings

router = APIRouter()

class TryOnRequest(BaseModel):
    model_image: str
    garment_image: str
    garment_photo_type: str = "auto"
    category: str = "auto"
    mode: str = "balanced"
    segmentation_free: bool = True
    seed: int = 0
    num_samples: int = 1
    api_key: str = None
    model_name: str = "tryon-v1.6"

@router.post("/")
async def generate_tryon(request: TryOnRequest):
    # This replaces the Next.js API route.
    # In a full implementation, you would save the request to PostgreSQL here.
    
    api_key = request.api_key or settings.FASHN_API_KEY
    if not api_key:
        raise HTTPException(status_code=401, detail="FASHN API key is required")

    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            response = await client.post(
                "https://api.fashn.ai/v1/run",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model_image": request.model_image,
                    "garment_image": request.garment_image,
                    "category": request.category,
                    "garment_photo_type": request.garment_photo_type,
                    "mode": request.mode,
                    "segmentation_free": request.segmentation_free,
                    "seed": request.seed,
                    "num_samples": request.num_samples,
                    "model_name": request.model_name
                }
            )
            response.raise_for_status()
            data = response.json()
            
            # In production, save the data.output URLs to PostgreSQL TryOnResult table here
            
            return data
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
