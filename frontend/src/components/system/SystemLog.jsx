import Panel from '../layout/Panel'

const LOGS = [
  {
    time: '16:24',
    message: 'Sensor data stream stable',
    type: 'success',
  },
  {
    time: '16:20',
    message: 'Model prediction updated',
    type: 'info',
  },
  {
    time: '16:15',
    message: 'Vacuum pressure normalized',
    type: 'success',
  },
  {
    time: '16:10',
    message: 'Minor vibration increase detected',
    type: 'warning',
  },
  {
    time: '16:05',
    message: 'Dashboard connected',
    type: 'success',
  },
  {
    time: '15:58',
    message: 'System initialized',
    type: 'success',
  },
]

const DOT_STYLES = {
  success: 'bg-emerald-400',
  info: 'bg-sky-400',
  warning: 'bg-amber-400',
  critical: 'bg-rose-500',
}

export default function SystemLog() {
  return (
    <Panel
      title="System Log"
      subtitle="Recent equipment events"
      className="h-full min-h-0"
    >
      <div className="h-full min-h-0 overflow-y-auto px-3 py-1">
        <div className="min-h-0">
          {LOGS.map((log, index) => (
            <div
              key={`${log.time}-${index}`}
              className="min-w-0 flex items-center gap-3 py-2.5 border-b border-slate-800 last:border-b-0"
            >
              <span
                className={`w-2 h-2 shrink-0 rounded-full ${DOT_STYLES[log.type]}`}
              />

              <span className="w-10 shrink-0 text-[9px] font-mono text-slate-600">
                {log.time}
              </span>

              <span className="min-w-0 truncate text-[10px] text-slate-400 leading-relaxed">
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}
