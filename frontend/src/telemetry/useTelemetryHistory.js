import { useEffect, useState } from 'react'
import { useTelemetry } from './useTelemetry'

const MAX_POINTS = 60

export function useTelemetryHistory() {
  const { telemetry } = useTelemetry()

  const [history, setHistory] = useState({
    position: [],
    temperature: [],
    vibration: [],
    vacuum: [],
  })

  useEffect(() => {
    const sample = {
      position: telemetry.stage.positionMm,
      temperature: telemetry.temperature.valueC,
      vibration: telemetry.vibration.rmsG,
      vacuum: telemetry.vacuum.pressurePa,
    }

    setHistory((previous) => ({
      position: [
        ...previous.position,
        sample.position,
      ].slice(-MAX_POINTS),

      temperature: [
        ...previous.temperature,
        sample.temperature,
      ].slice(-MAX_POINTS),

      vibration: [
        ...previous.vibration,
        sample.vibration,
      ].slice(-MAX_POINTS),

      vacuum: [
        ...previous.vacuum,
        sample.vacuum,
      ].slice(-MAX_POINTS),
    }))
  }, [
    telemetry.stage.positionMm,
    telemetry.temperature.valueC,
    telemetry.vibration.rmsG,
    telemetry.vacuum.pressurePa,
  ])

  return history
}
