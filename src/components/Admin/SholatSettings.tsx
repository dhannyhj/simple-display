'use client'

import { useApp } from '@/context/AppContext'
import type { WitirMode } from '@/types'

// Pilihan jumlah salam tarawih (harus genap, range 2-20)
const TARAWIH_OPTIONS = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

export function SholatSettings() {
  const { totalTarawihSalam, witirMode, setSholatSettings } = useApp()

  const handleTarawih = (val: number) => {
    // Reset currentRakaat ke 1 saat config berubah agar tidak out-of-range
    setSholatSettings({ totalTarawihSalam: val, currentRakaat: 1 })
  }

  const handleWitir = (mode: WitirMode) => {
    setSholatSettings({ witirMode: mode, currentRakaat: 1 })
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-white font-bold text-base">🕌 Pengaturan Sholat</h2>

      {/* ── Jumlah Salam Tarawih ── */}
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-3 font-semibold">
          Jumlah Salam Tarawih
        </p>
        <div className="grid grid-cols-5 gap-2">
          {TARAWIH_OPTIONS.map((val) => {
            const isActive = totalTarawihSalam === val
            return (
              <button
                key={val}
                onClick={() => handleTarawih(val)}
                className={`
                  rounded-xl py-3 text-sm font-bold border transition-all
                  ${isActive
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'}
                `}
              >
                {val}
              </button>
            )
          })}
        </div>
        <p className="text-slate-500 text-xs mt-2">
          {totalTarawihSalam} salam &times; 2 rakaat = {totalTarawihSalam * 2} rakaat tarawih
        </p>
      </div>

      {/* ── Mode Witir ── */}
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-3 font-semibold">
          Mode Witir
        </p>
        <div className="flex flex-col gap-2">
          {/* 2+1 */}
          <button
            onClick={() => handleWitir('2+1')}
            className={`
              flex items-start gap-3 p-4 rounded-xl border transition-all text-left
              ${witirMode === '2+1'
                ? 'bg-blue-600/20 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'}
            `}
          >
            <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 ${witirMode === '2+1' ? 'border-blue-400 bg-blue-400' : 'border-slate-500'}`} />
            <div>
              <p className="font-semibold text-sm">2 + 1 Rakaat (2 Salam)</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Salam 1: 2 rakaat witir &bull; Salam 2: 1 rakaat witir
              </p>
            </div>
          </button>

          {/* 3 rakaat 1 salam */}
          <button
            onClick={() => handleWitir('3')}
            className={`
              flex items-start gap-3 p-4 rounded-xl border transition-all text-left
              ${witirMode === '3'
                ? 'bg-blue-600/20 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'}
            `}
          >
            <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 ${witirMode === '3' ? 'border-blue-400 bg-blue-400' : 'border-slate-500'}`} />
            <div>
              <p className="font-semibold text-sm">3 Rakaat (1 Salam)</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Semua 3 rakaat witir langsung 1 salam
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
