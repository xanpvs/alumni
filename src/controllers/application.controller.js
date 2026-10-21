'use strict';

const { ApplicationStore } = require('../models/application.model');

const statusFor = error =>
  error.includes('bulunamadı') ? 404
  : error.includes('zaten') || error.includes('DUPLICATE') ? 409
  : 400;

const sendResult = (res, result, successStatus = 200) =>
  result.success
    ? res.status(successStatus).json({ success: true, application: result.application })
    : res.status(statusFor(result.error)).json({ success: false, error: result.error });

/**
 * GET /api/applications
 * GET /api/job-postings/:jobPostingId/applications
 * GET /api/users/:userId/applications  (applicant_id filtresi)
 */
const getAll = async (req, res) => {
  const filters = {};
  if (req.params.jobPostingId) filters.jobPostingId = Number(req.params.jobPostingId);
  if (req.params.userId)       filters.applicantId  = Number(req.params.userId);
  if (req.query.status)        filters.status       = req.query.status;
  res.json(await ApplicationStore.getAll(filters));
};

const getById = async (req, res) => {
  const result = await ApplicationStore.getById(Number(req.params.id));
  return result.success
    ? res.json(result.application)
    : res.status(statusFor(result.error)).json({ success: false, error: result.error });
};

/**
 * POST /api/applications
 * POST /api/job-postings/:jobPostingId/applications
 * POST /api/users/:userId/applications
 */
const create = async (req, res) => {
  const body = { ...(req.body || {}) };
  if (req.params.jobPostingId) body.job_posting_id = Number(req.params.jobPostingId);
  if (req.params.userId)       body.applicant_id   = Number(req.params.userId);
  sendResult(res, await ApplicationStore.create(body), 201);
};

const update = async (req, res) =>
  sendResult(res, await ApplicationStore.update(Number(req.params.id), req.body || {}));

const patch = async (req, res) =>
  sendResult(res, await ApplicationStore.patch(Number(req.params.id), req.body || {}));

const remove = async (req, res) => {
  const result = await ApplicationStore.delete(Number(req.params.id));
  return result.success
    ? res.json({ success: true, application: result.application })
    : res.status(statusFor(result.error)).json({ success: false, error: result.error });
};

module.exports = { getAll, getById, create, update, patch, remove };
