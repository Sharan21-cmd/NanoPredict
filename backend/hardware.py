import asyncio


class HardwareTelemetry:
    def __init__(self):
        self.latest = None
        self.updated = asyncio.Event()

    def update(self, data: dict):
        self.latest = data

        # Wake up anything waiting for new hardware data
        self.updated.set()

        # Create a fresh event for the next packet
        self.updated = asyncio.Event()

        print("[Hardware] Real sensor data received:")
        print(data)


hardware_telemetry = HardwareTelemetry()


# Currently connected Raspberry Pi WebSocket
hardware_socket = None


def set_hardware_socket(websocket):
    global hardware_socket
    hardware_socket = websocket


def clear_hardware_socket(websocket):
    global hardware_socket
    if hardware_socket is websocket:
        hardware_socket = None


async def send_hardware_command(command: dict):
    if hardware_socket is None:
        print("[Hardware] Raspberry Pi not connected")
        return False

    try:
        await hardware_socket.send_json(command)
        print(f"[Hardware] Command sent to Raspberry Pi: {command}")
        return True
    except Exception as e:
        print(f"[Hardware] Command send failed: {e}")
        return False
