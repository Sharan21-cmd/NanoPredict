import random
import time


class TelemetryEngine:
    def __init__(self):
        self.start_time = time.time()

        # Motor state
        self.position = 0.0
        self.target_position = 0.0
        self.speed_mm_per_sec = 10.0
        self.motor_running = False

        # Sensor modes
        self.temperature_mode = "normal"
        self.vibration_mode = "normal"
        self.vacuum_mode = "normal"
        self.critical_mode = False

    # ---------------------------------------------------------
    # MOTOR CONTROL
    # ---------------------------------------------------------

    def set_target_position(self, position_mm):
        self.target_position = max(0.0, min(100.0, float(position_mm)))
        self.motor_running = True

    def stop_motor(self):
        self.target_position = self.position
        self.motor_running = False

    def set_motor_speed(self, speed_mm_per_sec):
        self.speed_mm_per_sec = max(
            1.0,
            min(30.0, float(speed_mm_per_sec))
        )

    # ---------------------------------------------------------
    # SENSOR CONTROL
    # ---------------------------------------------------------

    def set_temperature_mode(self, mode):
        if mode in ("normal", "heat"):
            self.temperature_mode = mode

    def set_vibration_mode(self, mode):
        if mode in ("normal", "shake"):
            self.vibration_mode = mode

    def set_vacuum_mode(self, mode):
        if mode in ("normal", "leak"):
            self.vacuum_mode = mode

    def set_critical_mode(self, enabled=True):
        self.critical_mode = bool(enabled)

    def normalize_sensors(self):
        self.critical_mode = False
        self.temperature_mode = "normal"
        self.vibration_mode = "normal"
        self.vacuum_mode = "normal"

    # ---------------------------------------------------------
    # TELEMETRY GENERATION
    # ---------------------------------------------------------

    def generate(self):
        elapsed = time.time() - self.start_time

        # -----------------------------------------------------
        # Motor movement
        # -----------------------------------------------------

        difference = self.target_position - self.position

        if abs(difference) > 0.001 and self.motor_running:

            direction = 1 if difference > 0 else -1

            movement = self.speed_mm_per_sec * 0.02

            self.position += direction * min(
                abs(difference),
                movement
            )

            if abs(self.target_position - self.position) <= 0.001:
                self.position = self.target_position
                self.motor_running = False

        else:
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
        # Vacuum
        # -----------------------------------------------------

        if self.critical_mode:
            vacuum = 0.00065 + random.uniform(-0.00004, 0.00008)
            vacuum_status = "LEAK"
        elif self.vacuum_mode == "leak":
            vacuum = 0.0005 + random.uniform(-0.00003, 0.00003)
            vacuum_status = "LEAK"
        else:
            vacuum = 0.00012 + random.uniform(-0.000015, 0.000015)
            vacuum_status = "STABLE"

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
        # Telemetry packet
        # -----------------------------------------------------

        return {
            "timestamp": time.time(),
            "elapsed": round(elapsed, 2),

            "motor": {
                "position": round(self.position, 4),
                "target_position": round(self.target_position, 4),
                "speed_rpm": round(motor_speed_rpm, 2),
                "speed_mm_per_sec": round(
                    self.speed_mm_per_sec,
                    2
                ),
                "current_a": round(motor_current, 3),
                "status": motor_status
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
                )
            },

            "vacuum": {
                "pressure_mbar": round(
                    vacuum,
                    7
                ),
                "status": vacuum_status
            }
        }


telemetry_engine = TelemetryEngine()
