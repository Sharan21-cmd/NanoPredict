import { useState } from 'react'
import useAIAssistant from './useAIAssistant'

const QUICK_QUESTIONS = [
  'What is the current risk?',
  'What happened to the machine?',
  'Why is vibration high?',
  'What is the prediction?',
]

export default function AIAssistant() {
  const [question, setQuestion] = useState('')

  const {
    ask,
    loading,
    error,
    response,
  } = useAIAssistant()

  async function handleSubmit(event) {
    event.preventDefault()

    const value = question.trim()

    if (!value || loading) {
      return
    }

    await ask(value)
    setQuestion('')
  }

  async function handleQuickQuestion(value) {
    if (loading) {
      return
    }

    setQuestion(value)
    await ask(value)
    setQuestion('')
  }

  return (
    <section className="flex h-full min-h-0 flex-col rounded-xl border border-slate-800 bg-slate-900/80 shadow-xl">

      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-white">
            NanoPredict AI Assistant
          </h2>

          <p className="mt-0.5 text-[10px] text-slate-500">
            Grounded in live machine telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-emerald-400">
            Ready
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">

        {!response && !error && (
          <div className="flex h-full flex-col justify-center">

            <div className="mb-5 text-center">
              <div className="mb-2 text-2xl">
                ◈
              </div>

              <p className="text-sm text-slate-300">
                Ask about the current machine state,
                risk, prediction, or anomalies.
              </p>
            </div>

            <div className="grid gap-2">
              {QUICK_QUESTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickQuestion(item)}
                  className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-left text-[11px] text-slate-300 transition hover:border-cyan-700 hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {item}
                </button>
              ))}
            </div>

          </div>
        )}

        {loading && (
          <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

            <span className="text-xs text-slate-400">
              Analyzing current machine state...
            </span>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-900/60 bg-red-950/30 p-3">
            <p className="text-[10px] uppercase tracking-wider text-red-400">
              Assistant Error
            </p>

            <p className="mt-1 text-xs text-red-300">
              {error}
            </p>
          </div>
        )}

        {response && !loading && (
          <div className="space-y-4">

            <div>
              <p className="text-[10px] uppercase tracking-wider text-cyan-400">
                Answer
              </p>

              <p className="mt-1 text-sm leading-relaxed text-slate-200">
                {response.answer}
              </p>
            </div>

            {response.observations?.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Observations
                </p>

                <ul className="mt-2 space-y-1">
                  {response.observations.map((item, index) => (
                    <li
                      key={index}
                      className="text-xs leading-relaxed text-slate-300"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {response.causes?.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Possible Causes
                </p>

                <ul className="mt-2 space-y-1">
                  {response.causes.map((item, index) => (
                    <li
                      key={index}
                      className="text-xs leading-relaxed text-slate-300"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {response.actions?.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Recommended Actions
                </p>

                <ul className="mt-2 space-y-1">
                  {response.actions.map((item, index) => (
                    <li
                      key={index}
                      className="text-xs leading-relaxed text-slate-300"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-slate-800 pt-3">
              <p className="text-[9px] text-slate-600">
                Intent: {response.intent}
              </p>
            </div>

          </div>
        )}

      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-800 p-3"
      >
        <div className="flex gap-2">

          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask NanoPredict..."
            disabled={loading}
            maxLength={1000}
            className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-600 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? '...' : 'Ask'}
          </button>

        </div>
      </form>

    </section>
  )
}
