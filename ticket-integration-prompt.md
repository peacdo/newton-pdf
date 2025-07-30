# Newton Ticket Sistemine PDF Entegrasyonu - Cursor Prompt 🎯

Newton Ticket sistemime PDF rapor oluşturma özelliği eklemek istiyorum. 

**Yapılacaklar:**
1. Ticket detay sayfasına "PDF Rapor İndir" butonu ekle
2. Bu buton tıklandığında external PDF API'yi çağır
3. PDF'i kullanıcıya indirt
4. Loading state ve error handling ekle

**PDF API Bilgileri:**
- URL: https://pdf.newtontech.com.tr/api/generate-pdf
- Method: POST
- Content-Type: application/json

**Gönderilecek veri formatı:**
```json
{
  "templateName": "support-ticket",
  "data": {
    "company": {
      "name": "NewtonTech",
      "address": "İstasyon Mahallesi, Cumhuriyet Caddesi No: 59/2, Kat: 1, İlkadım/Samsun", 
      "phone": "+90 362 231 0 444",
      "email": "destek@newtontech.com.tr",
      "website": "www.newtontech.com.tr"
    },
    "client": {
      "company": "Müşteri şirketi adı",
      "taxNumber": "Vergi kimlik numarası",
      "address": "Müşteri adresi",
      "customerType": "Ücretli veya Sözleşmeli"
    },
    "ticket": {
      "id": "Ticket ID",
      "title": "Ticket başlığı", 
      "description": "Problem açıklaması",
      "status": "Ticket durumu",
      "technicians": "Atanan teknisyen(ler)",
      "fee": "Ücret bilgisi (TL + KDV)",
      "solution": "Uygulanan çözüm detayları",
      "customerComments": "Müşteri yorumları (opsiyonel)",
      "createdDate": "2024-01-20T09:30:00",
      "resolvedDate": "2024-01-20T16:45:00"
    }
  }
}
```

**Response formatı:**
```json
{
  "success": true,
  "base64": "PDF'in base64 hali",
  "filename": "rapor-T-2024-001.pdf"
}
```

**Frontend kod örneği:**
```javascript
const downloadPDF = async (ticketData) => {
  try {
    setLoading(true);
    
    const response = await fetch('https://pdf.newtontech.com.tr/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateName: 'support-ticket',
        data: ticketData
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Base64'ü blob'a çevir
      const pdfBlob = new Blob([
        Uint8Array.from(atob(result.base64), c => c.charCodeAt(0))
      ], { type: 'application/pdf' });
      
      // İndir
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('PDF Error:', error);
    toast.error('PDF oluşturulurken hata oluştu');
  } finally {
    setLoading(false);
  }
};
```

**UI Gereksinimleri:**
- Ticket detay sayfasında prominent bir "PDF Rapor İndir" butonu
- Loading spinner icon
- Success/error toast messages  
- Download icon kullan

**TypeScript interface'i:**
```typescript
interface TicketPDFData {
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
  };
  client: {
    company: string;
    taxNumber: string;
    address: string;
    customerType: 'Ücretli' | 'Sözleşmeli';
  };
  ticket: {
    id: string;
    title: string;
    description: string;
    status: string;
    technicians: string;
    fee: string;
    solution: string;
    customerComments?: string;
    createdDate: string;
    resolvedDate: string;
  };
}
```

Mevcut ticket data yapısını yukarıdaki API formatına uygun şekilde map et. Hangi ticket sayfalarında bu özelliği istiyorsan söyle, ona göre component'leri güncelleyelim. 