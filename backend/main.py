import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from websocket import manager, telemetry_loop, handle_command
from auth import authenticate_user, create_access_token, verify_access_token


app = FastAPI(
    title="NanoPredict Backend",
    description="Sub-Nanometer Drift & Vacuum Anomaly Prediction System",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5178",
    "http://127.0.0.1:5178",
    "https://nano-predict.vercel.app",
    "https://nano-predict-8s12tzn6v-vortex-5d1a.vercel.app"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    username: str
    password: str


@app.post("/api/auth/login")
async def login(request: LoginRequest):

    if not authenticate_user(
        request.username,
        request.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_access_token(
        request.username
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.on_event("startup")
async def startup_event():

    asyncio.create_task(
        telemetry_loop()
    )

    print("[NanoPredict] Telemetry engine started")


@app.get("/")
async def root():

    return {
        "project": "NanoPredict",
        "status": "online",
        "message": "NanoPredict backend is running"
    }


@app.get("/api/health")
async def health():

    return {
        "status": "healthy",
        "backend": "online"
    }


@app.websocket("/ws/telemetry")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(default="")
):

    # Authenticate before accepting the connection
    if not token:
        await websocket.close(code=1008)
        print("[WebSocket] Rejected: missing token")
        return

    try:
        username = verify_access_token(token)

    except HTTPException:
        await websocket.close(code=1008)
        print("[WebSocket] Rejected: invalid token")
        return

    await manager.connect(websocket)

    print(f"[WebSocket] Authenticated user: {username}")

    try:

        while True:

            message = await websocket.receive_text()

            await handle_command(message)

    except WebSocketDisconnect:

        manager.disconnect(websocket)
        print(f"[WebSocket] Disconnected: {username}")

    except Exception as e:

        print(f"[WebSocket] ERROR: {e}")

        manager.disconnect(websocket)
