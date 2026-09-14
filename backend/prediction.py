from collections import deque


class PredictionEngine:
    def __init__(self, max_history=30):
        self.history = deque(maxlen=max_history)

    def update(self, telemetry):
        self.history.append({
            "drift_nm": abs(telemetry["laser"]["drift_nm"]),
            "vibration": telemetry["vibration"]["acceleration_g"],
            "temperature": telemetry["environment"]["temperature_c"],
            "vacuum": telemetry["vacuum"]["pressure_mbar"],
            "timestamp": telemetry["timestamp"],
        })

    def _trend(self, key):
        if len(self.history) < 5:
            return 0.0

        values = [x[key] for x in self.history]

        first = sum(values[:3]) / 3
        last = sum(values[-3:]) / 3

        return last - first

    def predict(self, telemetry, risk):
        self.update(telemetry)

        drift_trend = self._trend("drift_nm")
        vibration_trend = self._trend("vibration")
        temperature_trend = self._trend("temperature")
        vacuum_trend = self._trend("vacuum")

        warnings = []

        if drift_trend > 0.5:
            warnings.append("Position drift is increasing")

        if vibration_trend > 0.08:
            warnings.append("Stage vibration is increasing")

        if temperature_trend > 1.5:
            warnings.append("Equipment temperature is increasing")

        if vacuum_trend > 0.00008:
            warnings.append("Vacuum pressure is increasing")

        risk_score = risk["risk_score"]

        if risk_score >= 70:
            condition = "CRITICAL ANOMALY LIKELY"
            confidence = min(99, round(70 + risk_score * 0.25, 1))

        elif risk_score >= 35:
            condition = "ANOMALY DEVELOPING"
            confidence = min(90, round(50 + risk_score * 0.35, 1))

        elif warnings:
            condition = "EARLY ANOMALY DETECTED"
            confidence = min(80, round(45 + len(warnings) * 8, 1))

        else:
            condition = "SYSTEM STABLE"
            confidence = round(95 - len(self.history) * 0.1, 1)

        return {
            "condition": condition,
            "confidence": confidence,
            "warnings": warnings,
            "trends": {
                "drift_nm": round(drift_trend, 4),
                "vibration_g": round(vibration_trend, 4),
                "temperature_c": round(temperature_trend, 4),
                "vacuum_mbar": round(vacuum_trend, 7),
            },
            "history_samples": len(self.history),
        }


prediction_engine = PredictionEngine()
