from fastapi import APIRouter, Depends, HTTPException
from app.services.analyticsService import AnalyticsService
from app.api.auth import get_current_user

router = APIRouter()

@router.grt("/dashboard")
async def get_dashboard(current_user = Depends(get_current_user)):
    try:
        metrics = await AnalyticsService.get_dashboard_matrics(str(current_user.id))
        return {"status" : "success", "data" : metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))