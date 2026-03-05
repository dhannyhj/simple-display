# 📦 REPO SETUP CHECKLIST

**Status:** PRE-IMPLEMENTATION  
**Tujuan:** Daftar file & konfigurasi yang diperlukan untuk initialize project

---

## 🚀 INITIALIZATION STEPS (Sebelum implementasi)

### 1. ROOT CONFIG FILES
- [ ] `package.json` - Next.js + Tailwind dependencies
- [ ] `tsconfig.json` - TypeScript configuration
- [ ] `next.config.js` - Next.js configuration
- [ ] `tailwind.config.ts` - Tailwind CSS configuration
- [ ] `postcss.config.js` - PostCSS configuration
- [ ] `.gitignore` - Git ignore patterns

### 2. ENV & DEPLOYMENT
- [ ] `.env.local` (template) - Environment variables
- [ ] `vercel.json` - Vercel deployment config
- [ ] `.env.example` - Example environment variables

### 3. SRC FOLDER STRUCTURE
- [ ] `src/app/layout.tsx` - Root layout dengan Tailwind globals
- [ ] `src/app/globals.css` - Tailwind base styles
- [ ] `src/app/page.tsx` - Display page (public)
- [ ] `src/app/admin/page.tsx` - Admin page (protected)

### 4. COMPONENTS
- [ ] `src/components/Display/RakaatDisplay.tsx`
- [ ] `src/components/Display/Clock.tsx`
- [ ] `src/components/Admin/PasswordGate.tsx`
- [ ] `src/components/Admin/Controls.tsx`
- [ ] `src/components/Admin/ThemeSelector.tsx`

### 5. CONTEXT & HOOKS
- [ ] `src/context/RakaatContext.tsx` - State management
- [ ] `src/context/ThemeContext.tsx` - Theme management
- [ ] `src/hooks/useRakaat.ts` - Custom hook
- [ ] `src/hooks/useTheme.ts` - Custom hook
- [ ] `src/hooks/useLocalStorage.ts` - Custom hook

### 6. LIBRARY & UTILS
- [ ] `src/lib/themes.ts` - 10 theme definitions
- [ ] `src/lib/rakaat-constants.ts` - Rakaat logic constants
- [ ] `src/lib/password-utils.ts` - Password validation helper

### 7. TYPES
- [ ] `src/types/index.ts` - TypeScript interfaces

### 8. PUBLIC & DOCUMENTATION
- [ ] `public/favicon.ico` (atau custom)
- [ ] `README.md` - Project documentation

---

## 📋 FILE DEPENDENCIES ORDER

**Implementasi harus mengikuti urutan ini:**

1. **Config Files** (package.json, tsconfig, tailwind, postcss, next.config)
   ↓
2. **Types** (src/types/index.ts) - semua components depend ini
   ↓
3. **Context** (RakaatContext, ThemeContext) - components depend ini
   ↓
4. **Hooks** (useRakaat, useTheme, useLocalStorage) - depend context
   ↓
5. **Lib/Utils** (themes.ts, rakaat-constants.ts, password-utils.ts)
   ↓
6. **Components** (Display, Admin, Theme components)
   ↓
7. **App Pages** (layout.tsx, page.tsx, admin/page.tsx) - depend components
   ↓
8. **Documentation & Deployment** (README, vercel.json)

---

## 🔧 COMMAND REFERENCE

### Setup Next.js Project
```bash
npx create-next-app@latest simple-display --typescript --tailwind --eslint
```

### Manual Setup Alternative
```bash
npm install next@latest react@latest react-dom@latest
npm install -D tailwindcss postcss autoprefixer typescript @types/react @types/node
npx tailwindcss init -p
```

### Build & Deploy Commands
```bash
npm run dev          # Development
npm run build        # Production build
npm run start        # Production server
npm run lint         # Linting
```

---

## 📍 DEPLOYMENT TARGETS

### Vercel Setup
```
Region: Auto (or asia-jakarta for Indonesia latency)
Framework: Next.js
Build Command: next build
Start Command: next start
```

### Android Box Access
```
URL: https://[your-vercel-domain].vercel.app
Local IP: http://[local-network-ip]:3000 (jika run locally)
```

---

## ⚠️ IMPORTANT NOTES

1. **No Database Required** ✓ (Pure client-side)
2. **LocalStorage Persistence** ✓ (Rakaat state + theme + session)
3. **Password Protection** ✓ (localStorage hash validation)
4. **10 Themes** ✓ (Tailwind color palettes)
5. **Mobile Responsive** ✓ (Android Box browser)

---

## ✅ REPO READY CHECKLIST

Setelah semua file tersedia, project siap untuk:
- [ ] Local testing (`npm run dev`)
- [ ] Build verification (`npm run build`)
- [ ] Deployment ke Vercel
- [ ] Testing di Android Box browser

---

**Ready untuk Phase 1 implementation?**
