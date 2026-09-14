export function generatePrediction(telemetry) {
  const temperature = telemetry.temperature?.valueC ?? 0
  const vibration = telemetry.vibration?.rmsG ?? 0

  const currentRisk = telemetry.risk?.riskScore ?? 0
  const backendStatus = telemetry.risk?.status ?? 'normal'
  const alerts = telemetry.alerts ?? []

  const hasCriticalAlert = alerts.some(
    alert => alert.severity === 'critical'
  )

  const hasWarningAlert = alerts.some(
    alert => alert.severity === 'warning'
  )

  let driftForecast = 0.32

  if (temperature >= 30) {
    driftForecast += 0.08
  }

  if (vibration >= 0.4) {
    driftForecast += 0.10
  }

  const anomalyProbability = Math.min(
    100,
    Math.round(
      currentRisk * 0.7 +
      (vibration >= 0.4 ? 15 : 0) +
      (temperature >= 30 ? 10 : 0) +
      (hasWarningAlert ? 10 : 0) +
      (hasCriticalAlert ? 20 : 0)
    )
  )

  const predictedRisk = Math.min(
    100,
    Math.round(
      currentRisk +
      (temperature >= 30 ? 6 : 0) +
      (vibration >= 0.4 ? 10 : 0) +
      (hasWarningAlert ? 5 : 0) +
      (hasCriticalAlert ? 15 : 0)
    )
  )

  let status = 'normal'

  if (hasCriticalAlert || backendStatus === 'critical' || predictedRisk >= 70) {
    status = 'critical'
  } else if (
    hasWarningAlert ||
    backendStatus === 'warning' ||
    predictedRisk >= 35
  ) {
    status = 'warning'
  }

  return {
    currentRisk,
    predictedRisk,
    driftForecast: Number(driftForecast.toFixed(2)),
    anomalyProbability,
    horizon: '24h',
    status,
  }
}
