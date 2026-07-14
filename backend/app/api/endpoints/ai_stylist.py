from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter()

class ImageRequest(BaseModel):
    resultUrl: str = None

@router.post("/stylist")
def get_stylist_analysis(request: ImageRequest):
    # In production, send the resultUrl to OpenAI/Gemini Vision API
    # and parse the response into this structured format, saving it to PostgreSQL.
    
    return {
        "overallScore": 87,
        "bodyType": {
            "detected": "Athletic",
            "confidence": 0.89,
            "recommendations": [
                "Structured blazers complement your proportions",
                "V-neck and scoop necklines create visual balance",
                "Straight-leg pants enhance your silhouette"
            ]
        },
        "colorAnalysis": {
            "skinTone": "Warm Medium",
            "bestColors": [
                {"name": "Navy Blue", "hex": "#1B365D", "reason": "Sophisticated contrast"},
                {"name": "Emerald", "hex": "#046A38", "reason": "Complements warm undertones"}
            ],
            "avoidColors": [
                {"name": "Neon Yellow", "hex": "#DFFF00", "reason": "Washes out warm tones"}
            ]
        },
        "occasions": [
            {"name": "Business", "icon": "💼", "rating": 9, "tips": "Boardroom-ready style."},
            {"name": "Casual", "icon": "☀️", "rating": 8, "tips": "Effortlessly polished look."}
        ],
        "accessories": [
            {"type": "Watch", "suggestion": "Minimalist silver watch", "icon": "⌚"},
            {"type": "Shoes", "suggestion": "Clean white sneakers", "icon": "👞"}
        ],
        "seasonRecommendation": {
            "best": "Fall/Autumn",
            "icon": "🍂",
            "reason": "Color palette is ideal for transitional weather."
        },
        "fashionAdvice": [
            "This outfit transitions well from day to evening.",
            "Consider layering with a neutral-toned jacket."
        ]
    }

@router.post("/score")
def get_outfit_score(request: ImageRequest):
    overall = random.randint(75, 95)
    return {
        "overall": overall,
        "categories": [
            {"name": "Color Harmony", "score": random.randint(75, 98), "icon": "🎨", "description": "Color compliment score"},
            {"name": "Style Match", "score": random.randint(75, 98), "icon": "✨", "description": "Cohesion score"},
            {"name": "Fit Quality", "score": random.randint(75, 98), "icon": "📐", "description": "Proportions score"},
            {"name": "Professional", "score": random.randint(75, 98), "icon": "💼", "description": "Work appropriateness"},
            {"name": "Fashion Score", "score": random.randint(75, 98), "icon": "👗", "description": "Trend alignment"},
            {"name": "Confidence", "score": random.randint(75, 98), "icon": "💪", "description": "Confidence boost"}
        ],
        "summary": "Great outfit! Strong scores with minor areas for improvement."
    }
