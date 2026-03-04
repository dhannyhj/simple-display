import type { BackgroundOption } from '@/types'

// Background options untuk Display page
// 'solid' = warna solid (dari theme), 'gradient' = gradient, 'pattern' = pattern CSS
export const backgroundOptions: BackgroundOption[] = [
  {
    id: 'solid',
    name: 'Solid',
    value: 'solid',
    type: 'solid',
    preview: 'bg-current',
  },
  {
    id: 'gradient-radial',
    name: 'Radial Glow',
    value: 'radial-gradient(ellipse at center, var(--bg-secondary) 0%, var(--bg-primary) 70%)',
    type: 'gradient',
    preview: 'bg-gradient-radial',
  },
  {
    id: 'gradient-diagonal',
    name: 'Diagonal',
    value: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
    type: 'gradient',
    preview: 'bg-gradient-to-br',
  },
  {
    id: 'gradient-top',
    name: 'Top to Bottom',
    value: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
    type: 'gradient',
    preview: 'bg-gradient-to-b',
  },
  {
    id: 'gradient-sunrise',
    name: 'Sunrise',
    value: 'linear-gradient(to bottom, #0c0c1e 0%, #1a1a3e 50%, #2d1b4e 100%)',
    type: 'gradient',
    preview: 'bg-gradient-to-b',
  },
  {
    id: 'gradient-night',
    name: 'Malam',
    value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    type: 'gradient',
    preview: 'bg-gradient-to-br',
  },
  {
    id: 'pattern-dots',
    name: 'Dots',
    value: 'dots',
    type: 'pattern',
    preview: 'bg-dots',
  },
  {
    id: 'pattern-grid',
    name: 'Grid',
    value: 'grid',
    type: 'pattern',
    preview: 'bg-grid',
  },
]

export const DEFAULT_BACKGROUND = 'solid'

// Menghitung inline style untuk background
export function getBackgroundStyle(
  backgroundId: string,
  bgColor: string,
  bgSecondaryColor: string
): React.CSSProperties {
  // Handle gambar: URL eksternal, data URI, atau path lokal /img/
  if (
    backgroundId.startsWith('http://') ||
    backgroundId.startsWith('https://') ||
    backgroundId.startsWith('data:') ||
    backgroundId.startsWith('/')
  ) {
    return {
      backgroundImage: `url(${backgroundId})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }

  const option = backgroundOptions.find((b) => b.id === backgroundId)
  if (!option || option.type === 'solid') return {}

  if (option.type === 'gradient') {
    const value = option.value
      .replace('var(--bg-primary)', bgColor)
      .replace('var(--bg-secondary)', bgSecondaryColor)
    return { background: value }
  }

  if (option.value === 'dots') {
    return {
      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
      backgroundSize: '30px 30px',
    }
  }

  if (option.value === 'grid') {
    return {
      backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
      backgroundSize: '50px 50px',
    }
  }

  return {}
}
