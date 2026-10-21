'use strict';

const pool = require('../db/connection');
const { assertStoreInterface } = require('../db/store.interface');

// ─────────────────────────────────────────────
//  Sabitler
// ─────────────────────────────────────────────

/** Geçerli başvuru durumları */
const VALID_STATUSES = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];

// ─────────────────────────────────────────────
//  Application Sınıfı
// ─────────────────────────────────────────────

/**
 * Tek bir iş başvurusunu temsil eden veri sınıfı.
 */
class Application {
  /**
   * @param {object} data
   * @param {number}  data.id
   * @param {number}  data.jobPostingId  - FK → job_postings.id
   * @param {number}  data.applicantId   - FK → users.id
   * @param {string}  [data.coverLetter] - Opsiyonel ön yazı
   * @param {string}  [data.status]      - Varsayılan: 'Pending'
   * @param {string}  [data.appliedAt]   - ISO 8601; belirtilmezse şimdiki zaman
   * @param {string}  [data.updatedAt]   - ISO 8601; opsiyonel
   */
  constructor({ id, jobPostingId, applicantId, coverLetter, status, appliedAt, updatedAt }) {
    this.id           = id;
    this.jobPostingId = jobPostingId;
    this.applicantId  = applicantId;
    this.coverLetter  = coverLetter || null;
    this.status       = status || 'Pending';
    this.appliedAt    = appliedAt || new Date().toISOString();
    if (updatedAt !== undefined) this.updatedAt = updatedAt;
  }

  toJSON() {
    const obj = {
      id:           this.id,
      jobPostingId: this.jobPostingId,
      applicantId:  this.applicantId,
      coverLetter:  this.coverLetter,
      status:       this.status,
      appliedAt:    this.appliedAt,
    };
    if (this.updatedAt) obj.updatedAt = this.updatedAt;
    return obj;
  }
}

// ─────────────────────────────────────────────
//  Doğrulama (Validation) Yardımcıları
// ─────────────────────────────────────────────

/**
 * CREATE için zorunlu alanları doğrular.
 * @param {object} data
 * @returns {string|null}
 */
const validateRequired = ({ job_posting_id, applicant_id, status }) => {
  if (!job_posting_id || !Number.isInteger(Number(job_posting_id)) || Number(job_posting_id) <= 0)
    return 'Geçerli bir job_posting_id zorunludur.';
  if (!applicant_id || !Number.isInteger(Number(applicant_id)) || Number(applicant_id) <= 0)
    return 'Geçerli bir applicant_id zorunludur.';
  if (status !== undefined && !VALID_STATUSES.includes(status))
    return `Geçersiz durum. İzin verilenler: ${VALID_STATUSES.join(', ')}.`;
  return null;
};

/**
 * PATCH için kısmi alanları doğrular.
 * @param {object} data
 * @returns {string|null}
 */
const validatePartial = ({ status }) => {
  if (status !== undefined && !VALID_STATUSES.includes(status))
    return `Geçersiz durum. İzin verilenler: ${VALID_STATUSES.join(', ')}.`;
  return null;
};

// ─────────────────────────────────────────────
//  DB Yardımcıları
// ─────────────────────────────────────────────

const mapApplication = row => new Application({
  id:           row.id,
  jobPostingId: row.job_posting_id,
  applicantId:  row.applicant_id,
  coverLetter:  row.cover_letter,
  status:       row.status,
  appliedAt:    row.applied_at  ? new Date(row.applied_at).toISOString()  : undefined,
  updatedAt:    row.updated_at  ? new Date(row.updated_at).toISOString()  : undefined,
});

const invalidId = id => !Number.isInteger(id) || id <= 0;
const missing = id => ({ success: false, error: `ID'si ${id} olan başvuru bulunamadı.` });

// ─────────────────────────────────────────────
//  ApplicationStore
// ─────────────────────────────────────────────

const ApplicationStore = {
  /**
   * Yeni başvuru oluşturur.
   * Aynı kullanıcının aynı ilana tekrar başvurması UNIQUE constraint ile engellenir.
   */
  async create(data = {}) {
    const error = validateRequired(data);
    if (error) return { success: false, error };

    const { job_posting_id, applicant_id, cover_letter, status } = data;
    try {
      const [result] = await pool.execute(
        `INSERT INTO applications (job_posting_id, applicant_id, cover_letter, status)
         VALUES (?, ?, ?, ?)`,
        [Number(job_posting_id), Number(applicant_id), cover_letter || null, status || 'Pending']
      );
      const [rows] = await pool.execute('SELECT * FROM applications WHERE id = ?', [result.insertId]);
      return { success: true, application: mapApplication(rows[0]) };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY')
        return { success: false, error: 'Bu kullanıcı bu ilana zaten başvurmuş.', code: 'DUPLICATE' };
      if (err.code === 'ER_NO_REFERENCED_ROW_2')
        return { success: false, error: 'Geçersiz job_posting_id veya applicant_id.', code: 'FK_VIOLATION' };
      return { success: false, error: 'Veritabanı işlemi başarısız oldu.', code: 'DB_ERROR' };
    }
  },

  /**
   * Tüm başvuruları döner.
   * filters.jobPostingId → belirli bir ilana ait başvurular
   * filters.applicantId  → belirli bir kullanıcının başvuruları
   * filters.status       → durum filtresi
   */
  async getAll(filters = {}) {
    let query = 'SELECT * FROM applications';
    const params = [];
    const conditions = [];

    if (filters.jobPostingId) {
      conditions.push('job_posting_id = ?');
      params.push(Number(filters.jobPostingId));
    }
    if (filters.applicantId) {
      conditions.push('applicant_id = ?');
      params.push(Number(filters.applicantId));
    }
    if (filters.status && VALID_STATUSES.includes(filters.status)) {
      conditions.push('status = ?');
      params.push(filters.status);
    }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY applied_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows.map(mapApplication);
  },

  async getById(id) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    const [rows] = await pool.execute('SELECT * FROM applications WHERE id = ?', [id]);
    return rows.length ? { success: true, application: mapApplication(rows[0]) } : missing(id);
  },

  /**
   * PUT: sadece status ve cover_letter güncellenebilir
   * (job_posting_id ve applicant_id değiştirilemez — yeni başvuru açılmalı)
   */
  async update(id, data = {}) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    if (data.status !== undefined && !VALID_STATUSES.includes(data.status))
      return { success: false, error: `Geçersiz durum. İzin verilenler: ${VALID_STATUSES.join(', ')}.` };

    const current = await this.getById(id);
    if (!current.success) return current;

    await pool.execute(
      `UPDATE applications SET cover_letter = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [data.cover_letter ?? current.application.coverLetter, data.status || current.application.status, id]
    );
    return this.getById(id);
  },

  async patch(id, data = {}) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    if (!['cover_letter', 'status'].some(k => data[k] !== undefined))
      return { success: false, error: 'Güncellenecek en az bir alan gönderilmelidir: cover_letter, status.' };

    const error = validatePartial(data);
    if (error) return { success: false, error };

    const current = await this.getById(id);
    if (!current.success) return current;

    return this.update(id, { ...current.application, ...data });
  },

  async delete(id) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    const current = await this.getById(id);
    if (!current.success) return current;
    await pool.execute('DELETE FROM applications WHERE id = ?', [id]);
    return current;
  },
};

assertStoreInterface(ApplicationStore, 'ApplicationStore');

// ─────────────────────────────────────────────
//  Export
// ─────────────────────────────────────────────

module.exports = { Application, ApplicationStore, VALID_STATUSES };
