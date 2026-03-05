'use client'

import { useApp } from '@/context/AppContext'
import {
  getRakaatInfo,
  getRakaatLabel,
  getRakaatSubLabel,
  getProgressPercent,
  getTarawihDots,
  getTotalSalam,
} from '@/lib/rakaat-constants'

export function useRakaat() {
  const { currentRakaat, nextRakaat, prevRakaat, resetRakaat, totalTarawihSalam, witirMode } = useApp()

  const totalSalam = getTotalSalam(totalTarawihSalam, witirMode)
  const info = getRakaatInfo(currentRakaat, totalTarawihSalam, witirMode)
  const label = getRakaatLabel(info)
  const subLabel = getRakaatSubLabel(info, totalTarawihSalam, witirMode)
  const progressPercent = getProgressPercent(currentRakaat, totalTarawihSalam, witirMode)
  const tarawihDots = getTarawihDots(currentRakaat, totalTarawihSalam)
  const isFirst = currentRakaat <= 1
  const isLast = currentRakaat >= totalSalam

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
    totalSalam,
  }
}
