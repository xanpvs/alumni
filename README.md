# Alumni Portal - Backend API

A robust backend service and RESTful API for the **Alumni Portal** platform. This system facilitates seamless communication and networking between alumni, fellow graduates, and faculty members (professors), fostering a collaborative academic and professional ecosystem.

> **Note:** This repository is dedicated exclusively to the **backend** architecture and API services of the project.

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
- **Database:** [MySQL](https://www.mysql.com/)
- **Containerization:** [Docker](https://www.docker.com/) & Docker Compose
- **Architecture:** MVC (Model-View-Controller) + EJS views for `/users` + JSON REST API under `/api`

---

## 📖 Canlı & Dinamik API Dokümantasyonu (Swagger UI)

Geçmiş API uç noktaları ve yeni eklenenler için OpenAPI 3.0 dokümantasyonu uygulama açılırken kaynak dosyalardaki `@swagger` açıklamalarından oluşturulur. Böylece yeni sunucu başlangıcında Swagger UI ve ham JSON belgesi güncel rotaları gösterir.

- 🔗 **Swagger UI Bağlantısı:** [http://localhost/api/swagger](http://localhost/api/swagger) *(veya `http://localhost:3000/api/swagger`)*
- 📄 **Ham OpenAPI JSON:** [http://localhost/api/swagger.json](http://localhost/api/swagger.json)
- ⚡ **Dinamik güncelleme:** `src/routes/**/*.js` ve `src/index.js` dosyaları sunucu başlangıcında taranır. OpenAPI belgesi bu dosyalardaki `@swagger` JSDoc açıklamalarından üretilir.
- 📝 **Geliştirici kuralı:** Her yeni API uç noktası için, ilgili Express rotasının yanına bir `@swagger` bloğu ekleyin; mevcut uç noktanın metodu, yolu, parametreleri, istek gövdesi veya yanıtı değiştiğinde bu bloğu da güncelleyin. Kod değişikliği tek başına dokümantasyonu güncellemez. Değişikliklerden sonra sunucuyu yeniden başlatın; belge yeniden oluşturulup `/api/swagger` ve `/api/swagger.json` üzerinden sunulur. Pull request/commit'e dokümantasyon açıklamasını da dahil edin.
- 🧪 **Sayfa İçi Canlı İstek:** Swagger UI üzerinden "Try it out" butonuna tıklayarak GET, POST, PUT, PATCH ve DELETE isteklerini tarayıcınızdan canlı çalıştırabilirsiniz.

---

> **Zorunlu geliştirme kuralı — Swagger:** Projede yapılan her değişiklikle birlikte Swagger dokümantasyonunu gözden geçirin ve değişikliklerin yansıması için gerekli güncellemeleri aynı iş kapsamında yapın. Bu kural yalnızca route değişiklikleriyle sınırlı değildir; controller davranışı, istek/yanıt biçimi, model alanları, validasyon, hata durumları ve diğer API davranışlarındaki değişiklikler de Swagger tanımlarına yansıtılmalıdır. Yeni veya değişen tüm uç noktalar için ilgili `@swagger` açıklamalarını güncel tutun. Swagger belgesi uygulama başlangıcında kaynak açıklamalarından üretildiği için değişikliklerden sonra sunucuyu yeniden başlatın; güncel belge `/api/swagger` ve `/api/swagger.json` üzerinden sunulur.
## 📡 API Endpoints

The `/api/...` endpoints communicate using JSON. The `/users` interface renders HTML views.

| Method | Endpoint | Description | Request Body | Response Format |
|---|---|---|---|---|
| `GET` | `/api/swagger` | Interaktif Swagger UI API Dokümantasyonu | *None* | `HTML UI` |
| `GET` | `/api/swagger.json` | OpenAPI 3.0 JSON Şeması | *None* | `JSON` |
| `GET` | `/api/health` | API health check and server status | *None* | `{"status":"ok", "message":"...", "timestamp":"..."}` |
| `GET` | `/users` | Render the user list and create form | *None* | `HTML view` |
| `POST` | `/users` | Create a user from the interface form | Form fields: `name`, `email`, `role`, `department` | `HTML view` (HTTP 201) |
| `GET` | `/users/:id` | Render one user in the interface | *None* | `HTML view` |
| `PUT` | `/users/:id` | Replace a user from the interface form | Full user form | `HTML view` |
| `PATCH` | `/users/:id` | Partially update a user from the interface form | Changed fields | `HTML view` |
| `DELETE` | `/users/:id` | Delete a user from the interface | *None* | `HTML view` |
| `GET` | `/api/users` | Retrieve all registered users | *None* | `[{"id":1, "name":"...", "email":"...", ...}]` |
| `GET` | `/api/users/:id` | Retrieve single user by ID | *None* | `{"id":2, "name":"...", "email":"...", ...}` |
| `POST` | `/api/users` | Register a new user | `{ "name", "email", "role", "department" }` | `{"success":true, "message":"...", "user":{...}}` (HTTP 201) |
| `PUT` | `/api/users/:id` | Full replacement/update of user | Full object: `{ "name", "email", "role", "department" }` | `{"success":true, "message":"...", "user":{...}}` (HTTP 200) |
| `PATCH` | `/api/users/:id` | Partial update of user | Partial fields: e.g. `{ "department": "..." }` | `{"success":true, "message":"...", "user":{...}}` (HTTP 200) |
| `DELETE` | `/api/users/:id` | Delete user by ID | *None* | `{"success":true, "message":"...", "user":{...}}` (HTTP 200) |
| `GET` | `/announcements` | Duyuruları listele ve yönetim arayüzünü aç | *None* | `HTML view` |
| `POST` | `/announcements` | Arayüzden duyuru oluştur | `title`, `content`, optional `author`, `category` | `HTML view` (HTTP 201) |
| `GET` | `/announcements/:id` | Duyuru detayını arayüzde aç | *None* | `HTML view` |
| `PUT/PATCH/DELETE` | `/announcements/:id` | Arayüzden duyuruyu güncelle veya sil | Full/partial form fields | `HTML view` |
| `GET/POST` | `/api/announcements` | Duyuruları listele veya oluştur | JSON: `title`, `content`, optional `author`, `category` | JSON |
| `GET/PUT/PATCH/DELETE` | `/api/announcements/:id` | Duyuruyu oku, güncelle veya sil | JSON fields | JSON |

Bu tablo temel örnekleri gösterir. Eski/genel rotalar dahil tam ve güncel metot, parametre ve yanıt listesi için Swagger UI'yi kullanın; yeni API rotalarını yukarıdaki kurala göre belgeleyin.

### 📬 Testing with Postman

Tüm isteklerde `URL` olarak `http://localhost/api/...` veya `http://localhost:3000/api/...` kullanılabilir.

#### 1. Belirli Kullanıcıyı Getir (`GET /api/users/:id`)
- **Method:** `GET`
- **URL:** `http://localhost/api/users/2`
- **Expected Status:** `200 OK` (ID'si 2 olan kullanıcının JSON detayları)

#### 2. Yeni Kullanıcı Oluştur (`POST /api/users`)
- **Method:** `POST`
- **URL:** `http://localhost/api/users`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "name": "Zeynep Kaya",
    "email": "zeynep@alumni.edu",
    "role": "Alumni",
    "department": "Endüstri Mühendisliği"
  }
  ```
- **Expected Status:** `201 Created`

#### 3. Kullanıcı Bilgilerini Tamamen Değiştir (`PUT /api/users/:id`)
- **Method:** `PUT`
- **URL:** `http://localhost/api/users/2`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "name": "Prof. Dr. Ayşe Yılmaz",
    "email": "ayse.yilmaz@faculty.edu",
    "role": "Faculty",
    "department": "Yapay Zeka Anabilim Dalı"
  }
  ```
- **Expected Status:** `200 OK`

#### 4. Kullanıcı Bilgilerini Kısmen Güncelle (`PATCH /api/users/:id`)
- **Method:** `PATCH`
- **URL:** `http://localhost/api/users/2`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):** *(Sadece değişmesini istediğiniz alanı gönderin)*
  ```json
  {
    "department": "Siber Güvenlik Anabilim Dalı"
  }
  ```
- **Expected Status:** `200 OK`

#### 5. Kullanıcıyı Sil (`DELETE /api/users/:id`)
- **Method:** `DELETE`
- **URL:** `http://localhost/api/users/2`
- **Expected Status:** `200 OK`

---

## ✨ Core Responsibilities & Features (Backend)

- **Authentication & RBAC:** Secure user authentication and Role-Based Access Control distinguishing between Alumni, Faculty/Professors, and Administrators.
- **Alumni & Faculty Directory:** Endpoints for querying and filtering profiles by graduation year, department, academic title, and industry.
- **Communication & Mentorship:** Direct communication channels and mentorship inquiry systems connecting graduates and academic staff.
- **Event & Announcement Management:** APIs to manage university events, alumni reunions, and departmental announcements.
- **Profile & Career Tracking:** Profile endpoints supporting education history, current career milestones, and contact preferences.

---

## 🐳 Getting Started

### Prerequisites
Ensure you have the following installed on your local machine:
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js](https://nodejs.org/) (v20 or later; required by `swagger-jsdoc`)
- [npm](https://www.npmjs.com/)

### Environment Variables

Bu proje ortam değişkenleri için `.env` / `.env.example` konvansiyonunu kullanır:

| Dosya | Git | Amaç |
|---|---|---|
| `.env.example` | ✅ Tracked | Şablon — tüm değişkenleri varsayılan/boş değerleriyle gösterir |
| `.env` | 🚫 Ignored | Gerçek değerler — **asla commit'lenme** |

```bash
# Klonladıktan sonra ilk yapılacak iş:
cp .env.example .env
# Windows:
copy .env.example .env
```

Ardından `.env` içindeki değerleri ortamınıza göre düzenleyin. Mevcut değişkenler:

```ini
PORT=80          # HTTP portu (Docker: 80, local Node.js: 3000)
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=alumni_user
DB_PASSWORD=alumni_password
DB_NAME=alumni_portal
MYSQL_ROOT_PASSWORD=root_password
```

### Running with Docker (Recommended)
```bash
# 1. Clone the repository
git clone https://github.com/xanpvs/alumni.git
cd alumni

# 2. Ortam değişkenlerini hazırla
copy .env.example .env   # Windows
# cp .env.example .env   # macOS / Linux

# 3. Start services using Docker Compose
docker-compose up --build
```

Open [http://localhost](http://localhost) to see the portal. The backend serves the committed `public/index.html` and `public/about.html` files, so the website UI is included in a fresh clone and in the Docker image.

### Running locally
```bash
# 1. Ortam değişkenlerini hazırla
copy .env.example .env   # Windows
# cp .env.example .env   # macOS / Linux

# 2. MySQL'i başlat, bağımlılıkları kur, şema ve seed'i hazırla
docker compose up -d db
npm ci
npm run db:setup

# 3. Uygulamayı başlat
npm start
```

`npm run db:setup` migration'ları uygular ve başlangıç kayıtlarını MySQL'e yükler. Uygulama açılışında da seed işlemi güvenle tekrarlanır.

Then open [http://localhost:3000](http://localhost:3000). On Windows, `run.bat` starts the same Node.js server after dependencies are installed.

### Postman collection
Import `postman/collections/Alumni_Portal_API.postman_collection.json` into Postman to use the included health check and user CRUD requests. Its `baseUrl` defaults to `http://localhost`; change it to `http://localhost:3000` when using the local Node.js server.

---


## 🏗️ Architecture — MVC

Bu proje **MVC (Model-View-Controller)** mimarisini kullanır. Her katmanın tek bir sorumluluğu vardır; bu sayede kod okunabilir, test edilebilir ve genişletilebilir olarak kalır.

| Katman | Klasör | Sorumluluk |
|---|---|---|
| **Model** | `src/models/` | Veri kaynağı, seed verisi, temel CRUD yardımcıları |
| **Controller** | `src/controllers/` | İş mantığı, validasyon, HTTP yanıt oluşturma |
| **Router** | `src/routes/` | Yalnızca URL eşleme; ilgili controller fonksiyonunu çağırır. Swagger `@swagger` JSDoc blokları burada yer alır. |

> **View:** `/users` arayüzü EJS ile sunucu tarafında render edilir. `/users` rotaları listeleme, detay, ekleme, tam güncelleme, kısmi güncelleme ve silme işlemlerini EJS view ile sunar. `/api/users` JSON tabanlı API olarak çalışmaya devam eder.

### 📐 Data Design Documentation

Sistemin veri mimarisi, entity alanları, validasyon kuralları, seed verisi ve MySQL Store sözleşmesi için bkz: **[DATA_DESIGN.md](./DATA_DESIGN.md)**

Kısa özet:

- **Depolama:** MySQL; kayıtlar sunucu yeniden başlatıldığında korunur.
- **Başlangıç verisi:** `src/db/seed.js` belgelenmiş kayıtları factory'lerle idempotent biçimde DB'ye yükler.
- **Factories:** `build()` DB'ye yazmadan örnek veri üretir; async `create()` ilgili Store'a kaydeder.
- **Store sözleşmesi:** `src/db/store.interface.js` async CRUD metodlarını tanımlar; controller'lar DB ayrıntılarını bilmez.
- **Varlıklar:** [`User`](./src/models/user.model.js) · [`Announcement`](./src/models/announcement.model.js)
- **Store katmanı:** MySQL sorguları Store katmanında kalır; controller ve router'lar ortak CRUD sözleşmesini kullanır.

> **Zorunlu kural — DDD:** Yeni kaynak eklendiğinde veya mevcut model değiştirildiğinde `DATA_DESIGN.md` belgesi de aynı iş kapsamında güncellenmelidir. Alan değişiklikleri, yeni validasyon kuralları ve Store davranış farklılıkları bu belgede tutulur.

### 📣 Site Duyuruları

Sitede ana sayfanın üst menüsündeki **Duyuruları yönet** bağlantısı, duyuruların yayınlandığı ve yönetildiği `/announcements` arayüzünü açar. Bu ekrandan duyuru başlığı ve içeriği oluşturabilir; kategori ve yayınlayan bilgisi ekleyebilir; kayıtları listeleyebilir, ayrıntılarını görüntüleyebilir, düzenleyebilir ve silebilirsiniz. Örnek duyurular ilk açılışta hazır gelir.

Duyurular MySQL'de saklanır ve uygulama yeniden başlatıldığında korunur. Arayüz `/announcements` rotalarını, JSON API ise `/api/announcements` rotalarını kullanır. Web controller'ı `announcement.controller.js`, API controller'ı `apiAnnouncement.controller.js` dosyasındadır. API uç noktaları Swagger dokümantasyonunda da yer alır.

---

## 📁 Project Structure

```
alumni/
├── migrations/
│   ├── 001_create_users.sql        #   → users tablosu (DATA_DESIGN.md §7)
│   └── 002_create_announcements.sql #   → announcements tablosu
├── src/
│   ├── config/
│   │   └── swagger.js              # Swagger / OpenAPI 3.0 yapılandırması
│   ├── controllers/                # [Controller] İş mantığı ve HTTP yanıtları
│   │   ├── health.controller.js    #   → GET /api/health handler'ı
│   │   └── user.controller.js      #   → Users CRUD handler'ları
│   │   ├── announcement.controller.js # → Duyuru web arayüzü
│   │   └── apiAnnouncement.controller.js # → Duyuru JSON API
│   ├── db/                         # [DB] MySQL bağlantı ve migration altyapısı
│   │   ├── connection.js           #   → mysql2/promise bağlantı havuzu
│   │   └── migrate.js              #   → Migration runner (npm run migrate)
│   │   ├── seed.js                 #   → Uygulama başlangıcında başlangıç verisini yükler
│   │   └── factories/              #   → User ve Announcement örnek veri factory'leri
│   ├── models/                     # [Model] Veri katmanı
│   │   └── user.model.js           #   → In-memory users verisi ve CRUD fonksiyonları
│   │   └── announcement.model.js   #   → In-memory duyuru verisi ve CRUD
│   ├── routes/                     # [Router] URL eşleme + @swagger belgeleri
│   │   ├── announcements.routes.js #   → /announcements arayüz rotaları
│   │   └── api/
│   │       ├── health.routes.js    #   → /api/health rotaları
│   │       ├── users.routes.js     #   → /api/users rotaları
│   │       ├── announcements.routes.js # → /api/announcements rotaları
│   │       └── index.js            #   → API router birleştirici
│   └── index.js                    # Express uygulama girişi, middleware, legacy rotalar
├── views/
│   ├── users.ejs                   #   → Kullanıcı arayüzü
│   └── announcements.ejs           #   → Duyuru yönetim arayüzü
├── public/
│   ├── index.html                  # Statik ana sayfa
│   └── about.html                  # Statik hakkımızda sayfası
├── postman/
│   └── collections/
│       └── Alumni_Portal_API.postman_collection.json
├── .env.example                    # Ortam değişkenleri şablonu (tracked)
├── .env                            # Gerçek değerler — git ignored
├── .gitignore
├── .dockerignore                   # Build context dışındaki gizli/üretilmiş dosyalar
├── Dockerfile
├── docker-compose.yml
├── package.json
├── DATA_DESIGN.md                  # Veri mimarisi ve entity belgeleri
└── README.md
```

### Geliştirici Kuralları

- **Yeni bir API kaynağı eklerken** şu adımları izle:
  1. `src/models/<kaynak>.model.js` — veri ve CRUD yardımcıları
  2. `src/controllers/<kaynak>.controller.js` — iş mantığı ve handler'lar
  3. `src/routes/api/<kaynak>.routes.js` — URL eşleme ve `@swagger` blokları
  4. `src/routes/api/index.js` — yeni router'ı bağla
- **Swagger belgeleri** yalnızca `src/routes/` altında tutulur; `swagger-jsdoc` bu klasörü tarar.
- **Veri katmanı** MySQL kullanır. Yeni Store'lar `src/db/store.interface.js` async CRUD sözleşmesini uygular; Controller ve Router katmanları doğrudan SQL çalıştırmaz.

---

## 🧩 Data Models

Tüm varlıkların (User, Announcement) alan tanımları, validasyon kuralları, Store sözleşmesi ve seed verisi için bkz: **[DATA_DESIGN.md](./DATA_DESIGN.md)**

Bu belge projenin tek yetkili veri tasarım belgesidir. Yeni model eklendiğinde veya mevcut model değiştirildiğinde `DATA_DESIGN.md` güncellenmesi zorunludur.

### Kısa Başvuru — User

Dosya: [`src/models/user.model.js`](./src/models/user.model.js)

| Alan | Tür | Zorunlu | Varsayılan |
|---|---|---|---|
| `id` | integer | ✅ otomatik | Auto-increment |
| `name` | string | ✅ | — |
| `email` | string (tekil) | ✅ | — |
| `role` | `Alumni` · `Faculty` · `Admin` | ❌ | `Alumni` |
| `department` | string | ❌ | `Genel` |
| `createdAt` | ISO 8601 | ✅ otomatik | `new Date()` |
| `updatedAt` | ISO 8601 | ❌ | — |

### Kısa Başvuru — Announcement

Dosya: [`src/models/announcement.model.js`](./src/models/announcement.model.js)

| Alan | Tür | Zorunlu | Varsayılan |
|---|---|---|---|
| `id` | integer | ✅ otomatik | Auto-increment |
| `title` | string (maks. 160 karakter) | ✅ | — |
| `content` | string | ✅ | — |
| `author` | string | ❌ | `Alumni Portal` |
| `category` | string | ❌ | `Genel` |
| `createdAt` | ISO 8601 | ✅ otomatik | `new Date()` |
| `updatedAt` | ISO 8601 | ❌ | — |

---

## 📄 License


This project is developed for educational and academic collaboration purposes.
