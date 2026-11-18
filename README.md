# Alumni Portal - Backend API

A robust backend service and RESTful API for the **Alumni Portal** platform. This system facilitates seamless communication and networking between alumni, fellow graduates, and faculty members (professors), fostering a collaborative academic and professional ecosystem.

> **Note:** This repository is dedicated exclusively to the **backend** architecture and API services of the project.
> 
> 🎨 **Marka & Tasarım Rehberi:** Renk paleti, tipografi, logo ve tasarım standartları için bkz: **[brand.md](./brand.md)**

---

## 🎯 Project Purpose

The primary objective of the **Alumni Portal** is to bridge the gap between graduates and their academic roots by providing a centralized platform where:
- **Alumni-to-Alumni Networking:** Graduates can reconnect with former classmates, share career achievements, and collaborate on professional endeavors.
- **Alumni-to-Faculty Engagement:** Alumni can stay in active communication with professors and faculty members for ongoing academic collaboration, mentorship, and guidance.
- **Career & Mentorship Opportunities:** Graduates and faculty can announce job openings, internship opportunities, and research collaborations.
- **Announcements & Reunions:** Stay up-to-date with department news, academic seminars, and alumni reunion events.

---

## 🛠 Tech Stack

- **Runtime & Language:** [Node.js](https://nodejs.org/) (JavaScript)
- **Web Framework:** [Express.js](https://expressjs.com/)
- **API Documentation:** [Swagger / OpenAPI 3.0](https://swagger.io/) (Erişim: `/api/swagger`)
- **Data Format & Interchange:** [JSON](https://www.json.org/) (JavaScript Object Notation)
- **Database:** [MySQL](https://www.mysql.com/) (ile in-memory fallback desteği)
- **Containerization:** [Docker](https://www.docker.com/) & Docker Compose
- **Architecture:** MVC (Model-View-Controller) + EJS views + Guardian & Logger Middleware

---

## 🛡️ Middleware & Hata Yönetim Mimarisi (Guardian & Logging)

Uygulama, istek yaşam döngüsünü izleyen ve hataları yöneten katmanlı bir middleware mimarisine sahiptir:

1. **Logger Middleware (`src/middleware/logger.middleware.js`):**
   - Sunucuya gelen her isteğin zamanını, HTTP metodunu, rotasını, yanıt durum kodunu ve işlem süresini terminale anlık yazdırır:
     ```text
     10:20:30 POST /user 201 18ms
     14:05:28 GET /api/health 200 18ms
     ```
2. **404 Guardian Middleware (`src/middleware/guardian404.middleware.js`):**
   - Tanımsız rotalara gelen istekleri yakalar.
   - API istekleri için neden (`reason`) içeren standart JSON 404 döner.
   - Web arayüzü isteklerini otomatik olarak generic **`/404`** sayfasına yönlendirir (`redirect`).
3. **Generic 404 Görünümü (`views/404.ejs`):**
   - Kullanıcı dostu arayüz ile aranan sayfanın bulunamadığını ve sebebini gösterir; ana sayfaya, duyurulara ve iş ilanlarına hızlı dönüş bağlantıları sunar.
4. **5xx Guardian Middleware (`src/middleware/guardian5xx.middleware.js`):**
   - Uygulama genelinde fırlatılan tüm 5xx hatalarını yakalar.
   - Hassas sistem bilgilerini sızdırmadan güvenli hata yanıtı döner.
   - Hatanın tam yığın izini (stack trace), zaman damgası ve istek bilgisiyle birlikte **`logs/error.logs`** dosyasına kalıcı olarak kaydeder.
5. **Hata Günlüğü (`logs/error.logs`):**
   - Kritik sistem hatalarını dosya sisteminde izole bir şekilde saklar.

---

## 📖 Canlı & Dinamik API Dokümantasyonu (Swagger UI)

OpenAPI 3.0 dokümantasyonu uygulama açılırken kaynak dosyalardaki `@swagger` açıklamalarından üretilir:

- 🔗 **Swagger UI Bağlantısı:** [http://localhost/api/swagger](http://localhost/api/swagger) *(veya `http://localhost:3000/api/swagger`)*
- 📄 **Ham OpenAPI JSON:** [http://localhost/api/swagger.json](http://localhost/api/swagger.json)
- 🧪 **Sayfa İçi Canlı İstek:** Swagger UI üzerinden "Try it out" butonuyla canlı istekler çalıştırılabilir.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Request Body | Response Format |
|---|---|---|---|---|
| `GET` | `/api/swagger` | Interaktif Swagger UI API Dokümantasyonu | *None* | `HTML UI` |
| `GET` | `/api/swagger.json` | OpenAPI 3.0 JSON Şeması | *None* | `JSON` |
| `GET` | `/api/health` | API health check and server status | *None* | JSON |
| `GET` | `/404` | Generic 404 Hata Sayfası | *None* | `HTML view` |
| `GET` | `/users` | Kullanıcı listesi ve form arayüzü | *None* | `HTML view` |
| `POST` | `/users` | Arayüzden kullanıcı oluştur | Form alanları | `HTML view` |
| `GET/PUT/PATCH/DELETE` | `/users/:id` | Kullanıcı detay, güncelleme veya silme | Form alanları | `HTML view` |
| `GET/POST` | `/api/users` | Kullanıcıları listele veya yeni kullanıcı oluştur | JSON | JSON |
| `GET/PUT/PATCH/DELETE` | `/api/users/:id` | Kullanıcıyı oku, güncelle veya sil | JSON | JSON |
| `GET/POST` | `/announcements` | Duyuru arayüzü ve oluşturma | Form alanları | `HTML view` |
| `GET/PUT/PATCH/DELETE` | `/announcements/:id` | Duyuru detay/düzenle/sil | Form alanları | `HTML view` |
| `GET/POST` | `/api/announcements` | Duyuruları listele veya oluştur | JSON | JSON |
| `GET/PUT/PATCH/DELETE` | `/api/announcements/:id` | Duyuruyu oku, güncelle veya sil | JSON | JSON |
| `GET/POST` | `/job-postings` | İş ilanları web arayüzü ve oluşturma | Form alanları | `HTML view` |
| `GET/POST` | `/api/job-postings` | İş ilanlarını listele veya oluştur (`title` max 120, `company` required) | JSON | JSON |
| `GET/PUT/PATCH/DELETE` | `/api/job-postings/:id` | İlanı oku, güncelle veya sil | JSON | JSON |
| `GET/POST` | `/api/users/:userId/job-postings` | Kullanıcının ilanlarını listele / ilan aç | JSON | JSON |
| `GET/POST` | `/api/applications` | Başvuruları listele veya oluştur | JSON | JSON |
| `GET/PUT/PATCH/DELETE` | `/api/applications/:id` | Başvuruyu oku, güncelle veya sil | JSON | JSON |
| `GET/POST` | `/api/job-postings/:jobPostingId/applications` | İlan başvurularını yönet (Nested) | JSON | JSON |
| `GET/POST` | `/api/users/:userId/applications` | Kullanıcı başvurularını yönet (Nested) | JSON | JSON |

---

### 📬 Testing with Postman

Tüm isteklerde `baseUrl` olarak `http://localhost:3000` veya `http://localhost` kullanılabilir. Postman koleksiyonu (`postman/collections/Alumni_Portal_API.postman_collection.json`) hem geçerli hem de geçersiz (invalid) istek senaryolarını barındırır:

#### Geçerli İstekler (Valid Requests):
1. **Health Check:** `GET /api/health`
2. **Kullanıcı Kayıt (POST):** `POST /api/users`
3. **Kullanıcı Güncelleme (PUT/PATCH):** `PUT /api/users/2`
4. **İş İlanı Yayınlama:** `POST /api/job-postings` (`title`, `company`, opsiyonel `city`, `description`)

#### Geçersiz İstekler & Guardian Testleri (Invalid Requests):
1. **Eksik E-posta ile Kullanıcı Oluşturma (400 Bad Request):**
   - `POST /api/users` body'sinde `email` gönderilmediğinde doğrulama hatası alınır.
2. **Olmayan Kullanıcı ID Sorgulama (404 Not Found):**
   - `GET /api/users/99999`
3. **120 Karakteri Aşan İlan Başlığı (400 Bad Request):**
   - `POST /api/job-postings` başlığı 120 karakteri aştığında `Başlık en fazla 120 karakter olabilir.` hatası döner.
4. **Şirket Adı Olmayan İlan (400 Bad Request):**
   - `POST /api/job-postings` `company` alanı eksik gönderildiğinde reddedilir.
5. **404 Guardian Testi (404 Not Found with reason):**
   - `GET /api/tanimsiz-bir-rota` -> `{ "success": false, "status": 404, "reason": "..." }`
6. **5xx Guardian Testi (500 Internal Server Error with reason):**
   - `GET /api/health?simulateError=true` -> 500 döner ve hata `logs/error.logs` dosyasına kaydedilir.

---

## 📁 Project Structure

```
alumni/
├── logs/
│   ├── .gitkeep                    # Log klasörünü repoda tutar
│   └── error.logs                  # 5xx sunucu hata logları (ignored)
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_announcements.sql
│   ├── 003_create_job_postings.sql
│   └── 004_create_applications.sql
├── src/
│   ├── config/
│   │   └── swagger.js              # Swagger / OpenAPI 3.0 yapılandırması
│   ├── controllers/                # [Controller] İş mantığı ve HTTP yanıtları
│   │   ├── health.controller.js
│   │   ├── user.controller.js
│   │   ├── announcement.controller.js
│   │   ├── jobPosting.controller.js
│   │   └── application.controller.js
│   ├── db/                         # [DB] MySQL bağlantı ve seed altyapısı
│   │   ├── connection.js
│   │   └── seed.js
│   ├── middleware/                 # [Middleware] İstek ve hata yakalama
│   │   ├── index.js
│   │   ├── logger.middleware.js    # → time method route res.type duration
│   │   ├── guardian404.middleware.js # → Tanımsız rotalar & web redirect
│   │   └── guardian5xx.middleware.js # → 5xx hata yakalama & error.logs
│   ├── models/                     # [Model] Veri katmanı & validasyonlar
│   │   ├── user.model.js
│   │   ├── announcement.model.js
│   │   ├── jobPosting.model.js     # → title max 120, company req, city/desc opt
│   │   └── application.model.js
│   ├── routes/                     # [Router] URL eşleme + @swagger
│   │   └── api/
│   ├── utils/
│   │   └── errorLogger.js          # logs/error.logs dosyasına yazıcı
│   └── index.js                    # Express uygulama girişi & middleware pipeline
├── views/
│   ├── users.ejs
│   ├── announcements.ejs
│   ├── job-postings.ejs
│   ├── applications.ejs
│   └── 404.ejs                     # Generic 404 hata sayfası
├── public/
│   ├── index.html
│   └── about.html
├── postman/
│   └── collections/
│       └── Alumni_Portal_API.postman_collection.json
├── .env.example
├── .gitignore
├── brand.md                        # Marka kimliği, renk paleti ve tasarım standartları
├── DATA_DESIGN.md                  # Veri mimarisi ve entity belgeleri
├── WEEK2_NOTES.md                  # 2. Hafta çalışma notları
├── WEEK3_NOTES.md                  # 3. Hafta çalışma notları (Middleware, Guardian, Rules)
└── README.md
```

---

## 🎨 Marka Kimliği & Tasarım Sistemi (Brand Identity)

Platformun görsel kimliği, renk paleti, tipografisi, amblem/logo standartları ve arayüz kuralları için bkz:
👉 **[brand.md — Marka ve Tasarım Rehberi](./brand.md)**

---

## 🧩 Data Models & Kurallar

Detaylı şemalar ve sözleşmeler için bkz: **[DATA_DESIGN.md](./DATA_DESIGN.md)**

### Kısa Başvuru — JobPosting (Güncel Kurallar)

| Alan | Tür | Zorunlu | Açıklama |
|---|---|---|---|
| `id` | integer | ✅ otomatik | Benzersiz pozitif tam sayı kimlik |
| `title` | string | ✅ | İlan başlığı; **en fazla 120 karakter** |
| `company` | string | ✅ | Şirket veya kurum adı |
| `city` / `location` | string | ❌ (opsiyonel) | Şehir veya çalışma konumu |
| `description` | string | ❌ (opsiyonel) | İş tanımı ve detaylar |
| `type` | enum | ❌ | `Full-time`, `Part-time`, `Internship`, `Contract` |
| `status` | enum | ❌ | `Active`, `Closed` |

---

## 📄 License

This project is developed for educational and academic collaboration purposes.
