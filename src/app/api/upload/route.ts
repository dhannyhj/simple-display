import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml']
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Tidak ada file' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Format tidak didukung (JPG, PNG, GIF, WEBP, AVIF, SVG)' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Ukuran file maksimal 5 MB' }, { status: 400 })
  }

  const blob = await put(`backgrounds/${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return NextResponse.json({ url: blob.url })
}
