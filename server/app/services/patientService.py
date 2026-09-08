from app.database.mongodb import MongoDB
from app.database.collections import Collections
from typing import List, Dict, Any, Optional
from bson import ObjectId

class PatientServices:
    @staticmethod
    async def create_patient(patient_data: Dict[str, Any]) -> str:
        patient_id = await MongoDB.insert_one(Collections.PATIENTS, patient_data)
        return str(patient_id)
    
    @staticmethod
    async def get_patients_by_user(user_id: str) -> List[Dict[str, Any]]:
        return await MongoDB.find(Collections.PATIENTS, {"user_id", user_id})
    
    @staticmethod
    async def get_patient_by_id(patient_id: str) -> Optional[Dict[str, Any]]:
        try:
            return await MongoDB.find_one(Collections.PATIENTS, {"_id": ObjectId(patient_id)})
        except Exception:
            return None
        
    @staticmethod
    async def update_patient(patient_id: str, update_data: Dict[str, Any]) -> int:
        try:
            return await MongoDB.update_one(Collections.PATIENTS, {"_id": ObjectId(patient_id)}, update_data)
        except Exception:
            return 0