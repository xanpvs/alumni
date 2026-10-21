'use strict';

const { ApplicationStore } = require('../models/application.model');

const statusFor = error => (error && error.includes('bulunamadı') ? 404 : 400);

const view = async (req, res, options = {}) => {
  const filters = {};
  let filterInfo = null;
  const jobId = req.query.jobPostingId || (options.form && options.form.job_posting_id);
  const applicantId = req.query.applicantId || (options.form && options.form.applicant_id);

  if (jobId) {
    filters.jobPostingId = Number(jobId);
    filterInfo = `İlan #${jobId} başvuruları`;
  }
  if (applicantId) {
    filters.applicantId = Number(applicantId);
    filterInfo = filterInfo ? `${filterInfo} ve Aday #${applicantId}` : `Aday #${applicantId} başvuruları`;
  }

  const applications = await ApplicationStore.getAll(filters);
  return res.status(options.status || 200).render('applications', {
    applications,
    message: options.message || null,
    error: options.error || null,
    form: options.form || {},
    defaultJobId: req.query.jobPostingId || '',
    defaultApplicantId: req.query.applicantId || '',
    filterInfo,
    selected: options.selected || null,
  });
};

const getAll = async (req, res) => view(req, res);

const getById = async (req, res) => {
  const result = await ApplicationStore.getById(Number(req.params.id));
  return result.success
    ? view(req, res, { selected: result.application })
    : view(req, res, { status: statusFor(result.error), error: result.error });
};

const create = async (req, res) => {
  const result = await ApplicationStore.create(req.body || {});
  return result.success
    ? view(req, res, { status: 201, message: 'Başvuru başarıyla iletildi.' })
    : view(req, res, { status: 400, error: result.error, form: req.body });
};

const update = async (req, res) => {
  const result = await ApplicationStore.update(Number(req.params.id), req.body || {});
  return result.success
    ? view(req, res, { message: 'Başvuru başarıyla güncellendi.' })
    : view(req, res, { status: statusFor(result.error), error: result.error });
};

const patch = async (req, res) => {
  const result = await ApplicationStore.patch(Number(req.params.id), req.body || {});
  return result.success
    ? view(req, res, { message: 'Başvuru durumu başarıyla güncellendi.' })
    : view(req, res, { status: statusFor(result.error), error: result.error });
};

const remove = async (req, res) => {
  const result = await ApplicationStore.delete(Number(req.params.id));
  return result.success
    ? view(req, res, { message: 'Başvuru başarıyla silindi.' })
    : view(req, res, { status: statusFor(result.error), error: result.error });
};

module.exports = { getAll, getById, create, update, patch, remove };
