from fastapi import APIRouter

router = APIRouter()

@router.get("/me")
def get_current_user():
    return {"message": "Current user mock - replace with JWT auth logic"}
