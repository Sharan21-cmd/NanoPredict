import Panel from '../layout/Panel'
import RiskScore from './RiskScore'
import { getStatusStyle } from '../../lib/status'
import { useTelemetryContext } from '../../telemetry/TelemetryContext'

function StatusRow({ label, value, status }) {
  const style = getStatusStyle(status)

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-800 last:border-b-0">
      <span className="text-[11px] text-slate-400">
        {label}
      </span>

      <span
        className={`flex items-center gap-1.5 text-[11px] font-medium ${style.text}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
        />

        {value}
      </span>
    </div>
  )
}

export default function HealthPanel() {
  const { telemetry } = useTelemetryContext()

  const overallHealth = telemetry.risk?.health ?? 100
  const riskScore = telemetry.risk?.riskScore ?? 0
  const riskStatus = telemetry.risk?.status ?? 'normal'

  const condition =
    riskStatus === 'critical'
      ? {
          label: 'Critical',
          status: 'critical',
        }
      : riskStatus === 'warning'
        ? {
            label: 'Warning',
            status: 'warning',
          }
        : {
            label: 'Nominal',
            status: 'normal',
          }

  const prediction =
    riskStatus === 'critical'
      ? {
          horizon: 'Next cycle',
          label: 'High Risk',
          status: 'critical',
        }
      : riskStatus === 'warning'
        ? {
            horizon: 'Next cycle',
            label: 'Monitor',
            status: 'warning',
          }
        : {
            horizon: 'Next cycle',
            label: 'Stable',
            status: 'normal',
          }

  return (
    <Panel
      title="Equipment Health"
      subtitle="Predictive assessment"
    >
      <div className="p-3">

        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-slate-400">
            Overall Health
          </span>

          <span className="text-sm font-mono font-semibold text-slate-100">
            {overallHealth.toFixed(1)}%
          </span>
        </div>

        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-emerald-400 rounded-full"
            style={{ width: `${overallHealth}%` }}
          />
        </div>

        <RiskScore
          score={riskScore}
          status={riskStatus}
        />

        <div className="mt-1">
          <StatusRow
            label="Current Condition"
            value={condition.label}
            status={condition.status}
          />

          <StatusRow
            label={`Prediction (${prediction.horizon})`}
            value={prediction.label}
            status={prediction.status}
          />
        </div>

      </div>
    </Panel>
  )
}
