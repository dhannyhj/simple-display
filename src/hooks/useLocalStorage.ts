'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook untuk localStorage — SSR-safe.
 * Hanya digunakan untuk adminSessionToken (device-local).
 * Shared app state (rakaat, theme, bg) kini disimpan di server via /api/state.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const keyRef = useRef(key)

  // Baca dari localStorage saat hydration selesai (SSR-safe)
  useEffect(() => {
    try {
      const item = localStorage.getItem(keyRef.current)
      if (item !== null) setStoredValue(JSON.parse(item) as T)
    } catch {
      // ignore
    }
  }, [])

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const newValue =
            typeof value === 'function'
              ? (value as (prev: T) => T)(prev)
              : value
          localStorage.setItem(keyRef.current, JSON.stringify(newValue))
          return newValue
        })
      } catch {
        // ignore
      }
    },
    []
  )

  return [storedValue, setValue]
}
