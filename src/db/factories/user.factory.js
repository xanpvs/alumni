/**
 * User Factory
 *
 * Kullanım:
 *   const { UserFactory } = require('../factories/user.factory');
 *
 *   UserFactory.build()               // → düz nesne (store'a dokunmaz)
 *   UserFactory.build({ role: 'Faculty' })
 *   UserFactory.buildList(5)          // → 5 elemanlı dizi
 *   UserFactory.create()              // → UserStore.create() çağırır
 *   UserFactory.createList(3)
 *
 * Not: create() asenkron UserStore arayüzünü kullanır; build() ve buildList()
 *      DB bağlantısına ihtiyaç duymadan çalışır.
 */

'use strict';

const { VALID_ROLES } = require('../../models/user.model');

// ─── Sabit kataloglar (gerçekçi Türk üniversite verisi) ─────────────────────

const NAMES = [
  'Berat Çelik', 'Ayşe Yılmaz', 'Emre Kaya', 'Zeynep Arslan', 'Murat Demir',
  'Selin Öztürk', 'Burak Şahin', 'Elif Koç', 'Can Aydın', 'Dilan Yıldız',
  'Sercan Polat', 'Nisan Güler', 'Oğuz Eren', 'Merve Çetin', 'Taha Doğan',
];

const DEPARTMENTS = [
  'Bilgisayar Mühendisliği', 'Yazılım Mühendisliği', 'Elektrik-Elektronik Mühendisliği',
  'Endüstri Mühendisliği', 'Makine Mühendisliği', 'İnşaat Mühendisliği',
  'Yapay Zeka Anabilim Dalı', 'Siber Güvenlik Anabilim Dalı', 'Veri Bilimi',
  'Matematik', 'Fizik', 'Kimya Mühendisliği', 'Biyomedikal Mühendisliği',
];

const EMAIL_DOMAINS = ['alumni.edu', 'faculty.edu', 'uni.edu.tr'];

// ─── Sekans sayacı (benzersiz e-posta üretimi için) ──────────────────────────

let _seq = 0;
const nextSeq = () => ++_seq;

// ─── Varsayılan değer üreteci ────────────────────────────────────────────────

function defaults() {
  const s    = nextSeq();
  const name = NAMES[s % NAMES.length];
  const slug = name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
  const domain = EMAIL_DOMAINS[s % EMAIL_DOMAINS.length];

  return {
    name,
    email:      `${slug}.${s}@${domain}`,
    role:       'Alumni',
    department: DEPARTMENTS[s % DEPARTMENTS.length],
  };
}

// ─── Factory ─────────────────────────────────────────────────────────────────

const UserFactory = {
  /**
   * Varsayılan alanlarla düz bir kullanıcı nesnesi üretir (store'a dokunmaz).
   * @param {object} [overrides]
   * @returns {object}
   */
  build(overrides = {}) {
    return { ...defaults(), ...overrides };
  },

  /**
   * `count` adet düz kullanıcı nesnesi üretir.
   * @param {number} count
   * @param {object} [overrides]
   * @returns {object[]}
   */
  buildList(count, overrides = {}) {
    return Array.from({ length: count }, () => this.build(overrides));
  },

  /**
   * Yeni bir kullanıcı oluşturur ve UserStore'a kaydeder.
   * @param {object} [overrides]
   * @returns {Promise<{ success: boolean, user?: import('../../models/user.model').User, error?: string }>}
   */
  create(overrides = {}) {
    const { UserStore } = require('../../models/user.model');
    return UserStore.create(this.build(overrides));
  },

  /**
   * `count` adet kullanıcı oluşturur ve UserStore'a kaydeder.
   * @param {number} count
   * @param {object} [overrides]
   * @returns {Promise<Array>}
   */
  async createList(count, overrides = {}) {
    return Promise.all(Array.from({ length: count }, () => this.create(overrides)));
  },

  /** Geçerli role listesi */
  ROLES: VALID_ROLES,
  DEPARTMENTS,
  NAMES,
};

module.exports = { UserFactory };
