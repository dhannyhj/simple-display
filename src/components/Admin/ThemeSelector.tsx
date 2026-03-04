'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import type { ThemeId } from '@/types'

export function ThemeSelector() {
  const { selectedTheme, themeList, setTheme, selectedBackground, backgroundOptions, setBackground } = useTheme()
  const [imgUrl, setImgUrl] = useState('')
  const [localImages, setLocalImages] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/images')
      .then((r) => r.json())
      .then((data) => setLocalImages(data.images ?? []))
      .catch(() => {})
  }, [])

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
      {/* ── Background Gambar — Folder /public/img ── */}
      <div>
        <h3 className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-3">
          🖼 Background Gambar Lokal
        </h3>
        {localImages.length === 0 ? (
          <p className="text-slate-600 text-xs">
            Belum ada gambar. Letakkan file di folder{' '}
            <code className="text-slate-400">public/img/</code> lalu refresh halaman ini.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {localImages.map((filename) => {
              const src = `/img/${filename}`
              const isActive = selectedBackground === src
              return (
                <button
                  key={filename}
                  onClick={() => setBackground(isActive ? 'solid' : src)}
                  title={filename}
                  className={`
                    relative rounded-xl overflow-hidden border-2 transition-all duration-150 aspect-video
                    ${isActive ? 'border-purple-500 ring-2 ring-purple-500/40' : 'border-slate-700 hover:border-slate-500'}
                  `}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={filename}
                    className="w-full h-full object-cover"
                  />
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
