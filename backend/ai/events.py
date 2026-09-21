from __future__ import annotations

import threading
import time
from collections import deque
from copy import deepcopy
from typing import Any, Dict, Optional


class EventStore:
    """
    In-memory event history for the NanoPredict AI assistant.

    The store records meaningful state transitions rather than every
    telemetry sample. This keeps the history small and useful.

    Events are lost when the backend process restarts. Persistent
    database history can be added later without changing the assistant API.
    """

    def __init__(self, max_events: int = 500) -> None:
        self.max_events = max_events
        self._events: deque[Dict[str, Any]] = deque(maxlen=max_events)

        self._lock = threading.Lock()

        # Current active signatures.
        #
        # These are used to detect a condition disappearing and then
        # appearing again later.
        self._active_alert_signatures: set[str] = set()

        self._last_risk_level: Optional[str] = None
        self._last_prediction_condition: Optional[str] = None

        self.started_at = time.time()

    def add_event(
        self,
        event_type: str,
        timestamp: Optional[float] = None,
        severity: Optional[str] = None,
        message: str = "",
        data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Add one event to the bounded history.
        """

        event = {
            "id": f"{event_type}-{time.time_ns()}",
            "type": event_type,
            "timestamp": timestamp if timestamp is not None else time.time(),
            "severity": severity,
            "message": message,
            "data": deepcopy(data or {}),
        }

        with self._lock:
            self._events.append(event)

        return deepcopy(event)

    def get_recent_events(self, limit: int = 20) -> list[Dict[str, Any]]:
        with self._lock:
            events = list(self._events)[-limit:]

        events.reverse()

        return deepcopy(events)

    def get_last_event(
        self,
        severity: Optional[str] = None,
        event_type: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """
        Return the newest event matching the requested filters.
        """

        severity_normalized = (
            severity.upper()
            if severity is not None
            else None
        )

        with self._lock:
            events = list(self._events)

        for event in reversed(events):
            if (
                severity_normalized is not None
                and str(event.get("severity", "")).upper()
                != severity_normalized
            ):
                continue

            if (
                event_type is not None
                and event.get("type") != event_type
            ):
                continue

            return deepcopy(event)

        return None

    def get_recent_alerts(
        self,
        limit: int = 20,
        severity: Optional[str] = None,
        alert_type: Optional[str] = None,
    ) -> list[Dict[str, Any]]:
        """
        Return recent alert events only.

        Alert events use the event type format:
            alert:<alert_type>

        Example:
            alert:vibration
            alert:vacuum
            alert:temperature
            alert:drift
        """

        severity_normalized = (
            severity.upper()
            if severity is not None
            else None
        )

        with self._lock:
            events = list(self._events)

        results: list[Dict[str, Any]] = []

        for event in reversed(events):
            event_type = str(event.get("type", ""))

            if not event_type.startswith("alert:"):
                continue

            if (
                severity_normalized is not None
                and str(event.get("severity", "")).upper()
                != severity_normalized
            ):
                continue

            if (
                alert_type is not None
                and event_type != f"alert:{alert_type}"
            ):
                continue

            results.append(deepcopy(event))

            if len(results) >= limit:
                break

        return results

    def get_last_alert(
        self,
        severity: Optional[str] = None,
        alert_type: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """
        Return the newest matching alert event.
        """

        alerts = self.get_recent_alerts(
            limit=1,
            severity=severity,
            alert_type=alert_type,
        )

        return alerts[0] if alerts else None

    def get_events_since(
        self,
        timestamp: float,
        event_type: Optional[str] = None,
    ) -> list[Dict[str, Any]]:
        """
        Return events occurring at or after the supplied Unix timestamp.
        """

        with self._lock:
            events = list(self._events)

        results = []

        for event in events:
            if float(event.get("timestamp", 0)) < timestamp:
                continue

            if (
                event_type is not None
                and event.get("type") != event_type
            ):
                continue

            results.append(deepcopy(event))

        results.reverse()

        return results

    def clear(self) -> None:
        """
        Clear all stored events.

        Primarily useful for tests and controlled development resets.
        """

        with self._lock:
            self._events.clear()

        self._active_alert_signatures.clear()
        self._last_risk_level = None
        self._last_prediction_condition = None
        self.started_at = time.time()

    def record_from_payload(
        self,
        telemetry: Dict[str, Any],
        risk: Dict[str, Any],
        alerts: list[Dict[str, Any]],
        prediction: Dict[str, Any],
    ) -> None:
        """
        Convert meaningful changes in a telemetry payload into events.

        This method does NOT record every telemetry sample.
        """

        timestamp = telemetry.get("timestamp", time.time())

        # ---------------------------------------------------------
        # Risk transitions
        # ---------------------------------------------------------

        risk_level = str(
            risk.get("status")
            or risk.get("level")
            or "UNKNOWN"
        ).upper()

        if (
            self._last_risk_level is not None
            and risk_level != self._last_risk_level
        ):
            self.add_event(
                event_type="risk",
                timestamp=timestamp,
                severity=risk_level,
                message=f"Risk level changed to {risk_level}.",
                data=deepcopy(risk),
            )

        self._last_risk_level = risk_level

        # ---------------------------------------------------------
        # Prediction transitions
        # ---------------------------------------------------------

        prediction_condition = str(
            prediction.get("condition")
            or "UNKNOWN"
        ).upper()

        if (
            self._last_prediction_condition is not None
            and prediction_condition != self._last_prediction_condition
        ):
            self.add_event(
                event_type="prediction",
                timestamp=timestamp,
                severity=risk_level,
                message=(
                    "Prediction condition changed to "
                    f"{prediction_condition}."
                ),
                data=deepcopy(prediction),
            )

        self._last_prediction_condition = prediction_condition

        # ---------------------------------------------------------
        # Alert transitions
        # ---------------------------------------------------------

        current_alert_signatures: set[str] = set()

        for alert in alerts:
            alert_type = str(
                alert.get("type")
                or alert.get("id")
                or "unknown"
            )

            severity = str(
                alert.get("severity")
                or alert.get("status")
                or "WARNING"
            ).upper()

            signature = f"{alert_type}:{severity}"

            current_alert_signatures.add(signature)

            # Record only when this alert condition becomes active.
            #
            # If it disappears and later appears again, it will be
            # recorded again because it was removed from the active set.
            if signature not in self._active_alert_signatures:
                self.add_event(
                    event_type=f"alert:{alert_type}",
                    timestamp=timestamp,
                    severity=severity,
                    message=str(
                        alert.get("message")
                        or alert.get("title")
                        or f"{alert_type} alert detected."
                    ),
                    data=deepcopy(alert),
                )

        # Replace active signatures with the conditions currently
        # reported by the telemetry cycle.
        self._active_alert_signatures = current_alert_signatures


event_store = EventStore()
