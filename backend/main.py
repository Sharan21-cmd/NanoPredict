import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from websocket import manager, telemetry_loop, handle_command


app = FastAPI(
    title="NanoPredict Backend",
    description="Sub-Nanometer Drift & Vacuum Anomaly Prediction System",
    version="1.0.0"
)


# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Startup
# -----------------------------

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(telemetry_loop())
    print("[NanoPredict] Telemetry engine started")


# -----------------------------
# Health
# -----------------------------

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


# -----------------------------
# WebSocket
# -----------------------------

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):

    await manager.connect(websocket)

    try:
        while True:

            message = await websocket.receive_text()

            await handle_command(message)

    except WebSocketDisconnect:
        manager.disconnect(websocket)

    except Exception as e:
        print(
            f"[WebSocket] ERROR: {e}"
        )

        manager.disconnect(websocket)
