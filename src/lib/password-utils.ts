// Password utils - client-side only (no external deps)
// Menggunakan Web Crypto API (built-in browser + Node.js 18+)

const DEFAULT_PASSWORD = 'admin123'
const SALT = 'simple-display-v1'

/**
 * Hash password menggunakan SHA-256 via Web Crypto API
 */
export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(SALT + password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Verifikasi password vs hash yang tersimpan
 */
export async function verifyPassword(
  inputPassword: string,
  storedHash: string
): Promise<boolean> {
  const inputHash = await hashPassword(inputPassword)
  return inputHash === storedHash
}

/**
 * Generate session token sederhana
 */
export function generateSessionToken(): string {
  const random = Math.random().toString(36).substring(2, 15)
  const timestamp = Date.now().toString(36)
  return `${timestamp}-${random}`
}

/**
 * Validasi session token (cek expiry 8 jam)
 */
export function isSessionValid(token: string | null): boolean {
  if (!token) return false
  const parts = token.split('-')
  if (parts.length < 2) return false
  const timestamp = parseInt(parts[0], 36)
  const now = Date.now()
  const eightHours = 8 * 60 * 60 * 1000
  return now - timestamp < eightHours
}

// Keys untuk localStorage
export const STORAGE_KEYS = {
  APP_STATE: 'simple-display-state',
  PASSWORD_HASH: 'simple-display-password',
  SESSION_TOKEN: 'simple-display-session',
} as const

/**
 * Inisialisasi password default jika belum ada
 * Dipanggil sekali saat app pertama kali load
 */
export async function initDefaultPassword(): Promise<void> {
  if (typeof window === 'undefined') return
  const existing = localStorage.getItem(STORAGE_KEYS.PASSWORD_HASH)
  if (!existing) {
    const hash = await hashPassword(DEFAULT_PASSWORD)
    localStorage.setItem(STORAGE_KEYS.PASSWORD_HASH, hash)
  }
}
