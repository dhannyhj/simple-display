'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/hooks/useTheme'
import type { ThemeId } from '@/types'

type ImageEntry = { url: string; name: string; source: 'local' | 'blob' }

export function ThemeSelector() {
  const { selectedTheme, themeList, setTheme, selectedBackground, backgroundOptions, setBackground } = useTheme()
  const [imgUrl, setImgUrl] = useState('')
  const [images, setImages] = useState<ImageEntry[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchImages = () => {
    fetch('/api/images')
      .then((r) => r.json())
      .then((data) => setImages(data.images ?? []))
      .catch(() => {})
  }

  useEffect(() => { fetchImages() }, [])

  const handleUpload = async (file: File) => {
    setUploading(true)
    setUploadError('')
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) {
        setUploadError(data.error ?? 'Upload gagal')
      } else {
        setBackground(data.url)
        fetchImages()
      }
    } catch {
      setUploadError('Gagal terhubung ke server')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const isImageBg =
    selectedBackground.startsWith('http://') ||
    selectedBackground.startsWith('https://') ||
    selectedBackground.startsWith('/')

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">

      {/* ── Theme Section ── */}
      <div>
        <h3 className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-3">
          🎨 Pilih Tema
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {themeList.map((theme) => {
            const isActive = selectedTheme === theme.id
            return (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id as ThemeId)}
                className={`
                  flex items-center gap-2 px-3 py-3 rounded-xl
                  border text-left text-sm font-medium
                  transition-all duration-150
                  ${isActive
                    ? 'border-blue-500 bg-blue-900/30 text-white'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-white'
                  }
                `}
              >
                <span className="text-lg">{theme.emoji}</span>
                <span className="truncate">{theme.name}</span>
                {isActive && <span className="ml-auto text-blue-400">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Background Section ── */}
      <div>
        <h3 className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-3">
          🖼️ Pilih Background
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {backgroundOptions.map((bg) => {
            const isActive = selectedBackground === bg.id
            return (
              <button
                key={bg.id}
                onClick={() => setBackground(bg.id)}
                className={`
                  flex items-center gap-2 px-3 py-3 rounded-xl
                  border text-left text-sm font-medium
                  transition-all duration-150
                  ${isActive
                    ? 'border-purple-500 bg-purple-900/30 text-white'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-white'
                  }
                `}
              >
                <span className="text-lg">
                  {bg.type === 'solid' ? '⬛' : bg.type === 'gradient' ? '🌈' : '⊞'}
                </span>
                <span className="truncate">{bg.name}</span>
                {isActive && <span className="ml-auto text-purple-400">✓</span>}
              </button>
            )
          })}
        </div>
      </div>
      {/* ── Background Gambar: Lokal + Blob ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-400 text-xs uppercase tracking-widest font-semibold">
            🖼️ Background Gambar
          </h3>
          {/* Tombol Upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 text-xs bg-purple-700 hover:bg-purple-600 disabled:bg-slate-700 disabled:text-slate-500 text-white px-3 py-1.5 rounded-lg transition-all"
          >
            {uploading ? (
              <>
                <span className="animate-spin">⏳</span> Mengupload...
              </>
            ) : (
              <>⬆️ Upload</>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/avif,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
            }}
          />
        </div>

        {/* ⚠️ Android 5 Compatibility Warning */}
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3 mb-3">
          <p className="text-amber-300 text-xs font-semibold mb-1 flex items-center gap-1.5">
            ⚠️ Catatan Kompatibilitas
          </p>
          <p className="text-amber-200/80 text-xs leading-relaxed">
            <strong>☁️ Upload Blob:</strong> Android 6+ saja (certificate issue di Android 5)<br />
            <strong>📁 Lokal:</strong> Semua device (letakkan di <code className="text-amber-100">public/img/</code>)
          </p>
        </div>

        {uploadError && (
          <p className="text-red-400 text-xs mb-2">❌ {uploadError}</p>
        )}

        {images.length === 0 ? (
          <p className="text-slate-600 text-xs">
            Belum ada gambar. Untuk Android 5: gunakan lokal di <code className="text-slate-400">public/img/</code>
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {images.map((img) => {
              const isActive = selectedBackground === img.url
              return (
                <button
                  key={img.url}
                  onClick={() => setBackground(isActive ? 'solid' : img.url)}
                  title={img.name}
                  className={`
                    relative rounded-xl overflow-hidden border-2 transition-all duration-150 aspect-video
                    ${isActive ? 'border-purple-500 ring-2 ring-purple-500/40' : 'border-slate-700 hover:border-slate-500'}
                  `}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  {img.source === 'blob' && (
                    <span className="absolute top-1 left-1 bg-black/50 text-white text-[9px] px-1 rounded">☁️</span>
                  )}
                  {isActive && (
                    <div className="absolute inset-0 bg-purple-900/40 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">✓</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Background Gambar via URL ── */}
      <div>
        <h3 className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-3">
          📷 Background Gambar (URL)
        </h3>
        <p className="text-slate-500 text-xs mb-2">
          ⚠️ URL eksternal punya masalah pada Android 5. Gunakan lokal untuk kompatibilitas maksimal.
        </p>
        <div className="flex gap-2">
          <input
            type="url"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            placeholder="https://contoh.com/gambar.jpg"
            className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => {
              if (imgUrl.trim()) {
                setBackground(imgUrl.trim())
                setImgUrl('')
              }
            }}
            disabled={!imgUrl.trim()}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium transition-all"
          >
            Pakai
          </button>
        </div>
        {isImageBg && (
          <div className="mt-3 flex items-center gap-2">
            <div
              className="w-12 h-8 rounded-lg bg-cover bg-center border border-slate-600 flex-shrink-0"
              style={{ backgroundImage: `url(${selectedBackground})` }}
            />
            <span className="text-slate-400 text-xs flex-1 truncate">{selectedBackground}</span>
            <button
              onClick={() => setBackground('solid')}
              className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-800 hover:border-red-600 transition-all flex-shrink-0"
            >
              Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
