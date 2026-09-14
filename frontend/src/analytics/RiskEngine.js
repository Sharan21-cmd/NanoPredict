function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function temperatureRisk(value) {
  if (value <= 30) return 0
  if (value >= 36) return 100

  return ((value - 30) / 6) * 100
}

function vibrationRisk(value) {
  if (value <= 0.4) return 0
  if (value >= 0.85) return 100

  return ((value - 0.4) / 0.45) * 100
}

function vacuumRisk(value) {
  if (value <= 4e-6) return 0
  if (value >= 10e-6) return 100

  return ((value - 4e-6) / 6e-6) * 100
}

export function calculateRisk({
  temperature,
  vibration,
  vacuum,
}) {
  const temperatureScore =
    temperatureRisk(temperature)

  const vibrationScore =
    vibrationRisk(vibration)

  const vacuumScore =
    vacuumRisk(vacuum)

  /*
   * Weighted contribution.
   *
   * Temperature -> 25%
   * Vibration   -> 40%
   * Vacuum      -> 35%
   */
  const rawRisk =
    temperatureScore * 0.25 +
    vibrationScore * 0.40 +
    vacuumScore * 0.35

  const riskScore = Math.round(
    clamp(rawRisk, 0, 100)
  )

  const health = Math.round(
    clamp(100 - riskScore, 0, 100)
  )

  let status = 'normal'

  if (riskScore >= 70) {
    status = 'critical'
  } else if (riskScore >= 35) {
    status = 'warning'
  }

  return {
    riskScore,
    health,
    status,

    contributions: {
      temperature: Math.round(temperatureScore),
      vibration: Math.round(vibrationScore),
      vacuum: Math.round(vacuumScore),
    },
  }
}
