/**
 * ApiUser Controller
 *
 * MVC Katmanı: Controller (API)
 *
 * REST API isteklerini karşılar. Tüm yanıtlar JSON formatındadır.
 * HTTP durum kodları RFC 7231'e göre seçilir.
 * İstemci: mobil uygulama, başka servisler, Postman, Swagger UI vb.
 *
 * Kullanılan rotalar: src/routes/api/users.routes.js
 */

const { UserStore } = require('../models/user.model');

// ─── Yardımcı: hata mesajına göre HTTP durum kodu belirler ──────────────────

const errorStatus = (message) => {
  if (message.includes('bulunamadı'))   return 404;
  if (message.includes('kullanılıyor')) return 409;
  if (message.includes('zaten kayıtlı')) return 409;
  return 400;
};

// ─── CREATE ─────────────────────────────────────────────────────────────────

/**
 * POST /api/users
 * Yeni kullanıcı kaydeder; yanıt JSON.
 */
const create = (req, res) => {
  const result = UserStore.create(req.body || {});

  if (!result.success) {
    return res.status(errorStatus(result.error)).json({
      success: false,
      error: result.error
    });
  }

  return res.status(201).json({
    success: true,
    message: 'Kullanıcı başarıyla kaydedildi.',
    user: result.user
  });
};

// ─── READ (all) ──────────────────────────────────────────────────────────────

/**
 * GET /api/users
 * Tüm kullanıcıları JSON dizisi olarak döner.
 */
const getAll = (req, res) => {
  return res.status(200).json(UserStore.getAll());
};

// ─── READ (single) ───────────────────────────────────────────────────────────

/**
 * GET /api/users/:id
 * ID'ye göre tek kullanıcı döner; JSON.
 */
const getById = (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: 'ID bir sayı olmalıdır.' });
  }

  const result = UserStore.getById(id);

  if (!result.success) {
    return res.status(404).json({ success: false, error: result.error });
  }

  return res.status(200).json(result.user);
};

// ─── UPDATE (full — PUT) ─────────────────────────────────────────────────────

/**
 * PUT /api/users/:id
 * Kullanıcının tüm alanlarını yeniden yazar.
 */
const update = (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: 'ID bir sayı olmalıdır.' });
  }

  const result = UserStore.update(id, req.body || {});

  if (!result.success) {
    return res.status(errorStatus(result.error)).json({
      success: false,
      error: result.error
    });
  }

  return res.status(200).json({
    success: true,
    message: `ID'si ${id} olan kullanıcı güncellendi (PUT).`,
    user: result.user
  });
};

// ─── UPDATE (partial — PATCH) ────────────────────────────────────────────────

/**
 * PATCH /api/users/:id
 * Yalnızca gönderilen alanları günceller.
 */
const patch = (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: 'ID bir sayı olmalıdır.' });
  }

  const result = UserStore.patch(id, req.body || {});

  if (!result.success) {
    return res.status(errorStatus(result.error)).json({
      success: false,
      error: result.error
    });
  }

  return res.status(200).json({
    success: true,
    message: `ID'si ${id} olan kullanıcı kısmen güncellendi (PATCH).`,
    user: result.user
  });
};

// ─── DELETE ──────────────────────────────────────────────────────────────────

/**
 * DELETE /api/users/:id
 * Kullanıcıyı siler.
 */
const remove = (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: 'ID bir sayı olmalıdır.' });
  }

  const result = UserStore.delete(id);

  if (!result.success) {
    return res.status(404).json({ success: false, error: result.error });
  }

  return res.status(200).json({
    success: true,
    message: `ID'si ${id} olan kullanıcı (${result.user.name}) silindi.`,
    user: result.user
  });
};

// ─────────────────────────────────────────────────────────────────────────────

module.exports = { create, getAll, getById, update, patch, remove };
