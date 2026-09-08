from app.database.mongodb import MongoDB
from app.database.collections import Collections
from typing import List, Dict, Any, Optional
from bson import ObjectId

class PredictionService:
    @staticmethod
    async def save_prediction(prediction_data: Dict[str, Any]) -> str:
        prediction_id = await MongoDB.insert_one(Collections.PREDICTIONS, prediction_data)
        return str(prediction_id)
    
    @staticmethod
    async def get_prediction_for_patient(patient_id : str) -> List[Dict[str, Any]]:
        return await MongoDB.find(Collections.PREDICTIONS, {"patient_id" : patient_id})
    
    @staticmethod
    async def get_prediction_by_id(prediction_id: str) -> Optional[Dict[str, Any]]:
        try:
           return await MongoDB.find_one(Collections.PREDICTIONS, {"_id": ObjectId(prediction_id)}) 
        except Exception:
            return None