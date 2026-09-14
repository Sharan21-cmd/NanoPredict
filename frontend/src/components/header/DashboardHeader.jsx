import { useLiveClock } from '../../hooks/useLiveClock'

export default function DashboardHeader() {
  const time = useLiveClock()

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950">

      {/* Brand */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-bold tracking-wide text-slate-100">
            NanoPredict
          </h1>

          <p className="text-[9px] text-slate-500 tracking-wide">
            Predictive Monitoring for Semiconductor Equipment
          </p>
        </div>

        <div className="hidden md:block h-7 w-px bg-slate-800" />

        <div className="hidden md:block">
          <p className="text-[11px] font-medium text-slate-300">
            Lithography Equipment Digital Twin
          </p>

          <p className="text-[9px] text-slate-600">
            Prototype EQ-04A
          </p>
        </div>
      </div>

      {/* Status + Time */}
      <div className="flex items-center gap-5">

        <div className="flex items-center gap-2 px-3 py-1.5 border border-emerald-400/25 bg-emerald-400/5 rounded-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>

          <span className="text-[10px] font-medium text-emerald-400">
            SYSTEM ONLINE
          </span>
        </div>

        <div className="text-right hidden sm:block">
          <p className="font-mono text-[11px] text-slate-300">
            {time}
          </p>

          <p className="text-[9px] text-slate-600">
            LOCAL TIME
          </p>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="w-8 h-8 flex items-center justify-center border border-slate-800 rounded-sm text-slate-400 hover:text-slate-200 hover:border-slate-700"
        >
          <span className="text-sm">♧</span>
        </button>

        <button
          type="button"
          aria-label="User"
          className="w-8 h-8 flex items-center justify-center border border-slate-800 rounded-sm text-slate-400 hover:text-slate-200 hover:border-slate-700"
        >
          <span className="text-sm">○</span>
        </button>

      </div>
    </header>
  )
}
