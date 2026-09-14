export default function Panel({
  title,
  subtitle,
  actions,
  className = '',
  children,
}) {
  return (
    <section
      className={`w-full min-w-0 min-h-0 h-full flex flex-col bg-slate-900/60 border border-slate-800 rounded-sm ${className}`}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between px-3 py-2 border-b border-slate-800 shrink-0">
          <div className="min-w-0">
            {title && (
              <h2 className="text-[11px] font-semibold text-slate-300 truncate">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="text-[10px] text-slate-500 truncate">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="shrink-0 flex items-center gap-2 ml-3">
              {actions}
            </div>
          )}
        </header>
      )}

      <div className="flex-1 min-w-0 min-h-0">
        {children}
      </div>
    </section>
  )
}
