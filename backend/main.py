import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth import router as auth_router
from prediction import router as prediction_router
from telemetry import router as telemetry_router
from websocket import router as websocket_router


app = FastAPI(
    title="NanoPredict API",
    description="Sub-Nanometer Drift & Vacuum Anomaly Prediction System",
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "").strip()

allow_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5178",
    "http://127.0.0.1:5178",
    "https://nano-predict.vercel.app",
]

if FRONTEND_ORIGIN and FRONTEND_ORIGIN not in allow_origins:
    allow_origins.append(FRONTEND_ORIGIN)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Routers
# --------------------------------------------------

app.include_router(auth_router)
app.include_router(prediction_router)
app.include_router(telemetry_router)
app.include_router(websocket_router)


# --------------------------------------------------
# Root / Health
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "name": "NanoPredict API",
        "status": "online",
        "version": "1.0.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }
