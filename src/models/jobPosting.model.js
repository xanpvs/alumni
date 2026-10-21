'use strict';

const pool = require('../db/connection');
const { assertStoreInterface } = require('../db/store.interface');

// ─────────────────────────────────────────────
//  Sabitler
// ─────────────────────────────────────────────

/** Geçerli ilan türleri */
const VALID_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract'];

/** Geçerli ilan durumları */
const VALID_STATUSES = ['Active', 'Closed'];

/** YYYY-MM-DD formatı kontrolü */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// ─────────────────────────────────────────────
//  JobPosting Sınıfı
// ─────────────────────────────────────────────

/**
 * Tek bir iş ilanını temsil eden veri sınıfı.
 * Yapıcı, gelen ham veriyi temizler ve normalize eder.
 */
class JobPosting {
  /**
   * @param {object} data
   * @param {number}  data.id
   * @param {string}  data.title
   * @param {string}  data.description
   * @param {string}  data.company
   * @param {string}  [data.location]      - Varsayılan: 'Uzaktan'
   * @param {string}  [data.type]          - Varsayılan: 'Full-time'
   * @param {string}  [data.salaryRange]   - Opsiyonel maaş aralığı
   * @param {number}  [data.postedBy]      - FK → users.id; opsiyonel
   * @param {string}  [data.status]        - Varsayılan: 'Active'
   * @param {string}  [data.deadline]      - YYYY-MM-DD; opsiyonel
   * @param {string}  [data.createdAt]     - ISO 8601; belirtilmezse şimdiki zaman
   * @param {string}  [data.updatedAt]     - ISO 8601; opsiyonel
   */
  constructor({ id, title, description, company, location, type, salaryRange, postedBy, status, deadline, createdAt, updatedAt }) {
    this.id          = id;
    this.title       = String(title || '').trim();
    this.description = String(description || '').trim();
    this.company     = String(company || '').trim();
    this.location    = String(location || '').trim() || 'Uzaktan';
    this.type        = type || 'Full-time';
    this.salaryRange = salaryRange || null;
    this.postedBy    = postedBy ?? null;
    this.status      = status || 'Active';
    this.deadline    = deadline || null;
    this.createdAt   = createdAt || new Date().toISOString();
    if (updatedAt !== undefined) this.updatedAt = updatedAt;
  }

  toJSON() {
    const obj = {
      id:          this.id,
      title:       this.title,
      description: this.description,
      company:     this.company,
      location:    this.location,
      type:        this.type,
      salaryRange: this.salaryRange,
      postedBy:    this.postedBy,
      status:      this.status,
      deadline:    this.deadline,
      createdAt:   this.createdAt,
    };
    if (this.updatedAt) obj.updatedAt = this.updatedAt;
    return obj;
  }
}

// ─────────────────────────────────────────────
//  Doğrulama (Validation) Yardımcıları
// ─────────────────────────────────────────────

/**
 * CREATE ve tam UPDATE (PUT) için zorunlu alanları doğrular.
 * @param {object} data
 * @returns {string|null} Hata mesajı veya null
 */
const validateRequired = ({ title, description, company, type, status, postedBy, deadline }) => {
  if (!title || typeof title !== 'string' || !title.trim())
    return 'İlan başlığı (title) zorunludur.';
  if (title.trim().length > 255)
    return 'Başlık en fazla 255 karakter olabilir.';
  if (!description || typeof description !== 'string' || !description.trim())
    return 'İş tanımı (description) zorunludur.';
  if (!company || typeof company !== 'string' || !company.trim())
    return 'Şirket adı (company) zorunludur.';
  if (type !== undefined && !VALID_TYPES.includes(type))
    return `Geçersiz ilan türü. İzin verilenler: ${VALID_TYPES.join(', ')}.`;
  if (status !== undefined && !VALID_STATUSES.includes(status))
    return `Geçersiz durum. İzin verilenler: ${VALID_STATUSES.join(', ')}.`;
  if (postedBy !== undefined && postedBy !== null && (!Number.isInteger(postedBy) || postedBy <= 0))
    return 'Geçersiz kullanıcı ID\'si.';
  if (deadline !== undefined && deadline !== null && !DATE_REGEX.test(deadline))
    return 'Geçersiz tarih formatı. Beklenen: YYYY-MM-DD.';
  return null;
};

/**
 * PATCH için kısmi alanları doğrular.
 * @param {object} data
 * @returns {string|null} Hata mesajı veya null
 */
const validatePartial = (data) => {
  const { title, description, company, type, status, postedBy, deadline } = data;
  if (title !== undefined && (typeof title !== 'string' || !title.trim()))
    return 'İlan başlığı (title) boş bırakılamaz.';
  if (title !== undefined && title.trim().length > 255)
    return 'Başlık en fazla 255 karakter olabilir.';
  if (description !== undefined && (typeof description !== 'string' || !description.trim()))
    return 'İş tanımı (description) boş bırakılamaz.';
  if (company !== undefined && (typeof company !== 'string' || !company.trim()))
    return 'Şirket adı (company) boş bırakılamaz.';
  if (type !== undefined && !VALID_TYPES.includes(type))
    return `Geçersiz ilan türü. İzin verilenler: ${VALID_TYPES.join(', ')}.`;
  if (status !== undefined && !VALID_STATUSES.includes(status))
    return `Geçersiz durum. İzin verilenler: ${VALID_STATUSES.join(', ')}.`;
  if (postedBy !== undefined && postedBy !== null && (!Number.isInteger(postedBy) || postedBy <= 0))
    return 'Geçersiz kullanıcı ID\'si.';
  if (deadline !== undefined && deadline !== null && !DATE_REGEX.test(deadline))
    return 'Geçersiz tarih formatı. Beklenen: YYYY-MM-DD.';
  return null;
};

// ─────────────────────────────────────────────
//  DB Yardımcıları
// ─────────────────────────────────────────────

const PATCHABLE_FIELDS = ['title', 'description', 'company', 'location', 'type', 'salary_range', 'posted_by', 'status', 'deadline'];

const mapJobPosting = row => new JobPosting({
  id:          row.id,
  title:       row.title,
  description: row.description,
  company:     row.company,
  location:    row.location,
  type:        row.type,
  salaryRange: row.salary_range,
  postedBy:    row.posted_by,
  status:      row.status,
  deadline:    row.deadline ? (row.deadline instanceof Date ? row.deadline.toISOString().split('T')[0] : String(row.deadline)) : null,
  createdAt:   row.created_at ? new Date(row.created_at).toISOString() : undefined,
  updatedAt:   row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
});

const invalidId = id => !Number.isInteger(id) || id <= 0;
const missing = id => ({ success: false, error: `ID'si ${id} olan ilan bulunamadı.` });

// ─────────────────────────────────────────────
//  In-Memory Fallback Veri Deposu (Seed Data)
// ─────────────────────────────────────────────

let memoryJobPostings = [
  new JobPosting({
    id: 1,
    title: 'Backend Developer',
    description: 'Node.js, Express ve MySQL ile REST API ve mikroservis mimarileri geliştirecek takım arkadaşı arıyoruz.',
    company: 'TechCorp A.Ş.',
    location: 'İstanbul / Uzaktan',
    type: 'Full-time',
    salaryRange: '35.000 - 55.000 TL',
    postedBy: 2,
    status: 'Active',
    deadline: '2026-12-31',
    createdAt: '2026-10-21T10:00:00.000Z'
  }),
  new JobPosting({
    id: 2,
    title: 'Yazılım Stajyeri (Yaz Dönemi)',
    description: 'Bilgisayar veya Yazılım Mühendisliği 3./4. sınıf öğrencileri için tam zamanlı staj imkanı.',
    company: 'StartupX Bilişim',
    location: 'Uzaktan',
    type: 'Internship',
    salaryRange: '15.000 - 20.000 TL',
    postedBy: 1,
    status: 'Active',
    deadline: '2026-06-30',
    createdAt: '2026-10-21T10:30:00.000Z'
  }),
  new JobPosting({
    id: 3,
    title: 'Yapay Zeka ve Veri Araştırmacısı',
    description: 'Büyük dil modelleri ve veri analitiği üzerine akademik ve endüstriyel Ar-Ge projeleri.',
    company: 'DeepLab AI Labs',
    location: 'Ankara / Hibrit',
    type: 'Contract',
    salaryRange: '50.000 - 75.000 TL',
    postedBy: 2,
    status: 'Active',
    deadline: '2026-11-15',
    createdAt: '2026-10-21T11:00:00.000Z'
  })
];

const nextJobId = () => memoryJobPostings.length > 0 ? Math.max(...memoryJobPostings.map(j => j.id)) + 1 : 1;
const isConnError = err => err && (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.name === 'AggregateError');

const JobPostingStore = {
  async create(data = {}) {
    const error = validateRequired(data);
    if (error) return { success: false, error };

    const { title, description, company, location, type, salary_range, posted_by, status, deadline } = data;
    try {
      const [result] = await pool.execute(
        `INSERT INTO job_postings (title, description, company, location, type, salary_range, posted_by, status, deadline)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title.trim(),
          description.trim(),
          company.trim(),
          location || 'Uzaktan',
          type || 'Full-time',
          salary_range || null,
          posted_by ?? null,
          status || 'Active',
          deadline || null,
        ]
      );
      const [rows] = await pool.execute('SELECT * FROM job_postings WHERE id = ?', [result.insertId]);
      return { success: true, jobPosting: mapJobPosting(rows[0]) };
    } catch (err) {
      if (isConnError(err)) {
        const item = new JobPosting({
          id: nextJobId(),
          title: title.trim(),
          description: description.trim(),
          company: company.trim(),
          location: location || 'Uzaktan',
          type: type || 'Full-time',
          salaryRange: salary_range || null,
          postedBy: posted_by ?? null,
          status: status || 'Active',
          deadline: deadline || null,
        });
        memoryJobPostings.unshift(item);
        return { success: true, jobPosting: item };
      }
      throw err;
    }
  },

  async getAll(filters = {}) {
    try {
      let query = 'SELECT * FROM job_postings';
      const params = [];
      const conditions = [];

      if (filters.status && VALID_STATUSES.includes(filters.status)) {
        conditions.push('status = ?');
        params.push(filters.status);
      }
      if (filters.type && VALID_TYPES.includes(filters.type)) {
        conditions.push('type = ?');
        params.push(filters.type);
      }
      if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
      query += ' ORDER BY id DESC';

      const [rows] = await pool.execute(query, params);
      return rows.map(mapJobPosting);
    } catch (err) {
      if (isConnError(err)) {
        let list = [...memoryJobPostings];
        if (filters.status) list = list.filter(j => j.status === filters.status);
        if (filters.type)   list = list.filter(j => j.type === filters.type);
        if (filters.posted_by) list = list.filter(j => j.postedBy === Number(filters.posted_by));
        return list;
      }
      throw err;
    }
  },

  async getById(id) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    try {
      const [rows] = await pool.execute('SELECT * FROM job_postings WHERE id = ?', [id]);
      return rows.length ? { success: true, jobPosting: mapJobPosting(rows[0]) } : missing(id);
    } catch (err) {
      if (isConnError(err)) {
        const item = memoryJobPostings.find(j => j.id === id);
        return item ? { success: true, jobPosting: item } : missing(id);
      }
      throw err;
    }
  },

  async update(id, data = {}) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    const error = validateRequired(data);
    if (error) return { success: false, error };

    const { title, description, company, location, type, salary_range, posted_by, status, deadline } = data;
    try {
      const current = await this.getById(id);
      if (!current.success) return current;

      await pool.execute(
        `UPDATE job_postings
         SET title = ?, description = ?, company = ?, location = ?, type = ?,
             salary_range = ?, posted_by = ?, status = ?, deadline = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          title.trim(),
          description.trim(),
          company.trim(),
          location || 'Uzaktan',
          type || 'Full-time',
          salary_range ?? null,
          posted_by ?? null,
          status || 'Active',
          deadline ?? null,
          id,
        ]
      );
      return this.getById(id);
    } catch (err) {
      if (isConnError(err)) {
        const index = memoryJobPostings.findIndex(j => j.id === id);
        if (index === -1) return missing(id);
        const updated = new JobPosting({
          id,
          title: title.trim(),
          description: description.trim(),
          company: company.trim(),
          location: location || 'Uzaktan',
          type: type || 'Full-time',
          salaryRange: salary_range ?? memoryJobPostings[index].salaryRange,
          postedBy: posted_by ?? memoryJobPostings[index].postedBy,
          status: status || memoryJobPostings[index].status,
          deadline: deadline ?? memoryJobPostings[index].deadline,
          createdAt: memoryJobPostings[index].createdAt,
          updatedAt: new Date().toISOString(),
        });
        memoryJobPostings[index] = updated;
        return { success: true, jobPosting: updated };
      }
      throw err;
    }
  },

  async patch(id, data = {}) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    const camelToSnake = { salaryRange: 'salary_range', postedBy: 'posted_by' };
    const hasField = PATCHABLE_FIELDS.some(f => {
      const camel = Object.keys(camelToSnake).find(k => camelToSnake[k] === f) || f;
      return data[f] !== undefined || data[camel] !== undefined;
    });
    if (!hasField) return { success: false, error: 'Güncellenecek en az bir alan gönderilmelidir.' };

    const error = validatePartial(data);
    if (error) return { success: false, error };

    const current = await this.getById(id);
    if (!current.success) return current;

    const normalized = { ...data };
    if (data.salaryRange !== undefined) { normalized.salary_range = data.salaryRange; delete normalized.salaryRange; }
    if (data.postedBy !== undefined)    { normalized.posted_by = data.postedBy;       delete normalized.postedBy; }

    const merged = {
      title:        current.jobPosting.title,
      description:  current.jobPosting.description,
      company:      current.jobPosting.company,
      location:     current.jobPosting.location,
      type:         current.jobPosting.type,
      salary_range: current.jobPosting.salaryRange,
      posted_by:    current.jobPosting.postedBy,
      status:       current.jobPosting.status,
      deadline:     current.jobPosting.deadline,
      ...normalized,
    };
    return this.update(id, merged);
  },

  async delete(id) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    try {
      const current = await this.getById(id);
      if (!current.success) return current;
      await pool.execute('DELETE FROM job_postings WHERE id = ?', [id]);
      return current;
    } catch (err) {
      if (isConnError(err)) {
        const index = memoryJobPostings.findIndex(j => j.id === id);
        if (index === -1) return missing(id);
        const [deleted] = memoryJobPostings.splice(index, 1);
        return { success: true, jobPosting: deleted };
      }
      throw err;
    }
  },
};

assertStoreInterface(JobPostingStore, 'JobPostingStore');

// ─────────────────────────────────────────────
//  Export
// ─────────────────────────────────────────────

module.exports = { JobPosting, JobPostingStore, VALID_TYPES, VALID_STATUSES };
