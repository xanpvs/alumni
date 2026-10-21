'use strict';

const { JobPostingStore } = require('../models/jobPosting.model');

const statusFor = error =>
  error.includes('bulunamadı') ? 404 : 400;

const sendResult = (res, result, successStatus = 200) =>
  result.success
    ? res.status(successStatus).json({ success: true, jobPosting: result.jobPosting })
    : res.status(statusFor(result.error)).json({ success: false, error: result.error });

const getAll = async (req, res) => {
  // query string filtresi: ?status=Active&type=Internship
  // nested route (/users/:userId/job-postings) için posted_by filtresi
  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.type)   filters.type   = req.query.type;
  if (req.params.userId) filters.posted_by = Number(req.params.userId);
  res.json(await JobPostingStore.getAll(filters));
};

const getById = async (req, res) => {
  const result = await JobPostingStore.getById(Number(req.params.id));
  return result.success
    ? res.json(result.jobPosting)
    : res.status(statusFor(result.error)).json({ success: false, error: result.error });
};

const create = async (req, res) => {
  const body = { ...(req.body || {}) };
  // nested route: posted_by URL'den gelir
  if (req.params.userId) body.posted_by = Number(req.params.userId);
  sendResult(res, await JobPostingStore.create(body), 201);
};

const update = async (req, res) =>
  sendResult(res, await JobPostingStore.update(Number(req.params.id), req.body || {}));

const patch = async (req, res) =>
  sendResult(res, await JobPostingStore.patch(Number(req.params.id), req.body || {}));

const remove = async (req, res) => {
  const result = await JobPostingStore.delete(Number(req.params.id));
  return result.success
    ? res.json({ success: true, jobPosting: result.jobPosting })
    : res.status(statusFor(result.error)).json({ success: false, error: result.error });
};

module.exports = { getAll, getById, create, update, patch, remove };
