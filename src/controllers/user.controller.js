/**
 * User Controller (Interface)
 * Web UI operations render the EJS users view. JSON API behavior lives in ApiUserController.
 */
const { UserStore, VALID_ROLES } = require('../models/user.model');

const formatUser = (user) => ({
  ...user.toJSON(),
  roleLabel: user.role === 'Faculty' ? 'Akademisyen' :
    user.role === 'Admin' ? 'Yönetici' : 'Mezun',
  createdAtFormatted: new Date(user.createdAt).toLocaleDateString('tr-TR', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
});

const errorStatus = (message) => {
  if (message.includes('Veritabanı işlemi')) return 500;
  if (message.includes('bulunamadı')) return 404;
  if (message.includes('kullanılıyor') || message.includes('zaten kayıtlı')) return 409;
  return 400;
};

const renderUsers = async (res, { status = 200, message = null, error = null, form = {}, selectedUser = null } = {}) => {
  const users = await UserStore.getAll();
  const roleSummary = VALID_ROLES.reduce((summary, role) => {
    summary[role] = users.filter(user => user.role === role).length;
    return summary;
  }, {});

  return res.status(status).render('users', {
    users: users.map(formatUser),
    total: users.length,
    roleSummary,
    validRoles: VALID_ROLES,
    message,
    error,
    form,
    selectedUser: selectedUser ? formatUser(selectedUser) : null
  });
};

// CREATE
const create = async (req, res) => {
  const result = await UserStore.create(req.body || {});
  if (!result.success) {
    return renderUsers(res, { status: errorStatus(result.error), error: result.error, form: req.body || {} });
  }
  return renderUsers(res, { status: 201, message: `${result.user.name} başarıyla sisteme kaydedildi.` });
};

// READ: all
const getAll = async (req, res) => renderUsers(res);

// READ: one
const getById = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return renderUsers(res, { status: 400, error: 'Geçersiz kullanıcı ID’si.' });
  }

  const result = await UserStore.getById(id);
  if (!result.success) return renderUsers(res, { status: 404, error: result.error });
  return renderUsers(res, { selectedUser: result.user });
};

// UPDATE: full replacement (PUT)
const update = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return renderUsers(res, { status: 400, error: 'Geçersiz kullanıcı ID’si.' });
  }

  const result = await UserStore.update(id, req.body || {});
  if (!result.success) {
    return renderUsers(res, { status: errorStatus(result.error), error: result.error, form: req.body || {} });
  }
  return renderUsers(res, { message: `${result.user.name} adlı kullanıcının bilgileri güncellendi.` });
};

// UPDATE: partial (PATCH)
const patch = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return renderUsers(res, { status: 400, error: 'Geçersiz kullanıcı ID’si.' });
  }

  const result = await UserStore.patch(id, req.body || {});
  if (!result.success) {
    return renderUsers(res, { status: errorStatus(result.error), error: result.error, form: req.body || {} });
  }
  return renderUsers(res, { message: `${result.user.name} adlı kullanıcının bilgileri kısmen güncellendi.` });
};

// DELETE
const remove = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return renderUsers(res, { status: 400, error: 'Geçersiz kullanıcı ID’si.' });
  }

  const result = await UserStore.delete(id);
  if (!result.success) return renderUsers(res, { status: 404, error: result.error });
  return renderUsers(res, { message: `${result.user.name} adlı kullanıcı silindi.` });
};

module.exports = { create, getAll, getById, update, patch, remove };
