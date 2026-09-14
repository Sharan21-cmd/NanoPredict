import Panel from '../layout/Panel'
import TrendChart from './TrendChart'
import { useTelemetryHistory } from '../../telemetry/useTelemetryHistory'
import { useTelemetry } from '../../telemetry/useTelemetry'

function getTemperatureStatus(value) {
  if (value >= 35) return 'critical'
  if (value >= 30) return 'warning'
  return 'stable'
}

function getVibrationStatus(value) {
  if (value >= 0.8) return 'critical'
  if (value >= 0.4) return 'warning'
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

export default function TrendAnalysis() {
  const history = useTelemetryHistory()
  const { telemetry } = useTelemetry()

  const trends = [
    {
      label: 'Position Drift',
      value: telemetry.stage.positionMm.toFixed(2),
      unit: 'mm',
      status: getPositionStatus(),
      points: history.position,
    },
    {
      label: 'Vibration',
      value: telemetry.vibration.rmsG.toFixed(2),
      unit: 'g RMS',
      status: getVibrationStatus(telemetry.vibration.rmsG),
      points: history.vibration,
    },
    {
      label: 'Temperature',
      value: telemetry.temperature.valueC.toFixed(1),
      unit: '°C',
      status: getTemperatureStatus(
        telemetry.temperature.valueC
      ),
      points: history.temperature,
    },
    {
      label: 'Vacuum Pressure',
      value: telemetry.vacuum.pressurePa.toExponential(2),
      unit: 'Pa',
      status: getVacuumStatus(
        telemetry.risk?.status,
        telemetry.alerts
      ),
      points: history.vacuum,
    },
  ]

  return (
    <Panel
      title="Trend Analysis"
      subtitle="Live sensor trends — rolling observation window"
      className="h-full min-h-0"
    >
      <div className="h-full min-h-0 grid grid-cols-2 grid-rows-2 gap-3 p-3">

        {trends.map((trend) => (
          <div
            key={trend.label}
            className="min-w-0 min-h-0 h-full"
          >
            <TrendChart
              {...trend}
              points={
                trend.points.length >= 2
                  ? trend.points
                  : [
                      trend.points[0] ?? 0,
                      trend.points[0] ?? 0,
                    ]
              }
            />
          </div>
        ))}

      </div>
    </Panel>
  )
}
