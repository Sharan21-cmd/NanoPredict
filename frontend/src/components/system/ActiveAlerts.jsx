import Panel from '../layout/Panel'
import { useTelemetry } from '../../telemetry/useTelemetry'

const ALERT_STYLES = {
  warning: {
    dot: 'bg-amber-400',
    icon: '!',
    iconStyle:
      'bg-amber-400/10 text-amber-400 border-amber-400/20',
    title: 'text-amber-300',
  },

  critical: {
    dot: 'bg-rose-500',
    icon: '!!',
    iconStyle:
      'bg-rose-500/10 text-rose-400 border-rose-400/20',
    title: 'text-rose-300',
  },

  info: {
    dot: 'bg-sky-400',
    icon: 'i',
    iconStyle:
      'bg-sky-400/10 text-sky-400 border-sky-400/20',
    title: 'text-sky-300',
  },
}

export default function ActiveAlerts() {
  const { telemetry } = useTelemetry()

  const alerts = telemetry.alerts ?? []

  return (
    <Panel
      title="Active Alerts"
      subtitle={`${alerts.length} open`}
    >
      <div className="divide-y divide-slate-800">
        {alerts.map((alert) => {
          const style =
            ALERT_STYLES[alert.type] ??
            ALERT_STYLES.info

          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 px-3 py-3"
            >
              {/* Alert icon */}
              <div
                className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-md border text-sm font-bold ${style.iconStyle}`}
              >
                {style.icon}
              </div>

              {/* Alert information */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-[11px] font-medium ${style.title}`}
                  >
                    {alert.title}
                  </p>

                  <span
                    className={`mt-1 w-1.5 h-1.5 shrink-0 rounded-full ${style.dot}`}
                  />
                </div>

                <p className="mt-1 text-[10px] text-slate-500 leading-relaxed">
                  {alert.detail}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-mono text-slate-600">
                    {alert.sensor}
                  </span>

                  <span className="text-slate-700">
                    |
                  </span>

                  <span className="text-[9px] font-mono text-slate-600">
                    {alert.timestamp}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {alerts.length === 0 && (
          <div className="px-3 py-6 text-center">
            <div className="flex justify-center mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            <p className="text-[10px] text-emerald-400">
              ALL SYSTEMS NOMINAL
            </p>

            <p className="text-[9px] text-slate-600 mt-1">
              No active equipment alerts
            </p>
          </div>
        )}
      </div>
    </Panel>
  )
}
