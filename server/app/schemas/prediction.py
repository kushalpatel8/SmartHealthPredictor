from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime

class PredictionRequest(BaseModel):
    patient_id : str
    health_parameters: Dict[str, Any]
    
class PredictionResponse(BaseModel):
    id : str
    patient_id: str
    risk_score: float
    daignosis: str
    created_at: datetime