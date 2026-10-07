const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/user.controller');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Tüm Kayıtlı Kullanıcıları Listele
 *     description: Sistemde kayıtlı tüm mezun, akademisyen ve öğrencilerin listesini JSON dizisi olarak döner.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Kullanıcı listesi başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', UserController.getAll);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: ID ile Tekil Kullanıcı Bilgisi Getir
 *     description: Belirtilen sayısal ID değerine sahip kullanıcının tüm profil detaylarını getirir.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Getirilecek kullanıcının ID'si
 *         example: 2
 *     responses:
 *       200:
 *         description: Kullanıcı bulundu ve bilgileri döndürüldü.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Geçersiz ID formatı.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Kullanıcı bulunamadı.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', UserController.getById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Yeni Kullanıcı Kaydet (POST)
 *     description: Sisteme yeni bir mezun veya fakülte üyesi kaydeder.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Eksik veya hatalı bilgi gönderildi.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: E-posta adresi zaten kullanımda.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', UserController.create);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Kullanıcı Bilgilerini Tamamen Değiştir (PUT)
 *     description: Belirtilen kullanıcının tüm bilgilerini yeni verilerle tamamen yeniler.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek kullanıcının ID'si
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla güncellendi.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Eksik alan veya geçersiz format.
 *       404:
 *         description: Kullanıcı bulunamadı.
 *       409:
 *         description: E-posta adresi başka bir kullanıcı tarafından kullanılıyor.
 */
router.put('/:id', UserController.updateFull);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Kullanıcı Bilgilerini Kısmen Güncelle (PATCH)
 *     description: Belirtilen kullanıcının yalnızca gönderilen alanlarını (örneğin sadece bölüm veya e-posta) günceller.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek kullanıcının ID'si
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPartialInput'
 *     responses:
 *       200:
 *         description: Kullanıcı kısmen güncellendi.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Hiçbir geçerli alan gönderilmedi veya geçersiz değer.
 *       404:
 *         description: Kullanıcı bulunamadı.
 *       409:
 *         description: E-posta adresi başka bir kullanıcı tarafından kullanılıyor.
 */
router.patch('/:id', UserController.updatePartial);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Kullanıcıyı Sil (DELETE)
 *     description: Belirtilen sayısal ID değerine sahip kullanıcıyı sistemden kalıcı olarak siler.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek kullanıcının ID'si
 *         example: 3
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla silindi.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Geçersiz ID formatı.
 *       404:
 *         description: Kullanıcı bulunamadı.
 */
router.delete('/:id', UserController.remove);

module.exports = router;
