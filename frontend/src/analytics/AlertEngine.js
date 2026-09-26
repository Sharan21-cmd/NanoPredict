const ALERT_CONFIG = {
  temperature: {
    warning: 30,
    critical: 35,
  },

  vibration: {
    warning: 0.96,
    critical: 0.98,
  },

  vacuum: {
    warning: 4e-6,
    critical: 8e-6,
  },
}

function getSeverity(value, thresholds) {
  if (value >= thresholds.critical) {
    return 'critical'
  }

  if (value >= thresholds.warning) {
    return 'warning'
  }

  return 'normal'
}

export function generateAlerts(telemetry) {
  const alerts = []

  const temperatureStatus = getSeverity(
    telemetry.temperature.valueC,
    ALERT_CONFIG.temperature
  )

  const vibrationStatus = getSeverity(
    telemetry.vibration.rmsG,
    ALERT_CONFIG.vibration
  )

  const vacuumStatus = getSeverity(
    telemetry.vacuum.pressurePa,
    ALERT_CONFIG.vacuum
  )

  // Temperature alert
  if (temperatureStatus !== 'normal') {
    alerts.push({
      id: 'temperature-alert',
      type: temperatureStatus,
      sensor: 'TEMP-01',
      title:
        temperatureStatus === 'critical'
          ? 'Critical temperature detected'
          : 'Temperature above warning limit',
      detail: `Temperature is ${telemetry.temperature.valueC.toFixed(1)} °C`,
      timestamp: new Date().toLocaleTimeString('en-GB', {
        hour12: false,
      }),
    })
  }

  // Vibration alert
  if (vibrationStatus !== 'normal') {
    alerts.push({
      id: 'vibration-alert',
      type: vibrationStatus,
      sensor: 'MPU6050',
      title:
        vibrationStatus === 'critical'
          ? 'Critical vibration detected'
          : 'High vibration detected',
      detail: `RMS vibration is ${telemetry.vibration.rmsG.toFixed(2)} g`,
      timestamp: new Date().toLocaleTimeString('en-GB', {
        hour12: false,
      }),
    })
  }

  // Vacuum alert
  if (vacuumStatus !== 'normal') {
    alerts.push({
      id: 'vacuum-alert',
      type: vacuumStatus,
      sensor: 'BMP280',
      title:
        vacuumStatus === 'critical'
          ? 'Critical vacuum pressure detected'
          : 'Vacuum pressure above warning limit',
      detail: `Pressure is ${telemetry.vacuum.pressurePa.toExponential(2)} Pa`,
      timestamp: new Date().toLocaleTimeString('en-GB', {
        hour12: false,
      }),
    })
  }

  return alerts
}
