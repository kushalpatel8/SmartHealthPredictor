from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URI: str
    FRONTEND_URL: str
    CLERK_SECRET_KEY: str
    MAX_UPLOAD_SIZE_MB: int = 10
    
    class Config:
        env_file = ".env"
        
settings = Settings()   