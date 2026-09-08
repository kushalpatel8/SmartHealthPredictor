from app.database.mongodb import MongoDB
from app.database.collections import Collections
from app.utils.security import get_password_hash, verify_password
from typing import Optional, Dict, Any
from bson import ObjectId

class AuthServices:
    @staticmethod
    async def create_user(user_data: Dict[str, Any]) -> str:
        if "password" in user_data:
            user_data["hashed_password"] = get_password_hash(user_data.pop("password"))
            
        user_id = await MongoDB.insert_one(Collections.USERS, user_data)
        return str(user_id)
    
    @staticmethod
    async def authenticate_user(email: str, password: str) -> Optional[Dict[str,Any]]:
        user = await MongoDB.find_one(Collections.USERS, {"email": email})
        if not user:
            return None
        if not verify_password(password, user.get("hashed_password")):
            return None
        return user
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        return await MongoDB.find_one(Collections.USERS, {"_id":ObjectId(user_id)})
    
    