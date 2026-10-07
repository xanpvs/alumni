const { AnnouncementStore } = require('../models/announcement.model');
const view = (res, options = {}) => res.status(options.status || 200).render('announcements', {
  announcements: AnnouncementStore.getAll(), message: options.message || null,
  error: options.error || null, form: options.form || {}, selected: options.selected || null
});
const statusFor = error => error.includes('bulunamadı') ? 404 : 400;
const getAll = (req, res) => view(res);
const getById = (req, res) => {
  const result = AnnouncementStore.getById(Number(req.params.id));
  return result.success ? view(res, { selected: result.announcement }) : view(res, { status: statusFor(result.error), error: result.error });
};
const create = (req, res) => {
  const result = AnnouncementStore.create(req.body || {});
  return result.success ? view(res, { status: 201, message: 'Duyuru oluşturuldu.' }) : view(res, { status: 400, error: result.error, form: req.body });
};
const update = (req, res) => {
  const result = AnnouncementStore.update(Number(req.params.id), req.body || {});
  return result.success ? view(res, { message: 'Duyuru güncellendi.' }) : view(res, { status: statusFor(result.error), error: result.error });
};
const patch = (req, res) => {
  const result = AnnouncementStore.patch(Number(req.params.id), req.body || {});
  return result.success ? view(res, { message: 'Duyuru güncellendi.' }) : view(res, { status: statusFor(result.error), error: result.error });
};
const remove = (req, res) => {
  const result = AnnouncementStore.delete(Number(req.params.id));
  return result.success ? view(res, { message: 'Duyuru silindi.' }) : view(res, { status: statusFor(result.error), error: result.error });
};
module.exports = { getAll, getById, create, update, patch, remove };
