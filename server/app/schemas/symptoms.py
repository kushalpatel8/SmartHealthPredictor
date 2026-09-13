from pydantic import BaseModel, Field
from typing import Optional, List

class SymptomsRequest(BaseModel):
    symptoms: List[str] = []
    description: Optional[str] = None

# Backward compatibility alias
SymtomsRequest = SymptomsRequest

class SymptomsResponse(BaseModel):
    disease: str
    confidence_score: float
    recommendations: List[str] = []
    urgency: str = "Low"