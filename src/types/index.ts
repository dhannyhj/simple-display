// ===========================
// Types Utama Aplikasi
// ===========================

export type ThemeId =
  | 'dark-blue'
  | 'light-blue'
  | 'dark-green'
  | 'light-green'
  | 'dark-purple'
  | 'light-purple'
  | 'dark-orange'
  | 'dark-red'
  | 'dark-cyan'
  | 'dark-slate'

export type BackgroundType = 'solid' | 'gradient' | 'pattern'

export interface Theme {
  id: ThemeId
  name: string
  emoji: string
  bg: string
  bgSecondary: string
  text: string
  textSecondary: string
  accent: string
  accentBg: string
  border: string
  progressTrack: string
  cardBg: string
}

export interface BackgroundOption {
  id: string
  name: string
  value: string
  type: BackgroundType
  preview: string
}

export type SholatType = 'tarawih' | 'witir' | 'selesai'

export interface RakaatInfo {
  /**
   * Nomor salam saat ini (1-12):
   * - 1–10 : Tarawih salam ke-1 sd ke-10 (masing-masing 2 rakaat)
   * - 11   : Witir salam ke-1 (2 rakaat)
   * - 12   : Witir salam ke-2 / rakaat terakhir (1 rakaat)
   */
  currentSalam: number
  type: SholatType
  /** Nomor tampilan: 1-10 tarawih, 1-2 witir */
  salamNumber: number
  /** Mis. "1 & 2", "3 & 4", "1 & 2 (Witir)" */
  rakaatRange: string
  isSelesai: boolean
}

export interface AppState {
  currentRakaat: number       // alias currentSalam: 1-12, 0 = belum mulai, 13 = selesai
  selectedTheme: ThemeId
  selectedBackground: string  // id dari BackgroundOption
  adminSessionToken: string | null
  lastUpdated: number         // timestamp
}

export interface AdminCredentials {
  passwordHash: string
}

/**
 * State yang di-share ke Vercel KV (lintas device).
 * adminSessionToken TIDAK disertakan — itu device-local.
 */
export interface SharedState {
  currentRakaat: number
  selectedTheme: ThemeId
  selectedBackground: string
  lastUpdated: number
}
