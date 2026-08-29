from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class PatientModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    name: str
    age: int
    gender: str
    created_at = datetime(default_factory = datetime.utcnow)