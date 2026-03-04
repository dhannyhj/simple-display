'use client'

import { useEffect, useCallback } from 'react'
import { RakaatDisplay } from '@/components/Display/RakaatDisplay'
import { useRakaat } from '@/hooks/useRakaat'

// Display page - public view untuk TV/Android Box
export default function DisplayPage() {
  const { nextRakaat, prevRakaat, isLast, isFirst } = useRakaat()

  // Keyboard shortcut: → / Space = next, ← = prev
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
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

  return <RakaatDisplay />
}
