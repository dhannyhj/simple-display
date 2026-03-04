import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg']

export async function GET() {
  try {
    const imgDir = path.join(process.cwd(), 'public', 'img')
    if (!fs.existsSync(imgDir)) {
      return NextResponse.json({ images: [] })
    }
    const files = fs.readdirSync(imgDir).filter((f) =>
      IMAGE_EXT.includes(path.extname(f).toLowerCase())
    )
    return NextResponse.json({ images: files })
  } catch {
    return NextResponse.json({ images: [] })
  }
}
