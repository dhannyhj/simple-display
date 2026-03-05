'use client'

import { useState } from 'react'
import { changePassword } from '@/lib/password-utils'

export function ChangePasswordForm() {
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'wrong-old' | 'mismatch' | 'too-short' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPw.length < 4) { setStatus('too-short'); return }
    if (newPw !== confirmPw) { setStatus('mismatch'); return }
    setStatus('loading')
    const result = await changePassword(oldPw, newPw)
    setStatus(result)
    if (result === 'ok') {
      setOldPw('')
      setNewPw('')
      setConfirmPw('')
    }
  }

  const msgMap: Record<string, { text: string; cls: string }> = {
    ok:         { text: '✅ Password berhasil diganti!', cls: 'text-green-400' },
    'wrong-old':{ text: '❌ Password lama salah.', cls: 'text-red-400' },
    mismatch:   { text: '❌ Password baru tidak cocok.', cls: 'text-red-400' },
    'too-short':{ text: '❌ Password minimal 4 karakter.', cls: 'text-red-400' },
    error:      { text: '❌ Terjadi kesalahan.', cls: 'text-red-400' },
  }

  const msg = msgMap[status]

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-white font-bold text-base">🔑 Ganti Password</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Password Lama */}
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Password Lama</label>
          <input
            type="password"
            value={oldPw}
            onChange={(e) => { setOldPw(e.target.value); setStatus('idle') }}
            placeholder="Password sekarang"
            className="
              w-full bg-slate-800 border border-slate-700 rounded-xl
              text-white placeholder-slate-500 text-sm
              px-4 py-3 outline-none focus:border-slate-500
              transition-colors
            "
          />
        </div>

        {/* Password Baru */}
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Password Baru</label>
          <input
            type="password"
            value={newPw}
            onChange={(e) => { setNewPw(e.target.value); setStatus('idle') }}
            placeholder="Minimal 4 karakter"
            className="
              w-full bg-slate-800 border border-slate-700 rounded-xl
              text-white placeholder-slate-500 text-sm
              px-4 py-3 outline-none focus:border-slate-500
              transition-colors
            "
          />
        </div>

        {/* Konfirmasi */}
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Konfirmasi Password Baru</label>
          <input
            type="password"
            value={confirmPw}
            onChange={(e) => { setConfirmPw(e.target.value); setStatus('idle') }}
            placeholder="Ulangi password baru"
            className="
              w-full bg-slate-800 border border-slate-700 rounded-xl
              text-white placeholder-slate-500 text-sm
              px-4 py-3 outline-none focus:border-slate-500
              transition-colors
            "
          />
        </div>

        {/* Pesan status */}
        {msg && (
          <p className={`text-xs ${msg.cls}`}>{msg.text}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || !oldPw || !newPw || !confirmPw}
          className="
            w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700
            disabled:text-slate-500 text-white font-semibold
            rounded-xl py-3 text-sm
            transition-colors disabled:cursor-not-allowed
          "
        >
          {status === 'loading' ? 'Menyimpan...' : 'Simpan Password'}
        </button>
      </form>
    </div>
  )
}
