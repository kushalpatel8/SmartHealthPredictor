from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class Database:
    client : AsyncIOMotorClient = None
    db = None
    
db_instance = Database()

async def connect_to_mongo():
    db_instance.client = AsyncIOMotorClient(settings.MONGODB_URI)
    db_instance.db = db_instance.client.get_database("healthcare_db")
    print("Connect to MongoDB!")
    
async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        print("Closed MongoDB connection.")
        
def get_database():
    return db_instance.db