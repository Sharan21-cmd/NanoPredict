import { useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed')
      }

      localStorage.setItem('nanopredict_token', data.access_token)

      onLogin()
    } catch (error) {
      console.error('[NanoPredict] Login error:', error)
      setError(error.message || 'Unable to connect to backend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-200 flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">

          <div className="mb-8 text-center">
            <div className="text-3xl font-bold tracking-wide text-white">
              NanoPredict
            </div>

            <div className="mt-2 text-sm text-slate-400">
              Sub-Nanometer Drift & Vacuum Anomaly Prediction System
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Authorized access only
          </div>

        </div>
      </div>
    </div>
  )
}
