import type { RakaatInfo, SholatType } from '@/types'

// ───────────────────────────────────────────────────────────────
// LOGIKA SHOLAT:
//   Tarawih  : 10 salam × 2 rakaat = 20 rakaat
//   Witir    : salam 1 = 2 rakaat, salam 2 = 1 rakaat = 3 rakaat
//   Total salam (jumlah tekan tombol Next): 12
// ───────────────────────────────────────────────────────────────

export const TOTAL_TARAWIH_SALAM = 10
export const TOTAL_WITIR_SALAM   = 2
export const TOTAL_SALAM         = TOTAL_TARAWIH_SALAM + TOTAL_WITIR_SALAM // 12

// Rakaat aktual per salam (untuk info saja)
export const TOTAL_TARAWIH_RAKAAT = 20
export const TOTAL_WITIR_RAKAAT   = 3

/**
 * Mendapatkan info berdasarkan currentSalam (1-12).
 * currentSalam 0 → belum dimulai (tampilkan salam 1 sebagai default)
 */
export function getRakaatInfo(currentSalam: number): RakaatInfo {
  const salam = Math.max(1, Math.min(currentSalam, TOTAL_SALAM))

  // ── Tarawih: salam 1-10 ────────────────────────────────────────
  if (salam <= TOTAL_TARAWIH_SALAM) {
    const r1 = (salam - 1) * 2 + 1  // rakaat pertama: 1,3,5,...19
    const r2 = r1 + 1               // rakaat kedua  : 2,4,6,...20
    return {
      currentSalam: salam,
      type: 'tarawih' as SholatType,
      salamNumber: salam,
      rakaatRange: `${r1} & ${r2}`,
      isSelesai: false,
    }
  }

  // ── Witir salam ke-1: 2 rakaat (salam 11) ─────────────────────
  if (salam === 11) {
    return {
      currentSalam: salam,
      type: 'witir' as SholatType,
      salamNumber: 1,
      rakaatRange: '1 & 2',
      isSelesai: false,
    }
  }

  // ── Witir salam ke-2: 1 rakaat terakhir (salam 12) ────────────
  return {
    currentSalam: salam,
    type: 'witir' as SholatType,
    salamNumber: 2,
    rakaatRange: '3',
    isSelesai: salam >= TOTAL_SALAM,
  }
}

/** Label utama besar di layar */
export function getRakaatLabel(info: RakaatInfo): string {
  if (info.isSelesai) return 'Selesai'
  if (info.type === 'tarawih') return `Salam ke-${info.salamNumber}`
  return `Witir ${info.salamNumber}`
}

/** Keterangan rakaat */
export function getRakaatSubLabel(info: RakaatInfo): string {
  if (info.isSelesai) return 'Sholat Tarawih & Witir Selesai'
  if (info.type === 'tarawih') {
    const isPenutup = info.salamNumber === TOTAL_TARAWIH_SALAM
    return `Tarawih rakaat ${info.rakaatRange}${isPenutup ? ' — Salam Terakhir Tarawih' : ''}`
  }
  if (info.type === 'witir') {
    if (info.salamNumber === 1) return 'Witir rakaat 1 & 2'
    return 'Witir rakaat 3 — Rakaat Terakhir'
  }
  return ''
}

/** Progress 0-100 berdasarkan salam */
export function getProgressPercent(currentSalam: number): number {
  if (currentSalam <= 0) return 0
  return Math.min(Math.round((currentSalam / TOTAL_SALAM) * 100), 100)
}

/**
 * Dot indikator 10 tarawih salam.
 * true = salam tersebut sudah SELESAI (sudah dilewati)
 */
export function getTarawihDots(currentSalam: number): { done: boolean; current: boolean }[] {
  return Array.from({ length: TOTAL_TARAWIH_SALAM }, (_, i) => {
    const s = i + 1
    return {
      done: currentSalam > s,
      current: currentSalam === s,
    }
  })
}
