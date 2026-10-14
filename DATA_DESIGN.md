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

> **Not:** Seed uygulama başlangıcında çalışır ve ayrıca `npm run seed` komutuyla çağrılabilir. Mevcut kayıtları silmez veya sıfırlamaz.

### Factory kullanımı

```js
const { UserFactory } = require('./src/db/factories/user.factory');
const { AnnouncementFactory } = require('./src/db/factories/announcement.factory');

const userInput = UserFactory.build({ role: 'Faculty' }); // Store'u değiştirmez
const announcementResult = await AnnouncementFactory.create({ category: 'Etkinlik' });
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

src/db/
  connection.js   ← mysql2/promise bağlantı havuzu
  migrate.js      ← Migration runner (sıralı SQL, _migrations tablosu)
  seed.js         ← DB'de eksik başlangıç kayıtlarını factory ile yükler
  store.interface.js ← Async CRUD store sözleşmesi
  factories/      ← User ve Announcement örnek veri üreticileri
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
