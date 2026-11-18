# 🌿 Alumni Portal — UI Design System & Style Reference
> Botanical greenhouse on cream paper · Akademik ve editoryal tasarım sistemi

- **Canlı Referans:** [https://styles.refero.design/style/e9f5e976-53f7-42f5-a882-4e63b3c2f734](https://styles.refero.design/style/e9f5e976-53f7-42f5-a882-4e63b3c2f734)
- **Tema:** Light (Krem Kağıt & Botanik Yeşil Katmanlar)
- **Karakter:** Gölgelerden arındırılmış, renk katmanları ile derinlik kazanan sakin, editoryal ve prestijli akademik kimlik.

---

## 🏛️ Alumni Portal Entegrasyon Vizyonu

Alumni Portal arayüzü, geleneksel kurumsal portalların soğuk ve kalabalık yapısından ayrılarak **Refero Style (`e9f5e976-53f7-42f5-a882-4e63b3c2f734`)** stilini benimser:

1. **Krem Zemin Üzerinde Mürekkep Hissi:** Sıcak krem kağıt (`#fffefc`) zemin, derin botanik yeşili (`#0f3e17` - Forest Ink) ile buluşarak diploma, tez ve akademik arşiv dokusunu yaşatır.
2. **Gölgesiz Katmanlı Derinlik (Zero Box-Shadow):** Kartlar ve modüller gölgeler (`box-shadow`) ile değil; krem, keylime, nane ve adaçayı panel katmanlarının kontrastı ile hiyerarşi kazanır.
3. **Tipografik Ağırlık Dengesi:** İnce editoryal serif başlıklar (`Faire Octave` / `Cormorant Garamond` weight 300) ile modern hümanist sans-serif gövde metinleri (`Suisse Intl` / `Inter`) kontrast oluşturur.
4. **Alumni Modüllerine Uyarlama:**
   - **İş & Staj İlanları (`/job-postings`):** Keylime Wash (`#e1f4df`) ve Mint Veil zeminli, 14px köşeli, tam hap (`999px`) etiketli ilan kartları.
   - **Duyurular & Seminerler (`/announcements`):** Sage Mist (`#b1dbb8`) zeminli, editoryal serif başlıklı duyuru panelleri.
   - **Mezun & Fakülte Dizini (`/users`):** Cream Paper (`#fffefc`) kartlar üzerinde botanik yeşil avatar ve rol rozetleri.
   - **Mimari & Guardian Sistemi:** Slate Hush (`#b6ced5`) panelinde sunulan teknik güvenilirlik ve hata izleme vitrini.

---

## 🎨 1. Renk Tokenları (Color Tokens)

| Token Adı | Değer (Hex) | CSS Değişkeni | Alumni Portal'daki Rolü |
|---|---|---|---|
| **Forest Ink** | `#0f3e17` | `--color-forest-ink` | Birincil CTA butonları, ana başlıklar, amblem çizgileri, aktif bağlantılar (Sistemdeki tek doygun koyu renk). |
| **Sage Mist** | `#b1dbb8` | `--color-sage-mist` | Duyuru kartları, fakülte panelleri, dekoratif orta tonlu yüzeyler. |
| **Keylime Wash** | `#e1f4df` | `--color-keylime-wash` | İş ilanları, hero panelleri ve açık renkli kart zeminleri (Baskın renkli kanvas). |
| **Mint Veil** | `#cfe7d3` | `--color-mint-veil` | Başvuru kartları, filtre çubukları ve adaçayı-keylime geçiş bölümleri. |
| **Slate Hush** | `#b6ced5` | `--color-slate-hush` | Guardian hata mimarisi, Swagger API önizleme ve geliştirici terminal kutusu (Tek mavimsi-soğuk kontrast panel). |
| **Cream Paper** | `#fffefc` | `--color-cream-paper` | Sayfa ana gövde zemini, iç kart zeminleri, buton yazı rengi (Yeşili yumuşatan sıcak beyaz). |
| **Charcoal** | `#222222` | `--color-charcoal` | Menü metinleri, gövde açıklamaları ve ikincil arayüz çizgileri. |
| **Border Mist** | `#efeeeb` | `--color-border-mist` | Kart aralarındaki kılcal çizgiler ve tablo ayraçları. |
| **Forest Shadow** | `#0c2f10` | `--color-forest-shadow` | Buton hover durumu ve küçük dekoratif kontrast vurguları. |

---

## 🔠 2. Tipografi Tokenları (Typography Tokens)

### Display Serif (Başlıklar) — `Faire Octave`
- **Alternatifler:** Cormorant Garamond, Playfair Display
- **Kullanım Alanı:** Tüm hero başlıkları, bölüm adları ve kart ana başlıkları
- **Sabit Ağırlık:** `300 (Light)` — *Asla bold yapılmaz.*
- **Harf Aralığı (Tracking):** 40px için `-0.01em`, 56–74px için `-0.03em`
- **Satır Yüksekliği (Leading):** `1.05 – 1.35`

### Humanist Sans (Gövde & Arayüz) — `Suisse Intl`
- **Alternatifler:** Inter, Plus Jakarta Sans, Helvetica Neue
- **Kullanım Alanı:** Gövde metinleri, butonlar, form girişleri, menü ve rozetler
- **Ağırlıklar:** `300 (Light)`, `400 (Regular)`, `600 (SemiBold)`
- **Özel Kural (Eyebrow Etiketleri):** 11px / 600 weight, `letter-spacing: 0.08em`, tamamı BÜYÜK HARF (Örn: `AKADEMİK MENTORLUK`, `GÜNCEL STAJ İLANI`)

### Tipografi Skalası (Type Scale)

| Rol | Boyut | Satır Yüksekliği | Harf Aralığı | Token |
|---|---|---|---|---|
| **caption** | 10px | 1.61 | 0px | `--text-caption` |
| **body** | 14px | 1.50 | 0px | `--text-body` |
| **subheading** | 18px | 1.30 | 0px | `--text-subheading` |
| **heading-sm** | 23px | 1.50 | 0px | `--text-heading-sm` |
| **heading** | 40px | 1.35 | -0.4px | `--text-heading` |
| **heading-lg** | 56px | 1.20 | -1.68px | `--text-heading-lg` |
| **display** | 74px | 1.05 | -2.22px | `--text-display` |

---

## 📏 3. Boşluk ve Şekil Standartları (Spacing & Shapes)

* **Sayfa Maksimum Genişliği:** `1200px` (Ortalanmış konteyner)
* **Bölümler Arası Boşluk:** `64px – 96px`
* **Kart İç Boşluğu (Padding):** `28px – 42px` (Ferah nefes alanı)
* **Elemanlar Arası Boşluk:** `14px – 21px`

### Köşe Yuvarlatma (Border Radius)

| Eleman | Değer | CSS Token |
|---|---|---|
| **Menü Elemanları** | `7px` | `--radius-nav` |
| **Kartlar ve Paneller** | `14px` | `--radius-cards` |
| **Butonlar** | `14px` | `--radius-buttons` |
| **Rozetler ve Etiketler (Pills)** | `999px` | `--radius-badges` |
| **Dekoratif Bölüm Uçları** | `9999px` | `--radius-sections` |

---

## 🧩 4. Temel Bileşen Şartnamesi (Components)

### 1. Primary Forest Button (Ana Eylem Butonu)
* **Kullanım:** İlan Aç, Başvuru Gönder, Kayıt Ol, Formu Onayla
* **Stil:** Zemin `#0f3e17`, yazı `#fffefc`, `border-radius: 14px`, `padding: 14px 21px`, `Suisse Intl 14px/400`.
* **Hover:** Arka plan `#0c2f10` rengine geçiş yapar, gölge eklenmez.

### 2. Pill Badge / Role Tag (Kategori ve Durum Rozetleri)
* **Kullanım:** Mezun/Fakülte rol etiketleri, ilan çalışma şekli (`Full-time`, `Internship`)
* **Stil:** Zemin Krem Kağıt (`#fffefc`), yazı Forest Ink (`#0f3e17`), `border-radius: 999px`, `padding: 9px 14px`, `14px/400`.

### 3. Keylime Job Card (İş ve Staj İlan Kartı)
* **Kullanım:** `/job-postings` modülündeki ilanlar
* **Stil:** Zemin Keylime Wash (`#e1f4df`), `border-radius: 14px`, `padding: 28px`, `box-shadow: none`. Başlık en fazla 120 karakter, şirket bilgisi `Forest Ink`.

### 4. Sage Announcement Card (Duyuru Kartı)
* **Kullanım:** `/announcements` modülündeki akademik ve sosyal duyurular
* **Stil:** Zemin Sage Mist (`#b1dbb8`), `border-radius: 14px`, `padding: 35px – 42px`, `box-shadow: none`. Başlık Faire Octave serif weight 300.

### 5. Slate Product & Guardian Panel (Sistem Mimarisi Paneli)
* **Kullanım:** Logger, 404 Guardian, 5xx Hata Günlüğü ve API Konsolu
* **Stil:** Zemin Slate Hush (`#b6ced5`), `border-radius: 14px`, `padding: 42px`. İçerisinde krem zeminli beyaz kod blokları barındırır.

---

## ✅ 5. Tasarım Kuralları: Yapılması ve Yapılmaması Gerekenler

### Yapılması Gerekenler (Do)
* ✔ **Forest Ink (`#0f3e17`)** rengini tüm birincil aksiyon butonlarında, başlıklarda ve ana bağlantılarda tekil koyu renk olarak kullanın.
* ✔ Başlıklarda `Faire Octave` (veya `Cormorant Garamond`) yazı tipini daima **weight 300** ve sıkı harf aralığıyla (`-0.03em`) uygulayın; **asla kalınlaştırmayın**.
* ✔ Katmanlı yüzey hiyerarşisine uyun: `Cream (#fffefc) → Keylime (#e1f4df) → Mint (#cfe7d3) → Sage (#b1dbb8) → Slate (#b6ced5)`.
* ✔ Kart ve butonlarda daima `14px`, etiketlerde `999px` köşe yuvarlatması kullanın.
* ✔ Bölüm üstü küçük yönlendirici etiketleri (eyebrow) daima `11px / 600`, büyük harf ve `0.08em` aralıkla biçimlendirin.

### Kesinlikle Yapılmaması Gerekenler (Don't)
* ❌ **Kartlara asla box-shadow (kutu gölgesi) eklemeyin.** Derinlik yükselti ile değil, krem ve açık yeşil yüzeylerin ton farkı ile sağlanır.
* ❌ `Forest Ink` rengini geniş kart zeminlerinde kullanmayın; aşırı koyu olduğu için yalnızca metin ve buton dolgusu içindir.
* ❌ Başlıklarda farklı ağırlıklar (bold / 700) karıştırmayın; editoryal dinginliği korumak için başlık ağırlığı daima `300` olmalıdır.
* ❌ Kart kenarlarına renkli ve kalın çizgiler eklemeyin; kenarlıklar dolgu kontrastıyla hissedilmelidir.
* ❌ Palete yeşil ve arduvaz dışında sarı, kırmızı gibi parlak üçüncü şahıs renkler sokmayın; greenhouse metaforunu bozmamak için botanik uyumu koruyun.
* ❌ Kartlarda 21px'den dar padding kullanmayın; ferah nefes alanı tasarımın omurgasıdır.

---

## 💻 6. Kod Entegrasyonu (Quick Start)

### CSS Custom Properties (`:root`)

```css
:root {
  /* Renkler */
  --color-forest-ink: #0f3e17;
  --color-sage-mist: #b1dbb8;
  --color-keylime-wash: #e1f4df;
  --color-mint-veil: #cfe7d3;
  --color-slate-hush: #b6ced5;
  --color-cream-paper: #fffefc;
  --color-charcoal: #222222;
  --color-border-mist: #efeeeb;
  --color-forest-shadow: #0c2f10;

  /* Tipografi — Yazı Tipleri */
  --font-faire-octave: 'Faire Octave', 'Cormorant Garamond', serif;
  --font-suisse-intl: 'Suisse Intl', 'Inter', -apple-system, sans-serif;

  /* Tipografi — Boyut & Aralık */
  --text-caption: 10px;
  --leading-caption: 1.61;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-heading: 40px;
  --leading-heading: 1.35;
  --tracking-heading: -0.4px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.68px;

  /* Boşluklar */
  --spacing-14: 14px;
  --spacing-21: 21px;
  --spacing-28: 28px;
  --spacing-42: 42px;
  --spacing-56: 56px;
  --page-max-width: 1200px;

  /* Köşe Yuvarlatma */
  --radius-nav: 7px;
  --radius-cards: 14px;
  --radius-buttons: 14px;
  --radius-badges: 999px;

  /* Yüzeyler */
  --surface-cream: #fffefc;
  --surface-keylime: #e1f4df;
  --surface-sage: #b1dbb8;
  --surface-slate: #b6ced5;
}
```

### Tailwind CSS v4 Yapılandırması (`@theme`)

```css
@theme {
  --color-forest-ink: #0f3e17;
  --color-sage-mist: #b1dbb8;
  --color-keylime-wash: #e1f4df;
  --color-mint-veil: #cfe7d3;
  --color-slate-hush: #b6ced5;
  --color-cream-paper: #fffefc;
  --color-charcoal: #222222;
  --color-border-mist: #efeeeb;
  --color-forest-shadow: #0c2f10;

  --font-serif-display: 'Faire Octave', 'Cormorant Garamond', serif;
  --font-sans-body: 'Suisse Intl', 'Inter', sans-serif;

  --radius-nav: 7px;
  --radius-cards: 14px;
  --radius-buttons: 14px;
  --radius-badges: 999px;
}
```

---

*Kaynak Referansı: [Styles Refero — Botanical Greenhouse on Cream Paper](https://styles.refero.design/style/e9f5e976-53f7-42f5-a882-4e63b3c2f734)*
