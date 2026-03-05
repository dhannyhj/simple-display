# 📱 TV DISPLAY OPTIMIZATION: ANDROID 5.1 + CHROME 95

**Status**: 🔴 PLANNING (Phase 1 readiness)  
**Created**: 2026-03-05  
**Target Hardware**: Android 5.1.1 (Lollipop) TV Box + Chrome 95 (2021)  
**Problem**: Page loading → stuck/hang (tidak responsive)

---

## 📋 EXECUTIVE SUMMARY

### Problem Statement
When Simple Display (Next.js 15) loads on TV Box (Android 5.1 + Chrome 95), page hangs indefinitely. Root causes:

| Issue | Impact | Priority |
|-------|--------|----------|
| ES6+ bundle (100%+ larger for ES5 compatibility) | RAM overflow (~256-512MB device) | 🔴 CRITICAL |
| No ES5 target, no polyfill | Chrome 95 (2021) cannot parse syntax | 🔴 CRITICAL |
| No timeout detection, no fallback UI | User stuck 5+ min, no feedback | 🔴 CRITICAL |
| No network retry, no cache | Single network hiccup = timeout | 🟠 HIGH |
| Modern APIs (IndexedDB, Service Workers) | Features not supported unsupported | 🟡 MEDIUM |

### Success Criteria
- ✅ Page loads in < 5 seconds on TV Box Android 5.1 (3G network)
- ✅ User sees spinner for first 3s, then content or helpful error message
- ✅ Reload button available if connection fails
- ✅ Last-known rakaat count cached in localStorage for instant fallback
- ✅ TypeScript build clean, bundle size < 200KB (combined JS chunks)
- ✅ No use of ES6+ features post-build (target ES5)

---

## 🗺️ SOLUTION ROADMAP (3 PHASES)

### Phase 1: IMMEDIATE - Bundle Optimization + Timeout UI
**Objective**: Solve 80% of hang issue through TL33 (bundle) + UX (feedback)  
**Effort**: MEDIUM  
**Impact**: HIGH  
**Blocking**: Must complete before Phase 2

#### 1.1 Next.js Configuration (ES5 Target)
```typescript
// next.config.js
const nextConfig = {
  swcMinify: true, // Already default in Next.js 15
  // Add ES5 target for SWC compiler
  swcOptions: {
    jsc: {
      target: 'es5', // Target ES5 (Chrome 95 compatible)
      loose: true,   // Loose mode = smaller output
    }
  },
  // Optimize static exports
  staticPageGenerationTimeout: 120,
}
```

**Why**: Next.js 15 uses SWC by default, but outputs ES6+ syntax. Need explicit ES5 target to ensure Chrome 95 compatibility.

#### 1.2 Bundle Size Analysis
**Steps**:
1. Run `npm run build`
2. Analyze: `du -sh .next/`
3. Check chunks: `ls -lah .next/static/chunks/` (should be < 200KB total)
4. If > 250KB: identify unused deps

**Current Status**: TBD (need to profile)

**Candidates to remove** (if found):
- Redux (not using)
- GraphQL client (not using)
- axios (use fetch instead)
- moment.js (use date-fns instead)

#### 1.3 LoadingFallback Component
**File**: `src/components/Display/LoadingFallback.tsx`

**Behavior**:
```
Time: 0-3s   → Spinner + "Memuat..." + no action
Time: 3-5s   → Spinner + "Memeriksa koneksi..." + no action
Time: 5s+    → "Koneksi Timeout" + Reload button + fallback display
```

**Features**:
- Store last-known rakaat state in `localStorage('rakaat_fallback')`
- On timeout: show cached value + "Offline Mode" badge
- Reload button: clear cache + retry

**Implementation**:
```typescript
const [loadingState, setLoadingState] = useState('loading') // loading → checking → timeout
const [timeElapsed, setTimeElapsed] = useState(0)

useEffect(() => {
  const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000)
  return () => clearInterval(timer)
}, [])

const getFallbackUI = () => {
  if (timeElapsed < 3) return <Spinner text="Memuat..." />
  if (timeElapsed < 5) return <Spinner text="Memeriksa koneksi..." />
  if (timeElapsed >= 5) return <TimeoutUI fallback={getCachedRakaat()} />
}
```

#### 1.4 Wrap Display with Suspense
**File**: `src/app/page.tsx`

```typescript
import { Suspense } from 'react'
import LoadingFallback from '@/components/Display/LoadingFallback'
import RakaatDisplay from '@/components/Display/RakaatDisplay'

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RakaatDisplay />
    </Suspense>
  )
}
```

#### 1.5 Validation Checklist
- [ ] `npx tsc --noEmit` passes (no TS errors)
- [ ] `npm run build` succeeds without warnings
- [ ] `.next/static/chunks/` total < 200KB
- [ ] `wget https://simple-display-*.vercel.app -O /tmp/index.html && wc -c /tmp/index.html`
  - HTML size < 50KB (no inline JS)
- [ ] Test locally: `npm run prod` (next start)
  - Open Chrome DevTools → Disable JS (to confirm HTML loads)
  - Enable Network → Throttle to 3G Slow, reload
  - Verify: spinner visible by 0.5s, content by 3-5s

---

### Phase 2: NETWORK RESILIENCE - Cache + Retry + Fallback
**Objective**: Handle network slowness / flaky connections  
**Effort**: MEDIUM  
**Impact**: MEDIUM  
**Blocked By**: Phase 1  
**Start After**: Phase 1 tested on TV Box

#### 2.1 Service Worker (Optional)
**Decision**: Only if Phase 1 + Phase 2.2 still insufficient

**If Needed**:
```typescript
// public/sw.js (edge case, TV Box may not support)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/',
        '/favicon.ico',
        // CSS/fonts only, NO heavy JS
      ])
    })
  )
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  
  e.respondWith(
    fetch(e.request)
      .then(r => {
        caches.open('v1').then(c => c.put(e.request, r.clone()))
        return r
      })
      .catch(() => caches.match(e.request))
  )
})
```

**Caveat**: Service Workers partially supported in Chrome 95, avoid if Phase 2.2 works.

#### 2.2 API Retry Logic
**File**: `src/lib/api-client.ts`

```typescript
async function fetchWithRetry(url: string, options: {retries?: number, timeout?: number} = {}) {
  const {retries = 3, timeout = 3000} = options
  
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      
      const res = await fetch(url, {signal: controller.signal})
      clearTimeout(timeoutId)
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (e) {
      const waitMs = 1000 * Math.pow(2, i) // 1s, 2s, 4s
      if (i < retries - 1) {
        console.warn(`Retry ${i+1}/${retries} after ${waitMs}ms`, e)
        await new Promise(r => setTimeout(r, waitMs))
      } else {
        throw e
      }
    }
  }
}

// Usage
const rakaat = await fetchWithRetry('/api/rakaat', {retries: 3, timeout: 3000})
```

#### 2.3 Fallback HTML / Static Display
**File**: `public/fallback.html` (pure static, no JS)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Simple Display</title>
  <style>
    body { background: #000; color: #fff; font: 80px Arial; text-align: center; padding: 50px; }
    .rakaat { display: flex; gap: 30px; justify-content: center; }
    .rakaat div { border: 3px solid yellow; padding: 30px; width: 150px; }
  </style>
</head>
<body>
  <h1>RAKAAT TARAWIH</h1>
  <div class="rakaat">
    <div role="status" aria-label="Rakaat count" id="count">01</div>
  </div>
  <p style="font-size: 30px; margin-top: 50px;">Terakhir diperbarui: <span id="time">--:--</span></p>
  <button onclick="location.reload()" style="font-size: 40px; padding: 20px; margin-top: 30px;">Muat Ulang</button>
  <script>
    // Fallback: show last-known value from localStorage
    const stored = localStorage.getItem('rakaat_fallback')
    if (stored) {
      try {
        const {count, timestamp} = JSON.parse(stored)
        document.getElementById('count').textContent = String(count).padStart(2, '0')
        document.getElementById('time').textContent = new Date(timestamp).toLocaleTimeString()
      } catch (e) {}
    }
  </script>
</body>
</html>
```

---

### Phase 3: TV-SPECIFIC FEATURES - OS Detection + Polling
**Objective**: Gracefully handle TV Box API limitations  
**Effort**: LOW  
**Impact**: LOW-MEDIUM  
**Blocked By**: Phase 1  
**Start After**: Phase 1 tested

#### 3.1 Feature Detection
**File**: `src/lib/feature-detect.ts`

```typescript
export function isTVBoxEnvironment(): boolean {
  // Detect: Android 5.x, limited browser
  return !('serviceWorker' in navigator) ||
         !('caches' in window) ||
         !('indexedDB' in window) ||
         navigator.userAgent.match(/Android [1-6]/i) !== null
}

export function getPlatformProfile() {
  return {
    isTVBox: isTVBoxEnvironment(),
    hasServiceWorker: 'serviceWorker' in navigator,
    hasCaches: 'caches' in window,
    hasIndexedDB: 'indexedDB' in window,
    hasLocalStorage: typeof localStorage !== 'undefined',
  }
}
```

#### 3.2 Disable Heavy APIs
**File**: `src/context/AppContext.tsx`

```typescript
if (isTVBoxEnvironment()) {
  // Disable real-time listeners
  // Use polling instead: fetch every 5s (not 1s)
  // Use localStorage instead of sessionStorage
  
  // Pseudo-code
  if (typeof window !== 'undefined' && !('caches' in window)) {
    console.info('[TV Box Mode] Caches API unavailable, using localStorage only')
  }
}
```

#### 3.3 Polling Rate Adjustment
**File**: `src/hooks/useRakaatUpdates.ts` (if created)

```typescript
const POLLING_INTERVAL_TV = 5000  // 5s for TV Box
const POLLING_INTERVAL_NORMAL = 1000 // 1s for normal browsers

const interval = isTVBoxEnvironment() ? POLLING_INTERVAL_TV : POLLING_INTERVAL_NORMAL
```

---

## 🧪 TESTING STRATEGY

### Pre-Deploy (Local Development)

#### Test 1: Bundle Size Check
```bash
npm run build
du -sh .next/
ls -lah .next/static/chunks/
# Expected: < 200KB total chunks
```

#### Test 2: Chrome Emulation (Local)
1. Chrome DevTools → Device Emulation → "Android 5.1" preset
2. Network Tab → Throttle to "3G Slow"
3. Disable JavaScript temporarily → reload → confirm HTML loads
4. Re-enable JS → measure load time
5. Verify: spinner visible, content by 5s

#### Test 3: TypeScript Build
```bash
npx tsc --noEmit
# Should: 0 errors
```

### On-Device Testing (TV Box)

#### Test 4: Production Load Test
```bash
# Measure via console
Date.now() → start
// Click reload
// Wait for content visible
Date.now() → end time
// Target: < 5 seconds
```

#### Test 5: Network Failure Simulation
1. Pause network in TV Chrome DevTools (if supported)
2. Refresh page
3. Should: show timeout message + fallback UI
4. Reload button should work

#### Test 6: Memory Profile
1. Chrome DevTools → Memory
2. Take heap snapshot before load
3. Load page (wait 10s)
4. Take heap snapshot after
5. Check: Delta < 50MB (TV Box typically 256-512MB)

### Post-Deploy Monitoring

#### Vercel Analytics
- Core Web Vitals (LCP, FID, CLS)
- Error rate (check for JS parsing errors)
- 404/500 rates on API endpoints

---

## 📊 SUCCESS METRICS

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Load Time (TV Box 3G) | < 5s | TBD | ⏳ TBD |
| First Interaction (Spinner visible) | < 0.5s | TBD | ⏳ TBD |
| Bundle Size (total JS chunks) | < 200KB | TBD | ⏳ TBD |
| Memory Delta | < 50MB | TBD | ⏳ TBD |
| Chrome 95 ES5 Compatibility | 100% | TBD | ⏳ TBD |
| TypeScript Errors | 0 | 0 | ✅ OK |
| Network Retry Success Rate | > 95% | TBD | ⏳ TBD |

---

## 🎯 IMPLEMENTATION ORDER (PHASE 1)

1. **Day 1 AM**: Edit next.config.js → add ES5 target
2. **Day 1 PM**: Analyze bundle size, create LoadingFallback.tsx
3. **Day 2 AM**: Integrate Suspense + LoadingFallback into Display page
4. **Day 2 PM**: Type check + local test (emulated Android 5.1)
5. **Day 3 AM**: Deploy to Vercel production
6. **Day 3 PM**: Test on actual TV Box, measure metrics
7. **Day 4**: Fix any issues, iterate Phase 2 decision

---

## 🚧 RISKS & MITIGATIONS

| Risk | Likelihood | Severity | Mitigation |
|------|------------|----------|-----------|
| ES5 target still too large | MEDIUM | HIGH | Phase 2: tree-shake unused deps |
| LoadingFallback itself slow | LOW | MEDIUM | Render as HTML string, not JSX |
| localStorage not available on TV | LOW | MEDIUM | Check: typeof localStorage !== 'undefined' |
| Chrome 95 doesn't support target:es5 | LOW | CRITICAL | Fallback: use @babel/preset-env |
| Network retry burns battery (polling) | MEDIUM | LOW | Limit retries to 3, ignore offline |

---

## 📝 NOTES

- **Do NOT start Phase 2/3** until Phase 1 is tested on actual TV Box
- **Do NOT add new dependencies** without explicit approval
- **Keep localStorage usage minimal** (TV Box storage may be limited)
- **Avoid IndexedDB / WebWorker APIs** (low browser support on Android 5)
- **Test with real 3G/4G network**, not WiFi (TV Box may be on cellular hotspot)

---

## ✅ CHECKLIST BEFORE PHASE 2

- [ ] Phase 1 deployed to production
- [ ] Page loads in < 5s on TV Box (measured 3+ times)
- [ ] Spinner visible by 0.5s
- [ ] Timeout message + fallback UI working
- [ ] localStorage cache persisting last-known value
- [ ] TypeScript errors: 0
- [ ] Vercel Analytics shows no JS parsing errors
- [ ] Bundle size < 200KB (confirmed)
- [ ] Chrome DevTools emulation test passes (Android 5.1 + 3G)

---

**Status**: 🔴 PLANNING - Ready for Phase 1 implementation approval
