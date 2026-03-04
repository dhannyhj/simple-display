'use client'

import { useRakaat } from '@/hooks/useRakaat'
import { useTheme } from '@/hooks/useTheme'
import { Clock } from '@/components/Display/Clock'
import { getBackgroundStyle } from '@/lib/backgrounds'
import { TOTAL_SALAM } from '@/lib/rakaat-constants'

export function RakaatDisplay() {
  const {
    currentRakaat,
    info,
    progressPercent,
  } = useRakaat()

  const { currentTheme, selectedBackground } = useTheme()

  // Inline bg style untuk gradient/pattern
  const bgStyle = getBackgroundStyle(
    selectedBackground,
    currentTheme.bg.replace('bg-', ''),
    currentTheme.bgSecondary.replace('bg-', '')
  )

  const isSelesai = info.isSelesai
  const isWitir = info.type === 'witir'

  return (
    <div
      className={`
        relative min-h-screen w-full flex flex-col items-center justify-center
        ${currentTheme.bg} ${currentTheme.text}
        overflow-hidden select-none transition-colors duration-700
      `}
      style={bgStyle}
    >
      {/* ── Dekorasi lingkaran latar ── */}
      <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10 ${currentTheme.accentBg} blur-3xl pointer-events-none`} />
      <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10 ${currentTheme.accentBg} blur-3xl pointer-events-none`} />

      {/* ── Konten Utama — key berubah → CSS animate-in terpicu, tidak perlu state ── */}
      <div
        key={currentRakaat}
        className="flex flex-col items-center justify-center text-center z-10 px-6 w-full animate-fade-in"
      >
        {/* Badge jenis sholat */}
        <div className={`text-sm md:text-xl font-semibold uppercase tracking-[0.3em] mb-6 ${currentTheme.textSecondary}`}>
          {isSelesai ? '🌙 Selesai' : isWitir ? '✨ Sholat Witir' : '🕌 Sholat Tarawih'}
        </div>

        {/* ── Teks Utama: Rakaat Range ── */}
        {!isSelesai && (
          <div
            className={`font-black leading-none drop-shadow-2xl ${currentTheme.accent} text-center`}
            style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
          >
            Rakaat {info.rakaatRange}
          </div>
        )}

        {isSelesai && (
          <div className={`font-black leading-none drop-shadow-2xl text-[18vw] ${currentTheme.accent}`}>✓</div>
        )}

        {/* Status sholat */}
        {!isSelesai && (
          <div className={`text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide mt-4 mb-8 ${currentTheme.textSecondary}`}>
            Sedang Berlangsung
          </div>
        )}

        {/* ── Progress Bar ── */}
        {!isSelesai && (
          <div className="w-full max-w-md px-4 mb-6">
            <div className={`flex justify-between text-xs mb-1 ${currentTheme.textSecondary} opacity-60`}>
              <span>Salam {currentRakaat}</span>
              <span>Total {TOTAL_SALAM} Salam</span>
            </div>
            <div className={`w-full h-3 rounded-full ${currentTheme.progressTrack} overflow-hidden`}>
              <div
                className={`h-3 rounded-full ${currentTheme.accentBg} transition-all duration-700`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Selesai message */}
        {isSelesai && (
          <div className={`text-xl md:text-2xl ${currentTheme.textSecondary} opacity-70 text-center mt-4`}>
            Alhamdulillah,<br />Semoga diterima Allah SWT 🤲
          </div>
        )}
      </div>

      {/* ── Jam pojok kanan bawah ── */}
      <Clock position="bottom-right" />
    </div>
  )
}
