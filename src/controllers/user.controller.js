/**
 * User Controller
 *
 * MVC Katmanı: Controller
 *
 * HTTP isteklerini alır → UserStore metodunu çağırır → HTTP yanıtı döner.
 * Tüm iş mantığı ve validasyon UserStore içinde yaşar; controller yalnızca
 * HTTP katmanını (status kodu, yanıt formatı) yönetir.
 */

const { UserStore } = require('../models/user.model');

/**
 * GET /api/users
 * Tüm kullanıcıları listeler.
 */
const getAll = (req, res) => {
  const users = UserStore.getAll();
  res.status(200).json(users);
};

/**
 * GET /api/users/:id
 * ID'ye göre tekil kullanıcı döner.
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

  res.status(200).json(result.user);
};

/**
 * POST /api/users
 * Yeni kullanıcı oluşturur.
 */
const create = (req, res) => {
  const result = UserStore.create(req.body || {});

  if (!result.success) {
    const status = result.error.includes('zaten kayıtlı') ? 409 : 400;
    return res.status(status).json({ success: false, error: result.error });
  }

  res.status(201).json({
    success: true,
    message: 'Kullanıcı başarıyla kaydedildi.',
    user: result.user,
    ...result.user.toJSON()
  });
};

/**
 * PUT /api/users/:id
 * Kullanıcının tüm alanlarını değiştirir.
 */
const updateFull = (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: 'ID bir sayı olmalıdır.' });
  }

  const result = UserStore.update(id, req.body || {});

  if (!result.success) {
    const status = result.error.includes('bulunamadı') ? 404
                 : result.error.includes('kullanılıyor') ? 409
                 : 400;
    return res.status(status).json({ success: false, error: result.error });
  }

  res.status(200).json({
    success: true,
    message: `ID'si ${id} olan kullanıcı başarıyla güncellendi (PUT).`,
    user: result.user,
    ...result.user.toJSON()
  });
};

/**
 * PATCH /api/users/:id
 * Kullanıcının yalnızca gönderilen alanlarını günceller.
 */
const updatePartial = (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: 'ID bir sayı olmalıdır.' });
  }

  const result = UserStore.patch(id, req.body || {});

  if (!result.success) {
    const status = result.error.includes('bulunamadı') ? 404
                 : result.error.includes('kullanılıyor') ? 409
                 : 400;
    return res.status(status).json({ success: false, error: result.error });
  }

  res.status(200).json({
    success: true,
    message: `ID'si ${id} olan kullanıcı başarıyla kısmen güncellendi (PATCH).`,
    user: result.user,
    ...result.user.toJSON()
  });
};

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

  res.status(200).json({
    success: true,
    message: `ID'si ${id} olan kullanıcı (${result.user.name}) başarıyla silindi.`,
    user: result.user,
    ...result.user.toJSON()
  });
};

module.exports = { getAll, getById, create, updateFull, updatePartial, remove };
