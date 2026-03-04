'use client'

import { useState, FormEvent } from 'react'
import { useApp } from '@/context/AppContext'

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn, adminLogin } = useApp()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setError('')

    const ok = await adminLogin(password)

    if (!ok) {
      setError('Password salah. Coba lagi.')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
    setLoading(false)
    setPassword('')
  }

  if (isAdminLoggedIn) return <>{children}</>

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div
        className={`
          bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl
          ${shake ? 'animate-pulse' : ''}
        `}
      >
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
          <p className="text-slate-400 text-sm mt-1">Masukkan password untuk lanjut</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password admin"
              className={`
                w-full bg-slate-800 text-white rounded-xl px-4 py-3
                border ${error ? 'border-red-500' : 'border-slate-700'}
                focus:outline-none focus:border-blue-500
                placeholder-slate-500 text-lg
                transition-colors
              `}
              autoFocus
              disabled={loading}
            />
            {error && (
              <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="
              w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700
              text-white font-semibold py-3 rounded-xl
              transition-colors duration-200 text-lg
              disabled:text-slate-400 disabled:cursor-not-allowed
            "
          >
            {loading ? '⏳ Memeriksa...' : '🔓 Masuk'}
          </button>
        </form>

        <p className="text-slate-600 text-xs text-center mt-6">
          Password default: <span className="font-mono text-slate-500">admin123</span>
        </p>
      </div>
    </div>
  )
}
