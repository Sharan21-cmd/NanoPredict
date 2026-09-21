from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, Field

from ai.assistant import answer_question
from auth import verify_access_token


router = APIRouter(
    prefix="/api/ai",
    tags=["AI Assistant"],
)


class AIAskRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        max_length=1000,
    )


class AIAskResponse(BaseModel):
    question: str
    normalized_question: str
    intent: str
    answer: str
    observations: list[str]
    causes: list[str]
    actions: list[str]
    sources: list[str]


@router.post(
    "/ask",
    response_model=AIAskResponse,
)
async def ask_ai(
    request: AIAskRequest,
    authorization: str | None = Header(default=None),
):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Missing authentication token",
        )

    scheme, _, token = authorization.partition(" ")

    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication header",
        )

    verify_access_token(token)

    try:
        return answer_question(
            request.question
        )

    except Exception as exc:
        print(f"[AI Assistant] ERROR: {exc}")

        raise HTTPException(
            status_code=500,
            detail="AI assistant failed to process the question",
        )
