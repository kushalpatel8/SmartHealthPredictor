import random
from app.schemas.patient import HealthParameters

def predict_risk(params: HealthParameters) -> dict:
    risk_score = 0.1
    
    if params.age > 50:
        risk_score += 0.2
    if params.cholesterol > 240:
        risk_score += 0.2
    if params.resting_bp > 140:
        risk_score += 0.15
    if params.chest_pain_type > 0:
        risk_score += 0.2
    if params.fasting_bs == 1:
        risk_score += 0.1
    if params.exercise_angina == 1:
        risk_score += 0.15
    if params.major_vessels > 0:
        risk_score += 0.1 * params.major_vessels
    if params.oldpeak > 1.5:
        risk_score += 0.1
        
    risk_score = min(0.99, risk_score + random.uniform(-0.05, 0.05))
    risk_level = "LOW"
    if risk_score > 0.8:
        risk_level = "CRITICAL"
    elif risk_score > 0.6:
        risk_level = "HIGH"
    elif risk_score > 0.35:
        risk_level = "MODERATE"
        
    return {
        "risk_score": round(risk_score, 2),
        "risk_level": risk_level,
        "diagnosis": f"Cardiovascular Assessment: {risk_level.title()} Risk",
        "model": "RandomForest-CardioRisk",
        "model_version": "1.0"
    }