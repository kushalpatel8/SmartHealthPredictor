from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional
from app.schemas.user import UserResponse

router = APIRouter()

async def get_current_user(authorization: Optional[str] = Header(None)) -> UserResponse:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not Authenticated")
    
    token = authorization.split(" ")[1]
    
    return UserResponse(
        id="clerk_user_id_placeholder",
        username="clerk_user",
        email="user@clerk.dev",
        role="user"
    )
    
@router.get("/user/me")
async def read_user_me(current_user: UserResponse = Depends(get_current_user)):
    return {"id" : current_user.id, "status" : "authenticated via clerk"} 