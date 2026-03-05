# 🕌 Simple Display — Penampil Tarawih Interaktif

Aplikasi real-time untuk menampilkan jumlah rakaat sholat tarawih di layar TV/projector dengan kontrol admin via web interface. Sempurna untuk masjid, mushala, atau acara ibadah.

![Alt text](https://github.com/dhannyhj/simple-display/blob/main/ss.jpg)


## ✨ Fitur Utama

- **🖥️ Display Layar Besar** — Tampilan full-screen dengan font yang dapat dikustomisasi
- **📱 Admin Panel** — Kontrol dari smartphone/tablet via web interface
- **🔄 Sync Real-time** — Semua device tersinkron otomatis via cloud
- **🎨 15+ Tema** — 8 tema dark + 5+ tema light (light-blue, light-green, light-purple, light-orange, light-red, light-cyan, light-slate, light-amber)
- **🖼️ Background Custom** — Solid color, 6 gradient presets, 2 pattern types, atau upload gambar via admin
- **⚙️ Pengaturan Fleksibel**:
  - Jumlah salam tarawih (2–20 salam, default 10)
  - Mode witir: 2+1 rakaat atau 3 rakaat 1 salam
  - Font family, ukuran (50-200%), bold, italic, underline
- **🔐 Proteksi Password** — Login admin dengan autentikasi SHA-256 (mobile-safe)
- **⛶ Fullscreen** — Tombol fullscreen untuk presentasi maksimal
- **☁️ Upload Gambar** — Upload background langsung dari admin panel ke Vercel Blob (instant, tanpa rebuild)
- **📺 Optimasi TV Box Android 5.1+** — Auto-detect environment, retry logic dengan exponential backoff, adaptive polling, loading UI dengan timeout detection (3-8 detik)

## 🚀 Deploy ke Vercel

### Prerequisite
- Node.js 18+
- Git
- Akun GitHub & Vercel

### Langkah Deploy

#### 1. **Fork/Clone Repository**
```bash
git clone https://github.com/dhannyhj/simple-display.git
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

## 🔄 Metode Deployment

Ada **2 pilihan** untuk deploy aplikasi:

### **Method A: Vercel + GitHub (Auto-Deploy) — RECOMMENDED ⭐**

*Deployment otomatis setiap kali push ke GitHub, no manual intervention.*

#### Setup

1. **Link Repository ke Vercel**
   - Buka [vercel.com](https://vercel.com) → Login → **Add New** → **Project**
   - Pilih **GitHub** dan authorize Vercel
   - Pilih repository `simple-display`
   - Vercel otomatis detect Next.js framework

2. **Configure Environment Variables**
   - Di Vercel Dashboard → Project → **Settings** → **Environment Variables**
   - Tambah 3 variables:
     ```
     UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
     UPSTASH_REDIS_REST_TOKEN=AAbyyyyy...
     BLOB_READ_WRITE_TOKEN=xxx...
     ```
   - Save & Redeploy

3. **Enable Auto-Deploy**
   - Di Vercel Dashboard → **Deployments** → **Settings**
   - Production Branch: `main` (should be auto-selected)
   - Preview Deployments: Automatic (untuk setiap PR)
   - **Save**

#### Workflow

Setiap kali push ke GitHub:
```bash
# Local development
npm run dev
# ..edit files...

# Commit & push
git add -A
git commit -m "feat: new feature"
git push origin main  # Vercel auto-trigger build & deploy
```

**Vercel akan:**
- Detect push ke main branch
- Auto-deploy ke production dalam 1-2 menit
- Send notification jika build success/failed
- URL tetap: `https://simple-display-xxx.vercel.app`

---

### **Method B: VPS Manual (Self-Hosted) — For Advanced Users**

*Deploy di VPS pribadi (AWS, DigitalOcean, Linode, etc.) dengan full control.*

#### Prerequisites

- VPS dengan OS: Ubuntu 20.04+ atau CentOS 8+
- SSH access ke VPS
- Domain (optional, atau pakai IP address)
- Node.js 18+ di VPS

#### Step 1: Setup VPS Environment

```bash
# SSH ke VPS
ssh root@your-vps-ip

# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Node.js (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verifikasi
node --version  # v20.x.x
npm --version   # 10.x.x

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### Step 2: Clone & Setup Repository

```bash
# Navigate ke app directory
cd /var/www

# Clone repo
git clone https://github.com/dhannyhj/simple-display.git
cd simple-display

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AAbyyyyy...
BLOB_READ_WRITE_TOKEN=xxx...
NODE_ENV=production
EOF

# Build aplikasi
npm run build
```

#### Step 3: Configure PM2 Startup

```bash
# Start aplikasi dengan PM2
pm2 start npm --name "simple-display" -- start

# Save PM2 config
pm2 save

# Setup PM2 auto-restart on reboot
pm2 startup
# Follow the command output to enable auto-restart
sudo pm2 startup
```

#### Step 4: Setup Reverse Proxy (Nginx)

```bash
# Install Nginx
sudo apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/simple-display
```

Paste ini:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Ganti dengan domain atau IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable config
sudo ln -s /etc/nginx/sites-available/simple-display /etc/nginx/sites-enabled/

# Test Nginx
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Step 5: Setup SSL (HTTPS) dengan Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renew setup
sudo systemctl enable certbot.timer
```

#### Step 6: Update Aplikasi dari GitHub

Buat script untuk sync dari GitHub:

```bash
# Create update script
cat > /var/www/simple-display/update.sh << 'EOF'
#!/bin/bash
cd /var/www/simple-display
git pull origin main
npm install
npm run build
pm2 restart simple-display
echo "✅ Update completed at $(date)"
EOF

# Make executable
chmod +x /var/www/simple-display/update.sh
```

Jalankan manual atau setup cron:
```bash
# Edit crontab
crontab -e

# Add this line untuk update setiap 30 menit
*/30 * * * * /var/www/simple-display/update.sh >> /var/www/simple-display/update.log 2>&1
```

#### Step 7: Monitoring & Logs

```bash
# Monitor PM2 processes
pm2 monit

# View application logs
pm2 logs simple-display

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

#### Troubleshooting VPS

**Port 3000 in use:**
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

**PM2 won't start:**
```bash
pm2 delete simple-display
pm2 start npm --name "simple-display" -- start
```

**Nginx not proxying:**
```bash
sudo nginx -t  # Check syntax
sudo systemctl restart nginx
```

---

### **Perbandingan: Vercel vs VPS**

| Feature | Vercel (Method A) | VPS (Method B) |
|---------|------------------|----------------|
| **Setup** | ⚡ 5 menit | ⏱️ 30-60 menit |
| **Auto-Deploy** | ✅ Yes | ⚠️ Manual/Cron |
| **Cost** | 💰 Free tier + $20/mo | 💰 $5-20/mo VPS |
| **Scaling** | 🚀 Auto | 📦 Manual |
| **Monitoring** | ✅ Built-in | ⚠️ DIY tools |
| **SSL Certificate** | ✅ Free auto | ✅ Free (Let's Encrypt) |
| **Maintenance** | Vercel handles | You handle |
| **Customization** | Limited | Full control |

**Rekomendasi:**
- **Vercel** → Best untuk production, minimal maintenance, hobby projects
- **VPS** → Best untuk full control, custom configuration, budget-conscious

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
│   │       ├── LoadingFallback.tsx    # TV Box loading UI (timeout detection)
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
│   │   ├── colors.ts
│   │   ├── feature-detect.ts     # Deteksi environment (TV Box, polling interval)
│   │   └── api-client.ts         # Retry logic dengan exponential backoff
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

- **Frontend:** Next.js 15.5.12, React 18.3.1, TypeScript 5
- **Styling:** Tailwind CSS 3.4.4
- **State Management:** React Context
- **Database:** Upstash Redis (KV store)
- **Storage:** Vercel Blob (image CDN)
- **Auth:** Pure JS SHA-256
- **Deployment:** Vercel (manual CLI: `vercel --prod --yes`)
- **Platform Target:** ES5 (Chrome 95+, Android 5.1+)

---

## 📺 Platform Compatibility & TV Box Optimization

### Supported Devices
- ✅ Desktop Chrome/Firefox/Safari (modern browsers)
- ✅ Mobile Chrome/Safari (iOS 12+, Android 6+)
- ✅ **TV Box Android 5.1** (Chrome 95) — Fully optimized with:
  - **LoadingFallback UI** — Interactive spinner (0-3s) → "Memeriksa koneksi..." (3-8s) → timeout fallback (8s+)
  - **Retry Logic** — 3 retries dengan exponential backoff (1-2-4s delays), per-request 5s timeout
  - **Adaptive Polling** — 5s untuk TV Box, 3s untuk normal devices
  - **localStorage Fallback** — Cache rakaat count untuk offline display
  - **Smart Feature Detection** — Auto-detect Android 5.x atau missing ServiceWorker/Caches API

### Jika Aplikasi Hang di TV Box
1. **Tunggu Loading UI** — Spinner akan tampil 0-3 detik
2. **Lihat Status** — "Memeriksa koneksi..." akan muncul 3-8 detik (koneksi sedang di-retry)
3. **Jika Timeout (8s+)** — App otomatis menampilkan cached rakaat dari session terakhir + reload button
4. **Refresh Koneksi** — Klik reload button di timeout UI untuk retry dengan koneksi baru
5. **Check Internet** — Pastikan TV Box terhubung dengan stabil ke internet

### Production URL
🚀 **Live:** https://simple-display-kgvivp5c7-dhannyhj.vercel.app (Commit: `7ba25f2`)

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

### **TV Box / Slow Devices**

#### "Aplikasi blank screen atau loading lama"
- **Normal behavior 0-8 detik** — LoadingFallback UI menunjukkan spinner & status
- **Tunggu sampai 8 detik** — System akan menampilkan cached rakaat jika timeout
- **Improved retry logic** — Automatic 3 retries dengan backoff 1s, 2s, 4s (handled internally)

#### "Timeout UI muncul terus-menerus"
- Cek koneksi internet TV Box (ping google.com dari TV Box)
- Restart Wi-Fi router jika signal lemah
- Pastikan Vercel app up-to-date (check commit `7ba25f2`)

#### "Display tidak sync dengan Admin Panel"
- Polling interval 5s untuk TV Box (vs 3s normal)
- Tekan Next/Prev di admin panel lagi jika tidak sync
- Check network latency (dev tools → Network tab)

#### "Cache rakaat tidak update setelah refresh"
- Cache auto-update setiap successful sync ke server
- Offline display hanya menampilkan last-known value sampai internet kembali

---

## 📄 License

MIT — Bebas gunakan untuk keperluan apapun.

---

## 💬 Support

Untuk pertanyaan atau issue:
1. Buka GitHub Issues: https://github.com/dhannyhj/simple-display/issues
2. Jelaskan error/fitur yang diinginkan

---

**Happy deploying! 🚀**
