# Dijital Menü - Mobil Öncelikli

Kısa kurulum:

- `index.html` ana dosyadır. QR kod hedefi olarak bu dosyayı açın.
- Resimleri `img/` klasörüne yerleştirin (`baklava1.jpg`, `pistachio_sarma.jpg`, `sobiyet.jpg` gibi).
 - Resimleri `img/` klasörüne yerleştirin (örn. `mekik_baklava.jpg`, `kare_baklava.jpg`).
 - Site logosu: logonuzu `img/dp.png` olarak ekleyin. (Şeffaf PNG önerilir; maksimum yükseklik ~44px.)
- Tarayıcıda açmak için dosyayı bir sunucuda servis edin (ör. `npx http-server` veya basit bir hosting).

Özellikler:
- Mobil öncelikli, 2 sütun grid mobilde.
- Koyu zümrüt arka plan, mat altın vurgu, açık krem yazı.
- Büyük dokunma alanları, yumuşak geçiş animasyonları.
- Ürün kartında görsel, isim, fiyat, badge. Açılınca detay modal.

Tavsiyeler:
- Gerçek ortamda resimleri optimize edin (webp / boyutlandırma).
- QR ile açıldığında doğrudan `index.html` gelmeli; sayfa en üstte ürünleri gösterir.
