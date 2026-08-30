from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class HealthParameters(BaseModel):
    age: int = Field(..., gt=0, lt=120)
    gender: int = Field(..., description="1 = male, 0 = female")
    chest_pain_type: int = Field(..., ge=0, le=3)
    resting_bp: int = Field(..., gt=0)
    cholesterol: int = Field(..., gt=0)
    fasting_bs: int = Field(..., ge=0, le=1)
    resting_ecg: int = Field(..., ge=0, le=2)
    max_hr: int = Field(..., gt=0)
    exercise_angina: int = Field(..., ge=0, le=1)
    oldpeak: float
    st_slope: int = Field(..., ge=0, le=2)
    major_vessels: int = Field(..., ge=0, le=4)
    thalassemia: int = Field(..., ge=0, le=3)
    
class PatientBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    age: Optional[int] = Field(None, gt=0, lt=120)
    gender: Optional[str] = None
    contact_info: Optional[str] = None
    existing_conditions: Optional[List[str]] = []

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: str
    created_at: datetime
    created_by: str

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = Field(None, gt=0, lt=120)
    gender: Optional[str] = None
    contact_info: Optional[str] = None
    existing_conditions: Optional[List[str]] = None
    