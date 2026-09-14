import { useLiveClock } from '../../hooks/useLiveClock'

export default function Header() {
  const time = useLiveClock()

  return (
    <header className="flex items-center justify-between h-14 px-4 bg-slate-950 border-b border-slate-800 shrink-0">
      <div className="flex items-baseline gap-3">
        <h1 className="text-sm font-bold tracking-wide text-slate-100">
          NanoPredict
        </h1>

        <span className="hidden sm:inline text-[11px] text-slate-500 border-l border-slate-700 pl-3">
          Lithography Equipment Monitoring
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-900 border border-emerald-400/30 rounded-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>

          <span className="text-[10px] font-medium text-emerald-400">
            System Online
          </span>
        </div>

        <div className="hidden md:flex flex-col items-end leading-tight">
          <span className="text-[11px] font-mono text-slate-300">
            {time}
          </span>

          <span className="text-[10px] text-slate-500">
            Session EQ-04A
          </span>
        </div>

        <button
          type="button"
          className="p-1.5 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-sm hover:border-slate-700 transition-colors"
          aria-label="Settings"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />

            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" />
          </svg>
        </button>
      </div>
    </header>
  )
}
