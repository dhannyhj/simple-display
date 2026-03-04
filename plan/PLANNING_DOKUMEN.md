# 📋 RENCANA APLIKASI: Simple Display Rakaat Tarawih
**Status:** PLANNING (Pre-Implementation)  
**Mode:** SERIOUS + PRODUCTION  
**Tanggal:** 4 Maret 2026

---

## 🎯 SCOPE & TUJUAN

### Visi
Aplikasi web-based yang menampilkan informasi rakaat sholat tarawih di Android Box dengan kontrol admin untuk advance ke rakaat berikutnya secara real-time.

### Target User
- **Display User:** Jamaah yang melihat di TV/layar publik
- **Admin User:** Imam/petugas yang mengontrol progress tarawih

---

## 📱 FEATURE REQUIREMENTS

### 1. DISPLAY PAGE (Public View)
- **Informasi Utama:**
  - Nomor rakaat saat ini (1-20 tarawih + 3 witir = 23 total)
  - Status rakaat (tarawih/witir)
  - Progress bar visual
  - Jam real-time (bawah kiri/kanan)
  
- **Behavior:**
  - Update otomatis saat admin tekan "Next"
  - Font besar & readable dari jarak jauh
  - Minimal distraksi, maksimal clarity
  
- **10 Themes:**
  - Dark/Light base
  - Warna berbeda: Blue, Green, Purple, Orange, Red, Cyan, Rose, Amber, Slate, Indigo

### 2. ADMIN PANEL (Protected Page)
- **URL:** `/admin` (password protected)
- **Controls:**
  - Button "Next Rakaat" → increment counter
  - Button "Reset All" → kembali ke rakaat 1
  - Display status saat ini
  - Theme selector (dropdown 10 themes)
  
- **Security:**
  - Password protection (localStorage hash)
  - Session-based access

### 3. DATA PERSISTENCE
- **State Management:** localStorage
- **Data yang disimpan:**
  - Current rakaat number (1-23)
  - Selected theme
  - Admin session status
  
- **Reset Logic:**
  - Automatic reset setelah sholat selesai (rakaat 23)
  - Manual reset via admin button

---

## 🛠️ TECH STACK

```
Frontend Framework:    Next.js 14+ (React 18)
Styling:              Tailwind CSS 3.4+
State Management:     React Context + localStorage
Deployment:           Vercel
UI Components:        Headless UI atau shadcn/ui
Fonts:                Geist (Next.js default) atau custom
```

### Why Next.js for Vercel?
✅ Native Vercel integration  
✅ App Router (modern setup)  
✅ Automatic optimization  
✅ Image optimization built-in  
✅ API routes (jika butuh extend later)  
✅ Export static untuk Android Box  

---

## 📁 STRUKTUR DIREKTORI

```
simple-display/
├── .github/
│   ├── copilot-instructions.md
│
├── plan/
│   └── PLANNING_DOKUMEN.md (file ini)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Display public page (/)
│   │   ├── admin/
│   │   │   └── page.tsx            # Admin panel (/admin)
│   │   └── globals.css             # Tailwind imports
│   │
│   ├── components/
│   │   ├── Display/
│   │   │   ├── RakaatDisplay.tsx   # Main display component
│   │   │   └── Clock.tsx           # Real-time clock
│   │   │
│   │   ├── Admin/
│   │   │   ├── PasswordGate.tsx    # Password input component
│   │   │   ├── Controls.tsx        # Next, Reset buttons
│   │   │   └── ThemeSelector.tsx   # Theme dropdown
│   │   │
│   │   └── Theme/
│   │       └── ThemeProvider.tsx   # Context provider
│   │
│   ├── context/
│   │   ├── RakaatContext.tsx       # State management
│   │   └── ThemeContext.tsx        # Theme state
│   │
│   ├── hooks/
│   │   ├── useRakaat.ts            # Custom hook untuk rakaat logic
│   │   ├── useTheme.ts             # Custom hook untuk theme
│   │   └── useLocalStorage.ts      # Custom hook untuk persistent storage
│   │
│   ├── lib/
│   │   ├── themes.ts               # 10 theme definitions
│   │   ├── rakaat-constants.ts     # Rakaat sequence constants
│   │   └── password-utils.ts       # Password validation
│   │
│   └── types/
│       └── index.ts                # TypeScript interfaces
│
├── public/
│   └── favicon.ico
│
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── vercel.json (optional)
└── README.md
```

---

## 🎨 THEME DEFINITIONS

### 10 Theme Palettes (TailwindCSS Colors)
```
1. DARK BLUE       → bg-blue-950, text-blue-100
2. LIGHT BLUE      → bg-blue-50, text-blue-900
3. DARK GREEN      → bg-green-950, text-green-100
4. LIGHT GREEN     → bg-green-50, text-green-900
5. DARK PURPLE     → bg-purple-950, text-purple-100
6. LIGHT PURPLE    → bg-purple-50, text-purple-900
7. DARK ORANGE     → bg-orange-950, text-orange-100
8. DARK RED        → bg-red-950, text-red-100
9. DARK CYAN       → bg-cyan-950, text-cyan-100
10. DARK SLATE     → bg-slate-900, text-slate-100
```

---

## 🔐 SECURITY MODEL

### Admin Access
- **Method:** Password (hash di localStorage)
- **Validation:** Simple MD5/SHA hash (for offline capability)
- **Session:** localStorage token
- **Logout:** Clear token

### Default Password (to be changed by user)
```
admin123 → hash akan disimpan
```

---

## 📊 RAKAAT SEQUENCE

```
Tarawih: 1-20 (2 rakaat → salam → 2 rakaat → salam ... 10x)
Witir:   21-23 (3 rakaat → salam)

Total:   23 rakaat

Display Logic:
- Rakaat 1-20   → "Tarawih #X"
- Rakaat 21-23  → "Witir #(X-20)"
```

---

## 🚀 DEPLOYMENT CHECKLIST (Vercel)

- [ ] `package.json` dengan Next.js 14+
- [ ] `tsconfig.json` configured
- [ ] `tailwind.config.ts` setup
- [ ] Environment variables (.env.local)
- [ ] Build optimization untuk Android Box
- [ ] vercel.json dengan correct region (id-1 untuk Indonesia)

---

## ⚙️ PACKAGE.JSON ESSENTIALS

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 🎯 IMPLEMENTASI PHASES (Untuk Reference)

```
PHASE 1: Setup & Structure
- Initialize Next.js repo
- Setup Tailwind
- Create folder structure
- Setup Context & hooks

PHASE 2: Core Components
- Rakaat Display component
- Clock component
- Admin controls

PHASE 3: Theme System
- Define 10 themes
- Theme provider
- Theme selector UI

PHASE 4: Storage & Logic
- localStorage persistence
- Rakaat state management
- Password auth

PHASE 5: Deployment
- Vercel setup
- Build optimization
- Testing on Android Box

PHASE 6: Polish
- Responsive testing
- Performance optimization
- Bug fixes
```

---

## ✅ DONE CHECKLIST - PLANNING

- [x] Definisi scope detail
- [x] Tech stack rationale
- [x] Struktur folder
- [x] Theme definitions
- [x] Security approach
- [x] Rakaat sequence logic
- [x] Deployment plan

---

## 📝 NEXT STEP

Tunggu instruksi user untuk memulai **implementasi fase 1** (Setup & Structure).
