/**
 * Abstraksi KV Store untuk shared state antar device.
 *
 * - Production (Vercel): menggunakan Upstash Redis via REST API
 *   Env vars yang dibutuhkan:
 *     UPSTASH_REDIS_REST_URL=https://<your-url>.upstash.io
 *     UPSTASH_REDIS_REST_TOKEN=<your-token>
 *
 * - Local Dev (tanpa env vars): menggunakan in-memory store
 *   (data reset saat dev server restart — cukup untuk testing lokal)
 */

import type { SharedState } from '@/types'
import { DEFAULT_THEME } from '@/lib/themes'
import { DEFAULT_BACKGROUND } from '@/lib/backgrounds'

export const DEFAULT_SHARED_STATE: SharedState = {
  currentRakaat: 1,
  selectedTheme: DEFAULT_THEME,
  selectedBackground: DEFAULT_BACKGROUND,
  lastUpdated: 0,
}

const KV_KEY = 'simple-display:state'

// In-memory fallback untuk local dev
let inMemoryState: SharedState = { ...DEFAULT_SHARED_STATE }

function createRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  // Dynamic require agar tidak di-bundle di client
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Redis } = require('@upstash/redis')
  return new Redis({ url, token })
}

export async function getSharedState(): Promise<SharedState> {
  const redis = createRedis()
  if (redis) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await (redis.get(KV_KEY) as Promise<any>)
      return (data as SharedState) ?? DEFAULT_SHARED_STATE
    } catch (e) {
      console.error('[kv-store] GET error:', e)
      return DEFAULT_SHARED_STATE
    }
  }
  return inMemoryState
}

export async function patchSharedState(patch: Partial<SharedState>): Promise<SharedState> {
  const current = await getSharedState()
  const next: SharedState = {
    ...current,
    ...patch,
    lastUpdated: Date.now(),
  }
  const redis = createRedis()
  if (redis) {
    try {
      await redis.set(KV_KEY, next)
    } catch (e) {
      console.error('[kv-store] SET error:', e)
    }
  } else {
    inMemoryState = next
  }
  return next
}
