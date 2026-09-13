from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from passlib.hash import pbkdf2_sha256

from app.config import settings
from app.models import User


def create_access_token(user: User) -> str:
    to_encode = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
    }
    expire = datetime.now(timezone.utc) + timedelta(minutes=60)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def verify_google_id_token(token: str) -> dict:
    return google_id_token.verify_oauth2_token(
        token,
        google_requests.Request(),
        settings.google_client_id,
        clock_skew_in_seconds=10,
    )


async def get_or_create_user(email: str, name: str, picture: Optional[str], google_id: str) -> User:
    user = await User.find_one({"email": email})
    if user:
        if user.google_id != google_id:
            user.google_id = google_id
            await user.save()
        return user

    role = "admin" if email == settings.admin_email else "customer"
    user = User(
        email=email,
        name=name,
        google_id=google_id,
        picture=picture,
        role=role,
    )
    await user.insert()
    return user


def hash_password(password: str) -> str:
    return pbkdf2_sha256.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pbkdf2_sha256.verify(password, hashed)


async def get_user_by_email(email: str) -> Optional[User]:
    return await User.find_one({"email": email})
