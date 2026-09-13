import logging

from fastapi import APIRouter, HTTPException, status

from app.config import settings
from app.models import User
from app.schemas import EmailLogin, EmailRegister, GoogleLogin, Token, UserOut
from app.services.auth import (
    create_access_token,
    get_or_create_user,
    get_user_by_email,
    hash_password,
    verify_google_id_token,
    verify_password,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/google", response_model=Token)
async def google_login(data: GoogleLogin):
    try:
        id_info = verify_google_id_token(data.credential)
    except Exception:
        logger.exception("Google token verification failed")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token")

    email = id_info.get("email")
    name = id_info.get("name") or email
    picture = id_info.get("picture")
    google_id = id_info.get("sub")

    if not email or not google_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incomplete token")

    user = await get_or_create_user(email, name, picture, google_id)
    access_token = create_access_token(user)

    return _token_response(user)


@router.post("/register", response_model=Token)
async def register(data: EmailRegister):
    if await get_user_by_email(data.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    role = "admin" if data.email == settings.admin_email else "customer"
    user = User(
        email=data.email,
        name=data.name,
        password_hash=hash_password(data.password),
        role=role,
    )
    await user.insert()
    return _token_response(user)


@router.post("/login", response_model=Token)
async def login(data: EmailLogin):
    user = await get_user_by_email(data.email)
    if not user or not user.password_hash or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    return _token_response(user)


def _token_response(user: User) -> Token:
    access_token = create_access_token(user)
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserOut(
            id=str(user.id),
            email=user.email,
            name=user.name,
            picture=user.picture,
            role=user.role,
        ),
    )


@router.post("/logout")
async def logout():
    return {"message": "Logged out"}
