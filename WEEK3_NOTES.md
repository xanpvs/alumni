# 📓 3. Hafta Çalışma Notları (Week 3 Notes)

**Tarih:** 11 Kasım 2026  
**Proje:** Alumni Portal - Backend API  
**Konu:** Middleware Pipeline, Guardian Mekanizmaları (404 & 5xx), Hata Günlüğü (Error Logging), DDD Kural Güncellemeleri ve Generic 404 Sayfası  

---

## 📌 Tahtada Belirlenen Görevler ve Uygulama Adımları

Tahtada yer alan 9 maddelik geliştirme planı sırasıyla uygulanmıştır:

```
① Try invalid requests on Postman
② Update ddd.md with rules (JobPosting: title required, max 120 chars, company required, city & description optional)
③ Logger Middleware (write log on terminal: time method route res.type duration)
④ 404 Guardian Middleware (return 404 errors with a reason)
⑤ 5xx Guardian (catch 5xx errors and return structured response)
⑥ Logs -> logs/error.logs (write error logs with timestamp and stack trace)
⑦ Define generic 404 page and redirect invalid request
⑧ Update README.md and the other md files with today's work
⑨ Commit & push
```

---

## 🚀 Yapılan İşlemlerin Detayları

### 1. Adım: Postman Üzerinde Geçersiz İstekler (Invalid Requests)
- `postman/collections/Alumni_Portal_API.postman_collection.json` koleksiyonu güncellendi.
- Eksik parametreli kullanıcı kaydı (`400`), var olmayan ID araması (`404`), 120 karakteri aşan ilan başlığı (`400`), eksik şirket bilgisi (`400`), tanımsız rota sorgusu (`404 with reason`) ve sunucu hatası simülasyonu (`500 with reason`) koleksiyona eklendi.

### 2. Adım: DATA_DESIGN.md (ddd.md) ve Model Kurallarının Güncellenmesi
- `JobPosting` modeli için yeni iş kuralları belirlendi:
  - `title`: Zorunlu (required), maksimum 120 karakter.
  - `company`: Zorunlu (required).
  - `city` / `location`: Opsiyonel (optional).
  - `description`: Opsiyonel (optional).
- `DATA_DESIGN.md`, `src/models/jobPosting.model.js` ve Swagger dokümantasyonu (`src/routes/api/jobPostings.routes.js`) bu kurallarla senkronize edildi.

### 3. Adım: Logger Middleware
- `src/middleware/logger.middleware.js` geliştirildi.
- Her gelen isteğin yaşam döngüsü tamamlandığında (`res.on('finish')`):
  ```text
  <time> <method> <route> <res.type> <duration>
  14:05:28 GET /api/health 200 18ms
  14:05:28 POST /api/users 400 29ms
  14:05:28 POST /api/job-postings 201 1ms
  ```
  formatında konsola anlık kayıt düşer.

### 4. Adım: 404 Guardian Middleware
- `src/middleware/guardian404.middleware.js` geliştirildi.
- Sistemde tanımlı olmayan rotaları yakalar.
- API veya JSON isteklerinde sebep (`reason`) içeren bir 404 yanıtı üretir:
  ```json
  {
    "success": false,
    "status": 404,
    "error": "Not Found",
    "reason": "Tanımsız rota: 'GET /api/tanimsiz' uç noktası sistemde bulunamadı."
  }
  ```

### 5. Adım: 5xx Guardian Middleware
- `src/middleware/guardian5xx.middleware.js` geliştirildi.
- Express'in 4 parametreli `(err, req, res, next)` hata yakalayıcısı olarak çalışır.
- İstemciye duyarlı bilgileri gizleyen güvenli bir hata yanıtı döner:
  ```json
  {
    "success": false,
    "status": 500,
    "error": "Internal Server Error",
    "reason": "Simüle edilmiş kritik sunucu hatası (5xx Guardian testi)."
  }
  ```

### 6. Adım: Dosyaya Hata Günlüğü (logs/error.logs)
- `src/utils/errorLogger.js` geliştirildi.
- Oluşan tüm 5xx istisnaları zaman damgası, istek metodu, URL, istemci IP'si, hata sebebi ve tam çağrı yığını (stack trace) ile birlikte `logs/error.logs` dosyasına append edilir.
- `logs/.gitkeep` ile klasör yapısı repoda tutulurken, `.gitignore` ile log dosyaları versiyon kontrolü dışında bırakıldı.

### 7. Adım: Generic 404 Sayfası ve Geçersiz İsteklerin Yönlendirilmesi
- `views/404.ejs` generic şablonu oluşturuldu.
- Web tarayıcısından gelen tanımsız istekler `404 Guardian` tarafından otomatik olarak `/404?url=...&reason=...` sayfasına yönlendirilir (`HTTP 302 Redirect`).
- Kullanıcıya şık bir arayüz, hata sebebi ve ana sayfa/duyurular/ilanlar bağlantıları sunulur.

### 8. Adım: Dokümantasyon Senkronizasyonu
- `README.md`, `DATA_DESIGN.md` ve bu çalışma notu (`WEEK3_NOTES.md`) yapılan tüm yeniliklerle güncellendi.

### 9. Adım: Versiyon Kontrolü (Commit & Push)
- Tüm değişiklikler Git staging alanına eklenip anlamlı bir commit mesajı ile uzak depoya (`origin/main`) aktarılır.
