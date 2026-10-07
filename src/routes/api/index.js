const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../../config/swagger');

const healthRoutes = require('./health.routes');
const usersRoutes = require('./users.routes');
const announcementsRoutes = require('./announcements.routes');

/**
 * @swagger
 * /api/swagger:
 *   get:
 *     summary: Swagger UI
 *     description: İnteraktif API dokümantasyon arayüzünü sunar.
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: Swagger UI HTML sayfası.
 */
// Swagger UI Mount on /api/swagger
router.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Alumni Portal - Swagger API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true
  }
}));

/**
 * @swagger
 * /api/swagger.json:
 *   get:
 *     summary: Ham OpenAPI Belgesi
 *     description: Uygulama başlangıcında kaynaklardaki JSDoc açıklamalarından üretilen OpenAPI belgesini döner.
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: OpenAPI JSON belgesi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
// Raw OpenAPI JSON endpoint
router.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: API Dokümantasyon Yönlendirmesi
 *     tags: [Documentation]
 *     responses:
 *       302:
 *         description: Swagger UI adresine yönlendirir.
 */
// Alias for docs
router.get('/docs', (req, res) => {
  res.redirect('/api/swagger');
});

/**
 * @swagger
 * /api:
 *   get:
 *     summary: API Bilgisi
 *     description: API adı, sürümü ve dokümantasyon bağlantılarını döner.
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API bilgileri.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
// API Documentation / root metadata
router.get('/', (req, res) => {
  res.json({
    name: 'Alumni Portal API',
    version: '1.0.0',
    description: 'RESTful API for Alumni and Faculty Portal',
    documentation: {
      swagger_ui: '/api/swagger',
      swagger_json: '/api/swagger.json'
    },
    endpoints: {
      health: 'GET /api/health',
      swagger: 'GET /api/swagger',
      users_list: 'GET /api/users',
      user_create: 'POST /api/users',
      user_detail: 'GET /api/users/:id',
      user_replace_full: 'PUT /api/users/:id',
      user_update_partial: 'PATCH /api/users/:id',
      user_delete: 'DELETE /api/users/:id',
      announcements_list: 'GET /api/announcements',
      announcement_create: 'POST /api/announcements',
      announcement_detail: 'GET /api/announcements/:id',
      announcement_update: 'PUT /api/announcements/:id',
      announcement_patch: 'PATCH /api/announcements/:id',
      announcement_delete: 'DELETE /api/announcements/:id'
    }
  });
});

// Sub-routes mounting
router.use('/health', healthRoutes);
router.use('/users', usersRoutes);
router.use('/announcements', announcementsRoutes);

module.exports = router;
