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
