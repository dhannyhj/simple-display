'use client'

import { useApp } from '@/context/AppContext'
import {
  getRakaatInfo,
  getRakaatLabel,
  getRakaatSubLabel,
  getProgressPercent,
  getTarawihDots,
  TOTAL_SALAM,
} from '@/lib/rakaat-constants'

export function useRakaat() {
  const { currentRakaat, nextRakaat, prevRakaat, resetRakaat } = useApp()

  const info = getRakaatInfo(currentRakaat)
  const label = getRakaatLabel(info)
  const subLabel = getRakaatSubLabel(info)
  const progressPercent = getProgressPercent(currentRakaat)
  const tarawihDots = getTarawihDots(currentRakaat)
  const isFirst = currentRakaat <= 1
  const isLast = currentRakaat >= TOTAL_SALAM

  return {
    currentRakaat,
    info,
    label,
    subLabel,
    progressPercent,
    tarawihDots,
    isFirst,
    isLast,
    nextRakaat,
    prevRakaat,
    resetRakaat,
    totalSalam: TOTAL_SALAM,
  }
}
