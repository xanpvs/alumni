const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Kullanıcı arayüzünü görüntüle
 *     description: Kullanıcı listesini ve yeni kullanıcı formunu HTML olarak sunar.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Kullanıcı listesi ve form view'ı.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/', UserController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Kullanıcı detayını arayüzde görüntüle
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kullanıcı detayını içeren HTML view.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       400:
 *         description: Geçersiz kullanıcı ID'si.
 *       404:
 *         description: Kullanıcı bulunamadı.
 */
router.get('/:id', UserController.getById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Arayüz formundan kullanıcı oluştur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Kullanıcı oluşturuldu ve güncel HTML view döndürüldü.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       400:
 *         description: Eksik veya hatalı bilgi; form view hata mesajıyla döner.
 *       409:
 *         description: E-posta kullanımda; form view hata mesajıyla döner.
 */
router.post('/', UserController.create);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Kullanıcı bilgilerini tamamen güncelle
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Kullanıcı güncellendi ve HTML view döndürüldü.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       400:
 *         description: Geçersiz form verisi.
 *       404:
 *         description: Kullanıcı bulunamadı.
 *       409:
 *         description: E-posta kullanımda.
 */
router.put('/:id', UserController.update);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Kullanıcı bilgilerini kısmen güncelle
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/UserPartialInput'
 *     responses:
 *       200:
 *         description: Kullanıcı kısmen güncellendi ve HTML view döndürüldü.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       400:
 *         description: Geçersiz form verisi.
 *       404:
 *         description: Kullanıcı bulunamadı.
 *       409:
 *         description: E-posta kullanımda.
 */
router.patch('/:id', UserController.patch);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Kullanıcıyı sil
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kullanıcı silindi ve güncel HTML view döndürüldü.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       400:
 *         description: Geçersiz kullanıcı ID'si.
 *       404:
 *         description: Kullanıcı bulunamadı.
 */
router.delete('/:id', UserController.remove);

module.exports = router;
