import os
import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.dependencies import require_role
from app.models import User

router = APIRouter(prefix="/upload", tags=["uploads"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_TYPES = {"image/png", "image/jpeg"}


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile = File(...),
    user: User = Depends(require_role("admin")),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PNG or JPEG images allowed",
        )

    ext = Path(file.filename).suffix
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = UPLOAD_DIR / filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"url": f"/uploads/{filename}"}
