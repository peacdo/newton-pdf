#!/bin/bash

echo "🧪 Newton Tech PDF API Test Scripti"
echo "======================================"

BASE_URL="https://pdf.newtontech.com.tr"

echo "📡 1. Health Check..."
curl -s "$BASE_URL/health" | jq '.'

echo -e "\n📊 2. API Bilgileri..."
curl -s "$BASE_URL/" | jq '.'

echo -e "\n📝 3. Örnek Veri Alma..."
curl -s "$BASE_URL/api/sample-data" | jq '.data' > test-data.json

echo -e "\n🎯 4. PDF Oluşturma..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/generate-pdf" \
  -H "Content-Type: application/json" \
  -d @test-data.json)

echo "$RESPONSE" | jq '.'

# Base64'ü PDF'e çevir
if echo "$RESPONSE" | jq -e '.success' > /dev/null; then
    echo -e "\n💾 5. PDF İndiriliyor..."
    echo "$RESPONSE" | jq -r '.base64' | base64 -d > newton-test-report.pdf
    echo "✅ PDF kaydedildi: newton-test-report.pdf"
    
    if command -v open &> /dev/null; then
        open newton-test-report.pdf
    elif command -v xdg-open &> /dev/null; then
        xdg-open newton-test-report.pdf
    fi
else
    echo "❌ PDF oluşturulamadı!"
fi

echo -e "\n🧹 Temizlik..."
rm -f test-data.json

echo "✅ Test tamamlandı!" 