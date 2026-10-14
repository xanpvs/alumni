const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/apiAnnouncement.controller');
const asyncHandler = require('../async-handler');

/**
 * @swagger
 * /api/announcements:
 *   get:
 *     summary: Duyuruları listele
 *     tags: [Announcements]
 *     responses:
 *       200:
 *         description: Duyuru listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Announcement'
 *   post:
 *     summary: Duyuru oluştur
 *     tags: [Announcements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnnouncementInput'
 *     responses:
 *       201:
 *         description: Duyuru oluşturuldu
 *       400:
 *         description: Geçersiz duyuru bilgisi
 */
router.get('/', asyncHandler(Controller.getAll));
router.post('/', asyncHandler(Controller.create));

/**
 * @swagger
 * /api/announcements/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Duyuru detayını getir
 *     tags: [Announcements]
 *     responses:
 *       200:
 *         description: Duyuru bulundu
 *       404:
 *         description: Duyuru bulunamadı
 *   put:
 *     summary: Duyuruyu tamamen güncelle
 *     tags: [Announcements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnnouncementInput'
 *     responses:
 *       200:
 *         description: Duyuru güncellendi
 *       400:
 *         description: Geçersiz duyuru bilgisi
 *       404:
 *         description: Duyuru bulunamadı
 *   patch:
 *     summary: Duyuruyu kısmen güncelle
 *     tags: [Announcements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnnouncementPartialInput'
 *     responses:
 *       200:
 *         description: Duyuru güncellendi
 *       400:
 *         description: Geçersiz alanlar
 *       404:
 *         description: Duyuru bulunamadı
 *   delete:
 *     summary: Duyuruyu sil
 *     tags: [Announcements]
 *     responses:
 *       200:
 *         description: Duyuru silindi
 *       404:
 *         description: Duyuru bulunamadı
 */
router.get('/:id', asyncHandler(Controller.getById));
router.put('/:id', asyncHandler(Controller.update));
router.patch('/:id', asyncHandler(Controller.patch));
router.delete('/:id', asyncHandler(Controller.remove));
module.exports = router;
