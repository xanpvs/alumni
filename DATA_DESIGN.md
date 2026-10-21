# Data Design Documentation

> Bu belge, **Alumni Portal** arka yüzünün veri mimarisini tanımlar.
> Yeni kaynak eklenirken, mevcut model değiştirilirken veya veritabanına geçiş planlanırken
> bu belgeden referans alınmalı ve belge güncel tutulmalıdır.

---

## İçindekiler

1. [Genel Mimari](#1-genel-mimari)
2. [Veri Katmanı Sözleşmesi](#2-veri-katmanı-sözleşmesi)
3. [Varlıklar (Entities)](#3-varlıklar-entities)
   - 3.1 [User](#31-user)
   - 3.2 [Announcement](#32-announcement)
   - 3.3 [JobPosting](#33-jobposting)
   - 3.4 [Application](#34-application)
4. [Validasyon Kuralları](#4-validasyon-kuralları)
5. [Seed (Başlangıç) Verisi](#5-seed-başlangıç-verisi)
6. [Veri Akışı](#6-veri-akışı)
7. [MySQL Kurulumu ve Migration](#7-mysql-kurulumu-ve-migration)
8. [Geliştirici Kuralları](#8-geliştirici-kuralları)

---

## 1. Genel Mimari

Sistem kalıcı depolama için **MySQL** kullanır. Router → Controller → Model Store akışı ortak asenkron CRUD sözleşmesini izler; MySQL bağlantı ve sorguları Store katmanında kalır. Sunucu açılırken seed verisi DB'de eksik olan kayıtları tamamlar.

```
┌─────────────────────────────────────────────────────────┐
│                     Express App                         │
│  ┌──────────┐    ┌───────────────┐    ┌─────────────┐  │
│  │  Router  │───▶│  Controller   │───▶│    Model    │  │
│  │(routes/) │    │(controllers/) │    │  (models/)  │  │
│  └──────────┘    └───────────────┘    └──────┬──────┘  │
│                                              │          │
│                                    ┌─────────▼────────┐ │
│                                    │  MySQL Store     │ │
│                                    │  (mysql2/promise)│ │
│                                    └──────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Katmanlar:**

| Katman | Dosyalar | Sorumluluk |
|---|---|---|
| Router | `src/routes/**/*.js` | URL eşleme, Swagger `@swagger` JSDoc blokları |
| Controller | `src/controllers/*.js` | HTTP istek/yanıt yönetimi, iş mantığı |
| Model / Store | `src/models/*.model.js` | Veri yapısı, validasyon, MySQL CRUD operasyonları |
| DB Interface | `src/db/store.interface.js` | Async CRUD metotlarının ortak sözleşmesi |

---

## 2. Veri Katmanı Sözleşmesi

Tüm Store CRUD metodları asenkrondur ve tutarlı bir sonuç nesnesi döner:

```ts
// Başarılı sonuç
{ success: true, <entity>: <EntityInstance> }

// Hatalı sonuç
{ success: false, error: string, code?: string }
```

Bu tasarım sayesinde Controller katmanı `try/catch` yazmak zorunda kalmaz; yalnızca `result.success` değerini kontrol eder.

```js
// Controller örneği
const result = await UserStore.create(req.body);
if (!result.success) return res.status(400).json({ success: false, error: result.error });
res.status(201).json({ success: true, user: result.user });
```

---

## 3. Varlıklar (Entities)

### 3.1 User

**Dosya:** [`src/models/user.model.js`](./src/models/user.model.js)

Kullanıcıyı temsil eder. Sistem üç rol destekler: mezun (`Alumni`), akademisyen (`Faculty`), yönetici (`Admin`).

#### Alan Tanımları

| Alan | Tür | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|---|
| `id` | `integer` | ✅ (otomatik) | Auto-increment | Benzersiz pozitif tam sayı kimlik |
| `name` | `string` | ✅ | — | Kullanıcının tam adı; boşlukları trim edilir |
| `email` | `string` | ✅ | — | E-posta adresi; küçük harfe normalize edilir, sistemde tekil olmalı |
| `role` | `enum` | ❌ | `Alumni` | Geçerli değerler: `Alumni` · `Faculty` · `Admin` |
| `department` | `string` | ❌ | `Genel` | Bölüm veya anabilim dalı adı |
| `createdAt` | `ISO 8601` | ✅ (otomatik) | `new Date()` | Kaydın oluşturulma zamanı |
| `updatedAt` | `ISO 8601` | ❌ | — | Son güncelleme zamanı; yalnızca PUT/PATCH sonrası set edilir |

#### JSON Örneği

```json
{
  "id": 1,
  "name": "Berat Çelik",
  "email": "berat@alumni.edu",
  "role": "Alumni",
  "department": "Bilgisayar Mühendisliği",
  "createdAt": "2026-09-20T10:00:00.000Z"
}
```

#### CRUD Operasyonları

| Metod | HTTP | Açıklama |
|---|---|---|
| `UserStore.create(data)` | `POST /api/users` | Yeni kullanıcı oluşturur; e-posta format ve tekil kontrolü |
| `UserStore.getAll()` | `GET /api/users` | Tüm kullanıcıları defensive copy olarak döner |
| `UserStore.getById(id)` | `GET /api/users/:id` | ID ile tek kullanıcı; bulunamazsa `success: false` |
| `UserStore.update(id, data)` | `PUT /api/users/:id` | Tüm alanları yeniden yazar; `createdAt` korunur, `updatedAt` güncellenir |
| `UserStore.patch(id, data)` | `PATCH /api/users/:id` | Yalnızca gönderilen alanları günceller |
| `UserStore.delete(id)` | `DELETE /api/users/:id` | Kullanıcıyı depodan kaldırır; silinen kaydı döner |

---

### 3.2 Announcement

**Dosya:** [`src/models/announcement.model.js`](./src/models/announcement.model.js)

Platform duyurularını temsil eder. Etkinlikler, haberler ve genel bilgilendirme için kullanılır.

#### Alan Tanımları

| Alan | Tür | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|---|
| `id` | `integer` | ✅ (otomatik) | Auto-increment | Benzersiz pozitif tam sayı kimlik |
| `title` | `string` | ✅ | — | Duyuru başlığı; maks. 160 karakter |
| `content` | `string` | ✅ | — | Duyuru tam metni |
| `author` | `string` | ❌ | `Alumni Portal` | Yayınlayan kişi veya birim adı |
| `category` | `string` | ❌ | `Genel` | Duyuru kategorisi (örn. `Etkinlik`, `Haber`, `Genel`) |
| `createdAt` | `ISO 8601` | ✅ (otomatik) | `new Date()` | Kaydın oluşturulma zamanı |
| `updatedAt` | `ISO 8601` | ❌ | — | Son güncelleme zamanı; yalnızca PUT/PATCH sonrası set edilir |

#### JSON Örneği

```json
{
  "id": 1,
  "title": "Alumni Portal'a Hoş Geldiniz",
  "content": "Mezunlar ve akademisyenler için duyuruları buradan takip edebilirsiniz.",
  "author": "Alumni Portal",
  "category": "Genel",
  "createdAt": "2026-09-20T10:00:00.000Z"
}
```

#### CRUD Operasyonları

| Metod | HTTP | Açıklama |
|---|---|---|
| `AnnouncementStore.create(data)` | `POST /api/announcements` | Yeni duyuru oluşturur; listeye en başa eklenir (unshift) |
| `AnnouncementStore.getAll()` | `GET /api/announcements` | Tüm duyuruları kopya olarak döner |
| `AnnouncementStore.getById(id)` | `GET /api/announcements/:id` | ID ile tek duyuru |
| `AnnouncementStore.update(id, data)` | `PUT /api/announcements/:id` | Tüm alanları yeniden yazar |
| `AnnouncementStore.patch(id, data)` | `PATCH /api/announcements/:id` | Yalnızca gönderilen alanları günceller |
| `AnnouncementStore.delete(id)` | `DELETE /api/announcements/:id` | Duyuruyu depodan kaldırır |

---

### 3.3 JobPosting

**Dosya:** [`src/models/jobPosting.model.js`](./src/models/jobPosting.model.js)

İş ilanlarını temsil eder. Alumni ve akademisyenler iş fırsatları, staj pozisyonları ve araştırma işbirlikleri ilan edebilir.

#### Alan Tanımları

| Alan | Tür | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|---|
| `id` | `integer` | ✅ (otomatik) | Auto-increment | Benzersiz pozitif tam sayı kimlik |
| `title` | `string` | ✅ | — | İlan başlığı; maks. 255 karakter |
| `description` | `string` | ✅ | — | İş tanımı ve gereksinimler |
| `company` | `string` | ✅ | — | Şirket veya kurum adı |
| `location` | `string` | ❌ | `Uzaktan` | Çalışma konumu (ör. `İstanbul`, `Uzaktan`, `Hibrit`) |
| `type` | `enum` | ❌ | `Full-time` | İlan türü: `Full-time` · `Part-time` · `Internship` · `Contract` |
| `salary_range` | `string` | ❌ | `NULL` | Maaş aralığı (ör. `15.000 - 20.000 TL`) |
| `posted_by` | `integer` (FK) | ❌ | `NULL` | İlanı oluşturan kullanıcının `users.id`'si |
| `status` | `enum` | ❌ | `Active` | İlan durumu: `Active` · `Closed` |
| `deadline` | `DATE` | ❌ | `NULL` | Başvuru son tarihi |
| `created_at` | `ISO 8601` | ✅ (otomatik) | `new Date()` | Kaydın oluşturulma zamanı |
| `updated_at` | `ISO 8601` | ❌ | — | Son güncelleme zamanı; yalnızca PUT/PATCH sonrası set edilir |

> **Foreign Key:** `posted_by` → `users(id)` ilişkisi `ON DELETE SET NULL` ile tanımlanır; kullanıcı silindiğinde ilan korunur, `posted_by` alanı `NULL` olur.

#### JSON Örneği

```json
{
  "id": 1,
  "title": "Backend Developer",
  "description": "Node.js ve Express ile REST API geliştirme deneyimi aranıyor.",
  "company": "TechCorp A.Ş.",
  "location": "İstanbul / Uzaktan",
  "type": "Full-time",
  "salary_range": "25.000 - 35.000 TL",
  "posted_by": 2,
  "status": "Active",
  "deadline": "2026-12-31",
  "created_at": "2026-10-21T10:00:00.000Z"
}
```

#### CRUD Operasyonları

| Metod | HTTP | Açıklama |
|---|---|---|
| `JobPostingStore.create(data)` | `POST /api/job-postings` | Yeni ilan oluşturur; `title`, `description`, `company` zorunludur |
| `JobPostingStore.getAll()` | `GET /api/job-postings` | Tüm ilanları döner; opsiyonel `status` ve `type` filtresi desteklenir |
| `JobPostingStore.getById(id)` | `GET /api/job-postings/:id` | ID ile tek ilan; bulunamazsa `success: false` |
| `JobPostingStore.update(id, data)` | `PUT /api/job-postings/:id` | Tüm alanları yeniden yazar; `created_at` korunur, `updated_at` güncellenir |
| `JobPostingStore.patch(id, data)` | `PATCH /api/job-postings/:id` | Yalnızca gönderilen alanları günceller |
| `JobPostingStore.delete(id)` | `DELETE /api/job-postings/:id` | İlanı depodan kaldırır; silinen kaydı döner |

---

### 3.4 Application

**Dosya:** [`src/models/application.model.js`](./src/models/application.model.js)

İş ilanlarına yapılan başvuruları temsil eder. Kullanıcılar (`users`) ve iş ilanları (`job_postings`) arasındaki çoka-çok ilişkiyi kurar. Bir kullanıcının aynı ilana birden fazla başvuru yapması `UNIQUE(job_posting_id, applicant_id)` kısıtı ile engellenir.

#### Alan Tanımları

| Alan | Tür | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|---|
| `id` | `integer` | ✅ (otomatik) | Auto-increment | Benzersiz pozitif tam sayı kimlik |
| `job_posting_id` | `integer` (FK) | ✅ | — | Başvurulan ilanın `job_postings.id`'si |
| `applicant_id` | `integer` (FK) | ✅ | — | Başvuran kullanıcının `users.id`'si |
| `cover_letter` | `text` | ❌ | `NULL` | Başvuru ön yazısı / motivasyon mektubu |
| `status` | `enum` | ❌ | `Pending` | Başvuru durumu: `Pending` · `Reviewed` · `Accepted` · `Rejected` |
| `applied_at` | `ISO 8601` | ✅ (otomatik) | `new Date()` | Başvuru oluşturulma tarihi |
| `updated_at` | `ISO 8601` | ❌ | — | Son güncelleme zamanı; durum/yazı güncellendiğinde değişir |

> **İlişkiler & Cascades:**
> - `job_posting_id` → `job_postings(id) ON DELETE CASCADE`: İlan silindiğinde ilişkili tüm başvurular otomatik silinir.
> - `applicant_id` → `users(id) ON DELETE CASCADE`: Kullanıcı silindiğinde başvuruları da otomatik silinir.
> - Tekillik: Bir aday aynı ilana yalnızca bir kez başvurabilir (`UNIQUE (job_posting_id, applicant_id)`).

#### JSON Örneği

```json
{
  "id": 1,
  "jobPostingId": 1,
  "applicantId": 3,
  "coverLetter": "İlanınızla yakından ilgileniyorum, CV'm ektedir.",
  "status": "Pending",
  "appliedAt": "2026-10-21T10:15:00.000Z"
}
```

#### CRUD Operasyonları (Direct & Nested Routes)

| Metod | HTTP | Açıklama |
|---|---|---|
| `ApplicationStore.create(data)` | `POST /api/applications` | Yeni başvuru oluşturur (`job_posting_id` ve `applicant_id` zorunlu) |
| `ApplicationStore.create(data)` | `POST /api/job-postings/:jobPostingId/applications` | İlan altına doğrudan başvuru ekler (`job_posting_id` URL'den alınır) |
| `ApplicationStore.create(data)` | `POST /api/users/:userId/applications` | Kullanıcı adına başvuru ekler (`applicant_id` URL'den alınır) |
| `ApplicationStore.getAll()` | `GET /api/applications` | Tüm başvuruları listeler (opsiyonel `status` filtresi) |
| `ApplicationStore.getAll({ jobPostingId })` | `GET /api/job-postings/:jobPostingId/applications` | Belirli bir ilana yapılmış tüm başvuruları listeler |
| `ApplicationStore.getAll({ applicantId })` | `GET /api/users/:userId/applications` | Belirli bir kullanıcının yaptığı tüm başvuruları listeler |
| `ApplicationStore.getById(id)` | `GET /api/applications/:id` | Başvuru detayını döner |
| `ApplicationStore.update(id, data)` | `PUT /api/applications/:id` | Durum ve ön yazıyı günceller |
| `ApplicationStore.patch(id, data)` | `PATCH /api/applications/:id` | `cover_letter` veya `status` alanını günceller |
| `ApplicationStore.delete(id)` | `DELETE /api/applications/:id` | Başvuruyu geri çeker / siler |

---

## 4. Validasyon Kuralları

### User Validasyonu

| Alan | Kural | Hata Mesajı |
|---|---|---|
| `name` | Zorunlu, string, boş olamaz | `İsim (name) alanı zorunludur ve metin olmalıdır.` |
| `email` | Zorunlu, `isim@domain.tld` formatı, sistemde tekil | `Lütfen geçerli bir e-posta adresi girin.` |
| `email` (tekil) | Aynı e-posta başka kayıtta yoksa izin verilir | `Bu e-posta adresi (...) zaten kayıtlı.` |
| `role` | Opsiyonel; `Alumni` · `Faculty` · `Admin` dışında reddedilir | `Geçersiz rol. İzin verilenler: Alumni, Faculty, Admin.` |

> **PUT vs PATCH:** `PUT`'ta `name` ve `email` zorunludur. `PATCH`'te yalnızca gönderilen alanlar doğrulanır; hiçbir alan gönderilmemişse istek reddedilir.

### Announcement Validasyonu

| Alan | Kural | Hata Mesajı |
|---|---|---|
| `title` | Zorunlu, string, maks. 160 karakter | `Başlık (title) zorunludur.` / `Başlık en fazla 160 karakter olabilir.` |
| `content` | Zorunlu, string, boş olamaz | `İçerik (content) zorunludur.` |

### JobPosting Validasyonu

| Alan | Kural | Hata Mesajı |
|---|---|---|
| `title` | Zorunlu, string, maks. 255 karakter | `İlan başlığı (title) zorunludur.` / `Başlık en fazla 255 karakter olabilir.` |
| `description` | Zorunlu, string, boş olamaz | `İş tanımı (description) zorunludur.` |
| `company` | Zorunlu, string, boş olamaz | `Şirket adı (company) zorunludur.` |
| `type` | Opsiyonel; `Full-time` · `Part-time` · `Internship` · `Contract` dışında reddedilir | `Geçersiz ilan türü. İzin verilenler: Full-time, Part-time, Internship, Contract.` |
| `status` | Opsiyonel; `Active` · `Closed` dışında reddedilir | `Geçersiz durum. İzin verilenler: Active, Closed.` |
| `posted_by` | Opsiyonel; pozitif tam sayı, `users.id`'de var olmalı | `Geçersiz kullanıcı ID'si.` |
| `deadline` | Opsiyonel; `YYYY-MM-DD` formatında geçerli tarih | `Geçersiz tarih formatı. Beklenen: YYYY-MM-DD.` |

> **PUT vs PATCH:** `PUT`'ta `title`, `description` ve `company` zorunludur. `PATCH`'te yalnızca gönderilen alanlar doğrulanır; hiçbir alan gönderilmemişse istek reddedilir.

### Application Validasyonu

| Alan | Kural | Hata Mesajı |
|---|---|---|
| `job_posting_id` | Zorunlu (create), pozitif tamsayı, `job_postings.id`'de bulunmalı | `Geçerli bir job_posting_id zorunludur.` |
| `applicant_id` | Zorunlu (create), pozitif tamsayı, `users.id`'de bulunmalı | `Geçerli bir applicant_id zorunludur.` |
| `status` | Opsiyonel; `Pending` · `Reviewed` · `Accepted` · `Rejected` | `Geçersiz durum. İzin verilenler: Pending, Reviewed, Accepted, Rejected.` |
| `cover_letter` | Opsiyonel; metin | — |

> **Not:** Bir başvuru oluşturulduktan sonra `job_posting_id` ve `applicant_id` değiştirilemez. Yalnızca durum (`status`) ve ön yazı (`cover_letter`) güncellenebilir. Çift başvuru durumunda `409 Conflict` ("Bu kullanıcı bu ilana zaten başvurmuş.") döner.

---

## 5. Seed (Başlangıç) Verisi

`src/db/seed.js`, aşağıdaki kayıtları factory'ler üzerinden MySQL Store'larına yükler. Kullanıcılar e-posta, duyurular başlık üzerinden tanınır; seed tekrar çalıştırıldığında var olan kayıtlar çoğaltılmaz. Factory'lerin `build()` metotları DB'ye dokunmadan örnek veri üretir, async `create()` metotları ilgili Store'un validasyon ve DB yazma akışını kullanır.

### Users

| ID | name | email | role | department |
|---|---|---|---|---|
| 1 | Berat Çelik | berat@alumni.edu | Alumni | Bilgisayar Mühendisliği |
| 2 | Prof. Dr. Ayşe Yılmaz | ayse.yilmaz@faculty.edu | Faculty | Yazılım Mühendisliği |
| 3 | Emre Kaya | emre.kaya@alumni.edu | Alumni | Elektrik-Elektronik Mühendisliği |

### Announcements

| ID | title | author | category |
|---|---|---|---|
| 1 | Alumni Portal'a Hoş Geldiniz | Alumni Portal | Genel |
| 2 | Mezunlar Buluşması | Alumni Portal | Etkinlik |

### JobPostings

| ID | title | company | type | posted_by | status |
|---|---|---|---|---|---|
| 1 | Backend Developer | TechCorp A.Ş. | Full-time | 2 | Active |
| 2 | Yazılım Stajyeri | StartupX | Internship | 1 | Active |

### Applications

| ID | job_posting_id | applicant_id | status | cover_letter |
|---|---|---|---|---|
| 1 | 1 | 3 | Pending | Backend pozisyonuna başvurmak istiyorum. |
| 2 | 2 | 1 | Reviewed | Staj programınız hakkında bilgi almak istiyorum. |

> **Not:** Seed uygulama başlangıcında çalışır ve ayrıca `npm run seed` komutuyla çağrılabilir. Mevcut kayıtları silmez veya sıfırlamaz.

### Factory kullanımı

```js
const { UserFactory } = require('./src/db/factories/user.factory');
const { AnnouncementFactory } = require('./src/db/factories/announcement.factory');
const { JobPostingFactory } = require('./src/db/factories/jobPosting.factory');

const userInput = UserFactory.build({ role: 'Faculty' }); // Store'u değiştirmez
const announcementResult = await AnnouncementFactory.create({ category: 'Etkinlik' });
const jobPostingResult = await JobPostingFactory.create({ type: 'Internship', status: 'Active' });
```

---

## 6. Veri Akışı

```
HTTP İsteği
    │
    ▼
Router (src/routes/)
  ├── URL eşleme
  └── Controller fonksiyonunu çağırır
          │
          ▼
Controller (src/controllers/)
  ├── req.body / req.params okur
  ├── Store metodunu çağırır
  └── result.success kontrolü yapar
          │
          ▼
Model / Store (src/models/)
  ├── Validasyon
  ├── Tekil kontrol (email)
  ├── MySQL CRUD (parameterized queries)
  └── { success, entity } döner
          │
          ▼
Controller
  └── HTTP yanıtı (JSON veya EJS render)
```

### ID Üretimi

Her iki tabloda da `AUTO_INCREMENT` kullanılır; ID üretimini MySQL yapar.

---

## 7. MySQL Kurulumu ve Migration

CRUD store'ları MySQL'e bağlıdır. Controller ve Router katmanları DB bağlantısını doğrudan kullanmaz; `src/db/store.interface.js` ortak async CRUD sözleşmesini uygular.

### Migration Sistemi

Proje hazır bir migration altyapısına sahiptir:

```
migrations/
  001_create_users.sql          ← DATA_DESIGN.md §3.1 users tablosu
  002_create_announcements.sql  ← DATA_DESIGN.md §3.2 announcements tablosu
  003_create_job_postings.sql   ← DATA_DESIGN.md §3.3 job_postings tablosu
  004_create_applications.sql   ← DATA_DESIGN.md §3.4 applications tablosu

src/db/
  connection.js   ← mysql2/promise bağlantı havuzu
  migrate.js      ← Migration runner (sıralı SQL, _migrations tablosu)
  seed.js         ← DB'de eksik başlangıç kayıtlarını factory ile yükler
  store.interface.js ← Async CRUD store sözleşmesi
  factories/      ← User, Announcement, JobPosting ve Application örnek veri üreticileri
```

**Çalışma mantığı (`src/db/migrate.js`):**
- `migrations/` klasöründeki `*.sql` dosyalarını ada göre sıralı çalıştırır.
- Veritabanında `_migrations` tablosu tutar; daha önce uygulanmış dosyaları atlar.
- **Idempotent** — aynı ortamda birden fazla çalıştırmak güvenlidir.

### Tablo Şemaları

Şemalar `migrations/` dosyalarındaki canonical SQL'den türetilmiştir:

#### `users` — [`migrations/001_create_users.sql`](./migrations/001_create_users.sql)

```sql
CREATE TABLE IF NOT EXISTS users (
  id           INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(255)    NOT NULL,
  email        VARCHAR(255)    NOT NULL UNIQUE,
  role         ENUM('Alumni','Faculty','Admin') NOT NULL DEFAULT 'Alumni',
  department   VARCHAR(255)    NOT NULL DEFAULT 'Genel',
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME        NULL ON UPDATE CURRENT_TIMESTAMP
);
```

#### `announcements` — [`migrations/002_create_announcements.sql`](./migrations/002_create_announcements.sql)

```sql
CREATE TABLE IF NOT EXISTS announcements (
  id           INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(160)    NOT NULL,
  content      TEXT            NOT NULL,
  author       VARCHAR(255)    NOT NULL DEFAULT 'Alumni Portal',
  category     VARCHAR(100)    NOT NULL DEFAULT 'Genel',
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME        NULL ON UPDATE CURRENT_TIMESTAMP
);
```

#### `job_postings` — [`migrations/003_create_job_postings.sql`](./migrations/003_create_job_postings.sql)

```sql
CREATE TABLE IF NOT EXISTS job_postings (
  id           INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255)    NOT NULL,
  description  TEXT            NOT NULL,
  company      VARCHAR(255)    NOT NULL,
  location     VARCHAR(255)    NOT NULL DEFAULT 'Uzaktan',
  type         ENUM('Full-time','Part-time','Internship','Contract') NOT NULL DEFAULT 'Full-time',
  salary_range VARCHAR(100)    NULL,
  posted_by    INT UNSIGNED    NULL,
  status       ENUM('Active','Closed') NOT NULL DEFAULT 'Active',
  deadline     DATE            NULL,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME        NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
);
```

#### `applications` — [`migrations/004_create_applications.sql`](./migrations/004_create_applications.sql)

```sql
CREATE TABLE IF NOT EXISTS applications (
  id             INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  job_posting_id INT UNSIGNED    NOT NULL,
  applicant_id   INT UNSIGNED    NOT NULL,
  cover_letter   TEXT            NULL,
  status         ENUM('Pending','Reviewed','Accepted','Rejected') NOT NULL DEFAULT 'Pending',
  applied_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME        NULL ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_application (job_posting_id, applicant_id),
  FOREIGN KEY (job_posting_id) REFERENCES job_postings(id) ON DELETE CASCADE,
  FOREIGN KEY (applicant_id)   REFERENCES users(id)        ON DELETE CASCADE
);
```

### Migration Çalıştırma

#### Docker ile (önerilen)

```bash
# MySQL, migrator ve backend'i başlat:
docker compose up --build
# db sağlıklı → migrator şemayı kurar → backend seed eder ve başlar.
```

#### Lokal Node.js ile

```bash
# MySQL'i başlat, ardından şema ve seed'i sırayla kur:
npm run db:setup
```

Uygulama MySQL ile çalışır. Yerel kurulum için `.env` ayarlarından sonra `npm run db:setup` ve `npm start`; Docker kurulumunda `docker compose up --build` kullanılır.

---

## 8. Geliştirici Kuralları

### Yeni Kaynak Ekleme

Yeni bir veri kaynağı eklenirken şu sıra izlenmelidir:

```
1. src/models/<kaynak>.model.js       — Entity sınıfı, Store, validasyon
2. src/controllers/<kaynak>.controller.js  — HTTP handler'lar
3. src/routes/api/<kaynak>.routes.js  — URL eşleme + @swagger blokları
4. src/routes/api/index.js            — Yeni router'ı bağla
5. DATA_DESIGN.md                     — Bu belgeyi güncelle
6. README.md                          — Endpoint tablosunu güncelle
```

### Mevcut Kaynağı Değiştirme

- Alan eklendiğinde veya kaldırıldığında: **Entity** sınıfını, **Store validasyonunu**, **Swagger şemasını** ve bu belgedeki alan tablosunu güncelle.
- Validasyon kuralı değiştiğinde: **Store** metodunu ve bu belgedeki [Validasyon Kuralları](#4-validasyon-kuralları) bölümünü güncelle.
- HTTP yanıt formatı değiştiğinde: **Controller**'ı ve Swagger `@swagger` bloğunu güncelle.

### Veri Bütünlüğü

- DB sorgularında kullanıcı verisini parametre bağlama ile geçir; SQL string'ine doğrudan ekleme yapma.
- ID üretimi tabloların `AUTO_INCREMENT` alanına aittir.
