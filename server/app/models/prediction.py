from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class PredictionModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    patient_id: str
    user_id: str
    health_parameters: Dict[str, Any]
    risk_score: float
    diagnosis: str
    created_at: datetime = Field(default_factory=datetime.utcnow)