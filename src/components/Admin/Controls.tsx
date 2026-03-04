'use client'

import { useState } from 'react'
import { useRakaat } from '@/hooks/useRakaat'
import { useApp } from '@/context/AppContext'
import { TOTAL_SALAM } from '@/lib/rakaat-constants'

export function Controls() {
  const { currentRakaat, info, label, subLabel, progressPercent, isFirst, isLast, nextRakaat, prevRakaat, resetRakaat } = useRakaat()
  const { adminLogout } = useApp()
  const [confirmReset, setConfirmReset] = useState(false)
  const [pressed, setPressed] = useState(false)

  const handleNext = () => {
    if (isLast) return
    setPressed(true)
    nextRakaat()
    setTimeout(() => setPressed(false), 150)
  }

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 3000)
      return
    }
    resetRakaat()
    setConfirmReset(false)
  }

  const isSelesai = info.isSelesai

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">

      {/* ── Status Card ── */}
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
        <div className="text-slate-400 text-xs uppercase tracking-widest mb-2 font-semibold">
          Status Sekarang
        </div>
        <div className="text-white text-3xl font-black mb-1">
          {isSelesai ? '✅ Selesai' : label}
        </div>
        <div className="text-slate-400 text-sm mb-1">{subLabel}</div>
        {!isSelesai && (
          <div className="text-slate-500 text-xs">
            Rakaat: {info.rakaatRange} &nbsp;•&nbsp; Salam {currentRakaat} dari {TOTAL_SALAM}
          </div>
        )}

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Salam {currentRakaat} dari {TOTAL_SALAM}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Navigation Buttons ── */}
      <div className="flex gap-3">
        {/* Prev */}
        <button
          onClick={prevRakaat}
          disabled={isFirst}
          className="
            flex-1 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900
            border border-slate-700 disabled:border-slate-800
            text-white disabled:text-slate-600
            rounded-2xl py-4 text-lg font-bold
            transition-all duration-150
            disabled:cursor-not-allowed
          "
        >
          ← Prev
        </button>

        {/* Next - tombol utama */}
        <button
          onClick={handleNext}
          disabled={isLast}
          className={`
            flex-[2] text-white font-black text-2xl rounded-2xl py-4
            transition-all duration-150 shadow-lg
            ${isLast
              ? 'bg-slate-800 border border-slate-700 text-slate-600 cursor-not-allowed'
              : pressed
                ? 'bg-blue-400 scale-95'
                : 'bg-blue-600 hover:bg-blue-500 active:scale-95'
            }
          `}
          style={{ touchAction: 'manipulation' }}
        >
          {isLast ? '🏁 Selesai' : '▶ NEXT'}
        </button>
      </div>

      {/* ── Reset & Logout ── */}
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          className={`
            flex-1 py-3 rounded-2xl font-semibold text-sm border
            transition-all duration-150
            ${confirmReset
              ? 'bg-red-600 border-red-500 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-700'
            }
          `}
        >
          {confirmReset ? '⚠️ Konfirmasi Reset?' : '🔄 Reset'}
        </button>

        <button
          onClick={adminLogout}
          className="
            flex-1 bg-slate-800 hover:bg-slate-700
            border border-slate-700 text-slate-400 hover:text-orange-400 hover:border-orange-700
            py-3 rounded-2xl font-semibold text-sm
            transition-all duration-150
          "
        >
          🚪 Logout
        </button>
      </div>

      <p className="text-slate-600 text-xs text-center">
        Tekan <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-400 font-mono">Space</kbd> atau{' '}
        <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-400 font-mono">→</kbd> untuk Next
      </p>
    </div>
  )
}
