from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import UserResponse
from app.api.auth import get_current_user
from app.schemas.symptoms import SymptomsResponse, SymtomsRequest
from app.ml.predict_symptoms import predict_disease_from_symptoms

router = APIRouter()

@router.post("/predict", response_model=SymptomsResponse)
async def predict_symptoms(request: SymtomsRequest, current_user: UserResponse = Depends(get_current_user)):
    try:
        prediction = predict_disease_from_symptoms(request.symptoms, request.description)
        return SymptomsResponse(**prediction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))