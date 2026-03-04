'use client'

import { useState, useEffect } from 'react'
import { useRakaat } from '@/hooks/useRakaat'
import { useTheme } from '@/hooks/useTheme'
import { useApp } from '@/context/AppContext'
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
  const { fontSettings } = useApp()

  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

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
            className={`leading-none drop-shadow-2xl ${currentTheme.accent} text-center`}
            style={{
              fontSize: `clamp(${2.5 * fontSettings.fontScale / 100}rem, ${8 * fontSettings.fontScale / 100}vw, ${7 * fontSettings.fontScale / 100}rem)`,
              fontFamily: fontSettings.fontFamily,
              fontWeight: fontSettings.fontBold ? 'bold' : 'normal',
              fontStyle: fontSettings.fontItalic ? 'italic' : 'normal',
              textDecoration: fontSettings.fontUnderline ? 'underline' : 'none',
            }}
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

      {/* ── Tombol Fullscreen pojok kanan atas ── */}
      <button
        onClick={toggleFullscreen}
        className={`absolute top-4 right-4 z-20 p-2 rounded-lg opacity-30 hover:opacity-90 transition-opacity
          ${currentTheme.textSecondary} bg-black/20 hover:bg-black/40`}
        title={isFullscreen ? 'Keluar Fullscreen' : 'Masuk Fullscreen'}
        aria-label={isFullscreen ? 'Keluar Fullscreen' : 'Masuk Fullscreen'}
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9L4 4m0 0h5m-5 0v5M15 9l5-5m0 0h-5m5 0v5M9 15l-5 5m0 0h5m-5 0v-5M15 15l5 5m0 0h-5m5 0v-5" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5M20 8V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5M20 16v4m0 0h-4m4 0l-5-5" />
          </svg>
        )}
      </button>
    </div>
  )
}
