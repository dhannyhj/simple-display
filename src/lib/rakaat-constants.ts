import type { RakaatInfo, SholatType, WitirMode } from '@/types'

// ───────────────────────────────────────────────────────────────
// KONSTANTA FALLBACK (digunakan jika tidak ada config dari state)
// ───────────────────────────────────────────────────────────────

export const DEFAULT_TARAWIH_SALAM = 10
export const DEFAULT_WITIR_MODE: WitirMode = '2+1'

// Backward-compat
export const TOTAL_TARAWIH_SALAM = DEFAULT_TARAWIH_SALAM
export const TOTAL_WITIR_SALAM   = 2

/** Hitung total salam berdasarkan config */
export function getTotalSalam(
  totalTarawihSalam = DEFAULT_TARAWIH_SALAM,
  witirMode: WitirMode = DEFAULT_WITIR_MODE
): number {
  const witirSalam = witirMode === '3' ? 1 : 2
  return totalTarawihSalam + witirSalam
}

/** @deprecated gunakan getTotalSalam() */
export const TOTAL_SALAM = getTotalSalam()

// Rakaat aktual
export const TOTAL_TARAWIH_RAKAAT = 20
export const TOTAL_WITIR_RAKAAT   = 3

/**
 * Mendapatkan info berdasarkan currentSalam (1-N).
 */
export function getRakaatInfo(
  currentSalam: number,
  totalTarawihSalam = DEFAULT_TARAWIH_SALAM,
  witirMode: WitirMode = DEFAULT_WITIR_MODE
): RakaatInfo {
  const totalSalam = getTotalSalam(totalTarawihSalam, witirMode)
  const salam = Math.max(1, Math.min(currentSalam, totalSalam))

  // ── Tarawih ────────────────────────────────────────────────────
  if (salam <= totalTarawihSalam) {
    const r1 = (salam - 1) * 2 + 1
    const r2 = r1 + 1
    return {
      currentSalam: salam,
      type: 'tarawih' as SholatType,
      salamNumber: salam,
      rakaatRange: `${r1} & ${r2}`,
      isSelesai: false,
    }
  }

  // ── Witir mode '2+1': 2 salam (salam tarawih+1 & tarawih+2) ───
  if (witirMode === '2+1') {
    const witirSalam = salam - totalTarawihSalam // 1 atau 2

    if (witirSalam === 1) {
      return {
        currentSalam: salam,
        type: 'witir' as SholatType,
        salamNumber: 1,
        rakaatRange: '1 & 2',
        isSelesai: false,
      }
    }
    // witirSalam === 2
    return {
      currentSalam: salam,
      type: 'witir' as SholatType,
      salamNumber: 2,
      rakaatRange: '3',
      isSelesai: salam >= totalSalam,
    }
  }

  // ── Witir mode '3': 3 rakaat 1 salam ──────────────────────────
  return {
    currentSalam: salam,
    type: 'witir' as SholatType,
    salamNumber: 1,
    rakaatRange: '1, 2 & 3',
    isSelesai: salam >= totalSalam,
  }
}

/** Label utama besar di layar */
export function getRakaatLabel(info: RakaatInfo): string {
  if (info.isSelesai) return 'Selesai'
  if (info.type === 'tarawih') return `Salam ke-${info.salamNumber}`
  return `Witir ${info.salamNumber}`
}

/** Keterangan rakaat */
export function getRakaatSubLabel(
  info: RakaatInfo,
  totalTarawihSalam = DEFAULT_TARAWIH_SALAM,
  witirMode: WitirMode = DEFAULT_WITIR_MODE
): string {
  if (info.isSelesai) return 'Sholat Tarawih & Witir Selesai'
  if (info.type === 'tarawih') {
    const isPenutup = info.salamNumber === totalTarawihSalam
    return `Tarawih rakaat ${info.rakaatRange}${isPenutup ? ' — Salam Terakhir Tarawih' : ''}`
  }
  if (info.type === 'witir') {
    if (witirMode === '3') return 'Witir 3 rakaat — 1 salam'
    if (info.salamNumber === 1) return 'Witir rakaat 1 & 2'
    return 'Witir rakaat 3 — Rakaat Terakhir'
  }
  return ''
}

/** Progress 0-100 berdasarkan salam */
export function getProgressPercent(
  currentSalam: number,
  totalTarawihSalam = DEFAULT_TARAWIH_SALAM,
  witirMode: WitirMode = DEFAULT_WITIR_MODE
): number {
  if (currentSalam <= 0) return 0
  const total = getTotalSalam(totalTarawihSalam, witirMode)
  return Math.min(Math.round((currentSalam / total) * 100), 100)
}

/**
 * Dot indikator tarawih salam.
 */
export function getTarawihDots(
  currentSalam: number,
  totalTarawihSalam = DEFAULT_TARAWIH_SALAM
): { done: boolean; current: boolean }[] {
  return Array.from({ length: totalTarawihSalam }, (_, i) => {
    const s = i + 1
    return {
      done: currentSalam > s,
      current: currentSalam === s,
    }
  })
}
