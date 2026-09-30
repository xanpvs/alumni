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
- **Architecture:** RESTful API (JSON-driven)

---

## 📖 Canlı & Dinamik API Dokümantasyonu (Swagger UI)

Geçmiş API uç noktaları ve yeni eklenenler için OpenAPI 3.0 dokümantasyonu uygulama açılırken kaynak dosyalardaki `@swagger` açıklamalarından oluşturulur. Böylece yeni sunucu başlangıcında Swagger UI ve ham JSON belgesi güncel rotaları gösterir.

- 🔗 **Swagger UI Bağlantısı:** [http://localhost/api/swagger](http://localhost/api/swagger) *(veya `http://localhost:3000/api/swagger`)*
- 📄 **Ham OpenAPI JSON:** [http://localhost/api/swagger.json](http://localhost/api/swagger.json)
- ⚡ **Dinamik güncelleme:** `src/routes/**/*.js` ve `src/index.js` dosyaları sunucu başlangıcında taranır. OpenAPI belgesi bu dosyalardaki `@swagger` JSDoc açıklamalarından üretilir.
- 📝 **Geliştirici kuralı:** Her yeni API uç noktası için, ilgili Express rotasının yanına bir `@swagger` bloğu ekleyin; mevcut uç noktanın metodu, yolu, parametreleri, istek gövdesi veya yanıtı değiştiğinde bu bloğu da güncelleyin. Kod değişikliği tek başına dokümantasyonu güncellemez. Değişikliklerden sonra sunucuyu yeniden başlatın; belge yeniden oluşturulup `/api/swagger` ve `/api/swagger.json` üzerinden sunulur. Pull request/commit'e dokümantasyon açıklamasını da dahil edin.
- 🧪 **Sayfa İçi Canlı İstek:** Swagger UI üzerinden "Try it out" butonuna tıklayarak GET, POST, PUT, PATCH ve DELETE isteklerini tarayıcınızdan canlı çalıştırabilirsiniz.

---

## 📡 API Endpoints

All backend endpoints communicate using standard **JSON** format.

| Method | Endpoint | Description | Request Body (JSON) | Response Format |
|---|---|---|---|---|
| `GET` | `/api/swagger` | Interaktif Swagger UI API Dokümantasyonu | *None* | `HTML UI` |
| `GET` | `/api/swagger.json` | OpenAPI 3.0 JSON Şeması | *None* | `JSON` |
| `GET` | `/api/health` | API health check and server status | *None* | `{"status":"ok", "message":"...", "timestamp":"..."}` |
| `GET` | `/api/users` | Retrieve all registered users | *None* | `[{"id":1, "name":"...", "email":"...", ...}]` |
| `GET` | `/api/users/:id` | Retrieve single user by ID | *None* | `{"id":2, "name":"...", "email":"...", ...}` |
| `POST` | `/api/users` | Register a new user | `{ "name", "email", "role", "department" }` | `{"success":true, "message":"...", "user":{...}}` (HTTP 201) |
| `PUT` | `/api/users/:id` | Full replacement/update of user | Full object: `{ "name", "email", "role", "department" }` | `{"success":true, "message":"...", "user":{...}}` (HTTP 200) |
| `PATCH` | `/api/users/:id` | Partial update of user | Partial fields: e.g. `{ "department": "..." }` | `{"success":true, "message":"...", "user":{...}}` (HTTP 200) |
| `DELETE` | `/api/users/:id` | Delete user by ID | *None* | `{"success":true, "message":"...", "user":{...}}` (HTTP 200) |

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

### Running with Docker (Recommended)
```bash
# 1. Clone the repository
git clone https://github.com/xanpvs/alumni.git
cd alumni

# 2. Start services using Docker Compose
docker-compose up --build
```

---

## 📄 License

This project is developed for educational and academic collaboration purposes.
