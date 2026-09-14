import Panel from '../layout/Panel'
import { useTelemetry } from '../../telemetry/useTelemetry'

const COLOR_STYLES = {
  emerald: {
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
    border: 'border-emerald-400/20',
  },
  amber: {
    dot: 'bg-amber-400',
    text: 'text-amber-400',
    border: 'border-amber-400/20',
  },
  rose: {
    dot: 'bg-rose-500',
    text: 'text-rose-500',
    border: 'border-rose-500/20',
  },
}

function getAlertStatus(alerts = [], type) {
  const alert = alerts.find(item => item.type === type)

  if (alert?.severity === 'critical') {
    return { label: 'Critical', color: 'rose' }
  }

  if (alert?.severity === 'warning') {
    return { label: 'Warning', color: 'amber' }
  }

  return { label: 'Normal', color: 'emerald' }
}

export default function LiveSensorReadings() {
  const { telemetry } = useTelemetry()

  const alerts = telemetry.alerts ?? []

  const vacuumStatus = getAlertStatus(alerts, 'vacuum')
  const vibrationStatus = getAlertStatus(alerts, 'vibration')
  const temperatureStatus = getAlertStatus(alerts, 'temperature')
  const driftStatus = getAlertStatus(alerts, 'drift')

  const sensorReadings = [
    {
      id: 'distance',
      label: 'VL53L1X',
      name: 'Stage Distance',
      value: telemetry.distance?.valueMm?.toFixed(2) ?? '0.00',
      unit: 'mm',
      status: driftStatus,
    },
    {
      id: 'vibration',
      label: 'MPU6050',
      name: 'RMS Vibration',
      value: telemetry.vibration?.rmsG?.toFixed(2) ?? '0.00',
      unit: 'g RMS',
      status: vibrationStatus,
    },
    {
      id: 'temperature',
      label: 'TEMP-01',
      name: 'Temperature',
      value: telemetry.temperature?.valueC?.toFixed(1) ?? '0.0',
      unit: '°C',
      status: temperatureStatus,
    },
    {
      id: 'pressure',
      label: 'BMP280',
      name: 'Vacuum Pressure',
      value: telemetry.vacuum?.pressurePa?.toExponential(2) ?? '0.00e+0',
      unit: 'Pa',
      status: vacuumStatus,
    },
  ]

  return (
    <Panel
      title="Live Sensor Readings"
      subtitle="Current telemetry from prototype sensors"
      className="h-full"
    >
      <div className="grid grid-cols-2 xl:grid-cols-4 divide-x divide-slate-800">
        {sensorReadings.map((sensor) => {
          const style = COLOR_STYLES[sensor.status.color]

          return (
            <div
              key={sensor.id}
              className="p-4 min-w-0"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[9px] font-mono text-slate-600">
                    {sensor.label}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {sensor.name}
                  </p>
                </div>

                <span
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border ${style.border} ${style.text} text-[8px]`}
                >
                  <span
                    className={`w-1 h-1 rounded-full ${style.dot}`}
                  />

                  {sensor.status.label}
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-xl font-mono font-semibold text-slate-100">
                  {sensor.value}
                </span>

                <span className="text-[9px] text-slate-500">
                  {sensor.unit}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
