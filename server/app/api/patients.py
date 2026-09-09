from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from app.schemas.patient import PatientCreate, PatientResponse, PatientUpdate
from app.schemas.user import UserResponse
from app.database.connection import get_database
from app.api.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def create_patient(patient : PatientCreate, db = Depends(get_database), current_user: UserResponse = Depends(get_current_user)):
    patient_dict = patient.model_dump()
    patient_dict["created_at"] = datetime.utcnow
    patient_dict["created_by"] = current_user.id
    
    result = await db["patients"].insert_one(patient_dict)
    patient_dict["id"] = str(result.inserted_id)
    return PatientResponse(**patient_dict)

@router.get("/", response_model=List[PatientResponse])
async def get_patients(db = Depends(get_database), current_user: UserResponse = Depends(get_database)):
    patients_cursor = db["patients"].find({"created_by" : current_user.id})
    pateints = []
    async for doc in patients_cursor:
        doc["id"] = str(doc["_id"])
        pateints.append(PatientResponse(**doc))
    return pateints

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(patient_id : str, db = Depends(get_database), current_user: UserResponse = Depends(get_database)):
    try:
        doc = await db["patients"].find_one({"_id": ObjectId(patient_id), "created_by": current_user.id})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid patient ID")
    
    if not doc:
        raise HTTPException(status_code=404, detail="Patient Not Found")
    
    doc["id"] = str(doc["_id"])
    return PatientResponse(**doc)

@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(patient_id: str, db = Depends(get_database), current_user: UserResponse = Depends(get_database)):
    try:
        result = await db["patients"].delete_one({"_id": ObjectId(patient_id), "created_by": current_user.id})    
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Patient Id")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Patient Not Found")
    return None
    
