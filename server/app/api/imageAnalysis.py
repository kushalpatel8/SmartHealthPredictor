from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.cv.analyzer import analyze_scan
from app.api.auth import get_current_user
import tempfile
import os
import shutil

router = APIRouter()

@router.post("/analyze")
async def upload_and_analyze(file: UploadFile = File(...), current_user=Depends(get_current_user)):
    if not file.filename.endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Invalid file type")        
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
            shutil.copyfileobj(file.file, temp)
            temp_path = temp.name
        results = analyze_scan(temp_path)
        os.remove(temp_path)       
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
