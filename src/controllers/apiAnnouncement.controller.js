const { AnnouncementStore } = require('../models/announcement.model');
const statusFor = error => error.includes('bulunamadı') ? 404 : 400;
const getAll = async (req, res) => res.json(await AnnouncementStore.getAll());
const getById = async (req, res) => {
  const result = await AnnouncementStore.getById(Number(req.params.id));
  return result.success ? res.json(result.announcement) : res.status(statusFor(result.error)).json({ success: false, error: result.error });
};
const sendResult = (res, result, successStatus = 200) => result.success
  ? res.status(successStatus).json({ success: true, announcement: result.announcement })
  : res.status(statusFor(result.error)).json({ success: false, error: result.error });
const create = async (req, res) => sendResult(res, await AnnouncementStore.create(req.body || {}), 201);
const update = async (req, res) => sendResult(res, await AnnouncementStore.update(Number(req.params.id), req.body || {}));
const patch = async (req, res) => sendResult(res, await AnnouncementStore.patch(Number(req.params.id), req.body || {}));
const remove = async (req, res) => {
  const result = await AnnouncementStore.delete(Number(req.params.id));
  return result.success ? res.json({ success: true, announcement: result.announcement }) : res.status(statusFor(result.error)).json({ success: false, error: result.error });
};
module.exports = { getAll, getById, create, update, patch, remove };
