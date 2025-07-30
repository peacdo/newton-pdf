const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const PDFGenerator = require('./index.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Enhanced CORS for Production (HTTPS)
app.use((req, res, next) => {
  // Newton Tech domain'leri için CORS
  const allowedOrigins = [
    'https://newton.newtontech.com.tr',
    'https://destek.newtontech.com.tr', 
    'https://www.newtontech.com.tr',
    'https://newtontech.com.tr',
    'http://localhost:3000',
    'http://localhost:5173' // Vite dev server
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*'); // Fallback
  }
  
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // HTTPS Security Headers
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

const generator = new PDFGenerator();

// Ana sayfa
app.get('/', (req, res) => {
  res.json({
    message: 'PDF Yaratıcı API',
    version: '1.0.0',
    endpoints: {
      'POST /api/generate-pdf': 'PDF oluştur',
      'GET /api/templates': 'Mevcut template\'leri listele',
      'GET /api/health': 'Sistem durumu'
    },
    documentation: 'https://github.com/username/pdf-yarat'
  });
});

// PDF oluşturma endpoint'i
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { templateName = 'support-ticket', data } = req.body;
    
    if (!data) {
      return res.status(400).json({
        error: 'Veri gerekli',
        message: 'data parametresi zorunludur'
      });
    }

    // Veri doğrulama
    const requiredFields = ['company', 'client', 'ticket'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Eksik alanlar',
        missingFields,
        message: `Şu alanlar zorunludur: ${missingFields.join(', ')}`
      });
    }

    console.log(`📄 PDF oluşturma isteği alındı: ${templateName}`);
    
    const pdfPath = await generator.generatePDF(templateName, data);
    const filename = path.basename(pdfPath);
    
    // PDF'i base64 olarak döndür
    const pdfBuffer = await fs.readFile(pdfPath);
    const base64PDF = pdfBuffer.toString('base64');
    
    res.json({
      success: true,
      message: 'PDF başarıyla oluşturuldu',
      filename,
      size: pdfBuffer.length,
      base64: base64PDF,
      downloadUrl: `/api/download/${filename}`
    });
    
  } catch (error) {
    console.error('❌ PDF oluşturma hatası:', error);
    res.status(500).json({
      error: 'PDF oluşturma hatası',
      message: error.message
    });
  }
});

// PDF indirme endpoint'i
app.get('/api/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const pdfPath = path.join(__dirname, 'output', filename);
    
    if (!await fs.pathExists(pdfPath)) {
      return res.status(404).json({
        error: 'Dosya bulunamadı',
        message: 'İstenen PDF dosyası bulunamadı'
      });
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('❌ Dosya indirme hatası:', error);
    res.status(500).json({
      error: 'Dosya indirme hatası',
      message: error.message
    });
  }
});

// Template listesi
app.get('/api/templates', async (req, res) => {
  try {
    const templatesDir = path.join(__dirname, 'templates');
    const files = await fs.readdir(templatesDir);
    const templates = files
      .filter(file => file.endsWith('.hbs'))
      .map(file => ({
        name: path.basename(file, '.hbs'),
        filename: file,
        path: path.join(templatesDir, file)
      }));
    
    res.json({
      success: true,
      templates,
      count: templates.length
    });
  } catch (error) {
    console.error('❌ Template listesi hatası:', error);
    res.status(500).json({
      error: 'Template listesi alınamadı',
      message: error.message
    });
  }
});

// Sistem durumu
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

// Örnek veri endpoint'i
app.get('/api/sample-data', (req, res) => {
  const sampleData = {
    company: {
      name: "NewtonTech",
      address: "İstasyon Mahallesi, Cumhuriyet Caddesi No: 59/2, Kat: 1, İlkadım/Samsun",
      phone: "+90 362 231 0 444",
      email: "destek@newtontech.com.tr",
      website: "www.newtontech.com.tr"
    },
    client: {
      company: "Müşteri Şirketi A.Ş.",
      taxNumber: "1234567890",
      address: "Örnek Mahallesi, Cumhuriyet Caddesi No: 123, Merkez/Samsun",
      customerType: "Sözleşmeli"
    },
    ticket: {
      id: "T-2024-001",
      title: "Sunucu Performans Sorunu",
      description: "Müşterinin web sunucusunda yavaşlık problemi tespit edildi. CPU kullanımı %90'ın üzerinde seyrediyor. Kullanıcılar site yüklenme sürelerinden şikayetçi.",
      status: "Çözüldü",
      createdDate: "2024-01-15T09:30:00",
      resolvedDate: "2024-01-16T14:45:00",
      technicians: "Mehmet Demir, Ahmet Yılmaz",
      fee: "1.500,00 TL + KDV",
      solution: "1. Sunucu performans analizi yapıldı\n2. Gereksiz servisler kapatıldı\n3. RAM kapasitesi 16GB'dan 32GB'a yükseltildi\n4. Sistem optimizasyonu gerçekleştirildi\n5. Monitoring araçları kuruldu"
    }
  };
  
  res.json({
    success: true,
    data: sampleData,
    message: 'Bu veriyi /api/generate-pdf endpoint\'ine gönderebilirsiniz'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint bulunamadı',
    message: 'İstenen endpoint mevcut değil',
    availableEndpoints: [
      'GET /',
      'POST /api/generate-pdf',
      'GET /api/templates',
      'GET /api/health',
      'GET /api/sample-data'
    ]
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('❌ Server hatası:', error);
  res.status(500).json({
    error: 'Sunucu hatası',
    message: 'Beklenmeyen bir hata oluştu'
  });
});

// Server başlat
app.listen(PORT, () => {
  console.log(`
🚀 PDF Yaratıcı API başlatıldı!
📍 Port: ${PORT}
🌐 Production URL: https://pdf.newtontech.com.tr
🏠 Local URL: http://localhost:${PORT}
📚 API Endpoints:
   - GET  /                    (Ana sayfa)
   - POST /api/generate-pdf    (PDF oluştur)
   - GET  /api/templates       (Template listesi)
   - GET  /api/health          (Sistem durumu)
   - GET  /api/sample-data     (Örnek veri)
   
💡 Production Test: curl -X POST https://pdf.newtontech.com.tr/api/generate-pdf -H "Content-Type: application/json" -d @sample-data.json
💡 Local Test: curl -X POST http://localhost:${PORT}/api/generate-pdf -H "Content-Type: application/json" -d @sample-data.json
  `);
});

module.exports = app; 