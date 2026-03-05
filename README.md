# 🕌 Simple Display — Penampil Tarawih Interaktif

Aplikasi real-time untuk menampilkan jumlah rakaat sholat tarawih di layar TV/projector dengan kontrol admin via web interface. Sempurna untuk masjid, mushala, atau acara ibadah.

![Alt text](https://github.com/dhannyhj/simple-display/blob/main/ss.jpg)


## ✨ Fitur Utama

- **🖥️ Display Layar Besar** — Tampilan full-screen dengan font yang dapat dikustomisasi
- **📱 Admin Panel** — Kontrol dari smartphone/tablet via web interface
- **🔄 Sync Real-time** — Semua device tersinkron otomatis via cloud
- **🎨 15+ Tema** — 8 tema dark + 5 tema light (light-blue, light-green, light-purple, light-orange, light-red, light-cyan, light-slate, light-amber)
- **🖼️ Background Custom** — Solid color, gradient, pattern, atau upload gambar via admin
- **⚙️ Pengaturan Fleksibel**:
  - Jumlah salam tarawih (2–20 salam, default 10)
  - Mode witir: 2+1 rakaat atau 3 rakaat 1 salam
  - Font family, ukuran, bold, italic, underline
- **🔐 Proteksi Password** — Login admin dengan autentikasi SHA-256 (mobile-safe)
- **⛶ Fullscreen** — Tombol fullscreen untuk presentasi maksimal
- **☁️ Upload Gambar** — Upload background langsung dari admin panel ke Vercel Blob (instant, tanpa rebuild)

## 🚀 Deploy ke Vercel

### Prerequisite
- Node.js 18+
- Git
- Akun GitHub & Vercel

### Langkah Deploy

#### 1. **Fork/Clone Repository**
```bash
git clone https://github.com/[your-username]/simple-display.git
cd simple-display
npm install
```

#### 2. **Setup Vercel Project**
```bash
npm install -g vercel
vercel login
vercel --prod --yes
```

> Vercel akan meminta setup project — pilih **Create new project** dan link ke repo.

#### 3. **Setup Redis (Upstash)**
1. Buka [upstash.com](https://upstash.com) → buat database Redis
2. Copy URL & token
3. Di Vercel Dashboard → **Settings** → **Environment Variables**
4. Tambah:
   ```
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=AAbyyyyy...
   ```
5. Redeploy project

#### 4. **Setup Vercel Blob (untuk Image Upload)**
1. Di Vercel Dashboard → Tab **Storage** → **Create Database**
2. Pilih **Blob** → beri nama `simple-display-blob`
3. Vercel auto-add `BLOB_READ_WRITE_TOKEN` env var
4. Redeploy project

#### 5. **Verifikasi**
```bash
vercel env list
# Output harus ada UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, BLOB_READ_WRITE_TOKEN
```

---

## 💻 Penggunaan Aplikasi

### **Display Page** (TV/Projector)
- URL: `https://[project].vercel.app/`
- Tampilkan di layar, auto-fullscreen
- Font size bisa diatur dari admin

### **Admin Panel** (Smartphone/Tablet)
- URL: `https://[project].vercel.app/admin`
- Default password: `admin123`
- Fitur:
  - **Next/Prev/Reset** — Kontrol rakaat
  - **🎨 Pilih Tema** — 15+ tema warna
  - **🖼️ Pilih Background** — solid/gradient/pattern/gambar
  - **🔤 Pengaturan Font** — family, ukuran, B/I/U
  - **🕌 Pengaturan Sholat** — jumlah tarawih, mode witir
  - **🔑 Ganti Password** — ubah password login
  - **📷 Upload Gambar** — upload background baru (Vercel Blob)

### **Keyboard Shortcuts** (Admin Panel)
- `Space` atau `→` — Next rakaat
- `←` — Prev rakaat

---

## 📁 Project Structure

```
simple-display/
│
├── src/
│   ├── app/
│   │   ├── page.tsx              # Display page (TV)
│   │   ├── admin/
│   │   │   └── page.tsx          # Admin panel
│   │   └── api/
│   │       ├── state/route.ts    # Sync state (Redis)
│   │       ├── images/route.ts   # List images (local + Blob)
│   │       └── upload/route.ts   # Upload to Vercel Blob
│   │
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── Controls.tsx
│   │   │   ├── ThemeSelector.tsx
│   │   │   ├── FontSelector.tsx
│   │   │   ├── SholatSettings.tsx
│   │   │   ├── ChangePasswordForm.tsx
│   │   │   └── PasswordGate.tsx
│   │   └── Display/
│   │       ├── RakaatDisplay.tsx
│   │       └── Clock.tsx
│   │
│   ├── context/
│   │   └── AppContext.tsx        # Global state management
│   │
│   ├── hooks/
│   │   ├── useRakaat.ts
│   │   ├── useTheme.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── lib/
│   │   ├── themes.ts
│   │   ├── backgrounds.ts
│   │   ├── rakaat-constants.ts
│   │   ├── password-utils.ts
│   │   ├── kv-store.ts
│   │   └── colors.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── styles/
│       └── globals.css
│
├── public/
│   ├── img/                       # Background images (lokal)
│   └── fonts/
│
├── .env.example                   # Template env vars
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── package.json
```

---

## 🔧 Dev Setup (Local)

```bash
npm install
npm run dev
# Buka http://localhost:3000 (Display)
# Buka http://localhost:3000/admin (Admin Panel)
```

### Build
```bash
npm run build
npm start
```

---

## 🔐 Password & Auth

- **Default Password:** `admin123`
- **Storage:** Browser localStorage (SHA-256 hash)
- **Session:** 8 jam, auto-logout
- **Change Password:** Admin Panel → **🔑 Ganti Password**

---

## 🎨 Customization

### Tambah Tema Baru
Edit `src/lib/themes.ts`:
```typescript
'light-gold': {
  id: 'light-gold',
  name: 'Light Gold',
  emoji: '✨',
  bg: 'bg-yellow-50',
  bgSecondary: 'bg-yellow-100',
  text: 'text-yellow-950',
  textSecondary: 'text-yellow-700',
  accent: 'text-yellow-600',
  accentBg: 'bg-yellow-500',
  border: 'border-yellow-300',
  progressTrack: 'bg-yellow-200',
  cardBg: 'bg-yellow-100',
}
```

### Tambah Background Tipe Baru
Edit `src/lib/backgrounds.ts`:
```typescript
{
  id: 'pattern-wave',
  name: 'Wave',
  value: 'wave',
  type: 'pattern',
  preview: 'bg-gradient-to-b',
}
```

---

## 📊 Tech Stack

- **Frontend:** Next.js 15, React, TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context
- **Database:** Upstash Redis (KV store)
- **Storage:** Vercel Blob (image CDN)
- **Auth:** Pure JS SHA-256
- **Deployment:** Vercel

---

## 🐛 Troubleshooting

### **Background tidak berubah**
- Pastikan `UPSTASH_REDIS_REST_TOKEN` & URL valid
- Check `/api/state` response (inspect Network tab)

### **Upload gambar error**
- Pastikan Vercel Blob sudah activated
- File size < 5 MB
- Format: JPG, PNG, GIF, WEBP, AVIF, SVG

### **Password tidak bisa login**
- Clear localStorage: `localStorage.clear()` (console)
- Reset password ke `admin123` (default)

### **Tema light warna tidak muncul**
- Clear browser cache
- Hard refresh: `Ctrl+Shift+R` / `Cmd+Shift+R`

---

## 📄 License

MIT — Bebas gunakan untuk keperluan apapun.

---

## 💬 Support

Untuk pertanyaan atau issue:
1. Buka GitHub Issues: https://github.com/[your-username]/simple-display/issues
2. Jelaskan error/fitur yang diinginkan

---

**Happy deploying! 🚀**
