# 📓 2. Hafta Çalışma Notları (Week 2 Notes)

**Tarih:** 23 Eylül 2026  
**Proje:** Alumni Portal - Backend API  
**Konu:** Backend Sunucu Kurulumu, REST Rotaları, Dinamik Parametreler ve Geçici Ön Yüz Sayfaları  

---

## 📌 Bugün Neler Yaptık? (Adım Adım Özet)

### 1. Adım: README Analizi ve Proje Gereksinimlerinin Belirlenmesi
- Depoda yer alan `README.md` dosyası incelendi.
- Projenin **Node.js (JavaScript)**, **MySQL**, **Docker / Docker Compose** ve **RESTful API** mimarisi kullanacağı tespit edildi.

### 2. Adım: Proje Altyapısının Sıfırdan Kurulması
- `package.json` oluşturuldu ve gerekli bağımlılıklar (`express`, `cors`, `dotenv`) eklendi.
- `.env` ve `.env.example` ortam dosyaları tanımlandı.
- `node_modules/`, geçici dosyalar ve gizli ortam değişkenleri için `.gitignore` dosyası oluşturuldu.
- `Dockerfile` ve `docker-compose.yml` dosyaları README standartlarına göre hazırlanarak MySQL ve Node.js konteyner yapıları kuruldu.

### 3. Adım: Sunucunun Port 80 ve 3000 Üzerinde Yayına Alınması
- Tarayıcıda ek bir port yazmaya gerek kalmadan sadece `http://localhost` yazılarak siteye girilebilmesi için varsayılan HTTP portu **80** yapılandırıldı.
- Geliştirme ortamlarına uyumluluk için alternatif **Port 3000** desteği de sağlandı.
- İlk aşamada `GET /` rotasına gidildiğinde ekranda **`ok`** yazısı görüntülendi.

### 4. Adım: İlk GET Uç Noktası (`/hello`)
- `GET /hello` rotası eklendi.
- Tarayıcıdan bu adrese girildiğinde ekrana **`Hello World`** yazdırıldı.

### 5. Adım: Dinamik Parametrik Rota (`/hello/:name`)
- URL üzerinden dinamik olarak gönderilen isimleri karşılayan `/hello/:name` rotası eklendi.
- Girilen ismin baş harfini otomatik büyüterek kişiselleştirilmiş selamlama sağlandı.
  - Örnek: `GET /hello/berat` ➔ `Hello Berat`
  - Örnek: `GET /hello/emre` ➔ `Hello Emre`

### 6. Adım: Yazım ve Noktalama İyileştirmesi
- Kullanıcı isteği doğrultusunda metin biçimleri düzenlendi:
  - `Hello World` ➔ **`Hello, World!`**
  - `Hello Berat` ➔ **`Hello, Berat!`**

### 7. Adım: Dinamik Matematiksel Hesaplama Rotası (`/sum/:a/:b`)
- URL'den iki sayı parametresi alıp toplayan `GET /sum/:a/:b` rotası yazıldı.
- Sayısal doğrulama ve tip dönüşümleri yapılarak toplam ekrana basıldı.
  - Örnek: `GET /sum/5/4` ➔ **`9`**
  - Örnek: `GET /sum/12/30` ➔ **`42`**

### 8. Adım: Geçici Ana Sayfa Geliştirilmesi (`GET /` - Temporary Homepage)
- `README.md` dosyasındaki proje amaçlarına (Mezun-Mezun ağı, Fakülte mentorluğu, kariyer fırsatları, etkinlikler, RBAC) uygun, alt sayfa içermeyen modern tek sayfalık bir ana sayfa (`public/index.html`) kodlandı.
- Sayfa içerisine:
  - Canlı API durum göstergesi,
  - Özellik ve misyon kartları,
  - Canlı API test uç noktaları ve sayfa içi anlık test konsolu eklendi.

### 9. Adım: Geçici Hakkımızda Sayfası (`GET /about` - Temporary About Page)
- Projenin misyonunu, vizyonunu, hedef kitlelerini (Mezunlar, Fakülte, Yönetim) ve teknik mimarisini detaylandıran `public/about.html` sayfası kodlandı.
- `GET /about` rotası üzerinden erişime açıldı.
- Ana sayfa ile Hakkımızda sayfası arasına gezinme (navigasyon) butonları bağlandı.

---

## 🚀 Aktif Uç Noktalar Listesi

| Metot | URL / Rota | Açıklama |
|---|---|---|
| `GET` | `/` | Alumni Portal Geçici Ana Sayfası |
| `GET` | `/about` | Alumni Portal Geçici Hakkımızda Sayfası |
| `GET` | `/hello` | `Hello, World!` çıktısı |
| `GET` | `/hello/:name` | Dinamik `Hello, <İsim>!` çıktısı (Örn: `/hello/berat`) |
| `GET` | `/sum/:a/:b` | İki sayının toplamı (Örn: `/sum/5/4` ➔ `9`) |
| `GET` | `/ok` | Temel durum kontrol çıktısı (`ok`) |
| `GET` | `/health` | JSON durum kontrolü (`{"status":"ok"}`) |

---

## 🛠️ Nasıl Çalıştırılır?

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Sunucuyu başlatın
npm start
# veya doğrudan Windows için:
run.bat

# 3. Tarayıcıdan erişin
http://localhost/
```
