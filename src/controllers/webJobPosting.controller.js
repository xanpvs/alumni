'use strict';

const { JobPostingStore } = require('../models/jobPosting.model');

const statusFor = error => (error && error.includes('bulunamadı') ? 404 : 400);

const view = async (res, options = {}) => {
  const jobPostings = await JobPostingStore.getAll();
  return res.status(options.status || 200).render('job-postings', {
    jobPostings,
    message: options.message || null,
    error: options.error || null,
    form: options.form || {},
    selected: options.selected || null,
  });
};

const getAll = async (req, res) => view(res);

const getById = async (req, res) => {
  const result = await JobPostingStore.getById(Number(req.params.id));
  return result.success
    ? view(res, { selected: result.jobPosting })
    : view(res, { status: statusFor(result.error), error: result.error });
};

const create = async (req, res) => {
  const result = await JobPostingStore.create(req.body || {});
  return result.success
    ? view(res, { status: 201, message: 'İş ilanı başarıyla yayınlandı.' })
    : view(res, { status: 400, error: result.error, form: req.body });
};

const update = async (req, res) => {
  const result = await JobPostingStore.update(Number(req.params.id), req.body || {});
  return result.success
    ? view(res, { message: 'İş ilanı başarıyla güncellendi.' })
    : view(res, { status: statusFor(result.error), error: result.error });
};

const patch = async (req, res) => {
  const result = await JobPostingStore.patch(Number(req.params.id), req.body || {});
  return result.success
    ? view(res, { message: 'İş ilanı başarıyla güncellendi.' })
    : view(res, { status: statusFor(result.error), error: result.error });
};

const remove = async (req, res) => {
  const result = await JobPostingStore.delete(Number(req.params.id));
  return result.success
    ? view(res, { message: 'İş ilanı başarıyla silindi.' })
    : view(res, { status: statusFor(result.error), error: result.error });
};

module.exports = { getAll, getById, create, update, patch, remove };
