import { createContext, useContext, useEffect, useRef, useState } from 'react'

const TelemetryContext = createContext(null)

function mapBackendTelemetry(packet) {
  const data = packet.telemetry
  const risk = packet.risk

  return {
    stage: {
      positionMm: data.motor.position,
      targetPositionMm:
        data.motor.target_position ?? data.motor.position,
      moving: data.motor.status === 'RUNNING',
      speedMmPerSec:
        data.motor.speed_mm_per_sec ??
        data.motor.speed_rpm,
    },

    temperature: {
      valueC: data.environment.temperature_c,
    },

    vibration: {
      rmsG: data.vibration.acceleration_g,
    },

    vacuum: {
      // Backend sends mbar.
      // Frontend expects Pa.
      // 1 mbar = 100 Pa.
      pressurePa: data.vacuum.pressure_mbar * 100,
    },

    distance: {
      valueMm: data.laser.displacement_mm,
      driftNm: data.laser.drift_nm,
    },

    risk: {
      riskScore: risk.risk_score,
      health: Math.max(0, 100 - risk.risk_score),
      status: risk.level.toLowerCase(),

      contributions: {
        temperature: risk.factors.temperature,
        vibration: risk.factors.vibration,
        vacuum: risk.factors.vacuum,
      },
    },

    alerts: packet.alerts ?? [],
  }
}

const initialTelemetry = {
  stage: {
    positionMm: 0,
    targetPositionMm: 0,
    moving: false,
    speedMmPerSec: 10,
  },

  temperature: {
    valueC: 23.6,
  },

  vibration: {
    rmsG: 0.12,
  },

  vacuum: {
    pressurePa: 2.4e-6,
  },

  distance: {
    valueMm: 0,
  },

  risk: {
    riskScore: 0,
    health: 100,
    status: 'normal',

    contributions: {
      temperature: 0,
      vibration: 0,
      vacuum: 0,
    },
  },

  alerts: [],
}

export function TelemetryProvider({ children }) {
  const [telemetry, setTelemetry] = useState(initialTelemetry)
  const [connected, setConnected] = useState(false)

  const socketRef = useRef(null)

  useEffect(() => {
    let socket = null
    let reconnectTimer = null
    let stopped = false

    function connect() {
      if (stopped) {
        return
      }

      console.log('[NanoPredict] Connecting to backend...')

      socket = new WebSocket(
        'ws://localhost:8000/ws/telemetry'
      )

      socketRef.current = socket

      socket.onopen = () => {
        console.log(
          '[NanoPredict] Backend WebSocket connected'
        )

        setConnected(true)
      }

      socket.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data)

          if (packet.type === 'telemetry') {
            const mappedTelemetry =
              mapBackendTelemetry(packet)

            setTelemetry(mappedTelemetry)
          }
        } catch (error) {
          console.error(
            '[NanoPredict] Telemetry parse error:',
            error
          )
        }
      }

      socket.onclose = () => {
        console.log(
          '[NanoPredict] Backend WebSocket disconnected'
        )

        setConnected(false)

        if (socketRef.current === socket) {
          socketRef.current = null
        }

        if (!stopped) {
          reconnectTimer = setTimeout(() => {
            connect()
          }, 2000)
        }
      }

      socket.onerror = (error) => {
        console.error(
          '[NanoPredict] WebSocket error:',
          error
        )
      }
    }

    connect()

    return () => {
      stopped = true

      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
      }

      if (socket) {
        socket.close()
      }

      socketRef.current = null
    }
  }, [])

  // ---------------------------------------------------------
  // SEND COMMAND TO BACKEND
  // ---------------------------------------------------------

  function sendCommand(command) {
    const socket = socketRef.current

    if (!socket) {
      console.warn(
        '[NanoPredict] Cannot send command: WebSocket unavailable'
      )
      return
    }

    if (socket.readyState !== WebSocket.OPEN) {
      console.warn(
        '[NanoPredict] Cannot send command: WebSocket not open'
      )
      return
    }

    try {
      socket.send(JSON.stringify(command))

      console.log(
        '[NanoPredict] Command sent:',
        command
      )
    } catch (error) {
      console.error(
        '[NanoPredict] Command send error:',
        error
      )
    }
  }

  // ---------------------------------------------------------
  // MOTOR COMMANDS
  // ---------------------------------------------------------

  function setTargetPosition(positionMm) {
    sendCommand({
      command: 'set_target_position',
      position_mm: positionMm,
    })
  }

  function stopMotor() {
    sendCommand({
      command: 'stop_motor',
    })
  }

  function setMotorSpeed(speedMmPerSec) {
    sendCommand({
      command: 'set_motor_speed',
      speed_mm_per_sec: speedMmPerSec,
    })
  }

  // ---------------------------------------------------------
  // SENSOR COMMANDS
  // ---------------------------------------------------------

  function setTemperatureMode(mode) {
    sendCommand({
      command: 'set_temperature_mode',
      mode,
    })
  }

  function setVibrationMode(mode) {
    sendCommand({
      command: 'set_vibration_mode',
      mode,
    })
  }

  function setVacuumMode(mode) {
    sendCommand({
      command: 'set_vacuum_mode',
      mode,
    })
  }

  // ---------------------------------------------------------
  // NORMALIZE
  // ---------------------------------------------------------

  function normalizeSensors() {
    sendCommand({
      command: 'normalize',
    })
  }

  const value = {
    telemetry,
    connected,

    setTargetPosition,
    stopMotor,
    setMotorSpeed,

    setTemperatureMode,
    setVibrationMode,
    setVacuumMode,

    normalizeSensors,
  }

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  )
}

export function useTelemetryContext() {
  const context = useContext(TelemetryContext)

  if (!context) {
    throw new Error(
      'useTelemetryContext must be used inside TelemetryProvider'
    )
  }

  return context
}
