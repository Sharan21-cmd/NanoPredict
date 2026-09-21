from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any, Dict
from zoneinfo import ZoneInfo

from .events import event_store
from .knowledge import retrieve_relevant_knowledge
from .state import latest_state


APP_TIMEZONE = ZoneInfo(
    os.getenv("NANOPREDICT_TIMEZONE", "Asia/Kolkata")
)


def format_timestamp(timestamp: float | None) -> str | None:
    """
    Convert a Unix timestamp into the configured NanoPredict timezone.
    """

    if timestamp is None:
        return None

    dt = datetime.fromtimestamp(
        timestamp,
        tz=timezone.utc,
    ).astimezone(APP_TIMEZONE)

    return dt.strftime(
        "%Y-%m-%d %H:%M:%S %Z"
    )


def current_time_context() -> Dict[str, Any]:
    """
    Return the current server time in both UTC and configured local time.
    """

    now = datetime.now(timezone.utc)
    local_now = now.astimezone(APP_TIMEZONE)

    return {
        "epoch": now.timestamp(),
        "iso_utc": now.isoformat(),
        "display": local_now.strftime(
            "%Y-%m-%d %H:%M:%S %Z"
        ),
        "date": local_now.strftime(
            "%Y-%m-%d"
        ),
        "timezone": str(APP_TIMEZONE),
    }


def build_context(
    question_normalized: str,
    history_limit: int = 10,
) -> Dict[str, Any]:
    """
    Build the complete grounded context used by the AI assistant.

    This function only reads application state, event history, and the
    static knowledge base. It does not generate or modify machine data.
    """

    state = latest_state.snapshot()

    telemetry = state.get("telemetry")
    risk = state.get("risk")
    alerts = state.get("alerts") or []
    prediction = state.get("prediction")

    recent_events = event_store.get_recent_events(
        limit=history_limit
    )

    knowledge = retrieve_relevant_knowledge(
        question_normalized,
        limit=4,
    )

    machine_context: Dict[str, Any] = {
        "available": telemetry is not None,
        "stage": {},
        "temperature": {},
        "vibration": {},
        "vacuum": {},
        "laser": {},
    }

    if telemetry:
        motor = telemetry.get("motor") or {}
        environment = telemetry.get("environment") or {}
        vibration = telemetry.get("vibration") or {}
        vacuum = telemetry.get("vacuum") or {}
        laser = telemetry.get("laser") or {}

        machine_context["stage"] = {
            "position_mm": motor.get("position"),
            "target_position_mm": motor.get(
                "target_position"
            ),
            "speed_mm_per_sec": motor.get(
                "speed_mm_per_sec"
            ),
            "speed_rpm": motor.get("speed_rpm"),
            "status": motor.get("status"),
            "moving": motor.get("status") == "RUNNING",
        }

        machine_context["temperature"] = {
            "value_c": environment.get(
                "temperature_c"
            ),
            "humidity_percent": environment.get(
                "humidity_percent"
            ),
        }

        machine_context["vibration"] = {
            "acceleration_g": vibration.get(
                "acceleration_g"
            ),
            "status": vibration.get("status"),
        }

        machine_context["vacuum"] = {
            "pressure_mbar": vacuum.get(
                "pressure_mbar"
            ),
            "status": vacuum.get("status"),
        }

        machine_context["laser"] = {
            "displacement_mm": laser.get(
                "displacement_mm"
            ),
            "drift_nm": laser.get("drift_nm"),
        }

    formatted_events = []

    for event in recent_events:
        formatted_events.append(
            {
                "type": event.get("type"),
                "severity": event.get("severity"),
                "message": event.get("message"),
                "timestamp": event.get("timestamp"),
                "time": format_timestamp(
                    event.get("timestamp")
                ),
                "data": event.get("data") or {},
            }
        )

    return {
        "current_time": current_time_context(),

        "machine": machine_context,

        "risk": risk,

        "alerts": alerts,

        "prediction": prediction,

        "recent_events": formatted_events,

        "event_history_started_at": event_store.started_at,

        "event_history_started": format_timestamp(
            event_store.started_at
        ),

        "knowledge": knowledge,

        "state_updated_at": state.get(
            "updated_at"
        ),

        "state_updated": format_timestamp(
            state.get("updated_at")
        ),
    }
