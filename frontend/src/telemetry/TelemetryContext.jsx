import { createContext, useContext, useEffect, useRef, useState } from 'react'

const TelemetryContext = createContext(null)

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000'

const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws')

function mapBackendTelemetry(packet) {
  const data = packet.telemetry
  const risk = packet.risk

  return {
    stage: {
      positionMm: data.motor.position,
      targetPositionMm: data.motor.target_position ?? data.motor.position,
      moving: data.motor.status === 'RUNNING',
      speedMmPerSec: data.motor.speed_mm_per_sec ?? data.motor.speed_rpm,
    },

    temperature: {
      valueC: data.environment.temperature_c,
    },

    vibration: {
      rmsG: data.vibration.acceleration_g,
    },

    vacuum: {
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
        displacement: risk.factors.displacement,
      },
    },

    alerts: packet.alerts ?? [],

    prediction: packet.prediction ?? {
      condition: 'SYSTEM STABLE',
      confidence: 0,
      warnings: [],
      trends: {
        drift_nm: 0,
        vibration_g: 0,
        temperature_c: 0,
        vacuum_mbar: 0,
      },
      history_samples: 0,
    },
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
    valueC: 24.5,
  },

  vibration: {
    rmsG: 0.12,
  },

  vacuum: {
    pressurePa: 0.012,
  },

  distance: {
    valueMm: 0,
    driftNm: 0,
  },

  risk: {
    riskScore: 0,
    health: 100,
    status: 'normal',

    contributions: {
      temperature: 0,
      vibration: 0,
      vacuum: 0,
      displacement: 0,
    },
  },

  alerts: [],

  prediction: {
    condition: 'SYSTEM STABLE',
    confidence: 0,
    warnings: [],
    trends: {
      drift_nm: 0,
      vibration_g: 0,
      temperature_c: 0,
      vacuum_mbar: 0,
    },
    history_samples: 0,
  },
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
      if (stopped) return

      const token = sessionStorage.getItem('nanopredict_token')

      if (!token) {
        console.warn('[NanoPredict] No authentication token found')
        setConnected(false)
        return
      }

      console.log('[NanoPredict] Connecting to backend...')

      socket = new WebSocket(
        `${WS_BASE_URL}/ws/telemetry?token=${encodeURIComponent(token)}`
      )

      socketRef.current = socket

      socket.onopen = () => {
        console.log('[NanoPredict] Backend WebSocket connected')
        setConnected(true)
      }

      socket.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data)

          if (packet.type === 'telemetry') {
            setTelemetry(mapBackendTelemetry(packet))
          }
        } catch (error) {
          console.error(
            '[NanoPredict] Telemetry parse error:',
            error
          )
        }
      }

      socket.onclose = (event) => {
        console.log(
          '[NanoPredict] Backend WebSocket disconnected',
          event.code
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

      console.log('[NanoPredict] Command sent:', command)
    } catch (error) {
      console.error(
        '[NanoPredict] Command send error:',
        error
      )
    }
  }

  function setTargetPosition(positionMm) {
    sendCommand({
      type: 'set_target_position',
      position_mm: Number(positionMm),
    })
  }

  function stopMotor() {
    sendCommand({
      type: 'stop_motor',
    })
  }

  function setMotorSpeed(speedMmPerSec) {
    sendCommand({
      type: 'set_motor_speed',
      speed_mm_per_sec: Number(speedMmPerSec),
    })
  }

  function setTemperatureMode(mode) {
    sendCommand({
      type: 'set_temperature_mode',
      mode,
    })
  }

  function setVibrationMode(mode) {
    sendCommand({
      type: 'set_vibration_mode',
      mode,
    })
  }

  function setVacuumMode(mode) {
    sendCommand({
      type: 'set_vacuum_mode',
      mode,
    })
  }

  function normalizeSensors() {
    sendCommand({
      type: 'normalize_sensors',
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
    sendCommand,
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

export function useTelemetry() {
  return useTelemetryContext()
}

export default TelemetryContext
