# Newton Tech - PDF Rapor Sistemi

Kurumsal destek kayıt yönetimi için SAP tarzı profesyonel PDF raporları oluşturan sistem.

## Özellikler

✅ **SAP Tarzı Tasarım** - Minimal ve kurumsal görünüm  
✅ **Kompakt PDF** - 124KB boyutunda optimize dosyalar  
✅ **Türkçe Karakter** - Tam Unicode desteği  
✅ **Newton Tech Branding** - Mavi N logosu entegre  
✅ **Tablo Bazlı Layout** - Profesyonel veri sunumu  
✅ **REST API** - Kolay entegrasyon
✅ **Railway Ready** - Production deploy hazır

## 🚀 **Deployment Seçenekleri**

### 1️⃣ **Railway (ÖNERİLEN)** 
**Hobby Plan: $5/ay** - En kolay çözüm

```bash
# 1. Railway Hobby Plan'a upgrade yap ($5/ay)
# 2. GitHub'a push yap
git add .
git commit -m "Railway deployment ready"  
git push origin main

# 3. Railway'e git: https://railway.app/dashboard
# 4. "New Project" > "Deploy from GitHub repo" > pdf-yarat seç
```

### 2️⃣ **Render (ÜCRETSİZ!)** 
**0 maliyet** - Yavaş ama bedava

```bash
# 1. GitHub'a push yap
git add .
git commit -m "Render deployment ready"
git push origin main

# 2. Render'a git: https://render.com
# 3. "New Web Service" > GitHub repo bağla  
# 4. Build Command: npm install
# 5. Start Command: npm run server
```

### 3️⃣ **Docker Self-Host**
**VDS/VPS gerekli** - Tam kontrol

```bash
# Docker Build & Run
docker build -t pdf-yarat .
docker run -p 3001:3000 pdf-yarat

# Ya da Docker Compose
docker-compose up -d
```

### Environment Variables
Tüm platformlar için:
```
NODE_ENV=production
PORT=3000 (otomatik ayarlanır)
```

### 3. Domain Ayarları
```bash
# Railway dashboard'da
Settings > Domains > Generate Domain
# Örnek: pdf-newton-tech-production.up.railway.app
```

## Kurulum

### Yerel Geliştirme
```bash
npm install
npm start  # Test PDF oluştur
npm run server  # API server başlat
```

### API Server (Önerilen)

```bash
npm run server
```

## 🌐 Production URL

**API Base URL**: `https://pdf.newtontech.com.tr`

Server başladıktan sonra:

#### PDF Oluşturma
```bash
# Railway/Render için
curl -X POST https://your-railway-url.up.railway.app/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d @sample-data.json

# Docker self-host için
curl -X POST https://pdf.newtontech.com.tr/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d @sample-data.json
```

#### Health Check
```bash
# Railway/Render için
curl https://your-railway-url.up.railway.app/health

# Docker self-host için
curl https://pdf.newtontech.com.tr/health
```

#### Örnek Veri Alma
```bash
curl https://pdf.newtontech.com.tr/api/sample-data
```

#### Template Listesi
```bash
curl https://pdf.newtontech.com.tr/api/templates
```

### Programmatic Kullanım

```javascript
const PDFGenerator = require('./index.js');

const generator = new PDFGenerator();

const data = {
  company: {
    name: "Newton Tech",
    address: "Gar, Samsun",
    phone: "+90 362 555 01 23",
    email: "destek@newtontech.com.tr"
  },
  client: {
    company: "Müşteri Şirketi",
    contactPerson: "İletişim Kişisi", 
    email: "musteri@email.com"
  },
  ticket: {
    id: "T-2024-001",
    title: "Problem başlığı",
    description: "Detaylı açıklama...",
    solution: "Uygulanan çözüm...",
    createdDate: "2024-01-20T09:30:00",
    resolvedDate: "2024-01-20T16:45:00"
  }
};

await generator.generatePDF('support-ticket', data);
```

## Newton Destek Entegrasyonu

### Frontend (React/Vite) Kullanımı
```javascript
// Newton Destek projesinde
const generatePDF = async (ticketData) => {
  const response = await fetch('https://pdf.newtontech.com.tr/api/generate-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      templateName: 'support-ticket',
      data: ticketData
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    // PDF base64 olarak gelir
    const pdfBlob = new Blob([
      Uint8Array.from(atob(result.base64), c => c.charCodeAt(0))
    ], { type: 'application/pdf' });
    
    // İndir
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapor-${ticketData.ticket.id}.pdf`;
    a.click();
  }
};
```

### Veri Formatı
```javascript
{
  company: {
    name: "Newton Tech",
    address: "Gar, Samsun",
    phone: "+90 362 555 01 23", 
    email: "destek@newtontech.com.tr",
    website: "www.newtontech.com.tr"
  },
  client: {
    company: "Müşteri şirketi",
    contactPerson: "İletişim kişisi",
    email: "E-posta",
    phone: "Telefon"
  },
  ticket: {
    id: "Kayıt numarası",
    title: "Başlık",
    description: "Açıklama",
    priority: "Öncelik seviyesi (Yüksek/Orta/Düşük)",
    status: "Durum",
    technician: "Teknisyen",
    solution: "Çözüm detayları",
    createdDate: "2024-01-20T09:30:00", // ISO format
    resolvedDate: "2024-01-20T16:45:00"  // ISO format
  }
}
```

## Template Yapısı

- `templates/support-ticket.hbs` - Ana şablon dosyası
- `templates/styles.css` - CSS stilleri
- `output/` - Oluşturulan PDF'ler (geçici)

## Handlebars Helper'ları

- `{{formatDate date 'DD.MM.YYYY'}}` - Tarih formatlama
- `{{formatDateTime date 'DD.MM.YYYY HH:mm'}}` - Tarih-saat formatlama
- `{{uppercase text}}` - Büyük harf dönüşümü
- `{{eq a b}}` - Eşitlik kontrolü

## API Endpoints

- `GET /` - API bilgileri
- `POST /api/generate-pdf` - PDF oluştur
- `GET /api/download/:filename` - PDF indir
- `GET /api/templates` - Template listesi
- `GET /api/health` - Sistem durumu
- `GET /api/sample-data` - Örnek veri

## Geliştirme

```bash
npm run dev  # Nodemon ile geliştirme modu
npm run server:dev  # API server geliştirme modu
```

## Production

```bash
npm run server  # Production server
```

## Teknoloji Stack

- **Backend**: Node.js + Express
- **PDF**: Puppeteer + Chrome Headless
- **Template**: Handlebars
- **Deploy**: Railway
- **Frontend Integration**: React/Vite uyumlu

## Dosya Yapısı

```
pdf-yarat/
├── templates/
│   ├── support-ticket.hbs (SAP tarzı template)
│   └── styles.css (Kurumsal CSS)
├── server.js (Express API)
├── index.js (PDF Generator)
├── sample-data.json (Test data)
├── railway.json (Railway config)
├── Procfile (Deploy config)
└── output/ (Generated PDFs)
```

## Lisans

MIT 