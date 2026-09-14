import Panel from '../components/layout/Panel'
import { useTelemetry } from '../telemetry/useTelemetry'

const SENSOR_INFO = [
  {
    id: 'distance',
    sensor: 'VL53L1X',
    name: 'Stage Distance',
    unit: 'mm',
    description: 'Linear stage position measurement',
  },
  {
    id: 'vibration',
    sensor: 'MPU6050',
    name: 'Vibration',
    unit: 'g RMS',
    description: 'Mechanical vibration measurement',
  },
  {
    id: 'temperature',
    sensor: 'TEMP-01',
    name: 'Temperature',
    unit: '°C',
    description: 'Prototype temperature measurement',
  },
  {
    id: 'vacuum',
    sensor: 'BMP280',
    name: 'Vacuum Pressure',
    unit: 'Pa',
    description: 'Chamber pressure measurement',
  },
]

function getStatus(type, alerts = []) {
  const alert = alerts.find(
    item => item.type === type
  )

  if (alert?.severity === 'critical') return 'Critical'
  if (alert?.severity === 'warning') return 'Warning'

  return 'Normal'
}

const STATUS_STYLES = {
  Normal: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    dot: 'bg-emerald-400',
  },
  Warning: {
    text: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    dot: 'bg-amber-400',
  },
  Critical: {
    text: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20',
    dot: 'bg-rose-500',
  },
}

function formatValue(type, value) {
  if (type === 'vacuum') {
    return value.toExponential(2)
  }

  if (type === 'temperature') {
    return value.toFixed(1)
  }

  if (type === 'vibration') {
    return value.toFixed(2)
  }

  return value.toFixed(2)
}

export default function SensorData() {
  const { telemetry } = useTelemetry()

  const readings = [
    {
      ...SENSOR_INFO[0],
      type: 'distance',
      value: telemetry.distance.valueMm,
    },
    {
      ...SENSOR_INFO[1],
      type: 'vibration',
      value: telemetry.vibration.rmsG,
    },
    {
      ...SENSOR_INFO[2],
      type: 'temperature',
      value: telemetry.temperature.valueC,
    },
    {
      ...SENSOR_INFO[3],
      type: 'vacuum',
      value: telemetry.vacuum.pressurePa,
    },
  ]

  return (
    <main className="flex-1 min-h-0 p-3 overflow-auto">

      {/* Page heading */}
      <div className="mb-3">
        <h1 className="text-base font-semibold text-slate-100">
          Sensor Data
        </h1>

        <p className="text-[10px] text-slate-500 mt-1">
          Detailed real-time telemetry from the NanoPredict prototype
        </p>
      </div>

      {/* Sensor cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

        {readings.map((reading) => {
          const status = getStatus(
            reading.type,
            telemetry.alerts
          )

          const style = STATUS_STYLES[status]

          return (
            <Panel
              key={reading.id}
              title={reading.sensor}
              subtitle={reading.description}
            >
              <div className="p-4">

                {/* Sensor name */}
                <p className="text-[11px] text-slate-400">
                  {reading.name}
                </p>

                {/* Value */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-semibold text-slate-100">
                    {formatValue(
                      reading.type,
                      reading.value
                    )}
                  </span>

                  <span className="text-[10px] text-slate-500">
                    {reading.unit}
                  </span>
                </div>

                {/* Status */}
                <div
                  className={`mt-4 inline-flex items-center gap-1.5 px-2 py-1 rounded-full border ${style.bg} ${style.border} ${style.text}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                  />

                  <span className="text-[9px] font-medium">
                    {status}
                  </span>
                </div>

                {/* Technical information */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">

                  <div className="flex justify-between">
                    <span className="text-[9px] text-slate-600">
                      Sensor ID
                    </span>

                    <span className="text-[9px] font-mono text-slate-400">
                      {reading.sensor}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[9px] text-slate-600">
                      Source
                    </span>

                    <span className="text-[9px] font-mono text-cyan-400">
                      BACKEND
                    </span>
                  </div>

                </div>

              </div>
            </Panel>
          )
        })}

      </div>

      {/* Telemetry overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 mt-3">

        <Panel
          title="Stage Position"
          subtitle="Virtual motor position"
        >
          <div className="p-4">

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] text-slate-600">
                  CURRENT POSITION
                </p>

                <p className="text-3xl font-mono font-semibold text-slate-100 mt-1">
                  {telemetry.stage.positionMm.toFixed(2)}
                </p>

                <p className="text-[10px] text-slate-500">
                  mm
                </p>
              </div>

              <div
                className={`px-2 py-1 text-[9px] border rounded-sm ${
                  telemetry.stage.moving
                    ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'
                    : 'text-slate-500 bg-slate-900 border-slate-800'
                }`}
              >
                {telemetry.stage.moving
                  ? 'MOVING'
                  : 'STOPPED'}
              </div>
            </div>

          </div>
        </Panel>

        <Panel
          title="Distance Tracking"
          subtitle="VL53L1X correlation"
        >
          <div className="p-4">

            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500">
                Stage
              </span>

              <span className="font-mono text-sm text-slate-200">
                {telemetry.stage.positionMm.toFixed(2)} mm
              </span>
            </div>

            <div className="flex justify-between items-center mt-3">
              <span className="text-[10px] text-slate-500">
                Distance Sensor
              </span>

              <span className="font-mono text-sm text-cyan-400">
                {telemetry.distance.valueMm.toFixed(2)} mm
              </span>
            </div>

            <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-75"
                style={{
                  width: `${Math.min(
                    telemetry.distance.valueMm,
                    100
                  )}%`,
                }}
              />
            </div>

          </div>
        </Panel>

        <Panel
          title="Telemetry Status"
          subtitle="WebSocket connection"
        >
          <div className="p-4">

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />

              <span className="text-[11px] text-emerald-400">
                TELEMETRY ONLINE
              </span>
            </div>

            <div className="mt-4 space-y-2">

              <div className="flex justify-between">
                <span className="text-[9px] text-slate-600">
                  Update Rate
                </span>

                <span className="text-[9px] font-mono text-slate-300">
                  20 Hz
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[9px] text-slate-600">
                  Source
                </span>

                <span className="text-[9px] font-mono text-cyan-400">
                  LIVE BACKEND
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[9px] text-slate-600">
                  Equipment
                </span>

                <span className="text-[9px] font-mono text-slate-300">
                  EQ-04A
                </span>
              </div>

            </div>

          </div>
        </Panel>

      </div>

    </main>
  )
}
