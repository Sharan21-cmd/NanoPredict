from __future__ import annotations

from collections import deque
from pathlib import Path
from typing import Any
import json
import math

try:
    import joblib
    import numpy as np
except Exception:
    joblib = None
    np = None


BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models" / "phase2"
MODEL_PATH = MODEL_DIR / "phase2_anomaly_model.joblib"
FEATURE_PATH = MODEL_DIR / "feature_columns.json"

FEATURES = [
    "acceleration_g", "ax_g", "ay_g", "az_g",
    "temperature_c", "pressure_hpa", "step_rate",
    "acceleration_g_roll_mean", "acceleration_g_roll_std",
    "temperature_c_roll_mean", "temperature_c_roll_std",
    "pressure_hpa_roll_mean", "pressure_hpa_roll_std",
    "step_rate_roll_mean", "step_rate_roll_std",
    "acceleration_g_roc", "temperature_c_roc",
    "pressure_hpa_roc", "step_rate_roc", "axis_rms",
]

_model = None
_model_error = None
_history = deque(maxlen=30)


def _load_model():
    global _model, _model_error

    if _model is not None:
        return _model

    if joblib is None or not MODEL_PATH.exists():
        _model_error = "Phase-2 trained model unavailable"
        return None

    try:
        _model = joblib.load(MODEL_PATH)
        _model_error = None
        return _model
    except Exception as exc:
        _model_error = str(exc)
        return None


def _number(value: Any, default: float = 0.0) -> float:
    try:
        value = float(value)
        if math.isfinite(value):
            return value
    except (TypeError, ValueError):
        pass
    return default


def _build_features(data: dict[str, Any]) -> dict[str, float]:
    motor = data.get("motor") or {}
    vibration = data.get("vibration") or {}
    environment = data.get("environment") or {}

    timestamp = _number(data.get("timestamp"), 0.0)
    step_count = _number(motor.get("step_count"))
    acceleration_g = _number(vibration.get("acceleration_g"))
    ax_g = _number(vibration.get("ax_g"))
    ay_g = _number(vibration.get("ay_g"))
    az_g = _number(vibration.get("az_g"))
    temperature_c = _number(environment.get("temperature_c"))
    pressure_hpa = _number(environment.get("pressure_hpa"))

    previous = _history[-1] if _history else None

    if previous is None:
        dt_s = 1.0
        step_rate = 0.0
    else:
        dt_s = max(timestamp - previous["timestamp"], 0.001)
        step_rate = max(
            0.0,
            (step_count - previous["step_count"]) / dt_s
        )

    current = {
        "timestamp": timestamp,
        "step_count": step_count,
        "acceleration_g": acceleration_g,
        "ax_g": ax_g,
        "ay_g": ay_g,
        "az_g": az_g,
        "temperature_c": temperature_c,
        "pressure_hpa": pressure_hpa,
        "step_rate": step_rate,
    }

    _history.append(current)
    history = list(_history)

    def values(key):
        return [row[key] for row in history]

    def mean(key):
        vals = values(key)
        return float(sum(vals) / len(vals))

    def std(key):
        vals = values(key)
        if len(vals) < 2:
            return 0.0
        m = sum(vals) / len(vals)
        return float(
            math.sqrt(sum((x - m) ** 2 for x in vals) / len(vals))
        )

    def roc(key):
        if len(history) < 2:
            return 0.0
        old = history[-2]
        dt = max(timestamp - old["timestamp"], 0.001)
        return (current[key] - old[key]) / dt

    return {
        "acceleration_g": acceleration_g,
        "ax_g": ax_g,
        "ay_g": ay_g,
        "az_g": az_g,
        "temperature_c": temperature_c,
        "pressure_hpa": pressure_hpa,
        "step_rate": step_rate,

        "acceleration_g_roll_mean": mean("acceleration_g"),
        "acceleration_g_roll_std": std("acceleration_g"),

        "temperature_c_roll_mean": mean("temperature_c"),
        "temperature_c_roll_std": std("temperature_c"),

        "pressure_hpa_roll_mean": mean("pressure_hpa"),
        "pressure_hpa_roll_std": std("pressure_hpa"),

        "step_rate_roll_mean": mean("step_rate"),
        "step_rate_roll_std": std("step_rate"),

        "acceleration_g_roc": roc("acceleration_g"),
        "temperature_c_roc": roc("temperature_c"),
        "pressure_hpa_roc": roc("pressure_hpa"),
        "step_rate_roc": roc("step_rate"),

        "axis_rms": math.sqrt(
            ax_g * ax_g +
            ay_g * ay_g +
            az_g * az_g
        ),
    }


def _adaptive_fallback(f: dict[str, float]) -> dict[str, Any]:
    samples = len(_history)

    # Warm-up: don't call the first few samples anomalous.
    if samples < 5:
        return {
            "available": True,
            "model_loaded": False,
            "mode": "adaptive_baseline_warmup",
            "anomaly": False,
            "anomaly_score": 0.0,
            "risk": "NORMAL",
            "risk_score": 0,
            "reasons": [],
            "observed": {
                "acceleration_g": f["acceleration_g"],
                "temperature_c": f["temperature_c"],
                "pressure_hpa": f["pressure_hpa"],
                "step_rate": f["step_rate"],
            },
            "samples": samples,
            "message": "Learning real Raspberry Pi telemetry baseline.",
        }

    score = 0
    reasons = []

    checks = [
        (
            "acceleration_g",
            "acceleration",
            3.0,
            "g",
        ),
        (
            "temperature_c",
            "temperature",
            3.0,
            "°C",
        ),
        (
            "pressure_hpa",
            "pressure",
            3.0,
            "hPa",
        ),
        (
            "step_rate",
            "motor step-rate",
            3.0,
            "steps/s",
        ),
    ]

    for key, label, sigma_limit, unit in checks:
        mean = f[f"{key}_roll_mean"]
        std = f[f"{key}_roll_std"]
        value = f[key]

        if std > 0.0001:
            deviation = abs(value - mean) / std

            if deviation >= sigma_limit:
                score += 30
                reasons.append(
                    f"{label.capitalize()} deviated "
                    f"{deviation:.1f}σ from rolling baseline"
                )
            elif deviation >= 2.0:
                score += 15
                reasons.append(
                    f"{label.capitalize()} showing elevated deviation "
                    f"from baseline"
                )

    # Rate-of-change checks.
    if abs(f["acceleration_g_roc"]) > 0.20:
        score += 15
        reasons.append("Rapid vibration change detected")

    if abs(f["temperature_c_roc"]) > 0.10:
        score += 10
        reasons.append("Rapid temperature change detected")

    if abs(f["pressure_hpa_roc"]) > 5.0:
        score += 15
        reasons.append("Rapid pressure change detected")

    score = min(score, 100)

    if score >= 70:
        risk = "CRITICAL"
        anomaly = True
    elif score >= 30:
        risk = "WARNING"
        anomaly = True
    else:
        risk = "NORMAL"
        anomaly = False

    return {
        "available": True,
        "model_loaded": False,
        "mode": "adaptive_baseline",
        "anomaly": anomaly,
        "anomaly_score": round(score / 100.0, 4),
        "risk": risk,
        "risk_score": score,
        "reasons": reasons,
        "observed": {
            "acceleration_g": f["acceleration_g"],
            "temperature_c": f["temperature_c"],
            "pressure_hpa": f["pressure_hpa"],
            "step_rate": f["step_rate"],
        },
        "samples": samples,
        "message": (
            "Adaptive Phase-2 assessment using real Raspberry Pi "
            "telemetry baseline."
        ),
    }


def predict_phase2(data: dict[str, Any]) -> dict[str, Any]:
    features = _build_features(data)
    model = _load_model()

    # If a real trained Isolation Forest exists, use it.
    if model is not None and np is not None:
        try:
            if FEATURE_PATH.exists():
                with open(FEATURE_PATH, "r", encoding="utf-8") as f:
                    feature_columns = json.load(f)
            else:
                feature_columns = FEATURES

            row = [[features[name] for name in feature_columns]]

            prediction = int(model.predict(row)[0])
            anomaly = prediction == -1
            decision = float(model.decision_function(row)[0])
            anomaly_score = -decision

            return {
                "available": True,
                "model_loaded": True,
                "mode": "isolation_forest",
                "anomaly": anomaly,
                "prediction": prediction,
                "anomaly_score": round(anomaly_score, 6),
                "risk": "WARNING" if anomaly else "NORMAL",
                "risk_score": 60 if anomaly else 0,
                "reasons": [],
                "observed": {
                    "acceleration_g": features["acceleration_g"],
                    "temperature_c": features["temperature_c"],
                    "pressure_hpa": features["pressure_hpa"],
                    "step_rate": features["step_rate"],
                },
                "model": "Phase-2 Isolation Forest",
            }

        except Exception as exc:
            return {
                **_adaptive_fallback(features),
                "model_error": str(exc),
            }

    # No .joblib: intelligently learn from real telemetry.
    return _adaptive_fallback(features)
