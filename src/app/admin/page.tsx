'use client'

import { useEffect, useCallback } from 'react'
import { PasswordGate } from '@/components/Admin/PasswordGate'
import { Controls } from '@/components/Admin/Controls'
import { ThemeSelector } from '@/components/Admin/ThemeSelector'
import { FontSelector } from '@/components/Admin/FontSelector'
import { useRakaat } from '@/hooks/useRakaat'
import Link from 'next/link'

export default function AdminPage() {
  const { nextRakaat, prevRakaat, isLast, isFirst } = useRakaat()

  // Keyboard shortcut di admin juga
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        if (!isLast) nextRakaat()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (!isFirst) prevRakaat()
      }
    },
    [nextRakaat, prevRakaat, isLast, isFirst]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <PasswordGate>
      <div className="min-h-screen bg-slate-950 text-white">
        {/* ── Header ── */}
        <header className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-4 py-4">
          <div className="max-w-sm mx-auto flex items-center justify-between">
            <div>
              <h1 className="font-bold text-lg text-white">🕌 Admin Panel</h1>
              <p className="text-slate-500 text-xs">Kontrol Display Tarawih</p>
            </div>
            <Link
              href="/"
              target="_blank"
              className="
                flex items-center gap-1.5 text-xs text-slate-400
                bg-slate-800 hover:bg-slate-700 border border-slate-700
                px-3 py-2 rounded-lg transition-colors
              "
            >
              <span>📺</span> Lihat Display
            </Link>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="max-w-sm mx-auto px-4 py-6 space-y-8 pb-20">
          {/* Controls (Next, Prev, Reset, Logout) */}
          <Controls />

          {/* Divider */}
          <div className="border-t border-slate-800" />

          {/* Theme & Background Selector */}
          <ThemeSelector />

          {/* Divider */}
          <div className="border-t border-slate-800" />

          {/* Font Settings */}
          <FontSelector />
        </main>
      </div>
    </PasswordGate>
  )
}
