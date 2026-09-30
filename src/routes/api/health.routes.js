const express = require('express');
const router = express.Router();

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
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Alumni Portal API is running successfully',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
