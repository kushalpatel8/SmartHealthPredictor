from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.config import settings
from app.database.connection import connect_to_mongo, close_mongo_connection
from app.api import auth, patients, predictions, imageAnalysis, symptoms, analytics
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()
    
app = FastAPI(
    title="AI Healthcare Risk Prediction API",
    description="Backend API for healthcare dashboard",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(patients.router, prefix="/api/patients", tags=["Patients"])
app.include_router(predictions.router, prefix="/api/predictions", tags=["Predictions"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(imageAnalysis.router, prefix="/api/cv", tags=["Computer Vision"])
app.include_router(symptoms.router, prefix="/api/symptoms", tags=["Symptom Checker"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to AI Healthcare API"}