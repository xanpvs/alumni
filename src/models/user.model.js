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
// ─────────────────────────────────────────────
//  In-Memory Fallback Veri Deposu (Seed Data)
// ─────────────────────────────────────────────

let memoryUsers = [
  new User({
    id: 1,
    name: 'Berat Çelik',
    email: 'berat@alumni.edu',
    role: 'Alumni',
    department: 'Bilgisayar Mühendisliği',
    createdAt: '2026-09-20T10:00:00.000Z'
  }),
  new User({
    id: 2,
    name: 'Prof. Dr. Ayşe Yılmaz',
    email: 'ayse.yilmaz@faculty.edu',
    role: 'Faculty',
    department: 'Yazılım Mühendisliği',
    createdAt: '2026-09-21T11:30:00.000Z'
  }),
  new User({
    id: 3,
    name: 'Emre Kaya',
    email: 'emre.kaya@alumni.edu',
    role: 'Alumni',
    department: 'Elektrik-Elektronik Mühendisliği',
    createdAt: '2026-09-22T14:15:00.000Z'
  })
];

const nextUserId = () => memoryUsers.length > 0 ? Math.max(...memoryUsers.map(u => u.id)) + 1 : 1;
const isConnError = err => err && (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.name === 'AggregateError');

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

    const cleanEmail = email.trim().toLowerCase();
    try {
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, role, department) VALUES (?, ?, ?, ?)',
        [name.trim(), cleanEmail, role || 'Alumni', department || 'Genel']
      );
      const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
      return { success: true, user: mapUser(rows[0]) };
    } catch (err) {
      if (isConnError(err)) {
        if (memoryUsers.some(u => u.email === cleanEmail)) {
          return { success: false, error: `Bu e-posta adresi (${cleanEmail}) zaten kayıtlı.` };
        }
        const user = new User({ id: nextUserId(), name, email: cleanEmail, role, department });
        memoryUsers.push(user);
        return { success: true, user };
      }
      return dbError(err);
    }
  },

  async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM users ORDER BY id');
      return rows.map(mapUser);
    } catch (err) {
      if (isConnError(err)) return [...memoryUsers];
      throw err;
    }
  },

  async getById(id) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    try {
      const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
      return rows.length ? { success: true, user: mapUser(rows[0]) } : missing(id);
    } catch (err) {
      if (isConnError(err)) {
        const u = memoryUsers.find(item => item.id === id);
        return u ? { success: true, user: u } : missing(id);
      }
      throw err;
    }
  },

  async update(id, data = {}) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    const { name, email, role, department } = data;
    const error = validateRequired({ name, email, role });
    if (error) return { success: false, error };
    const cleanEmail = email.trim().toLowerCase();

    try {
      const current = await this.getById(id);
      if (!current.success) return current;
      await pool.execute(
        'UPDATE users SET name = ?, email = ?, role = ?, department = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name.trim(), cleanEmail, role || 'Alumni', department || 'Genel', id]
      );
      return this.getById(id);
    } catch (err) {
      if (isConnError(err)) {
        const index = memoryUsers.findIndex(u => u.id === id);
        if (index === -1) return missing(id);
        if (memoryUsers.some(u => u.email === cleanEmail && u.id !== id)) {
          return { success: false, error: `Bu e-posta adresi (${cleanEmail}) başka bir kullanıcı tarafından kullanılıyor.` };
        }
        const updated = new User({
          id, name, email: cleanEmail, role, department,
          createdAt: memoryUsers[index].createdAt,
          updatedAt: new Date().toISOString()
        });
        memoryUsers[index] = updated;
        return { success: true, user: updated };
      }
      return dbError(err);
    }
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
    try {
      const current = await this.getById(id);
      if (!current.success) return current;
      await pool.execute('DELETE FROM users WHERE id = ?', [id]);
      return current;
    } catch (err) {
      if (isConnError(err)) {
        const index = memoryUsers.findIndex(u => u.id === id);
        if (index === -1) return missing(id);
        const [deleted] = memoryUsers.splice(index, 1);
        return { success: true, user: deleted };
      }
      throw err;
    }
  },
};
assertStoreInterface(UserStore, 'UserStore');

// ─────────────────────────────────────────────
//  Export
// ─────────────────────────────────────────────

module.exports = { User, UserStore, VALID_ROLES, isValidEmail, isValidRole };
