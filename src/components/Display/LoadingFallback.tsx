'use client'

import { useEffect, useState } from 'react'

// Key untuk cache localStorage — diimport juga di AppContext
export const RAKAAT_CACHE_KEY = 'rakaat_fallback'

interface CachedRakaat {
  count: number
  timestamp: number
}

function getCachedRakaat(): CachedRakaat | null {
  try {
    const stored = localStorage.getItem(RAKAAT_CACHE_KEY)
    if (!stored) return null
    return JSON.parse(stored) as CachedRakaat
  } catch {
    return null
  }
}

export default function LoadingFallback() {
  const [elapsed, setElapsed] = useState(0)
  const [cached, setCached] = useState<CachedRakaat | null>(null)

  useEffect(() => {
    setCached(getCachedRakaat())
    const timer = setInterval(() => setElapsed((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const getMessage = () => {
    if (elapsed < 3) return 'Memuat...'
    if (elapsed < 8) return 'Memeriksa koneksi...'
    return 'Koneksi timeout'
  }

  const isTimeout = elapsed >= 8

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white select-none">
      {!isTimeout ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-2xl font-medium tracking-wide">{getMessage()}</p>
        </div>
      ) : (
        <div className="text-center space-y-6 px-8 max-w-lg">
          <p className="text-3xl text-yellow-400 font-bold">⚠ Tidak Dapat Terhubung</p>

          {cached ? (
            <>
              <p className="text-gray-400 text-lg">Menampilkan data terakhir tersimpan</p>
              <div className="text-9xl font-bold font-mono text-white py-4">
                {String(cached.count).padStart(2, '0')}
              </div>
              <p className="text-gray-500 text-sm">
                Terakhir diperbarui:{' '}
                {new Date(cached.timestamp).toLocaleTimeString('id-ID')}
              </p>
            </>
          ) : (
            <p className="text-gray-400 text-xl">Tidak ada data cache tersedia</p>
          )}

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 text-xl font-bold bg-white text-black rounded-xl hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
          >
            🔄 Muat Ulang
          </button>
        </div>
      )}
    </div>
  )
}
