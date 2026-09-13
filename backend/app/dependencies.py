import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings
from app.models import User

security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
        user_id = payload.get("sub")
        if not user_id:
            raise ValueError
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def require_role(role: str):
    async def _role_checker(user: User = Depends(get_current_user)) -> User:
        if user.role != role:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
        return user

    return _role_checker
