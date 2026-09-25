import asyncio
import json

from fastapi import WebSocket

from telemetry import telemetry_engine, generate_from_hardware
from risk import calculate_risk, generate_alerts
from prediction import prediction_engine
from ai.state import latest_state
from ai.events import event_store


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

        print(
            f"[WebSocket] Client connected. "
            f"Total: {len(self.active_connections)}"
        )

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

        print(
            f"[WebSocket] Client disconnected. "
            f"Total: {len(self.active_connections)}"
        )

    async def broadcast(self, data: dict):
        disconnected = []

        for connection in self.active_connections:
            try:
                await connection.send_json(data)
            except Exception:
                disconnected.append(connection)

        for connection in disconnected:
            self.disconnect(connection)


manager = ConnectionManager()


async def handle_command(message: str):
    try:
        command = json.loads(message)

        command_type = (
            command.get("command")
            or command.get("type")
        )

        if command_type == "set_target_position":
            position = command.get("position_mm")

            if position is not None:
                telemetry_engine.set_target_position(position)

                print(
                    f"[Command] Target position → "
                    f"{position} mm"
                )

        elif command_type == "stop_motor":
            telemetry_engine.stop_motor()
            print("[Command] Motor stopped")

        elif command_type == "set_motor_speed":
            speed = command.get("speed_mm_per_sec")

            if speed is not None:
                telemetry_engine.set_motor_speed(speed)

                print(
                    f"[Command] Motor speed → "
                    f"{speed} mm/s"
                )

        elif command_type == "set_temperature_mode":
            mode = command.get("mode")

            if mode in ("normal", "heat"):
                telemetry_engine.set_temperature_mode(mode)

                print(
                    f"[Command] Temperature mode → {mode}"
                )

        elif command_type == "set_vibration_mode":
            mode = command.get("mode")

            if mode in ("normal", "shake"):
                telemetry_engine.set_vibration_mode(mode)

                print(
                    f"[Command] Vibration mode → {mode}"
                )

        elif command_type == "set_vacuum_mode":
            mode = command.get("mode")

            if mode in ("normal", "leak"):
                telemetry_engine.set_vacuum_mode(mode)

                print(
                    f"[Command] Vacuum mode → {mode}"
                )

        elif command_type in (
            "normalize",
            "normalize_sensors"
        ):
            telemetry_engine.stop_motor()
            telemetry_engine.normalize_sensors()

            print("[Command] System normalized")

        else:
            print(
                f"[Command] Unknown command: "
                f"{command_type}"
            )

    except json.JSONDecodeError:
        print("[Command] Invalid JSON received")

    except Exception as e:
        print(f"[Command] ERROR: {e}")


async def telemetry_loop():
    while True:
        try:
            print("[Telemetry] Generating packet...")

            # -------------------------------------------------
            # REAL RASPBERRY PI DATA
            # -------------------------------------------------

            telemetry = generate_from_hardware()

            # -------------------------------------------------
            # FALLBACK TO SIMULATION
            # -------------------------------------------------

            if telemetry is None:
                telemetry = telemetry_engine.generate()

            # -------------------------------------------------
            # RISK ANALYSIS
            # -------------------------------------------------

            risk = calculate_risk(telemetry)

            # -------------------------------------------------
            # ALERT GENERATION
            # -------------------------------------------------

            alerts = generate_alerts(
                telemetry,
                risk
            )

            # -------------------------------------------------
            # PREDICTION
            # -------------------------------------------------

            prediction = prediction_engine.predict(
                telemetry,
                risk
            )

            # -------------------------------------------------
            # UPDATE CURRENT SYSTEM STATE
            # -------------------------------------------------

            latest_state.update(
                telemetry=telemetry,
                risk=risk,
                alerts=alerts,
                prediction=prediction,
            )

            # -------------------------------------------------
            # STORE EVENT
            # -------------------------------------------------

            event_store.record_from_payload(
                telemetry=telemetry,
                risk=risk,
                alerts=alerts,
                prediction=prediction,
            )

            # -------------------------------------------------
            # SEND TO FRONTEND
            # -------------------------------------------------

            payload = {
                "type": "telemetry",
                "timestamp": telemetry["timestamp"],
                "telemetry": telemetry,
                "risk": risk,
                "alerts": alerts,
                "prediction": prediction,
            }

            await manager.broadcast(payload)

        except Exception as e:
            print(
                f"[Telemetry] ERROR: {e}"
            )

        await asyncio.sleep(1)
