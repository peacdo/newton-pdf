# PDF Sistem Güncelleme - v1.2.0

## 📋 Yapılan Değişiklikler

### 🏢 Şirket Bilgileri
- **Telefon:** `+90 362 555 01 23` → `+90 362 231 0 444`
- **Adres:** `Gar, Samsun` → `İstasyon Mahallesi, Cumhuriyet Caddesi No: 59/2, Kat: 1, İlkadım/Samsun`
- **Şirket Adı:** `Newton Tech` → `NewtonTech`

### 👥 Müşteri Bilgileri Güncellendi
**ESKİ:**
- Şirket
- İletişim Kişisi
- E-posta
- Telefon

**YENİ:**
- Ünvan (Şirket Adı)
- VKN (Vergi Kimlik)
- Adres
- Müşteri Tipi (Ücretli/Sözleşmeli)

### 🎫 Ticket Bilgileri
- **Kaldırıldı:** Öncelik alanı (priority)
- **Güncellendi:** `technician` → `technicians` (çoğul)
- **Eklendi:** Ücret bilgisi (fee)


### 🎨 Template Değişiklikleri
- NewtonTech logo placeholder eklendi
- Rapor No ve Tarihi kayıt özetine taşındı
- Öncelik stileri kaldırıldı
- Layout düzenlemeleri yapıldı

### 📊 Örnek Veri Formatı
```json
{
  "company": {
    "name": "NewtonTech",
    "address": "İstasyon Mahallesi, Cumhuriyet Caddesi No: 59/2, Kat: 1, İlkadım/Samsun",
    "phone": "+90 362 231 0 444",
    "email": "destek@newtontech.com.tr",
    "website": "www.newtontech.com.tr"
  },
  "client": {
    "company": "Müşteri Şirketi A.Ş.",
    "taxNumber": "1234567890",
    "address": "Örnek Mahallesi, Cumhuriyet Caddesi No: 123, Merkez/Samsun",
    "customerType": "Sözleşmeli"
  },
  "ticket": {
    "id": "T-2024-042",
    "title": "E-posta Sunucu Erişim Sorunu",
    "description": "Problem açıklaması...",
    "status": "Çözüldü",
    "createdDate": "2024-01-20T08:15:00",
    "resolvedDate": "2024-01-20T16:30:00",
    "technicians": "Mehmet Yılmaz, Ali Şen",
    "fee": "2.000,00 TL + KDV",
    "solution": "Uygulanan çözüm detayları..."
  }
}
```

### 📚 Güncellenen Dosyalar
- `templates/support-ticket.hbs` - Ana template
- `templates/styles.css` - CSS stilleri
- `sample-data.json` - Örnek veri
- `server.js` - API endpoint'i
- `README.md` - Dokümantasyon
- `ticket-integration-prompt.md` - Cursor prompt'u
- `update-logo.sh` - Logo güncelleme scripti

### 🚀 Deployment
SSL destekli production URL: `https://pdf.newtontech.com.tr`

### 🧪 Test
```bash
./test-api.sh
```

## 🔄 Breaking Changes
- `priority` alanı kaldırıldı
- `technician` → `technicians` oldu
- Müşteri bilgileri formatı değişti
- `fee` alanı zorunlu hale geldi
- `customerComments` alanı kaldırıldı
- Rapor No ve Tarihi kayıt özetine taşındı

## 📝 Migration Guide
Eski format kullanan entegrasyonlar yeni veri formatına göre güncellenmeli.