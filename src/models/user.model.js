/** User entity, validation, and MySQL-backed asynchronous CRUD store. */

const pool = require('../db/connection');
const { assertStoreInterface } = require('../db/store.interface');

// ─────────────────────────────────────────────
//  Sabitler
// ─────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Geçerli kullanıcı rolleri */
const VALID_ROLES = ['Alumni', 'Faculty', 'Admin'];

/** Alan adından okunabilir etikete eşleme (hata mesajları için) */
const FIELD_LABELS = {
  name: 'İsim (name)',
  email: 'E-posta (email)',
  role: 'Rol (role)',
  department: 'Bölüm (department)'
};

// ─────────────────────────────────────────────
//  User Sınıfı
// ─────────────────────────────────────────────

/**
 * Tek bir kullanıcıyı temsil eden veri sınıfı.
 * Yapıcı, gelen ham veriyi temizler ve normalize eder.
 */
class User {
  /**
   * @param {object} data
   * @param {number}  data.id
   * @param {string}  data.name
   * @param {string}  data.email        - Ham e-posta; küçük harfe çevrilir ve trim edilir
   * @param {string}  [data.role]       - Varsayılan: 'Alumni'
   * @param {string}  [data.department] - Varsayılan: 'Genel'
   * @param {string}  [data.createdAt]  - ISO 8601; belirtilmezse şimdiki zaman
   * @param {string}  [data.updatedAt]  - ISO 8601; opsiyonel
   */
  constructor({ id, name, email, role, department, createdAt, updatedAt }) {
    this.id         = id;
    this.name       = String(name).trim();
    this.email      = String(email).trim().toLowerCase();
    this.role       = (role && String(role).trim()) || 'Alumni';
    this.department = (department && String(department).trim()) || 'Genel';
    this.createdAt  = createdAt || new Date().toISOString();
    if (updatedAt !== undefined) this.updatedAt = updatedAt;
  }

  /**
   * Kullanıcıyı düz nesne olarak döner (JSON serileştirme için).
   * @returns {object}
   */
  toJSON() {
    const obj = {
      id:         this.id,
      name:       this.name,
      email:      this.email,
      role:       this.role,
      department: this.department,
      createdAt:  this.createdAt
    };
    if (this.updatedAt) obj.updatedAt = this.updatedAt;
    return obj;
  }
}

// ─────────────────────────────────────────────
//  Doğrulama (Validation) Yardımcıları
// ─────────────────────────────────────────────

/**
 * E-posta formatını doğrular.
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => EMAIL_REGEX.test(email);

/**
 * Rolün geçerli olup olmadığını kontrol eder.
 * @param {string} role
 * @returns {boolean}
 */
const isValidRole = (role) => VALID_ROLES.includes(role);

/**
 * CREATE ve tam UPDATE (PUT) için zorunlu alanları doğrular.
 * Hata varsa hata mesajı string'i döner; geçerliyse null döner.
 * @param {{ name: any, email: any, role?: any }} data
 * @returns {string|null}
 */
const validateRequired = ({ name, email, role }) => {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return `${FIELD_LABELS.name} alanı zorunludur ve metin olmalıdır.`;
  }
  if (!email || typeof email !== 'string' || !email.trim()) {
    return `${FIELD_LABELS.email} alanı zorunludur.`;
  }
  if (!isValidEmail(email.trim().toLowerCase())) {
    return 'Lütfen geçerli bir e-posta adresi girin. (Örn: isim@domain.com)';
  }
  if (role !== undefined && role !== null && !isValidRole(role)) {
    return `Geçersiz rol. İzin verilenler: ${VALID_ROLES.join(', ')}.`;
  }
  return null;
};

/**
 * PATCH için kısmi alanları doğrular.
 * Hata varsa hata mesajı string'i döner; geçerliyse null döner.
 * @param {{ name?: any, email?: any, role?: any }} data
 * @returns {string|null}
 */
const validatePartial = ({ name, email, role }) => {
  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    return `${FIELD_LABELS.name} alanı boş bırakılamaz.`;
  }
  if (email !== undefined) {
    if (typeof email !== 'string' || !email.trim()) {
      return `${FIELD_LABELS.email} alanı boş bırakılamaz.`;
    }
    if (!isValidEmail(email.trim().toLowerCase())) {
      return 'Lütfen geçerli bir e-posta adresi girin.';
    }
  }
  if (role !== undefined && !isValidRole(role)) {
    return `Geçersiz rol. İzin verilenler: ${VALID_ROLES.join(', ')}.`;
  }
  return null;
};

const dbError = error => error.code === 'ER_DUP_ENTRY'
  ? { success: false, error: 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.', code: 'DUPLICATE' }
  : { success: false, error: 'Veritabanı işlemi başarısız oldu.', code: 'DB_ERROR' };
const mapUser = row => row ? new User({
  id: row.id, name: row.name, email: row.email, role: row.role, department: row.department,
  createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
  updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
}) : null;
const invalidId = id => !Number.isInteger(id) || id <= 0;
const missing = id => ({ success: false, error: `ID'si ${id} olan kullanıcı bulunamadı.` });

const UserStore = {
  async create(data = {}) {
    const { name, email, role, department } = data;
    const error = validateRequired({ name, email, role });
    if (error) return { success: false, error };
    try {
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, role, department) VALUES (?, ?, ?, ?)',
        [name.trim(), email.trim().toLowerCase(), role || 'Alumni', department || 'Genel']
      );
      const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
      return { success: true, user: mapUser(rows[0]) };
    } catch (err) { return dbError(err); }
  },

  async getAll() {
    const [rows] = await pool.execute('SELECT * FROM users ORDER BY id');
    return rows.map(mapUser);
  },

  async getById(id) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length ? { success: true, user: mapUser(rows[0]) } : missing(id);
  },

  async update(id, data = {}) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    const { name, email, role, department } = data;
    const error = validateRequired({ name, email, role });
    if (error) return { success: false, error };
    const current = await this.getById(id);
    if (!current.success) return current;
    try {
      await pool.execute(
        'UPDATE users SET name = ?, email = ?, role = ?, department = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name.trim(), email.trim().toLowerCase(), role || 'Alumni', department || 'Genel', id]
      );
      return this.getById(id);
    } catch (err) { return dbError(err); }
  },

  async patch(id, data = {}) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    if (!['name', 'email', 'role', 'department'].some(key => data[key] !== undefined)) {
      return { success: false, error: 'En az bir alan gönderilmelidir: name, email, role, department.' };
    }
    const error = validatePartial(data);
    if (error) return { success: false, error };
    const current = await this.getById(id);
    if (!current.success) return current;
    const merged = { ...current.user.toJSON(), ...data };
    return this.update(id, merged);
  },

  async delete(id) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    const current = await this.getById(id);
    if (!current.success) return current;
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return current;
  },
};
assertStoreInterface(UserStore, 'UserStore');

// ─────────────────────────────────────────────
//  Export
// ─────────────────────────────────────────────

module.exports = { User, UserStore, VALID_ROLES, isValidEmail, isValidRole };
