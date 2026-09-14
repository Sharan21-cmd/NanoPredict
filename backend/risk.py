def calculate_risk(telemetry):
    vibration = telemetry["vibration"]["acceleration_g"]
    drift_nm = abs(telemetry["laser"]["drift_nm"])
    temperature = telemetry["environment"]["temperature_c"]
    vacuum = telemetry["vacuum"]["pressure_mbar"]

    vibration_risk = min(100, max(0, (vibration - 0.10) / 0.30 * 100))
    drift_risk = min(100, max(0, drift_nm / 5.0 * 100))
    temperature_risk = min(100, max(0, abs(temperature - 25.0) / 10.0 * 100))
    vacuum_risk = min(100, max(0, (vacuum - 0.0001) / 0.0005 * 100))

    risk_score = (
        vibration_risk * 0.30 +
        drift_risk * 0.40 +
        temperature_risk * 0.10 +
        vacuum_risk * 0.20
    )

    risk_score = round(min(100, max(0, risk_score)), 2)

    if risk_score < 35:
        level = "NORMAL"
    elif risk_score < 70:
        level = "WARNING"
    else:
        level = "CRITICAL"

    return {
        "risk_score": risk_score,
        "level": level,
        "factors": {
            "vibration": round(vibration_risk, 2),
            "displacement": round(drift_risk, 2),
            "temperature": round(temperature_risk, 2),
            "vacuum": round(vacuum_risk, 2)
        }
    }


def generate_alerts(telemetry, risk):
    alerts = []

    vibration = telemetry["vibration"]["acceleration_g"]
    drift_nm = abs(telemetry["laser"]["drift_nm"])
    temperature = telemetry["environment"]["temperature_c"]
    vacuum = telemetry["vacuum"]["pressure_mbar"]

    # Vacuum
    if vacuum >= 0.0004:
        alerts.append({
            "id": "vacuum-critical",
            "type": "vacuum",
            "severity": "critical",
            "title": "Vacuum Pressure Critical",
            "message": f"Chamber pressure is elevated at {vacuum:.7f} mbar.",
            "value": vacuum,
            "unit": "mbar"
        })
    elif vacuum >= 0.00025:
        alerts.append({
            "id": "vacuum-warning",
            "type": "vacuum",
            "severity": "warning",
            "title": "Vacuum Pressure Warning",
            "message": f"Chamber pressure is rising at {vacuum:.7f} mbar.",
            "value": vacuum,
            "unit": "mbar"
        })

    # Vibration
    if vibration >= 0.60:
        alerts.append({
            "id": "vibration-critical",
            "type": "vibration",
            "severity": "critical",
            "title": "High Vibration Detected",
            "message": f"Stage vibration is {vibration:.3f} g.",
            "value": vibration,
            "unit": "g"
        })
    elif vibration >= 0.35:
        alerts.append({
            "id": "vibration-warning",
            "type": "vibration",
            "severity": "warning",
            "title": "Vibration Increasing",
            "message": f"Stage vibration is elevated at {vibration:.3f} g.",
            "value": vibration,
            "unit": "g"
        })

    # Temperature
    if temperature >= 35:
        alerts.append({
            "id": "temperature-critical",
            "type": "temperature",
            "severity": "critical",
            "title": "Temperature Critical",
            "message": f"Equipment temperature is {temperature:.2f} °C.",
            "value": temperature,
            "unit": "°C"
        })
    elif temperature >= 30:
        alerts.append({
            "id": "temperature-warning",
            "type": "temperature",
            "severity": "warning",
            "title": "Temperature Elevated",
            "message": f"Equipment temperature is {temperature:.2f} °C.",
            "value": temperature,
            "unit": "°C"
        })

    # Position drift
    if drift_nm >= 3:
        alerts.append({
            "id": "drift-critical",
            "type": "drift",
            "severity": "critical",
            "title": "Position Drift Critical",
            "message": f"Measured stage drift is {drift_nm:.3f} nm.",
            "value": drift_nm,
            "unit": "nm"
        })
    elif drift_nm >= 1:
        alerts.append({
            "id": "drift-warning",
            "type": "drift",
            "severity": "warning",
            "title": "Position Drift Increasing",
            "message": f"Measured stage drift is {drift_nm:.3f} nm.",
            "value": drift_nm,
            "unit": "nm"
        })

    return alerts
