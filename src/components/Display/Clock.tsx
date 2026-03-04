'use client'

import { useClock } from '@/hooks/useClock'
import { useTheme } from '@/hooks/useTheme'

interface ClockProps {
  position?: 'bottom-left' | 'bottom-right'
}

export function Clock({ position = 'bottom-right' }: ClockProps) {
  const { time, date } = useClock()
  const { currentTheme } = useTheme()

  const posClass = position === 'bottom-left' ? 'left-6' : 'right-6'

  return (
    <div
      className={`absolute bottom-6 ${posClass} text-right ${currentTheme.textSecondary} select-none`}
    >
      <div className="text-5xl md:text-6xl font-mono font-semibold tracking-widest leading-none">
        {time}
      </div>
      <div className="text-base md:text-xl mt-2 opacity-70 tracking-wide">{date}</div>
    </div>
  )
}
