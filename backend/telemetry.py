import random
import time

try:
    from .hardware import hardware_telemetry
    from .phase2_predictor import predict_phase2
except ImportError:
    from hardware import hardware_telemetry
    from phase2_predictor import predict_phase2


class TelemetryGenerator:
    """
    Simulation engine used only when real Raspberry Pi telemetry
    is unavailable.

    Important:
    - No fake vacuum/chamber-pressure values are generated.
    - BMP280 pressure comes from real hardware telemetry.
    - Vacuum commands are retained only for frontend compatibility.
    """

    def __init__(self):
        self.start_time = time.time()

        self.position = 0.0
        self.target_position = 0.0
        self.speed_mm_per_sec = 0.0

        self.motor_running = False

        self.critical_mode = False
        self.temperature_mode = "normal"
        self.vibration_mode = "normal"

        # Compatibility only.
        # This does NOT generate or modify pressure.
        self.vacuum_mode = "normal"

    # ---------------------------------------------------------
    # Motor controls
    # ---------------------------------------------------------

    def set_target_position(self, position):
        self.target_position = float(position)

        if self.target_position != self.position:
            self.motor_running = True

    def set_motor_speed(self, speed):
        self.speed_mm_per_sec = max(0.0, float(speed))

        if self.speed_mm_per_sec > 0:
            self.motor_running = True

    def stop_motor(self):
        self.motor_running = False
        self.speed_mm_per_sec = 0.0

    # ---------------------------------------------------------
    # Simulation modes
    # ---------------------------------------------------------

    def set_temperature_mode(self, mode):
        if mode in ("normal", "heat"):
            self.temperature_mode = mode

    def set_vibration_mode(self, mode):
        if mode in ("normal", "shake"):
            self.vibration_mode = mode

    def set_vacuum_mode(self, mode):
        """
        Compatibility method.

        We intentionally do NOT generate fake vacuum pressure.
        Real BMP280 pressure remains controlled by hardware telemetry.
        """
        if mode in ("normal", "leak"):
            self.vacuum_mode = mode

    def normalize_sensors(self):
        self.critical_mode = False
        self.temperature_mode = "normal"
        self.vibration_mode = "normal"
        self.vacuum_mode = "normal"

    # ---------------------------------------------------------
    # Simulation telemetry
    # ---------------------------------------------------------

    def generate(self):
        elapsed = time.time() - self.start_time

        # -----------------------------------------------------
        # Motor position
        # -----------------------------------------------------

        if self.motor_running:
            direction = 1.0

            if self.target_position < self.position:
                direction = -1.0

            self.position += (
                direction
                * self.speed_mm_per_sec
                * 0.01
            )

            if direction > 0 and self.position >= self.target_position:
                self.position = self.target_position
                self.motor_running = False
                self.speed_mm_per_sec = 0.0

            elif direction < 0 and self.position <= self.target_position:
                self.position = self.target_position
                self.motor_running = False
                self.speed_mm_per_sec = 0.0

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
        # Laser drift
        # -----------------------------------------------------

        if self.critical_mode:
            drift_nm = random.uniform(4.0, 6.0) * random.choice([-1, 1])
        else:
            drift_nm = random.uniform(-0.35, 0.35)

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
        # Simulation packet
        # -----------------------------------------------------

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
                "pressure_hpa": None
            },

            # Compatibility only.
            # This is NOT a vacuum measurement.
            "vacuum": {
                "pressure_hpa": None,
                "status": "UNAVAILABLE"
            }
        }


# Global simulation engine expected by websocket.py
telemetry_engine = TelemetryGenerator()


# ---------------------------------------------------------
# Real Raspberry Pi telemetry
# ---------------------------------------------------------

def generate_from_hardware():
    data = hardware_telemetry.latest

    if not data:
        return None

    vibration_data = data.get("vibration", {})
    environment_data = data.get("environment", {})
    motor_data = data.get("motor", {})

    phase2_data = predict_phase2(data)

    acceleration = vibration_data.get("acceleration_g")
    temperature = environment_data.get("temperature_c")
    pressure_hpa = environment_data.get("pressure_hpa")

    # Require the core real sensors.
    if acceleration is None or temperature is None:
        return None

    step_count = int(
        motor_data.get(
            "step_count",
            motor_data.get("position_steps", 0)
        )
    )

    position_steps = int(
        motor_data.get(
            "position_steps",
            step_count
        )
    )

    return {
        "timestamp": data.get(
            "timestamp",
            time.time()
        ),

        "elapsed": 0.0,

        "source": "raspberry_pi",

        "phase2": phase2_data,

        "motor": {
            "position": float(position_steps),

            "target_position": float(position_steps),

            "speed_rpm": 0.0,

            "speed_mm_per_sec": 0.0,

            "current_a": 0.0,

            "status": motor_data.get(
                "status",
                "UNKNOWN"
            ),

            "step_count": step_count,

            "position_steps": position_steps
        },

        "laser": {
            "displacement_mm": 0.0,
            "drift_nm": 0.0
        },

        "vibration": {
            "acceleration_g": round(
                float(acceleration),
                4
            ),

            "status": (
                "HIGH"
                if float(acceleration) >= 0.80
                else "NORMAL"
            )
        },

        "environment": {
            "temperature_c": round(
                float(temperature),
                2
            ),

            "pressure_hpa": (
                round(
                    float(pressure_hpa),
                    2
                )
                if pressure_hpa is not None
                else None
            )
        },

        # Compatibility object only.
        # It carries the SAME REAL BMP280 pressure.
        # It is NOT a separate vacuum sensor.
        "vacuum": {
            "pressure_hpa": (
                round(
                    float(pressure_hpa),
                    2
                )
                if pressure_hpa is not None
                else None
            ),

            "status": "REAL"
        }
    }
