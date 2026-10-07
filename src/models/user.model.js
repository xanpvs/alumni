/**
 * User Model
 *
 * MVC Katmanı: Model
 *
 * İki yapıdan oluşur:
 *  1. User    — Tek bir kullanıcıyı temsil eden sınıf. Doğrulama (validation)
 *               ve veri normalleştirme bu sınıfın içinde yaşar.
 *  2. UserStore — In-memory veri deposu. Tüm CRUD operasyonlarını (Create,
 *                 Read, Update, Delete) kapsüller. Veri tabanı bağlantısına
 *                 gerek yoktur; ileride MySQL/MongoDB ile değiştirmek için
 *                 yalnızca bu dosyayı güncellemek yeterlidir.
 */

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

// ─────────────────────────────────────────────
//  In-Memory Veri Deposu (Seed Data)
// ─────────────────────────────────────────────

/** @type {User[]} */
let store = [
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

/** Sıradaki kullanıcı ID'sini üretir (mevcut en büyük ID + 1). */
const nextId = () =>
  store.length > 0 ? Math.max(...store.map(u => u.id)) + 1 : 1;

// ─────────────────────────────────────────────
//  UserStore — CRUD Operasyonları
// ─────────────────────────────────────────────

const UserStore = {

  // ── CREATE ──────────────────────────────────

  /**
   * Yeni bir kullanıcı oluşturur.
   *
   * @param {{ name: string, email: string, role?: string, department?: string }} data
   * @returns {{ success: boolean, error?: string, user?: User }}
   *
   * @example
   * const result = UserStore.create({ name: 'Ali', email: 'ali@uni.edu', role: 'Alumni' });
   * if (result.success) console.log(result.user);
   */
  create(data) {
    const { name, email, role, department } = data;

    const validationError = validateRequired({ name, email, role });
    if (validationError) return { success: false, error: validationError };

    const cleanEmail = email.trim().toLowerCase();

    if (store.some(u => u.email === cleanEmail)) {
      return {
        success: false,
        error: `Bu e-posta adresi (${cleanEmail}) zaten kayıtlı.`
      };
    }

    const user = new User({ id: nextId(), name, email: cleanEmail, role, department });
    store.push(user);
    return { success: true, user };
  },

  // ── READ ─────────────────────────────────────

  /**
   * Kayıtlı tüm kullanıcıları döner.
   *
   * @returns {User[]}
   *
   * @example
   * const users = UserStore.getAll();
   */
  getAll() {
    return [...store]; // Defensive copy — dış kod store'u doğrudan değiştiremez
  },

  /**
   * ID'ye göre tek kullanıcı döner.
   *
   * @param {number} id
   * @returns {{ success: boolean, error?: string, user?: User }}
   *
   * @example
   * const result = UserStore.getById(1);
   * if (result.success) console.log(result.user);
   */
  getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    }
    const user = store.find(u => u.id === id);
    if (!user) {
      return { success: false, error: `ID'si ${id} olan kullanıcı bulunamadı.` };
    }
    return { success: true, user };
  },

  // ── UPDATE (Full — PUT) ──────────────────────

  /**
   * Kullanıcının tüm alanlarını yeniden yazar (PUT semantiği).
   *
   * @param {number} id
   * @param {{ name: string, email: string, role?: string, department?: string }} data
   * @returns {{ success: boolean, error?: string, user?: User }}
   *
   * @example
   * const result = UserStore.update(2, { name: 'Yeni Ad', email: 'yeni@uni.edu' });
   */
  update(id, data) {
    if (!Number.isInteger(id) || id <= 0) {
      return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    }

    const { name, email, role, department } = data;

    const validationError = validateRequired({ name, email, role });
    if (validationError) return { success: false, error: validationError };

    const cleanEmail = email.trim().toLowerCase();

    const index = store.findIndex(u => u.id === id);
    if (index === -1) {
      return { success: false, error: `ID'si ${id} olan kullanıcı bulunamadı.` };
    }

    if (store.some(u => u.email === cleanEmail && u.id !== id)) {
      return {
        success: false,
        error: `Bu e-posta adresi (${cleanEmail}) başka bir kullanıcı tarafından kullanılıyor.`
      };
    }

    const updated = new User({
      id,
      name,
      email: cleanEmail,
      role,
      department,
      createdAt: store[index].createdAt,
      updatedAt: new Date().toISOString()
    });

    store[index] = updated;
    return { success: true, user: updated };
  },

  // ── UPDATE (Partial — PATCH) ─────────────────

  /**
   * Yalnızca gönderilen alanları günceller (PATCH semantiği).
   *
   * @param {number} id
   * @param {{ name?: string, email?: string, role?: string, department?: string }} data
   * @returns {{ success: boolean, error?: string, user?: User }}
   *
   * @example
   * const result = UserStore.patch(2, { department: 'Siber Güvenlik' });
   */
  patch(id, data) {
    if (!Number.isInteger(id) || id <= 0) {
      return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    }

    const { name, email, role, department } = data;

    if (name === undefined && email === undefined && role === undefined && department === undefined) {
      return {
        success: false,
        error: 'En az bir alan gönderilmelidir: name, email, role, department.'
      };
    }

    const validationError = validatePartial({ name, email, role });
    if (validationError) return { success: false, error: validationError };

    const index = store.findIndex(u => u.id === id);
    if (index === -1) {
      return { success: false, error: `ID'si ${id} olan kullanıcı bulunamadı.` };
    }

    const current = store[index];
    const cleanEmail = email !== undefined ? email.trim().toLowerCase() : current.email;

    if (email !== undefined && store.some(u => u.email === cleanEmail && u.id !== id)) {
      return {
        success: false,
        error: `Bu e-posta adresi (${cleanEmail}) başka bir kullanıcı tarafından kullanılıyor.`
      };
    }

    const updated = new User({
      id,
      name:       name       !== undefined ? name       : current.name,
      email:      cleanEmail,
      role:       role       !== undefined ? role       : current.role,
      department: department !== undefined ? department : current.department,
      createdAt:  current.createdAt,
      updatedAt:  new Date().toISOString()
    });

    store[index] = updated;
    return { success: true, user: updated };
  },

  // ── DELETE ───────────────────────────────────

  /**
   * Kullanıcıyı depodan kalıcı olarak siler.
   *
   * @param {number} id
   * @returns {{ success: boolean, error?: string, user?: User }}
   *
   * @example
   * const result = UserStore.delete(3);
   * if (result.success) console.log('Silindi:', result.user);
   */
  delete(id) {
    if (!Number.isInteger(id) || id <= 0) {
      return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    }

    const index = store.findIndex(u => u.id === id);
    if (index === -1) {
      return { success: false, error: `ID'si ${id} olan kullanıcı bulunamadı.` };
    }

    const [deleted] = store.splice(index, 1);
    return { success: true, user: deleted };
  }
};

// ─────────────────────────────────────────────
//  Export
// ─────────────────────────────────────────────

module.exports = { User, UserStore, VALID_ROLES, isValidEmail, isValidRole };
