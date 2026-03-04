'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react'
import type { SharedState, ThemeId } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { DEFAULT_THEME, themeList } from '@/lib/themes'
import { DEFAULT_BACKGROUND, backgroundOptions } from '@/lib/backgrounds'
import { TOTAL_SALAM } from '@/lib/rakaat-constants'
import {
  STORAGE_KEYS,
  initDefaultPassword,
  generateSessionToken,
  isSessionValid,
  verifyPassword,
} from '@/lib/password-utils'

// ===========================
// Default Shared State
// ===========================
const DEFAULT_STATE: SharedState = {
  currentRakaat: 1,
  selectedTheme: DEFAULT_THEME,
  selectedBackground: DEFAULT_BACKGROUND,
  lastUpdated: 0,
}

// Sanitasi state dari API — cegah nilai korup merusak UI
function sanitize(raw: SharedState): SharedState {
  const validThemeIds = themeList.map((t) => t.id as string)
  const validBgIds = backgroundOptions.map((b) => b.id)
  return {
    ...raw,
    currentRakaat: Number.isFinite(raw.currentRakaat)
      ? Math.max(1, Math.min(raw.currentRakaat, TOTAL_SALAM))
      : DEFAULT_STATE.currentRakaat,
    selectedTheme: validThemeIds.includes(raw.selectedTheme as string)
      ? raw.selectedTheme
      : DEFAULT_THEME,
    selectedBackground: validBgIds.includes(raw.selectedBackground)
      ? raw.selectedBackground
      : DEFAULT_BACKGROUND,
    lastUpdated: raw.lastUpdated ?? 0,
  }
}

// ===========================
// API helpers (client-side)
// ===========================
async function fetchState(): Promise<SharedState> {
  const res = await fetch('/api/state', { cache: 'no-store' })
  if (!res.ok) throw new Error('fetch /api/state failed')
  return res.json()
}

async function pushState(patch: Partial<SharedState>): Promise<SharedState> {
  const res = await fetch('/api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
  if (!res.ok) throw new Error('POST /api/state failed')
  return res.json()
}

// ===========================
// Context Types
// ===========================
interface AppContextType {
  currentRakaat: number
  nextRakaat: () => void
  prevRakaat: () => void
  resetRakaat: () => void
  selectedTheme: ThemeId
  setTheme: (themeId: ThemeId) => void
  selectedBackground: string
  setBackground: (bgId: string) => void
  isAdminLoggedIn: boolean
  adminLogin: (password: string) => Promise<boolean>
  adminLogout: () => void
}

// ===========================
// Context Instance
// ===========================
const AppContext = createContext<AppContextType | null>(null)

// ===========================
// Provider
// ===========================
export function AppProvider({ children }: { children: ReactNode }) {
  const [sharedState, setSharedState] = useState<SharedState>(DEFAULT_STATE)
  const lastUpdatedRef = useRef<number>(0)

  // Admin session — tetap di localStorage (device-local, tidak sync ke server)
  const [sessionToken, setSessionToken] = useLocalStorage<string | null>(
    STORAGE_KEYS.SESSION_TOKEN,
    null
  )

  // Inisialisasi default password
  useEffect(() => {
    initDefaultPassword()
  }, [])

  // ── Initial fetch + polling 3 detik ──────────────────────────────────
  useEffect(() => {
    let active = true

    const sync = async () => {
      try {
        const fresh = await fetchState()
        if (!active) return
        if (fresh.lastUpdated !== lastUpdatedRef.current) {
          lastUpdatedRef.current = fresh.lastUpdated
          setSharedState(sanitize(fresh))
        }
      } catch {
        // Abaikan error jaringan, coba lagi 3 detik berikutnya
      }
    }

    sync()
    const interval = setInterval(sync, 3000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  // ── Update ke server — tidak pakai optimistic agar tidak double-setState ─
  const update = useCallback(async (patch: Partial<SharedState>) => {
    try {
      const confirmed = await pushState(patch)
      lastUpdatedRef.current = confirmed.lastUpdated
      setSharedState(sanitize(confirmed))
    } catch {
      // Polling berikutnya akan sync semua device
    }
  }, [])

  // ── Rakaat Actions ────────────────────────────────────────────────────
  const nextRakaat = useCallback(() => {
    const next = Math.min(sharedState.currentRakaat + 1, TOTAL_SALAM)
    update({ currentRakaat: next })
  }, [sharedState.currentRakaat, update])

  const prevRakaat = useCallback(() => {
    const next = Math.max(sharedState.currentRakaat - 1, 1)
    update({ currentRakaat: next })
  }, [sharedState.currentRakaat, update])

  const resetRakaat = useCallback(() => {
    update({ currentRakaat: 1 })
  }, [update])

  // ── Theme & Background ────────────────────────────────────────────────
  const setTheme = useCallback((themeId: ThemeId) => {
    update({ selectedTheme: themeId })
  }, [update])

  const setBackground = useCallback((bgId: string) => {
    update({ selectedBackground: bgId })
  }, [update])

  // ── Admin Auth ────────────────────────────────────────────────────────
  const isAdminLoggedIn = isSessionValid(sessionToken)

  const adminLogin = useCallback(async (password: string): Promise<boolean> => {
    const storedHash = localStorage.getItem(STORAGE_KEYS.PASSWORD_HASH)
    if (!storedHash) return false
    const valid = await verifyPassword(password, storedHash)
    if (valid) setSessionToken(generateSessionToken())
    return valid
  }, [setSessionToken])

  const adminLogout = useCallback(() => {
    setSessionToken(null)
  }, [setSessionToken])

  // ── Context Value ──────────────────────────────────────────────────────
  const value: AppContextType = {
    currentRakaat: sharedState.currentRakaat,
    nextRakaat,
    prevRakaat,
    resetRakaat,
    selectedTheme: sharedState.selectedTheme,
    setTheme,
    selectedBackground: sharedState.selectedBackground,
    setBackground,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// ===========================
// Custom Hook
// ===========================
export function useApp(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp harus digunakan di dalam AppProvider')
  return ctx
}
