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

// Mapping Tailwind bg class → CSS hex (background colors yang dipakai di themes.ts)
const TAILWIND_COLOR_MAP: Record<string, string> = {
  // Dark themes
  'bg-blue-950':   '#172554', 'bg-blue-900':   '#1e3a8a',
  'bg-green-950':  '#052e16', 'bg-green-900':  '#14532d',
  'bg-purple-950': '#3b0764', 'bg-purple-900': '#581c87',
  'bg-orange-950': '#431407', 'bg-orange-900': '#7c2d12',
  'bg-red-950':    '#450a0a', 'bg-red-900':    '#7f1d1d',
  'bg-cyan-950':   '#083344', 'bg-cyan-900':   '#164e63',
  'bg-slate-900':  '#0f172a', 'bg-slate-800':  '#1e293b',
  // Light themes
  'bg-blue-50':    '#eff6ff', 'bg-blue-100':   '#dbeafe',
  'bg-green-50':   '#f0fdf4', 'bg-green-100':  '#dcfce7',
  'bg-purple-50':  '#faf5ff', 'bg-purple-100': '#f3e8ff',
  'bg-orange-50':  '#fff7ed', 'bg-orange-100': '#ffedd5',
  'bg-red-50':     '#fef2f2', 'bg-red-100':    '#fee2e2',
  'bg-cyan-50':    '#ecfeff', 'bg-cyan-100':   '#cffafe',
  'bg-slate-100':  '#f1f5f9', 'bg-slate-200':  '#e2e8f0',
  'bg-amber-50':   '#fffbeb', 'bg-amber-100':  '#fef3c7',
}

function resolveColor(tailwindClass: string): string {
  return TAILWIND_COLOR_MAP[tailwindClass] ?? tailwindClass
}

// Menghitung inline style untuk background
export function getBackgroundStyle(
  backgroundId: string,
  bgClass: string,
  bgSecondaryClass: string
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

  // Resolve Tailwind class → hex color
  const primary   = resolveColor(bgClass)
  const secondary = resolveColor(bgSecondaryClass)

  if (option.type === 'gradient') {
    const value = option.value
      .replace('var(--bg-primary)', primary)
      .replace('var(--bg-secondary)', secondary)
    return { background: value }
  }

  if (option.value === 'dots') {
    return {
      backgroundImage: `radial-gradient(circle, rgba(128,128,128,0.15) 1px, transparent 1px)`,
      backgroundSize: '30px 30px',
    }
  }

  if (option.value === 'grid') {
    return {
      backgroundImage: `linear-gradient(rgba(128,128,128,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.1) 1px, transparent 1px)`,
      backgroundSize: '50px 50px',
    }
  }

  return {}
}
