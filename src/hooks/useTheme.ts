'use client'

import { useApp } from '@/context/AppContext'
import { themes, themeList, DEFAULT_THEME } from '@/lib/themes'
import { backgroundOptions, DEFAULT_BACKGROUND } from '@/lib/backgrounds'
import type { ThemeId } from '@/types'

/**
 * Custom hook untuk theme dan background management
 */
export function useTheme() {
  const { selectedTheme, setTheme, selectedBackground, setBackground } = useApp()

  // Fallback ke DEFAULT_THEME jika localStorage berisi value lama/tidak valid
  const currentTheme = themes[selectedTheme] ?? themes[DEFAULT_THEME]
  const currentBg = backgroundOptions.find((b) => b.id === selectedBackground)
    ?? backgroundOptions.find((b) => b.id === DEFAULT_BACKGROUND)
    ?? backgroundOptions[0]

  return {
    // Current
    selectedTheme,
    currentTheme,
    selectedBackground,
    currentBg,

    // Lists
    themeList,
    backgroundOptions,

    // Actions
    setTheme: (id: ThemeId) => setTheme(id),
    setBackground,
  }
}
