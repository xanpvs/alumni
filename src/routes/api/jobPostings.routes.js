'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams: nested route'tan userId alır
const Controller = require('../../controllers/jobPosting.controller');
const asyncHandler = require('../async-handler');

/**
 * @swagger
 * tags:
 *   - name: JobPostings
 *     description: İş ilanı listeleme, oluşturma, güncelleme ve silme işlemleri
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     JobPosting:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Backend Developer
 *         description:
 *           type: string
 *           example: Node.js ve Express ile REST API geliştirme deneyimi aranıyor.
 *         company:
 *           type: string
 *           example: TechCorp A.Ş.
 *         location:
 *           type: string
 *           example: İstanbul / Uzaktan
 *         type:
 *           type: string
 *           enum: [Full-time, Part-time, Internship, Contract]
 *           example: Full-time
 *         salaryRange:
 *           type: string
 *           nullable: true
 *           example: 25.000 - 35.000 TL
 *         postedBy:
 *           type: integer
 *           nullable: true
 *           example: 2
 *         status:
 *           type: string
 *           enum: [Active, Closed]
 *           example: Active
 *         deadline:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: '2026-12-31'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     JobPostingInput:
 *       type: object
 *       required: [title, company]
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 120
 *           example: Senior Node.js Developer
 *         company:
 *           type: string
 *           example: TechCorp A.Ş.
 *         description:
 *           type: string
 *           example: Node.js ve Express ile REST API geliştirme deneyimi.
 *         city:
 *           type: string
 *           example: İstanbul
 *         location:
 *           type: string
 *           default: Uzaktan
 *         type:
 *           type: string
 *           enum: [Full-time, Part-time, Internship, Contract]
 *           default: Full-time
 *         salary_range:
 *           type: string
 *           nullable: true
 *         posted_by:
 *           type: integer
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [Active, Closed]
 *           default: Active
 *         deadline:
 *           type: string
 *           format: date
 *           nullable: true
 *     JobPostingPartialInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 120
 *         company:
 *           type: string
 *         description:
 *           type: string
 *         city:
 *           type: string
 *         location:
 *           type: string
 *         type:
 *           type: string
 *           enum: [Full-time, Part-time, Internship, Contract]
 *         salary_range:
 *           type: string
 *           nullable: true
 *         posted_by:
 *           type: integer
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [Active, Closed]
 *         deadline:
 *           type: string
 *           format: date
 *           nullable: true
 */

// ─── Direct routes: GET /api/job-postings  &  POST /api/job-postings ──────────
// ─── Nested routes: GET /api/users/:userId/job-postings  &  POST ...  ─────────

/**
 * @swagger
 * /api/job-postings:
 *   get:
 *     summary: İş ilanlarını listele
 *     tags: [JobPostings]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Closed]
 *         description: Durum filtresi
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Full-time, Part-time, Internship, Contract]
 *         description: İlan türü filtresi
 *     responses:
 *       200:
 *         description: İlan listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JobPosting'
 *   post:
 *     summary: Yeni iş ilanı oluştur
 *     tags: [JobPostings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobPostingInput'
 *     responses:
 *       201:
 *         description: İlan oluşturuldu
 *       400:
 *         description: Geçersiz ilan bilgisi
 */
router.get('/',  asyncHandler(Controller.getAll));
router.post('/', asyncHandler(Controller.create));

/**
 * @swagger
 * /api/job-postings/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: İlan ID'si
 *   get:
 *     summary: İlan detayını getir
 *     tags: [JobPostings]
 *     responses:
 *       200:
 *         description: İlan bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobPosting'
 *       404:
 *         description: İlan bulunamadı
 *   put:
 *     summary: İlanı tamamen güncelle
 *     tags: [JobPostings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobPostingInput'
 *     responses:
 *       200:
 *         description: İlan güncellendi
 *       400:
 *         description: Geçersiz ilan bilgisi
 *       404:
 *         description: İlan bulunamadı
 *   patch:
 *     summary: İlanı kısmen güncelle
 *     tags: [JobPostings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobPostingPartialInput'
 *     responses:
 *       200:
 *         description: İlan güncellendi
 *       400:
 *         description: Geçersiz alanlar
 *       404:
 *         description: İlan bulunamadı
 *   delete:
 *     summary: İlanı sil
 *     tags: [JobPostings]
 *     responses:
 *       200:
 *         description: İlan silindi
 *       404:
 *         description: İlan bulunamadı
 */
router.get('/:id',    asyncHandler(Controller.getById));
router.put('/:id',    asyncHandler(Controller.update));
router.patch('/:id',  asyncHandler(Controller.patch));
router.delete('/:id', asyncHandler(Controller.remove));

/**
 * @swagger
 * /api/users/{userId}/job-postings:
 *   parameters:
 *     - in: path
 *       name: userId
 *       required: true
 *       schema:
 *         type: integer
 *       description: Kullanıcı ID'si (posted_by filtresi)
 *   get:
 *     summary: Belirli bir kullanıcının ilanlarını listele
 *     tags: [JobPostings]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Closed]
 *     responses:
 *       200:
 *         description: Kullanıcıya ait ilan listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JobPosting'
 *   post:
 *     summary: Belirli bir kullanıcı adına ilan oluştur
 *     tags: [JobPostings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobPostingInput'
 *     responses:
 *       201:
 *         description: İlan oluşturuldu; posted_by otomatik set edilir
 *       400:
 *         description: Geçersiz ilan bilgisi
 */

module.exports = router;
