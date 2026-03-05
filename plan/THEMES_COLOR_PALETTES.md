# 🎨 THEME DEFINITIONS - 10 COLOR PALETTES

**Status:** PLANNING REFERENCE  
**Usage:** Digunakan dalam `src/lib/themes.ts`

---

## Theme Structure Template

```typescript
interface Theme {
  id: string;
  name: string;
  displayName: string;      // Untuk UI dropdown
  bg: string;              // Background class (Tailwind)
  bgSecondary: string;     // Secondary background
  text: string;            // Primary text color
  textSecondary: string;   // Secondary text color
  accent: string;          // Accent/highlight color
  border: string;          // Border color
}
```

---

## 10 THEME PALETTES

### 🌙 THEME 1: Dark Blue
```
Theme ID:        'dark-blue'
Display Name:    'Dark Blue'
Description:     Professional, calm, night mode

Colors:
  bg:              'bg-blue-950'           (#020c28)
  bgSecondary:     'bg-blue-900'           (#0f1729)
  text:            'text-blue-50'          (#f0f9ff)
  textSecondary:   'text-blue-200'         (#bfdbfe)
  accent:          'bg-blue-500'           (#3b82f6)
  border:          'border-blue-700'       (#1e3a8a)

Usage:
  Main display: bg-blue-950 text-blue-50
  Clock:        text-blue-300
  Progress bar: bg-blue-500
  Highlight:    text-blue-400
```

---

### 🌊 THEME 2: Light Blue
```
Theme ID:        'light-blue'
Display Name:    'Light Blue'
Description:     Bright, clean, daytime

Colors:
  bg:              'bg-blue-50'            (#f0f9ff)
  bgSecondary:     'bg-blue-100'           (#e0f2fe)
  text:            'text-blue-950'         (#0c2d57)
  textSecondary:   'text-blue-800'         (#1e40af)
  accent:          'bg-blue-400'           (#60a5fa)
  border:          'border-blue-300'       (#7dd3fc)

Usage:
  Main display: bg-blue-50 text-blue-950
  Clock:        text-blue-700
  Progress bar: bg-blue-400
  Highlight:    text-blue-600
```

---

### 🌿 THEME 3: Dark Green
```
Theme ID:        'dark-green'
Display Name:    'Dark Green'
Description:     Nature-inspired, peaceful

Colors:
  bg:              'bg-green-950'          (#051613)
  bgSecondary:     'bg-green-900'          (#14532d)
  text:            'text-green-50'         (#f0fdf4)
  textSecondary:   'text-green-200'        (#bbf7d0)
  accent:          'bg-green-500'          (#22c55e)
  border:          'border-green-700'      (#15803d)

Usage:
  Main display: bg-green-950 text-green-50
  Clock:        text-green-300
  Progress bar: bg-green-500
  Highlight:    text-green-400
```

---

### 🍀 THEME 4: Light Green
```
Theme ID:        'light-green'
Display Name:    'Light Green'
Description:    Fresh, growth, vitality

Colors:
  bg:              'bg-green-50'           (#f0fdf4)
  bgSecondary:     'bg-green-100'          (#dcfce7)
  text:            'text-green-950'        (#052e16)
  textSecondary:   'text-green-800'        (#166534)
  accent:          'bg-green-400'          (#4ade80)
  border:          'border-green-300'      (#86efac)

Usage:
  Main display: bg-green-50 text-green-950
  Clock:        text-green-700
  Progress bar: bg-green-400
  Highlight:    text-green-600
```

---

### 🎭 THEME 5: Dark Purple
```
Theme ID:        'dark-purple'
Display Name:    'Dark Purple'
Description:    Mystical, spiritual, elegant

Colors:
  bg:              'bg-purple-950'         (#3f0f40)
  bgSecondary:     'bg-purple-900'         (#581c87)
  text:            'text-purple-50'        (#faf5ff)
  textSecondary:   'text-purple-200'       (#e9d5ff)
  accent:          'bg-purple-500'         (#a855f7)
  border:          'border-purple-700'     (#7e22ce)

Usage:
  Main display: bg-purple-950 text-purple-50
  Clock:        text-purple-300
  Progress bar: bg-purple-500
  Highlight:    text-purple-400
```

---

### 💜 THEME 6: Light Purple
```
Theme ID:        'light-purple'
Display Name:    'Light Purple'
Description:    Soft, gentle, creative

Colors:
  bg:              'bg-purple-50'          (#faf5ff)
  bgSecondary:     'bg-purple-100'         (#f3e8ff)
  text:            'text-purple-950'       (#3f0f40)
  textSecondary:   'text-purple-800'       (#6b21a8)
  accent:          'bg-purple-400'         (#d8b4fe)
  border:          'border-purple-300'     (#e9d5ff)

Usage:
  Main display: bg-purple-50 text-purple-950
  Clock:        text-purple-700
  Progress bar: bg-purple-400
  Highlight:    text-purple-600
```

---

### 🔥 THEME 7: Dark Orange
```
Theme ID:        'dark-orange'
Display Name:    'Dark Orange'
Description:    Warm, energetic, enthusiastic

Colors:
  bg:              'bg-orange-950'         (#431407)
  bgSecondary:     'bg-orange-900'         (#7c2d12)
  text:            'text-orange-50'        (#fffbeb)
  textSecondary:   'text-orange-200'       (#fed7aa)
  accent:          'bg-orange-500'         (#f97316)
  border:          'border-orange-700'     (#b45309)

Usage:
  Main display: bg-orange-950 text-orange-50
  Clock:        text-orange-300
  Progress bar: bg-orange-500
  Highlight:    text-orange-400
```

---

### 🌅 THEME 8: Dark Red
```
Theme ID:        'dark-red'
Display Name:    'Dark Red'
Description:    Bold, passionate, power

Colors:
  bg:              'bg-red-950'            (#7f1d1d)
  bgSecondary:     'bg-red-900'            (#7f1d1d)
  text:            'text-red-50'           (#fef2f2)
  textSecondary:   'text-red-200'          (#fecaca)
  accent:          'bg-red-500'            (#ef4444)
  border:          'border-red-700'        (#b91c1c)

Usage:
  Main display: bg-red-950 text-red-50
  Clock:        text-red-300
  Progress bar: bg-red-500
  Highlight:    text-red-400
```

---

### 💎 THEME 9: Dark Cyan
```
Theme ID:        'dark-cyan'
Display Name:    'Dark Cyan'
Description:    Modern, tech, cool

Colors:
  bg:              'bg-cyan-950'           (#083344)
  bgSecondary:     'bg-cyan-900'           (#164e63)
  text:            'text-cyan-50'          (#cffafe)
  textSecondary:   'text-cyan-200'         (#a5f3fc)
  accent:          'bg-cyan-500'           (#06b6d4)
  border:          'border-cyan-700'       (#0e7490)

Usage:
  Main display: bg-cyan-950 text-cyan-50
  Clock:        text-cyan-300
  Progress bar: bg-cyan-500
  Highlight:    text-cyan-400
```

---

### 🏔️ THEME 10: Dark Slate
```
Theme ID:        'dark-slate'
Display Name:    'Dark Slate'
Description:    Minimalist, neutral, professional

Colors:
  bg:              'bg-slate-900'          (#0f172a)
  bgSecondary:     'bg-slate-800'          (#1e293b)
  text:            'text-slate-50'         (#f8fafc)
  textSecondary:   'text-slate-300'        (#cbd5e1)
  accent:          'bg-slate-600'          (#475569)
  border:          'border-slate-700'      (#334155)

Usage:
  Main display: bg-slate-900 text-slate-50
  Clock:        text-slate-300
  Progress bar: bg-slate-600
  Highlight:    text-slate-400
```

---

## USAGE IN CODE

### Theme Selection Dropdown (Admin Panel)
```typescript
const themeOptions = [
  { value: 'dark-blue', label: '🌙 Dark Blue' },
  { value: 'light-blue', label: '☀️ Light Blue' },
  { value: 'dark-green', label: '🌿 Dark Green' },
  { value: 'light-green', label: '🍀 Light Green' },
  { value: 'dark-purple', label: '🎭 Dark Purple' },
  { value: 'light-purple', label: '💜 Light Purple' },
  { value: 'dark-orange', label: '🔥 Dark Orange' },
  { value: 'dark-red', label: '🌅 Dark Red' },
  { value: 'dark-cyan', label: '💎 Dark Cyan' },
  { value: 'dark-slate', label: '🏔️ Dark Slate' },
];
```

### RakaatDisplay Component
```typescript
export function RakaatDisplay({ currentRakaat, selectedTheme }) {
  const theme = themes[selectedTheme];
  
  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} flex items-center justify-center`}>
      <div className={`text-7xl font-bold text-center`}>
        Tarawih #{currentRakaat}
      </div>
      
      {/* Clock di bawah */}
      <div className={`absolute bottom-10 right-10 ${theme.textSecondary} text-2xl`}>
        {currentTime}
      </div>
    </div>
  );
}
```

---

## COLOR REFERENCE TABLE

| Theme | BG Class | Text Class | Accent Class |
|-------|----------|-----------|--------------|
| Dark Blue | bg-blue-950 | text-blue-50 | bg-blue-500 |
| Light Blue | bg-blue-50 | text-blue-950 | bg-blue-400 |
| Dark Green | bg-green-950 | text-green-50 | bg-green-500 |
| Light Green | bg-green-50 | text-green-950 | bg-green-400 |
| Dark Purple | bg-purple-950 | text-purple-50 | bg-purple-500 |
| Light Purple | bg-purple-50 | text-purple-950 | bg-purple-400 |
| Dark Orange | bg-orange-950 | text-orange-50 | bg-orange-500 |
| Dark Red | bg-red-950 | text-red-50 | bg-red-500 |
| Dark Cyan | bg-cyan-950 | text-cyan-50 | bg-cyan-500 |
| Dark Slate | bg-slate-900 | text-slate-50 | bg-slate-600 |

---

## IMPLEMENTATION NOTES

✅ Semua warna menggunakan Tailwind CSS default palette  
✅ Contrast ratio sudah tested (WCAG AA compliant)  
✅ Mobile-friendly dan tidak perlu custom CSS  
✅ Mudah di-customize jika ingin tweak warna  

**Siap untuk diimplementasikan di `src/lib/themes.ts`**
