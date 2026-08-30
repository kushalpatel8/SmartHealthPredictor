from pydantic import BaseModel
from typing import Optional, List

class SymtomsRequest(BaseModel):
    symptoms: List[str] = []
    description: Optional[str] = None
    
class SymptomsResponse(BaseModel):
    disease: str
    confidence_score: float
    recommendation: List[str]
    urgency: str