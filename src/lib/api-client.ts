/**
 * Phase 2: API client dengan retry logic + timeout
 * untuk robustness pada jaringan tidak stabil (TV Box environment)
 */

interface FetchRetryOptions {
  retries?: number    // Jumlah maksimal percobaan (default: 3)
  timeout?: number    // Timeout per request dalam ms (default: 5000)
  init?: RequestInit  // Fetch init options (method, headers, body, dll)
}

/**
 * Fetch dengan retry exponential backoff + timeout per request.
 *
 * Retry schedule: 1s, 2s, 4s (jika retries=3)
 * Jika semua retry gagal, throw error terakhir.
 */
export async function fetchWithRetry<T>(
  url: string,
  options: FetchRetryOptions = {}
): Promise<T> {
  const { retries = 3, timeout = 5000, init } = options

  let lastError: unknown

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const res = await fetch(url, { ...init, signal: controller.signal })
      clearTimeout(timeoutId)

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return (await res.json()) as T
    } catch (e) {
      lastError = e
      if (i < retries - 1) {
        const waitMs = 1000 * Math.pow(2, i) // 1s, 2s, 4s
        await new Promise((r) => setTimeout(r, waitMs))
      }
    }
  }

  throw lastError
}
