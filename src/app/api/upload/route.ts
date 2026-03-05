import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml']
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(req: Request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Blob storage belum dikonfigurasi (BLOB_READ_WRITE_TOKEN missing)' }, { status: 503 })
    }

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
      access: 'private',
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[upload] error:', msg)
    return NextResponse.json({ error: `Upload gagal: ${msg}` }, { status: 500 })
  }
}
