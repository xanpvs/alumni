const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const apiRoutes = require('./routes/api');
const userRoutes = require('./routes/users.routes');
const announcementRoutes = require('./routes/announcements.routes');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Mount web interface CRUD routes and modular API routes.
app.use('/users', userRoutes);
app.use('/announcements', announcementRoutes);
app.use('/api', apiRoutes);

/**
 * @swagger
 * /swagger:
 *   get:
 *     summary: Swagger UI Yönlendirmesi
 *     tags: [Documentation]
 *     responses:
 *       302:
 *         description: Swagger UI adresine yönlendirir.
 */
// Convenience redirects to Swagger UI
app.get('/swagger', (req, res) => res.redirect('/api/swagger'));
/**
 * @swagger
 * /docs:
 *   get:
 *     summary: Dokümantasyon Yönlendirmesi
 *     tags: [Documentation]
 *     responses:
 *       302:
 *         description: Swagger UI adresine yönlendirir.
 */
app.get('/docs', (req, res) => res.redirect('/api/swagger'));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Alumni Portal Ana Sayfası
 *     description: Alumni Portal tek sayfalı geçici ana sayfasını (HTML) sunar.
 *     tags: [General & Legacy]
 *     responses:
 *       200:
 *         description: HTML ana sayfası başarıyla yüklendi.
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Hakkımızda Sayfası
 *     description: Platformun misyonunu, vizyonunu ve teknik mimarisini tanıtan HTML sayfasını sunar.
 *     tags: [General & Legacy]
 *     responses:
 *       200:
 *         description: Hakkımızda HTML sayfası başarıyla yüklendi.
 */
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/about.html'));
});

/**
 * @swagger
 * /ok:
 *   get:
 *     summary: Basit Durum Kontrolü (Legacy)
 *     description: Temel sunucu erişilebilirlik kontrolü için düz metin 'ok' döner.
 *     tags: [General & Legacy]
 *     responses:
 *       200:
 *         description: Sunucu yanıt veriyor.
 */
app.get('/ok', (req, res) => {
  res.send('ok');
});

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Sabit Selamlama Uç Noktası
 *     description: "Hello, World! metnini döner."
 *     tags: [General & Legacy]
 *     responses:
 *       200:
 *         description: Başarılı selamlama yanıtı.
 */
app.get('/hello', (req, res) => {
  res.send('Hello, World!');
});

/**
 * @swagger
 * /hello/{name}:
 *   get:
 *     summary: Dinamik Parametrik Selamlama
 *     description: URL'den girilen ismin baş harfini büyüterek kişiselleştirilmiş selamlama döner.
 *     tags: [General & Legacy]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Selamlanacak kişinin adı
 *         example: berat
 *     responses:
 *       200:
 *         description: Kişiselleştirilmiş 'Hello, <Name>!' yanıtı.
 */
app.get('/hello/:name', (req, res) => {
  const name = req.params.name;
  const formattedName = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  res.send(`Hello, ${formattedName}!`);
});

/**
 * @swagger
 * /sum/{a}/{b}:
 *   get:
 *     summary: Matematiksel Toplama Hesabı
 *     description: URL parametreleri ile verilen iki sayıyı toplayarak sonucu döner.
 *     tags: [General & Legacy]
 *     parameters:
 *       - in: path
 *         name: a
 *         required: true
 *         schema:
 *           type: number
 *         description: İlk sayı
 *         example: 5
 *       - in: path
 *         name: b
 *         required: true
 *         schema:
 *           type: number
 *         description: İkinci sayı
 *         example: 4
 *     responses:
 *       200:
 *         description: Toplam sonucu metin olarak döndürüldü.
 *       400:
 *         description: Sayısal olmayan geçersiz parametre girildi.
 */
app.get('/sum/:a/:b', (req, res) => {
  const num1 = Number(req.params.a);
  const num2 = Number(req.params.b);

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).send('Lütfen geçerli sayılar girin. Örn: /sum/5/4');
  }

  const result = num1 + num2;
  res.send(String(result));
});

/**
 * @swagger
 * /sum:
 *   get:
 *     summary: Toplama Uç Noktası Kullanımı
 *     description: Parametreli toplama uç noktasının kullanım bilgisini döner.
 *     tags: [General & Legacy]
 *     responses:
 *       200:
 *         description: Kullanım bilgisi metin olarak döndürüldü.
 */
app.get('/sum', (req, res) => {
  res.send('Kullanım: /sum/:sayi1/:sayi2 (Örn: /sum/5/4)');
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Genel Sağlık Kontrolü (Legacy)
 *     description: JSON formatında sistem sağlık durumunu döner.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Sunucu çalışıyor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = parseInt(process.env.PORT, 10) || 80;
const ALT_PORT = 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost (port ${PORT})`);
});

server.on('error', (err) => {
  console.error(`Error on port ${PORT}:`, err.message);
});

// Also listen on port 3000 if PORT is not 3000
if (PORT !== ALT_PORT) {
  const altServer = app.listen(ALT_PORT, '0.0.0.0', () => {
    console.log(`Server is also running on http://localhost:${ALT_PORT}`);
  });

  altServer.on('error', (err) => {
    // If port 3000 is already in use, don't crash
    console.log(`Secondary port ${ALT_PORT} note: ${err.message}`);
  });
}

module.exports = app;

