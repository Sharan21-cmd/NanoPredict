import Panel from '../layout/Panel'
import ParameterCard from './ParameterCard'
import { useTelemetry } from '../../telemetry/useTelemetry'

function getTemperatureStatus(value) {
  if (value >= 35) return 'critical'
  if (value >= 30) return 'warning'
  return 'stable'
}

function getVibrationStatus(value) {
  if (value >= 0.98) return 'critical'
  if (value >= 0.96) return 'warning'
  return 'stable'
}

function getVacuumStatus(riskStatus, alerts = []) {
  const vacuumAlert = alerts.find(
    alert => alert.type === 'vacuum'
  )

  if (vacuumAlert?.severity === 'critical') return 'critical'
  if (vacuumAlert?.severity === 'warning') return 'warning'

  if (riskStatus === 'critical') return 'critical'
  if (riskStatus === 'warning') return 'warning'

  return 'stable'
}

function getPositionStatus() {
  return 'stable'
}

export default function KeyParameters() {
  const { telemetry } = useTelemetry()

  const temperature = telemetry.temperature.valueC
  const vibration = telemetry.vibration.rmsG
  const vacuum = telemetry.vacuum.pressurePa
  const position = telemetry.stage.positionMm

  const parameters = [
    {
      label: 'Position / Displacement',
      value: position.toFixed(2),
      unit: 'mm',
      status: getPositionStatus(),
      icon: '✥',
      trendPoints:
        '0,13 7,15 14,9 21,12 28,6 35,10 42,7 49,9 56,5',
    },
    {
      label: 'Vibration',
      value: vibration.toFixed(2),
      unit: 'g RMS',
      status: getVibrationStatus(vibration),
      icon: '∿',
      trendPoints:
        '0,14 7,10 14,15 21,8 28,12 35,6 42,11 49,9 56,6',
    },
    {
      label: 'Temperature',
      value: temperature.toFixed(1),
      unit: '°C',
      status: getTemperatureStatus(temperature),
      icon: '♨',
      trendPoints:
        '0,15 7,11 14,13 21,9 28,12 35,8 42,10 49,7 56,9',
    },
    {
      label: 'Pressure / Vacuum',
      value: vacuum.toExponential(2),
      unit: 'Pa',
      status: getVacuumStatus(
        telemetry.risk?.status,
        telemetry.alerts
      ),
      icon: '◌',
      trendPoints:
        '0,14 7,13 14,15 21,11 28,12 35,8 42,10 49,6 56,5',
    },
  ]

  const risk = telemetry.risk?.riskScore ?? 0
  const health = telemetry.risk?.health ?? 100

  const lowRisk = Math.max(0, 100 - risk - 4)

  return (
    <Panel
      title="Key Parameters"
      subtitle="Current equipment measurements"
      className="h-full min-h-0"
    >
      <div className="h-full min-h-0 flex flex-col">

        {/* Risk summary */}
        <div className="shrink-0 px-3 py-2 border-b border-slate-800">

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500">
              Equipment Risk
            </span>

            <span className="font-mono text-[11px] text-slate-300">
              {risk}%
            </span>
          </div>

          {/* Risk legend */}
          <div className="grid grid-cols-3 gap-2 mt-2">

            <div className="min-w-0 flex items-center justify-between gap-1">
              <span className="flex items-center gap-1.5 min-w-0 text-[9px] text-slate-500">
                <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="truncate">
                  Low Risk
                </span>
              </span>

              <span className="font-mono text-[9px] text-slate-400">
                {lowRisk}%
              </span>
            </div>

            <div className="min-w-0 flex items-center justify-between gap-1">
              <span className="flex items-center gap-1.5 min-w-0 text-[9px] text-slate-500">
                <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-amber-400" />
                <span className="truncate">
                  Warning
                </span>
              </span>

              <span className="font-mono text-[9px] text-slate-400">
                4%
              </span>
            </div>

            <div className="min-w-0 flex items-center justify-between gap-1">
              <span className="flex items-center gap-1.5 min-w-0 text-[9px] text-slate-500">
                <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-rose-500" />
                <span className="truncate">
                  Critical
                </span>
              </span>

              <span className="font-mono text-[9px] text-slate-400">
                2%
              </span>
            </div>

          </div>

          {/* Health */}
          <div className="mt-2">

            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-slate-600">
                Health
              </span>

              <span className="text-[9px] font-mono text-emerald-400">
                {health}%
              </span>
            </div>

            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{
                  width: `${health}%`,
                }}
              />
            </div>

          </div>

        </div>

        {/* Parameter rows */}
        <div className="flex-1 min-h-0 grid grid-rows-4 px-3">

          {parameters.map((parameter) => (
            <div
              key={parameter.label}
              className="min-w-0 min-h-0"
            >
              <ParameterCard {...parameter} />
            </div>
          ))}

        </div>

      </div>
    </Panel>
  )
}
