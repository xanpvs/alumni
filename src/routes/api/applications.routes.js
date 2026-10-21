'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true }); // nested route'lardan jobPostingId / userId alır
const Controller = require('../../controllers/application.controller');
const asyncHandler = require('../async-handler');

/**
 * @swagger
 * tags:
 *   - name: Applications
 *     description: İş başvurusu oluşturma, listeleme, güncelleme ve silme işlemleri
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         jobPostingId:
 *           type: integer
 *           example: 1
 *         applicantId:
 *           type: integer
 *           example: 3
 *         coverLetter:
 *           type: string
 *           nullable: true
 *           example: Başvurumu değerlendirmenizi rica ederim.
 *         status:
 *           type: string
 *           enum: [Pending, Reviewed, Accepted, Rejected]
 *           example: Pending
 *         appliedAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ApplicationInput:
 *       type: object
 *       required: [job_posting_id, applicant_id]
 *       properties:
 *         job_posting_id:
 *           type: integer
 *         applicant_id:
 *           type: integer
 *         cover_letter:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [Pending, Reviewed, Accepted, Rejected]
 *           default: Pending
 *     ApplicationUpdateInput:
 *       type: object
 *       properties:
 *         cover_letter:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [Pending, Reviewed, Accepted, Rejected]
 */

// ─── Direct routes ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Tüm başvuruları listele
 *     tags: [Applications]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Reviewed, Accepted, Rejected]
 *         description: Durum filtresi
 *     responses:
 *       200:
 *         description: Başvuru listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *   post:
 *     summary: Yeni başvuru oluştur
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationInput'
 *     responses:
 *       201:
 *         description: Başvuru oluşturuldu
 *       400:
 *         description: Geçersiz başvuru bilgisi
 *       409:
 *         description: Bu kullanıcı bu ilana zaten başvurmuş
 */
router.get('/',  asyncHandler(Controller.getAll));
router.post('/', asyncHandler(Controller.create));

/**
 * @swagger
 * /api/applications/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: Başvuru ID'si
 *   get:
 *     summary: Başvuru detayını getir
 *     tags: [Applications]
 *     responses:
 *       200:
 *         description: Başvuru bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       404:
 *         description: Başvuru bulunamadı
 *   put:
 *     summary: Başvuruyu güncelle (status / cover_letter)
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationUpdateInput'
 *     responses:
 *       200:
 *         description: Başvuru güncellendi
 *       400:
 *         description: Geçersiz alan
 *       404:
 *         description: Başvuru bulunamadı
 *   patch:
 *     summary: Başvuruyu kısmen güncelle
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationUpdateInput'
 *     responses:
 *       200:
 *         description: Başvuru güncellendi
 *       400:
 *         description: Geçersiz alanlar
 *       404:
 *         description: Başvuru bulunamadı
 *   delete:
 *     summary: Başvuruyu sil
 *     tags: [Applications]
 *     responses:
 *       200:
 *         description: Başvuru silindi
 *       404:
 *         description: Başvuru bulunamadı
 */
router.get('/:id',    asyncHandler(Controller.getById));
router.put('/:id',    asyncHandler(Controller.update));
router.patch('/:id',  asyncHandler(Controller.patch));
router.delete('/:id', asyncHandler(Controller.remove));

// ─── Nested Swagger docs (mounted by index.js as sub-routes) ──────────────────

/**
 * @swagger
 * /api/job-postings/{jobPostingId}/applications:
 *   parameters:
 *     - in: path
 *       name: jobPostingId
 *       required: true
 *       schema:
 *         type: integer
 *       description: İlan ID'si
 *   get:
 *     summary: Bir ilana ait başvuruları listele
 *     tags: [Applications]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Reviewed, Accepted, Rejected]
 *     responses:
 *       200:
 *         description: İlana ait başvuru listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *   post:
 *     summary: Bir ilana başvuru yap
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationInput'
 *     responses:
 *       201:
 *         description: Başvuru oluşturuldu; job_posting_id otomatik set edilir
 *       409:
 *         description: Bu kullanıcı bu ilana zaten başvurmuş
 */

/**
 * @swagger
 * /api/users/{userId}/applications:
 *   parameters:
 *     - in: path
 *       name: userId
 *       required: true
 *       schema:
 *         type: integer
 *       description: Kullanıcı (aday) ID'si
 *   get:
 *     summary: Bir kullanıcının başvurularını listele
 *     tags: [Applications]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Reviewed, Accepted, Rejected]
 *     responses:
 *       200:
 *         description: Kullanıcıya ait başvuru listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *   post:
 *     summary: Kullanıcı adına başvuru oluştur
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationInput'
 *     responses:
 *       201:
 *         description: Başvuru oluşturuldu; applicant_id otomatik set edilir
 *       409:
 *         description: Bu kullanıcı bu ilana zaten başvurmuş
 */

module.exports = router;
