const express = require('express');
const router = express.Router();
const HealthController = require('../../controllers/health.controller');

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: API Sağlık ve Durum Kontrolü
 *     description: Sunucunun ve REST API servisinin anlık çalışma durumunu ve zaman damgasını JSON olarak döner.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Sunucu sorunsuz çalışıyor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get('/', HealthController.getStatus);

module.exports = router;
