def calculate_risk(telemetry):
    vibration = telemetry["vibration"]["acceleration_g"]
    drift_nm = abs(telemetry["laser"]["drift_nm"])
    temperature = telemetry["environment"]["temperature_c"]

    # Real BMP280 chamber pressure.
    # Do not compare against atmospheric pressure unless a calibrated
    # chamber reference/setpoint has been defined.
    pressure_hpa = telemetry["environment"].get("pressure_hpa")

    # ---------------------------------------------------------
    # Vibration risk
    # ---------------------------------------------------------

    vibration_risk = min(
        100,
        max(
            0,
            (vibration - 0.10) / 0.30 * 100
        )
    )

    # ---------------------------------------------------------
    # Drift risk
    # ---------------------------------------------------------

    drift_risk = min(
        100,
        max(
            0,
            drift_nm / 5.0 * 100
        )
    )

    # ---------------------------------------------------------
    # Temperature risk
    # ---------------------------------------------------------

    temperature_risk = min(
        100,
        max(
            0,
            abs(temperature - 25.0) / 10.0 * 100
        )
    )

    # ---------------------------------------------------------
    # Pressure risk
    # ---------------------------------------------------------
    #
    # We have a REAL pressure measurement, but without a calibrated
    # chamber operating setpoint we must not invent a pressure risk.
    #

    pressure_risk = 0.0

    # ---------------------------------------------------------
    # Overall risk
    # ---------------------------------------------------------

    risk_score = (
        vibration_risk * 0.35 +
        drift_risk * 0.40 +
        temperature_risk * 0.15 +
        pressure_risk * 0.10
    )

    risk_score = min(
        100,
        max(
            0,
            risk_score
        )
    )

    # ---------------------------------------------------------
    # Risk level
    # ---------------------------------------------------------

    if risk_score >= 70:
        level = "CRITICAL"

    elif risk_score >= 40:
        level = "WARNING"

    else:
        level = "NORMAL"

    return {
        "risk_score": round(
            risk_score,
            2
        ),

        "level": level,

        "factors": {
            "vibration": round(
                vibration_risk,
                2
            ),

            "drift": round(
                drift_risk,
                2
            ),

            "temperature": round(
                temperature_risk,
                2
            ),

            "pressure": round(
                pressure_risk,
                2
            )
        },

        "measurements": {
            "temperature_c": round(
                temperature,
                2
            ),

            "vibration_g": round(
                vibration,
                4
            ),

            "drift_nm": round(
                drift_nm,
                3
            ),

            "pressure_hpa": (
                round(
                    pressure_hpa,
                    2
                )
                if pressure_hpa is not None
                else None
            )
        }
    }


def generate_alerts(telemetry):
    alerts = []

    vibration = telemetry["vibration"]["acceleration_g"]
    drift_nm = abs(telemetry["laser"]["drift_nm"])
    temperature = telemetry["environment"]["temperature_c"]
    pressure_hpa = telemetry["environment"].get("pressure_hpa")

    # ---------------------------------------------------------
    # Vibration
    # ---------------------------------------------------------

    if vibration >= 0.90:
        alerts.append({
            "type": "critical",
            "title": "High Vibration",
            "message": (
                f"Vibration level is {vibration:.3f} g."
            ),
            "value": vibration
        })

    elif vibration >= 0.80:
        alerts.append({
            "type": "warning",
            "title": "Elevated Vibration",
            "message": (
                f"Vibration level is {vibration:.3f} g."
            ),
            "value": vibration
        })

    # ---------------------------------------------------------
    # Laser drift
    # ---------------------------------------------------------

    if drift_nm >= 5.0:
        alerts.append({
            "type": "critical",
            "title": "Sub-Nanometer Drift Anomaly",
            "message": (
                f"Measured drift is {drift_nm:.3f} nm."
            ),
            "value": drift_nm
        })

    elif drift_nm >= 3.0:
        alerts.append({
            "type": "warning",
            "title": "Elevated Laser Drift",
            "message": (
                f"Measured drift is {drift_nm:.3f} nm."
            ),
            "value": drift_nm
        })

    # ---------------------------------------------------------
    # Temperature
    # ---------------------------------------------------------

    if temperature >= 38.0:
        alerts.append({
            "type": "critical",
            "title": "High Temperature",
            "message": (
                f"Temperature is {temperature:.2f} °C."
            ),
            "value": temperature
        })

    elif temperature >= 35.0:
        alerts.append({
            "type": "warning",
            "title": "Elevated Temperature",
            "message": (
                f"Temperature is {temperature:.2f} °C."
            ),
            "value": temperature
        })

    # ---------------------------------------------------------
    # Chamber pressure
    # ---------------------------------------------------------
    #
    # IMPORTANT:
    # BMP280 gives us the REAL chamber pressure.
    #
    # We display/store it, but we do not generate an alert from
    # the absolute value until a calibrated chamber reference
    # pressure is provided.
    #

    if pressure_hpa is not None:
        pass

    return alerts
