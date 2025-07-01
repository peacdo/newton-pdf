const fs = require('fs-extra');
const path = require('path');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const moment = require('moment');

class PDFGenerator {
  constructor() {
    this.templatesDir = path.join(__dirname, 'templates');
    this.outputDir = path.join(__dirname, 'output');
    this.publicDir = path.join(__dirname, 'public');
    
    // Output klasörünü oluştur
    fs.ensureDirSync(this.outputDir);
  }

  async generatePDF(templateName, data) {
    try {
      // Template dosyasını oku
      const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
      const templateSource = await fs.readFile(templatePath, 'utf8');
      
      // CSS dosyasını oku
      const cssPath = path.join(this.templatesDir, 'styles.css');
      const cssContent = await fs.readFile(cssPath, 'utf8');
      
      // Handlebars template'ini compile et
      const template = handlebars.compile(templateSource);
      
      // Veriyi hazırla
      const templateData = {
        ...data,
        currentDate: moment().format('DD.MM.YYYY'),
        currentTime: moment().format('HH:mm')
      };
      
      // HTML'i oluştur
      const html = template(templateData);
      
      // Puppeteer ile PDF oluştur (Railway için optimize)
      const isProduction = process.env.NODE_ENV === 'production';
      const launchOptions = {
        headless: 'new',
        args: []
      };
      
      if (isProduction) {
        // Railway/Cloud environment için özel ayarlar
        launchOptions.args = [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        ];
      }
      
      const browser = await puppeteer.launch(launchOptions);
      const page = await browser.newPage();
      
      // CSS'i sayfaya ekle
      await page.setContent(html);
      await page.addStyleTag({ content: cssContent });
      
      // PDF oluştur
      const filename = `${templateName}_${Date.now()}.pdf`;
      const outputPath = path.join(this.outputDir, filename);
      
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        preferCSSPageSize: true
      });
      
      await browser.close();
      
      console.log(`✅ PDF oluşturuldu: ${filename}`);
      return outputPath;
      
    } catch (error) {
      console.error('❌ PDF oluşturma hatası:', error);
      throw error;
    }
  }
}

// Handlebars helper'ları
handlebars.registerHelper('formatDate', function(date, format) {
  return moment(date).format(format || 'DD.MM.YYYY');
});

handlebars.registerHelper('formatDateTime', function(date, format) {
  return moment(date).format(format || 'DD.MM.YYYY HH:mm');
});

handlebars.registerHelper('uppercase', function(str) {
  return str ? str.toString().toUpperCase() : '';
});

handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

// Test fonksiyonu
async function testPDF() {
  const generator = new PDFGenerator();
  
  const sampleData = {
    company: {
      name: "Newton Tech",
      address: "Gar, Samsun",
      phone: "+90 362 555 01 23",
      email: "destek@newtontech.com.tr",
      website: "www.newtontech.com.tr"
    },
    client: {
      company: "Müşteri Şirketi A.Ş.",
      contactPerson: "Ahmet Özkan",
      email: "ahmet@musteri.com",
      phone: "+90 532 987 65 43"
    },
    ticket: {
      id: "T-2024-001",
      title: "Sunucu Performans Sorunu",
      description: "Müşterinin web sunucusunda yavaşlık problemi tespit edildi. CPU kullanımı %90'ın üzerinde seyrediyor.",
      priority: "Yüksek",
      status: "Çözüldü",
      createdDate: "2024-01-15T09:30:00",
      resolvedDate: "2024-01-16T14:45:00",
      technician: "Mehmet Demir",
      solution: "1. Sunucu performans analizi yapıldı\\n2. Gereksiz servisler kapatıldı\\n3. RAM kapasitesi 16GB'dan 32GB'a yükseltildi\\n4. Sistem optimizasyonu gerçekleştirildi"
    }
  };
  
  await generator.generatePDF('support-ticket', sampleData);
}

module.exports = PDFGenerator;

// Eğer direkt çalıştırılıyorsa test et
if (require.main === module) {
  testPDF().catch(console.error);
} 