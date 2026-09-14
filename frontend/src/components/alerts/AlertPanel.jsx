import Panel from '../layout/Panel'
import { getStatusStyle } from '../../lib/status'
import { useTelemetryContext } from '../../telemetry/TelemetryContext'

export default function AlertPanel() {
  const { telemetry } = useTelemetryContext()
  const alerts = telemetry.alerts ?? []

  return (
    <Panel
      title="Active Alerts"
      subtitle={`${alerts.length} open`}
      className="flex-1"
    >
      <ul className="divide-y divide-slate-800">

        {alerts.map((alert) => {
          const style = getStatusStyle(alert.status)

          return (
            <li
              key={alert.id}
              className="flex items-start gap-2 px-3 py-2"
            >
              <span
                className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`}
              />

              <div className="min-w-0">
                <p className="text-[11px] text-slate-300 leading-snug">
                  {alert.message}
                </p>

                <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                  {alert.timestamp}
                </p>
              </div>
            </li>
          )
        })}

        {alerts.length === 0 && (
          <li className="px-3 py-4 text-[11px] text-slate-500 text-center">
            No active alerts
          </li>
        )}

      </ul>
    </Panel>
  )
}
