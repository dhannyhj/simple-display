import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg']

export async function GET() {
  // ── Gambar lokal dari public/img/ ─────────────────────────────
  const localFiles: { url: string; name: string; source: 'local' }[] = []
  try {
    const imgDir = path.join(process.cwd(), 'public', 'img')
    if (fs.existsSync(imgDir)) {
      fs.readdirSync(imgDir)
        .filter((f) => IMAGE_EXT.includes(path.extname(f).toLowerCase()))
        .forEach((f) => localFiles.push({ url: `/img/${f}`, name: f, source: 'local' }))
    }
  } catch { /* abaikan */ }

  // ── Gambar dari Vercel Blob ────────────────────────────────────
  const blobFiles: { url: string; name: string; source: 'blob' }[] = []
  try {
    const { blobs } = await list({ prefix: 'backgrounds/' })
    blobs.forEach((b) =>
      blobFiles.push({
        url: b.url,
        name: b.pathname.replace('backgrounds/', ''),
        source: 'blob',
      })
    )
  } catch { /* tidak ada BLOB_READ_WRITE_TOKEN atau jaringan error */ }

  return NextResponse.json({ images: [...localFiles, ...blobFiles] })
}

