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
      {/* clamp() agar proporsional di semua viewport — menghindari text terlalu besar di Android 5 */}
      <div
        className="font-mono font-semibold tracking-wider leading-none"
        style={{ fontSize: 'clamp(1.25rem, 3.5vw, 2.5rem)' }}
      >
        {time}
      </div>
      <div
        className="mt-2 opacity-70 tracking-wide"
        style={{ fontSize: 'clamp(0.7rem, 1.2vw, 1rem)' }}
      >
        {date}
      </div>
    </div>
  )
}
