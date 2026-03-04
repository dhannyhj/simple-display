import { NextRequest, NextResponse } from 'next/server'
import { getSharedState, patchSharedState } from '@/lib/kv-store'

// Pastikan Next.js tidak cache response ini
export const dynamic = 'force-dynamic'

/** GET /api/state — ambil shared state (dipakai oleh display polling) */
export async function GET() {
  const state = await getSharedState()
  return NextResponse.json(state, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

/** POST /api/state — update shared state (dipakai oleh admin panel) */
export async function POST(request: NextRequest) {
  try {
    const patch = await request.json()
    const next = await patchSharedState(patch)
    return NextResponse.json(next)
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
