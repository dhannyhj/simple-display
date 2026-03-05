/**
 * Phase 3: TV Box environment detection
 * Android 5.1 (Lollipop) + Chrome 95 → limited API support
 */

export function isTVBoxEnvironment(): boolean {
  if (typeof window === 'undefined') return false
  const ua = navigator.userAgent
  const isOldAndroid = /Android [1-6]\./i.test(ua)
  const noServiceWorker = !('serviceWorker' in navigator)
  const noCaches = !('caches' in window)
  // Old Android OR browser missing both SW + Caches API
  return isOldAndroid || (noServiceWorker && noCaches)
}

/**
 * Polling interval adaptif:
 * - TV Box (Android 5.1 / low-resource): 5 detik
 * - Normal device: 3 detik
 */
export function getPollingInterval(): number {
  return isTVBoxEnvironment() ? 5000 : 3000
}

export interface PlatformProfile {
  isTVBox: boolean
  hasServiceWorker: boolean
  hasCaches: boolean
  hasIndexedDB: boolean
  hasLocalStorage: boolean
}

export function getPlatformProfile(): PlatformProfile {
  if (typeof window === 'undefined') {
    return {
      isTVBox: false,
      hasServiceWorker: false,
      hasCaches: false,
      hasIndexedDB: false,
      hasLocalStorage: false,
    }
  }
  return {
    isTVBox: isTVBoxEnvironment(),
    hasServiceWorker: 'serviceWorker' in navigator,
    hasCaches: 'caches' in window,
    hasIndexedDB: 'indexedDB' in window,
    hasLocalStorage: typeof localStorage !== 'undefined',
  }
}
