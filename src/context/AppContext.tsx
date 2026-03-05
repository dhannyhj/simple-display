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
import type { SharedState, ThemeId, WitirMode } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { DEFAULT_THEME, themeList } from '@/lib/themes'
import { DEFAULT_BACKGROUND, backgroundOptions } from '@/lib/backgrounds'
import { getTotalSalam, DEFAULT_TARAWIH_SALAM, DEFAULT_WITIR_MODE } from '@/lib/rakaat-constants'
import {
  STORAGE_KEYS,
  initDefaultPassword,
  getStoredHash,
  generateSessionToken,
  isSessionValid,
  verifyPassword,
} from '@/lib/password-utils'
import { fetchWithRetry } from '@/lib/api-client'
import { getPollingInterval } from '@/lib/feature-detect'
import { RAKAAT_CACHE_KEY } from '@/components/Display/LoadingFallback'

// ===========================
// Default Shared State
// ===========================
const DEFAULT_STATE: SharedState = {
  currentRakaat: 1,
  selectedTheme: DEFAULT_THEME,
  selectedBackground: DEFAULT_BACKGROUND,
  fontFamily: 'system-ui, sans-serif',
  fontScale: 100,
  fontBold: true,
  fontItalic: false,
  fontUnderline: false,
  totalTarawihSalam: DEFAULT_TARAWIH_SALAM,
  witirMode: DEFAULT_WITIR_MODE,
  lastUpdated: 0,
}

// Sanitasi state dari API — cegah nilai korup merusak UI
function sanitize(raw: SharedState): SharedState {
  const validThemeIds = themeList.map((t) => t.id as string)
  const validBgIds = backgroundOptions.map((b) => b.id)
  const rawTarawih = Number.isFinite(raw.totalTarawihSalam) && raw.totalTarawihSalam >= 2
    ? raw.totalTarawihSalam
    : DEFAULT_TARAWIH_SALAM
  const rawWitirMode = raw.witirMode === '2+1' || raw.witirMode === '3'
    ? raw.witirMode
    : DEFAULT_WITIR_MODE
  const totalSalam = getTotalSalam(rawTarawih, rawWitirMode)
  return {
    ...raw,
    currentRakaat: Number.isFinite(raw.currentRakaat)
      ? Math.max(1, Math.min(raw.currentRakaat, totalSalam))
      : DEFAULT_STATE.currentRakaat,
    selectedTheme: validThemeIds.includes(raw.selectedTheme as string)
      ? raw.selectedTheme
      : DEFAULT_THEME,
    selectedBackground: validBgIds.includes(raw.selectedBackground) ||
      raw.selectedBackground.startsWith('/') ||
      raw.selectedBackground.startsWith('http://') ||
      raw.selectedBackground.startsWith('https://') ||
      raw.selectedBackground.startsWith('data:')
        ? raw.selectedBackground
        : DEFAULT_BACKGROUND,
    fontFamily: typeof raw.fontFamily === 'string' && raw.fontFamily
      ? raw.fontFamily
      : DEFAULT_STATE.fontFamily,
    fontScale: Number.isFinite(raw.fontScale) && raw.fontScale >= 50 && raw.fontScale <= 200
      ? raw.fontScale
      : DEFAULT_STATE.fontScale,
    fontBold: typeof raw.fontBold === 'boolean' ? raw.fontBold : DEFAULT_STATE.fontBold,
    fontItalic: typeof raw.fontItalic === 'boolean' ? raw.fontItalic : DEFAULT_STATE.fontItalic,
    fontUnderline: typeof raw.fontUnderline === 'boolean' ? raw.fontUnderline : DEFAULT_STATE.fontUnderline,
    totalTarawihSalam: Number.isFinite(raw.totalTarawihSalam) && raw.totalTarawihSalam >= 2 && raw.totalTarawihSalam <= 20 && raw.totalTarawihSalam % 2 === 0
      ? raw.totalTarawihSalam
      : DEFAULT_STATE.totalTarawihSalam,
    witirMode: raw.witirMode === '2+1' || raw.witirMode === '3' ? raw.witirMode : DEFAULT_STATE.witirMode,
    lastUpdated: raw.lastUpdated ?? 0,
  }
}

// ===========================
// API helpers (client-side)
// ===========================
async function fetchState(): Promise<SharedState> {
  return fetchWithRetry<SharedState>('/api/state', {
    retries: 3,
    timeout: 5000,
    init: { cache: 'no-store' },
  })
}

async function pushState(patch: Partial<SharedState>): Promise<SharedState> {
  return fetchWithRetry<SharedState>('/api/state', {
    retries: 2,
    timeout: 5000,
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    },
  })
}

// Simpan rakaat ke localStorage sebagai fallback offline
function cacheRakaatLocally(count: number) {
  try {
    localStorage.setItem(
      RAKAAT_CACHE_KEY,
      JSON.stringify({ count, timestamp: Date.now() })
    )
  } catch {
    // localStorage bisa gagal di some TV Box, abaikan
  }
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
  fontSettings: { fontFamily: string; fontScale: number; fontBold: boolean; fontItalic: boolean; fontUnderline: boolean }
  setFontSettings: (patch: Partial<SharedState>) => void
  totalTarawihSalam: number
  witirMode: WitirMode
  setSholatSettings: (patch: Partial<SharedState>) => void
  isAdminLoggedIn: boolean
  adminLogin: (password: string) => Promise<boolean>
  adminLogout: () => void
  isInitialLoading: boolean
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
  const [isInitialLoading, setIsInitialLoading] = useState(true)
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

  // ── Initial fetch + adaptive polling (3s normal / 5s TV Box) ───────────
  useEffect(() => {
    let active = true

    const sync = async () => {
      try {
        const fresh = await fetchState()
        if (!active) return
        setIsInitialLoading(false)
        if (fresh.lastUpdated !== lastUpdatedRef.current) {
          lastUpdatedRef.current = fresh.lastUpdated
          const sanitized = sanitize(fresh)
          setSharedState(sanitized)
          // Cache ke localStorage untuk offline fallback (TV Box)
          cacheRakaatLocally(sanitized.currentRakaat)
        }
      } catch {
        // Abaikan error jaringan, coba lagi di interval berikutnya
      }
    }

    sync()
    const pollingMs = getPollingInterval()
    const interval = setInterval(sync, pollingMs)
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
    const totalSalam = getTotalSalam(sharedState.totalTarawihSalam, sharedState.witirMode)
    const next = Math.min(sharedState.currentRakaat + 1, totalSalam)
    update({ currentRakaat: next })
  }, [sharedState.currentRakaat, sharedState.totalTarawihSalam, sharedState.witirMode, update])

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

  const setFontSettings = useCallback((patch: Partial<SharedState>) => {
    update(patch)
  }, [update])

  const setSholatSettings = useCallback((patch: Partial<SharedState>) => {
    update(patch)
  }, [update])

  // ── Admin Auth ────────────────────────────────────────────────────────
  const isAdminLoggedIn = isSessionValid(sessionToken)

  const adminLogin = useCallback(async (password: string): Promise<boolean> => {
    // getStoredHash() memastikan hash sudah ada sebelum dibaca
    // menghindari race condition saat initDefaultPassword() belum selesai
    const storedHash = await getStoredHash()
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
    fontSettings: {
      fontFamily: sharedState.fontFamily,
      fontScale: sharedState.fontScale,
      fontBold: sharedState.fontBold,
      fontItalic: sharedState.fontItalic,
      fontUnderline: sharedState.fontUnderline,
    },
    setFontSettings,
    totalTarawihSalam: sharedState.totalTarawihSalam,
    witirMode: sharedState.witirMode,
    setSholatSettings,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    isInitialLoading,
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
