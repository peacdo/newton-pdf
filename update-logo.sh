#!/bin/bash

echo "🎨 Newton Logo'yu Template'e Ekliyor..."

# Logo dosyasının varlığını kontrol et
if [ ! -f "newton-logo.png" ]; then
    echo "❌ newton-logo.png dosyası bulunamadı!"
    echo "Lütfen newton-logo.png dosyasını bu dizine kopyalayın."
    exit 1
fi

echo "📸 Logo'yu base64'e çeviriliyor..."
LOGO_BASE64=$(base64 -w 0 newton-logo.png)

echo "📝 Template güncelleniyor..."
# Template'teki placeholder base64'ü gerçek logo ile değiştir
sed -i "s|data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==|data:image/png;base64,$LOGO_BASE64|" templates/support-ticket.hbs

echo "✅ Logo başarıyla güncellendi!"
echo "🧪 Template test etmek için:"
echo "   curl -X POST https://pdf.newtontech.com.tr/api/generate-pdf -H \"Content-Type: application/json\" -d @sample-data.json"
echo ""
echo "🐳 Docker konteyner'ını yeniden başlatın:"
echo "   docker-compose down"
echo "   docker-compose up -d --build" 