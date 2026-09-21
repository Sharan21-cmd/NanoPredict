from __future__ import annotations

import threading
import time
from copy import deepcopy
from typing import Any, Dict, Optional


class LatestState:
    """
    Thread-safe container for the latest NanoPredict machine state.

    This does not generate telemetry and does not modify the existing
    telemetry engine. It only stores the latest data so the AI assistant
    can answer questions about the current machine condition.
    """

    def __init__(self) -> None:
        self._lock = threading.Lock()

        self._telemetry: Optional[Dict[str, Any]] = None
        self._risk: Optional[Dict[str, Any]] = None
        self._alerts: list[Dict[str, Any]] = []
        self._prediction: Optional[Dict[str, Any]] = None
        self._updated_at: Optional[float] = None

    def update(
        self,
        telemetry: Dict[str, Any],
        risk: Dict[str, Any],
        alerts: list[Dict[str, Any]],
        prediction: Dict[str, Any],
    ) -> None:
        """
        Replace the stored state with the latest machine data.
        """

        with self._lock:
            self._telemetry = deepcopy(telemetry)
            self._risk = deepcopy(risk)
            self._alerts = deepcopy(alerts)
            self._prediction = deepcopy(prediction)
            self._updated_at = time.time()

    def snapshot(self) -> Dict[str, Any]:
        """
        Return a safe copy of the latest state.

        If telemetry has not arrived yet, the corresponding values remain
        None/empty rather than inventing machine data.
        """

        with self._lock:
            return {
                "telemetry": deepcopy(self._telemetry),
                "risk": deepcopy(self._risk),
                "alerts": deepcopy(self._alerts),
                "prediction": deepcopy(self._prediction),
                "updated_at": self._updated_at,
            }


latest_state = LatestState()
