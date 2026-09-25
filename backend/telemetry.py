import random
import time


class TelemetryGenerator:
    def __init__(self):
        self.start_time = time.time()

        self.position = 0.0
        self.target_position = 0.0
        self.speed_mm_per_sec = 0.0

        self.motor_running = False

        self.critical_mode = False
        self.temperature_mode = "normal"
        self.vibration_mode = "normal"

    def generate(self):
        elapsed = time.time() - self.start_time

        # -----------------------------------------------------
        # Motor position
        # -----------------------------------------------------

        if self.motor_running:
            self.position += self.speed_mm_per_sec * 0.01

            if self.position >= self.target_position:
                self.position = self.target_position
                self.motor_running = False

        # -----------------------------------------------------
        # Temperature
        # -----------------------------------------------------

        if self.critical_mode:
            temperature = 38.0 + random.uniform(-1.0, 2.0)

        elif self.temperature_mode == "heat":
            temperature = 35.0 + random.uniform(-0.5, 0.5)

        else:
            temperature = 24.5 + random.uniform(-0.3, 0.3)

        # -----------------------------------------------------
        # Vibration
        # -----------------------------------------------------

        if self.critical_mode:
            vibration = 0.95 + random.uniform(-0.08, 0.12)
            vibration_status = "HIGH"

        elif self.vibration_mode == "shake":
            vibration = 0.80 + random.uniform(-0.08, 0.08)
            vibration_status = "HIGH"

        else:
            vibration = 0.12 + random.uniform(-0.025, 0.025)
            vibration_status = "NORMAL"

        # -----------------------------------------------------
        # Humidity
        # -----------------------------------------------------

        humidity = 45.0 + random.uniform(-1.0, 1.0)

        # -----------------------------------------------------
        # Sub-nanometer laser drift
        # -----------------------------------------------------

        if self.critical_mode:
            drift_nm = random.uniform(4.0, 6.0) * random.choice([-1, 1])

        else:
            drift_nm = random.uniform(-0.35, 0.35)

        # Convert nm → mm
        laser_displacement = (
            self.position +
            (drift_nm / 1_000_000)
        )

        # -----------------------------------------------------
        # Motor parameters
        # -----------------------------------------------------

        if self.motor_running:
            motor_speed_rpm = 1200 + random.uniform(-30, 30)
            motor_current = 0.82 + random.uniform(-0.05, 0.05)
            motor_status = "RUNNING"

        else:
            motor_speed_rpm = 0.0
            motor_current = 0.15 + random.uniform(-0.02, 0.02)
            motor_status = "STOPPED"

        # -----------------------------------------------------
        # Simulation telemetry packet
        # -----------------------------------------------------
        #
        # IMPORTANT:
        # No fake chamber-pressure value is generated here.
        # Real BMP280 pressure is provided only by hardware mode.
        #

        return {
            "timestamp": time.time(),
            "elapsed": round(elapsed, 2),

            "source": "simulation",

            "motor": {
                "position": round(self.position, 4),
                "target_position": round(self.target_position, 4),
                "speed_rpm": round(motor_speed_rpm, 2),
                "speed_mm_per_sec": round(
                    self.speed_mm_per_sec,
                    2
                ),
                "current_a": round(motor_current, 3),
                "status": motor_status,
                "step_count": 0,
                "position_steps": 0
            },

            "laser": {
                "displacement_mm": round(
                    laser_displacement,
                    9
                ),
                "drift_nm": round(
                    drift_nm,
                    3
                )
            },

            "vibration": {
                "acceleration_g": round(
                    vibration,
                    4
                ),
                "status": vibration_status
            },

            "environment": {
                "temperature_c": round(
                    temperature,
                    2
                ),
                "humidity_percent": round(
                    humidity,
                    2
                ),

                # No simulated pressure.
                "pressure_hpa": None
            },

            # Temporary compatibility object.
            # This is NOT a vacuum measurement.
            "vacuum": {
                "pressure_hpa": None,
                "status": "UNAVAILABLE"
            }
        }


# ---------------------------------------------------------
# Hardware telemetry
# ---------------------------------------------------------

def generate_from_hardware():
    data = hardware_telemetry.latest

    if not data:
        return None

    vibration_data = data.get("vibration", {})
    environment_data = data.get("environment", {})
    motor_data = data.get("motor", {})

    acceleration = vibration_data.get("acceleration_g")
    temperature = environment_data.get("temperature_c")
    pressure_hpa = environment_data.get("pressure_hpa")

    if acceleration is None or temperature is None:
        return None

    return {
        "timestamp": data.get(
            "timestamp",
            time.time()
        ),

        "elapsed": 0.0,

        "source": "raspberry_pi",

        "motor": {
            "position": float(
                motor_data.get(
                    "position_steps",
                    0.0
                )
            ),

            "target_position": float(
                motor_data.get(
                    "position_steps",
                    0.0
                )
            ),

            "speed_rpm": 0.0,

            "speed_mm_per_sec": 0.0,

            "current_a": 0.0,

            "status": motor_data.get(
                "status",
                "UNKNOWN"
            ),

            "step_count": int(
                motor_data.get(
                    "step_count",
                    0
                )
            ),

            "position_steps": int(
                motor_data.get(
                    "position_steps",
                    0
                )
            )
        },

        "laser": {
            "displacement_mm": 0.0,
            "drift_nm": 0.0
        },

        "vibration": {
            "acceleration_g": round(
                acceleration,
                4
            ),

            "status": (
                "HIGH"
                if acceleration >= 0.80
                else "NORMAL"
            )
        },

        "environment": {
            "temperature_c": round(
                temperature,
                2
            ),

            "pressure_hpa": (
                round(
                    pressure_hpa,
                    2
                )
                if pressure_hpa is not None
                else None
            )
        },

        # Temporary compatibility object.
        # This contains the SAME REAL BMP280 pressure,
        # but it is NOT a separate vacuum sensor.
        "vacuum": {
            "pressure_hpa": (
                round(
                    pressure_hpa,
                    2
                )
                if pressure_hpa is not None
                else None
            ),

            "status": "REAL"
        }
    }
