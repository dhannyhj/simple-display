'use client'

import { useTheme } from '@/hooks/useTheme'
import type { ThemeId } from '@/types'

export function ThemeSelector() {
  const { selectedTheme, themeList, setTheme, selectedBackground, backgroundOptions, setBackground } = useTheme()

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">

      {/* ── Theme Section ── */}
      <div>
        <h3 className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-3">
          🎨 Pilih Tema
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {themeList.map((theme) => {
            const isActive = selectedTheme === theme.id
            return (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id as ThemeId)}
                className={`
                  flex items-center gap-2 px-3 py-3 rounded-xl
                  border text-left text-sm font-medium
                  transition-all duration-150
                  ${isActive
                    ? 'border-blue-500 bg-blue-900/30 text-white'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-white'
                  }
                `}
              >
                <span className="text-lg">{theme.emoji}</span>
                <span className="truncate">{theme.name}</span>
                {isActive && <span className="ml-auto text-blue-400">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Background Section ── */}
      <div>
        <h3 className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-3">
          🖼️ Pilih Background
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {backgroundOptions.map((bg) => {
            const isActive = selectedBackground === bg.id
            return (
              <button
                key={bg.id}
                onClick={() => setBackground(bg.id)}
                className={`
                  flex items-center gap-2 px-3 py-3 rounded-xl
                  border text-left text-sm font-medium
                  transition-all duration-150
                  ${isActive
                    ? 'border-purple-500 bg-purple-900/30 text-white'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-white'
                  }
                `}
              >
                <span className="text-lg">
                  {bg.type === 'solid' ? '⬛' : bg.type === 'gradient' ? '🌈' : '⊞'}
                </span>
                <span className="truncate">{bg.name}</span>
                {isActive && <span className="ml-auto text-purple-400">✓</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
