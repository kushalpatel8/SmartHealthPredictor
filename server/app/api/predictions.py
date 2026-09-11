from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from app.schemas.patient import HealthParameters
from app.schemas.user import UserResponse
from app.database.connection import get_database
from app.api.auth import get_current_user
from app.ml.predict_heart_disease import predict_risk

router = APIRouter()

@router.post("/")
async def generate_anonymous_prediction(params: HealthParameters, current_user: UserResponse = Depends(get_current_user)):
    prediction_result = predict_risk(params)
    return prediction_result

@router.post("/{patient_id}")
async def generate_prediction(patient_id: str, params: HealthParameters, db = Depends(get_database), current_user: UserResponse = Depends(get_current_user)):
    try:
        patient = await db["patients"].find_one({"_id": ObjectId(patient_id), "created_by": current_user.id})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid patient ID")
        
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
        

    prediction_result = predict_risk(params)

    history_record = {
        "patient_id": patient_id,
        "created_by": current_user.id,
        "created_at": datetime.utcnow(),
        "parameters": params.model_dump(),
        "result": prediction_result
    }
    await db["predictions"].insert_one(history_record)
    return prediction_result

@router.get("/{patient_id}/history")
async def get_prediction_history(patient_id: str, db = Depends(get_database), current_user: UserResponse = Depends(get_current_user)):
    try:
        patient = await db["patients"].find_one({"_id": ObjectId(patient_id), "created_by": current_user.id})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid patient ID")
        
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    cursor = db["predictions"].find({"patient_id": patient_id}).sort("created_at", -1)
    history = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        history.append(doc)   
    return history
