from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None
    
db_instance = Database()

async def connect_to_mongo():
    try:
        db_instance.client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
        db_instance.db = db_instance.client.get_database("healthcare_db")
        print("Connected to MongoDB!")
    except Exception as e:
        print(f"Warning: Could not connect to MongoDB: {e}")
    
async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        print("Closed MongoDB connection.")
        
def get_database():
    return db_instance.db