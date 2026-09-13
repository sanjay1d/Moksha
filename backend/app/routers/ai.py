from fastapi import APIRouter, Depends, HTTPException

from app.ai.agent import ask_agent
from app.dependencies import get_current_user
from app.models import User
from app.schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, user: User = Depends(get_current_user)):
    try:
        answer = await ask_agent(request.message, user)
        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
