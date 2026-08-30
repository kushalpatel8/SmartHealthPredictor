from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=3)
    role: str = "user"
    
class UserInDB(UserCreate):
    hashed_password: str
    
class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    role: str
    
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    