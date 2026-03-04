'use client'

import { useState, useEffect } from 'react'

interface ClockData {
  time: string   // HH:MM:SS
  date: string   // Senin, 4 Maret 2026
  hours: number
  minutes: number
  seconds: number
}

/**
 * Custom hook real-time clock - update setiap 1 detik
 */
export function useClock(): ClockData {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!now) {
    return {
      time: '--:--:--',
      date: '',
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  const padded = (n: number) => String(n).padStart(2, '0')
  const time = `${padded(hours)}:${padded(minutes)}:${padded(seconds)}`

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ]

  const dayName = dayNames[now.getDay()]
  const date = `${dayName}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`

  return { time, date, hours, minutes, seconds }
}
