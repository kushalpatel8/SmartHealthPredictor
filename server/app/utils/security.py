import os
from passlib.context import CryptContext
from clerk_backend_api import Clerk

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

clerk = Clerk(
    bearer_auth=os.getenv("CLERK_SECRET_KEY")
)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)