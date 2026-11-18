# 🎨 Alumni Portal - Marka ve Tasarım Rehberi (Brand Identity & Design System)

Bu belge, **Alumni Portal** platformunun marka kimliğini, görsel tasarım sistemini, renk hiyerarşisini, tipografisini ve iletişim standartlarını tanımlar. Platform genelindeki tüm kullanıcı arayüzleri, dokümantasyonlar ve harici iletişimler bu rehbere uygun olarak geliştirilmelidir.

---

## 📌 1. Marka Özeti ve Temel Değerler

| Özellik | Tanım |
|---|---|
| **Platform Adı** | **Alumni Portal** |
| **Resmi Alt Başlık** | Mezun & Fakülte Ağı *(Alumni & Faculty Network)* |
| **Ana Slogan** | *“Akademi ile Sektörü Buluşturan, Geleceğe Yön Veren Mezunlar Ağı”* |
| **İkincil Slogan** | *“Kariyerinizi ve Akademik Köklerinizi Canlı Tutun”* |
| **Hedef Kitle** | Mezunlar (`Alumni`), Akademisyenler/Profesörler (`Faculty`), Öğrenciler (`Student`) ve Bölüm Yöneticileri (`Admin`) |

### Temel Değerler (Core Values)
1. **Akademik Kökler ve Dayanışma:** Mezunlar ile üniversite arasındaki bağı ve aidiyet duygusunu daima canlı tutmak.
2. **Kariyer ve Fırsat Eşitliği:** Mezunların tecrübelerini genç yeteneklere aktardığı, şeffaf staj ve iş ilanları ekosistemi.
3. **Güvenilirlik ve Şeffaflık:** Kesintisiz çalışan REST API ve Guardian hata koruma mimarisi ile korunan güvenli veri altyapısı.
4. **Modern & Sade Kullanılabilirlik:** Bilgiye hızlı ulaşım sağlayan çağdaş ve erişilebilir tasarım dili.

---

## 🎓 2. Logo ve Amblem

### Görsel Temsil
* **Amblem:** 🎓 *(Graduation Cap / Mezuniyet Kepi)*
* **Konteyner:** 12px köşe yuvarlatılmış kare (`border-radius: 12px`)
* **Arka Plan Gradyanı:** `linear-gradient(135deg, #2563eb, #1d4ed8)`
* **Gölge (Shadow):** `0 4px 14px rgba(37, 99, 235, 0.30)`

### Metin Yerleşimi
* **Üst Başlık:** `Alumni Portal` (Ağırlık: 800 - ExtraBold, Renk: `#0f172a`, `letter-spacing: -0.02em`)
* **Alt Başlık:** `MEZUN & FAKÜLTE AĞI` (Ağırlık: 600 - SemiBold, Renk: `#2563eb`, `letter-spacing: 0.05em`, Küçük Harf/Büyük Harf Oranı: Uppercase)

---

## 🎨 3. Renk Paleti (Color Tokens)

Platformun renk paleti, akademik ciddiyeti modern teknoloji dinamizmiyle harmanlayan mavi ve arduvaz (slate) tonlarına dayanır.

### Birincil Renkler (Primary Palette)

| Renk İsmi | Hex Kodu | Kullanım Alanı |
|---|---|---|
| **Primary (Mavi)** | `#2563eb` | Ana butonlar, aktif sekmeler, bağlantılar, vurgular |
| **Primary Hover** | `#1d4ed8` | Buton ve etkileşim hover durumları |
| **Primary Light** | `#eff6ff` | Kart arka planları, etiket (badge) arka planları |
| **Primary Border** | `#bfdbfe` | Açık mavi kenarlıklar ve ayraçlar |

### Nötr ve Koyu Tonlar (Slate Scales)

| Renk İsmi | Hex Kodu | Kullanım Alanı |
|---|---|---|
| **Slate 900** | `#0f172a` | Başlıklar, terminal arka planı, koyu kart zeminleri |
| **Slate 800** | `#1e293b` | Terminal üst çubuğu, koyu kart sınırları |
| **Slate 600** | `#475569` | Gövde metinleri, ikincil açıklamalar |
| **Slate 500** | `#64748b` | Tarihler, pasif sayaç etiketleri, dipnotlar |
| **Slate 200** | `#e2e8f0` | Standart kart ve panel kenarlıkları (`--border`) |
| **Slate 100** | `#f1f5f9` | Kontrol çubukları, gri filtre hapları, butonlar |
| **Slate 50** | `#f8fafc` | Sayfa genel arka planı (`--bg`) |

### Durum ve Vurgu Renkleri (Status & Semantic)

| Durum | Hex | Hafif Zemin | Anlamı / Kullanım |
|---|---|---|---|
| **Başarı (Success)** | `#10b981` | `#ecfdf5` | Aktif sistem durumu (`Canlı • Çevrimiçi`), onay mesajları |
| **Uyarı (Warning)** | `#f59e0b` | `#fef3c7` | Fakülte rolü rozeti, etkinlik duyuruları, dikkat kutuları |
| **Hata (Danger)** | `#ef4444` | `#fef2f2` | 5xx sunucu hataları, silme butonları (`DELETE`), guardian uyarıları |
| **İndigo (Accent)** | `#6366f1` | `#e0e7ff` | Staj ilanları, öğrenci rol rozeti, API Swagger vurguları |

---

## 🔤 4. Tipografi (Typography)

Tüm arayüzlerde okunabilirliği yüksek, geometrik ve modern hümanist yazı tipleri tercih edilmiştir:

1. **Arayüz ve Başlık Yazı Tipi:** `Plus Jakarta Sans`, system-ui, -apple-system, sans-serif
   - `H1 (Hero Başlığı)`: 36px - 60px (clamp), 800 (ExtraBold), `line-height: 1.15`
   - `H2 (Bölüm Başlıkları)`: 28px - 40px, 800 (ExtraBold), `letter-spacing: -0.02em`
   - `H3 (Kart Başlıkları)`: 18px - 22px, 700 (Bold)
   - `Gövde Metni (Body)`: 15px - 16px, 400 (Regular) / 500 (Medium), `line-height: 1.6`
   - `Etiketler & Sayaçlar`: 12px - 14px, 700 (Bold)

2. **Teknik ve Kod Yazı Tipi:** `JetBrains Mono`, `Consolas`, monospace
   - API uç noktaları (`/api/job-postings`, `GET /users`), JSON yanıtları, terminal çıktısı ve log gösterimleri.

---

## 📐 5. Tasarım Bileşenleri ve UI Standartları

* **Köşe Yuvarlatma Değerleri (Border Radius):**
  * `sm (8px)`: Form girişleri, küçük butonlar, etiketler
  * `md (12px)`: İç kartlar, sekmeler, bildirim kutuları
  * `lg (16px)`: Ana panel kartları, modüller
  * `xl (24px)`: Hero sayaç bandı, ana veri merkezi kutusu
  * `pill (9999px)`: Durum rozetleri, filtre hapları
* **Cam Efekti (Glassmorphism):**
  * `background: rgba(255, 255, 255, 0.88)`
  * `backdrop-filter: blur(14px)`
* **Gölge Standartları:**
  * Hafif: `0 1px 3px rgba(0, 0, 0, 0.05)`
  * Kart Vurgusu: `0 4px 6px -1px rgba(0, 0, 0, 0.07)`
  * Hero & Modal: `0 20px 25px -5px rgba(0, 0, 0, 0.10)`

---

## 🗣️ 6. Dil, Üslup ve Terminoloji (Tone of Voice)

* **Üslup:** Samimi, akademik saygınlığı koruyan, profesyonel, motive edici ve net.
* **Standart Terimler:**
  * Mezunlar için: **Alumni** veya **Mezun**
  * Öğretim üyeleri için: **Faculty** veya **Akademisyen**
  * Öğrenciler için: **Student** veya **Öğrenci**
  * İlanlar için: **İş & Staj İlanları** *(Job Postings)*
  * Başvurular için: **Başvuru Yönetimi** *(Applications)*
* **Sistem Kuralları:**
  * İlan başlıkları her zaman **en fazla 120 karakter** ile sınırlandırılır.
  * Şirket/Kurum adı zorunludur.

---

Bu rehber, [README.md](./README.md) ve proje dokümantasyonu ile eşzamanlı olarak güncellenir.
