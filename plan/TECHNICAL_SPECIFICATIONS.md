# 🔧 TECHNICAL SPECIFICATIONS & DATA FLOW

**Document Version:** 1.0  
**Status:** PLANNING  
**Last Updated:** 4 Maret 2026

---

## 1. DATA STRUCTURES & TYPESCRIPT TYPES

### RakaatState
```typescript
interface RakaatState {
  currentRakaat: number;        // 1-23
  isWitir: boolean;             // true jika rakaat > 20
  totalTarawih: number;         // Always 20
  totalWitir: number;           // Always 3
  selectedTheme: 'dark-blue' | 'light-blue' | ... (10 themes);
  adminPassword: string;        // Hashed password
  isAdminLoggedIn: boolean;
}
```

### LocalStorage Schema
```typescript
localStorage = {
  'rakaat-state': JSON.stringify({
    currentRakaat: 1,
    isWitir: false,
    selectedTheme: 'dark-blue',
    adminSessionToken: 'hash_token'
  }),
  'admin-password-hash': 'hashed_value'
}
```

---

## 2. STATE MANAGEMENT FLOW

### Display Page (/)
```
User Views Display
        ↓
[RakaatContext] reads localStorage
        ↓
RakaatDisplay component menerima:
  - currentRakaat (1-23)
  - selectedTheme
  - displayText ("Tarawih #1" atau "Witir #1")
        ↓
Render dengan theme styling
        ↓
Clock component update setiap 1 detik
```

### Admin Page (/admin)
```
User Access /admin
        ↓
[PasswordGate] check localStorage adminSessionToken
        ↓
IF token valid → Show Controls
IF token invalid → Show password input
        ↓
[Controls] component:
  - Button "Next" → increment currentRakaat
  - Button "Reset" → set currentRakaat = 1
        ↓
Update localStorage
        ↓
Display page auto-update via Context listener
```

---

## 3. RAKAAT LOGIC

### Current Rakaat Calculation
```typescript
function getRakaatInfo(number: number) {
  if (number <= 20) {
    return {
      type: 'Tarawih',
      number: number,
      displayText: `Tarawih #${number}`,
      isWitir: false
    };
  } else if (number <= 23) {
    return {
      type: 'Witir',
      number: number - 20,
      displayText: `Witir #${number - 20}`,
      isWitir: true
    };
  }
}

// Example outputs:
getRakaatInfo(1)  → "Tarawih #1"
getRakaatInfo(10) → "Tarawih #10"
getRakaatInfo(20) → "Tarawih #20"
getRakaatInfo(21) → "Witir #1"
getRakaatInfo(23) → "Witir #3"
```

### Next Rakaat Button Logic
```typescript
function handleNextRakaat() {
  setCurrentRakaat(prev => {
    if (prev < 23) {
      return prev + 1;
    } else {
      // Auto reset setelah sholat selesai
      return 1;
    }
  });
  // Persist to localStorage
  saveToLocalStorage();
}
```

---

## 4. THEME SYSTEM

### Theme Object Structure
```typescript
interface Theme {
  id: string;
  name: string;
  bg: string;           // Tailwind class
  text: string;         // Tailwind class
  accent: string;       // Tailwind class untuk accent
  secondary: string;    // Tailwind class untuk secondary
}

const themes: Record<string, Theme> = {
  'dark-blue': {
    id: 'dark-blue',
    name: 'Dark Blue',
    bg: 'bg-blue-950',
    text: 'text-blue-100',
    accent: 'bg-blue-500',
    secondary: 'text-blue-300'
  },
  // ... 9 themes lainnya
};
```

### Theme Persistence
```typescript
localStorage['selected-theme'] = 'dark-blue'

// RakaatDisplay component menggunakan:
const theme = themes[selectedTheme]
return <div className={`${theme.bg} ${theme.text}`}>...
```

---

## 5. PASSWORD AUTHENTICATION

### Admin Access Flow

#### Login (First Time)
```
User access /admin
  ↓
[PasswordGate] check localStorage['admin-session-token']
  ↓
Token not found → Show password input form
  ↓
User input password
  ↓
Validate dengan hash
  ↓
IF correct → Set session token + localStorage
IF incorrect → Show error
```

#### Session Management
```typescript
// Store hashed password
localStorage['admin-password-hash'] = SHA256('admin123')

// Session token
localStorage['admin-session-token'] = JWT_TOKEN_or_SIMPLE_HASH

// Session expiry (optional)
localStorage['admin-session-expiry'] = timestamp
```

#### Logout
```
User click logout
  ↓
Delete localStorage['admin-session-token']
  ↓
Redirect ke /admin (akan minta password lagi)
```

---

## 6. DISPLAY PAGE LAYOUT

### Mobile/Large Screen Layout
```
┌─────────────────────────────┐
│                             │
│      RAKAAT DISPLAY         │
│      ┌───────────────┐      │
│      │  Tarawih #5   │      │
│      │    (22pt)     │      │
│      └───────────────┘      │
│                             │
│      Progress: ██░░░░░░░    │
│      (5 dari 23)            │
│                             │
│  Clock: 21:45:30            │
│  (bottom-left atau right)   │
│                             │
└─────────────────────────────┘
```

### Responsive Breakpoints (Tailwind)
```
Mobile (sm): 640px
Tablet (md): 768px  
Large (lg):  1024px
XL (xl):     1280px

RakaatDisplay font harus scalable:
- Mobile: text-4xl (36pt)
- Tablet: text-5xl (48pt)
- Large:  text-7xl (64pt)
```

---

## 7. ADMIN PAGE LAYOUT

```
┌─────────────────────────────┐
│     ADMIN CONTROL PANEL     │
├─────────────────────────────┤
│                             │
│  Current Rakaat: Tarawih #5 │
│  Progress: ██░░░░░░░        │
│  (5 dari 23)                │
│                             │
│  [ NEXT RAKAAT ]            │
│  [ RESET ALL   ]            │
│                             │
│  Theme: [Select ▼]          │
│         - Dark Blue         │
│         - Light Blue        │
│         - ...               │
│                             │
│  [ LOGOUT ]                 │
│                             │
└─────────────────────────────┘
```

---

## 8. SECURITY CONSIDERATIONS

### Password Storage
```
❌ JANGAN: localStorage['password'] = 'admin123'
✅ LAKUKAN: localStorage['password-hash'] = SHA256_or_MD5('admin123')
```

### Session Token
```
Simple approach (offline-safe):
  - Generate random token on login
  - Store di localStorage
  - Validate on /admin access
  - Clear on logout

Optional enhancement:
  - Add session expiry (1 hour)
  - Validate timestamp
```

### CORS & API Safety
```
✓ Pure client-side (no external API calls)
✓ Data hanya di localStorage
✓ No sensitive data exposed
```

---

## 9. PERFORMANCE OPTIMIZATION

### For Android Box
```
✓ Minimize bundle size
✓ No heavy libraries (already minimal: Tailwind only)
✓ PWA capability (optional)
✓ Service Worker untuk offline (optional)
✓ Lazy-load themes
```

### Clock Update Optimization
```typescript
// Update hanya setiap 1 detik, bukan re-render penuh
useEffect(() => {
  const interval = setInterval(() => {
    setTime(new Date());
  }, 1000);
  return () => clearInterval(interval);
}, []);
```

---

## 10. TESTING CHECKLIST

### Unit Tests (Optional)
- [ ] Rakaat calculation logic
- [ ] Theme selection
- [ ] Password validation
- [ ] localStorage persistence

### Integration Tests
- [ ] Admin → Display sync
- [ ] Theme change reflection
- [ ] Password auth flow
- [ ] Reset logic

### Device Tests
- [ ] Android Box browser (Chrome/Firefox)
- [ ] Touch responsive
- [ ] Landscape/Portrait
- [ ] Network reconnection (PWA)

---

## 11. DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] `npm run build` sukses tanpa error
- [ ] `npm run start` berjalan lancar
- [ ] .env.local dikonfigurasi

### Vercel Deployment
- [ ] Push ke GitHub/GitLab
- [ ] Connect dengan Vercel
- [ ] Set environment variables
- [ ] Configure domain (optional)

### Post-Deployment
- [ ] Test di production URL
- [ ] Test di Android Box connected ke production
- [ ] Monitor Vercel analytics
- [ ] Backup password (simpan di tempat aman)

---

## 📊 FILE SIZE TARGETS

Target bundle size untuk Android Box:
```
HTML: < 50KB
CSS (Tailwind): < 100KB
JS (Next.js + React): < 200KB
Total: < 350KB
```

---

**Dokumen ini adalah reference untuk fase implementasi. Semua detail sudah siap untuk development.**
