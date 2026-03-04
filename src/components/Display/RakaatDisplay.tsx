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
    label,
    subLabel,
    progressPercent,
    tarawihDots,
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
        <div className={`text-sm md:text-xl font-semibold uppercase tracking-[0.3em] mb-4 ${currentTheme.textSecondary}`}>
          {isSelesai ? '🌙 Selesai' : isWitir ? '✨ Sholat Witir' : '🕌 Sholat Tarawih'}
        </div>

        {/* ── Nomor SALAM — angka besar ── */}
        {!isSelesai && (
          <div className={`font-black leading-none drop-shadow-2xl ${currentTheme.accent}`}
            style={{ fontSize: 'clamp(6rem, 28vw, 22rem)' }}>
            {isWitir ? info.salamNumber : info.salamNumber}
          </div>
        )}

        {isSelesai && (
          <div className={`font-black leading-none drop-shadow-2xl text-[18vw] ${currentTheme.accent}`}>✓</div>
        )}

        {/* Label salam / witir */}
        <div className={`text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide mt-2 mb-2 ${currentTheme.text}`}>
          {label}
        </div>

        {/* Range rakaat aktual */}
        {!isSelesai && (
          <div className={`text-lg md:text-2xl lg:text-3xl font-semibold ${currentTheme.textSecondary} mb-2`}>
            Rakaat {info.rakaatRange}
          </div>
        )}

        {/* Sub-label keterangan */}
        <div className={`text-sm md:text-lg opacity-60 ${currentTheme.textSecondary} mb-10`}>
          {subLabel}
        </div>

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

        {/* ── Tarawih Dots (10 salam) ── */}
        {!isWitir && !isSelesai && (
          <div className="flex gap-2 mt-1">
            {tarawihDots.map((dot, i) => (
              <div
                key={i}
                title={`Salam ke-${i + 1}`}
                className={`
                  rounded-full transition-all duration-500
                  ${dot.current
                    ? `w-5 h-5 md:w-6 md:h-6 ${currentTheme.accentBg} ring-2 ring-offset-2 ring-offset-transparent ring-white/30 scale-125`
                    : dot.done
                      ? `w-3 h-3 md:w-4 md:h-4 ${currentTheme.accentBg} opacity-70`
                      : `w-3 h-3 md:w-4 md:h-4 ${currentTheme.progressTrack} opacity-30`
                  }
                `}
              />
            ))}
          </div>
        )}

        {/* Witir indicator */}
        {isWitir && !isSelesai && (
          <div className="flex gap-3 mt-2">
            {[1, 2].map((n) => (
              <div
                key={n}
                className={`
                  w-6 h-6 rounded-full transition-all duration-500
                  ${info.salamNumber > n
                    ? `${currentTheme.accentBg} opacity-80`
                    : info.salamNumber === n
                      ? `${currentTheme.accentBg} ring-2 ring-white/30 scale-125`
                      : `${currentTheme.progressTrack} opacity-25`
                  }
                `}
              />
            ))}
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
