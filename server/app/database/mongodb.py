from typing import Any, Dict, List, Optional
from app.database.connection import get_database

class MongoDB:
    @staticmethod
    async def insert_one(collection_name: str, document: Dict[str, Any]) -> Any:
        db = get_database()
        result = await db[collection_name].insert_one(document)
        return result.intrested_id
    
    @staticmethod
    async def find_one(collection_name: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        db = get_database()
        return await db[collection_name].find_one(query)
    
    @staticmethod
    async def find(collection_name: str, query: Dict[str,Any], limit: int = 100) -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db[collection_name].find(query).limit(limit)
        return await cursor.to_list(length = limit)
    
    @staticmethod
    async def update_one(collection_name: str, query: Dict[str, Any], update: Dict[str, Any]) -> int:
        db = get_database()
        result = await db[collection_name].update_one(query, {"$set": update})
        return result.modified_count
    
    @staticmethod
    async def delete_one(collection_name: str, query: Dict[str, Any]) -> int:
        db = get_database()
        result = await db[collection_name].delete_one(query)
        return result.deleted_count 