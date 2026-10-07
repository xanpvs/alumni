const { AnnouncementStore } = require('../models/announcement.model');
const statusFor = error => error.includes('bulunamadı') ? 404 : 400;
const getAll = (req, res) => res.json(AnnouncementStore.getAll());
const getById = (req, res) => {
  const result = AnnouncementStore.getById(Number(req.params.id));
  return result.success ? res.json(result.announcement) : res.status(statusFor(result.error)).json({ success: false, error: result.error });
};
const sendResult = (res, result, successStatus = 200) => result.success
  ? res.status(successStatus).json({ success: true, announcement: result.announcement })
  : res.status(statusFor(result.error)).json({ success: false, error: result.error });
const create = (req, res) => sendResult(res, AnnouncementStore.create(req.body || {}), 201);
const update = (req, res) => sendResult(res, AnnouncementStore.update(Number(req.params.id), req.body || {}));
const patch = (req, res) => sendResult(res, AnnouncementStore.patch(Number(req.params.id), req.body || {}));
const remove = (req, res) => {
  const result = AnnouncementStore.delete(Number(req.params.id));
  return result.success ? res.json({ success: true, announcement: result.announcement }) : res.status(statusFor(result.error)).json({ success: false, error: result.error });
};
module.exports = { getAll, getById, create, update, patch, remove };
