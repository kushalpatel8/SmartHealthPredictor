from app.database.mongodb import MongoDB
from app.database.collections import Collections
from typing import Dict, Any

class AnalyticsService:
    @staticmethod
    async def get_dashboard_matrics(user_id: str) -> Dict[str,Any]:
        patients = await MongoDB.find(Collections.PATIENTS, {"user_id", user_id})
        predictions = await MongoDB.find(Collections.ANALYTICS, {"user_id", user_id})
        
        high_risk = sum(1 for p in predictions if p.get("risk_score", 0) > 0.7)
        
        return {
            "total_patients" : len(patients),
            "total_predictions" : len(predictions),
            "high_risk_cases" : high_risk
        }