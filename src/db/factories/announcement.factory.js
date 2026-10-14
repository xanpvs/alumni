/**
 * Announcement Factory
 *
 * Kullanım:
 *   const { AnnouncementFactory } = require('../factories/announcement.factory');
 *
 *   AnnouncementFactory.build()
 *   AnnouncementFactory.build({ category: 'Etkinlik' })
 *   AnnouncementFactory.buildList(3)
 *   AnnouncementFactory.create()
 *   AnnouncementFactory.createList(5)
 */

'use strict';

// ─── Sabit kataloglar ────────────────────────────────────────────────────────

const CATEGORIES = ['Genel', 'Etkinlik', 'Haber', 'Duyuru', 'Kariyer', 'Akademik'];

const AUTHORS = [
  'Alumni Portal', 'Öğrenci İşleri', 'Kariyer Merkezi',
  'Bilgisayar Mühendisliği Bölümü', 'Rektörlük', 'Mezunlar Derneği',
];

const TITLES = [
  'Mezunlar Buluşması 2026',
  'Kariyer Fuarı Kayıtları Başladı',
  'Yeni Dönem Akademik Takvimi Yayınlandı',
  'Bölüm Semineri: Yapay Zeka ve Gelecek',
  'Staj Fırsatları — Güz 2026',
  'Mezun Başarı Hikayeleri: Bu Haftaki Konuğumuz',
  'Kampüs Renovasyonu Hakkında Duyuru',
  'Online Mentorluk Programı Başvuruları Açıldı',
  'Erasmus+ Hareketlilik Programı Bilgilendirme Toplantısı',
  'Lisansüstü Kabul Koşulları Güncellendi',
];

const CONTENTS = [
  'Tüm mezunlarımızı bu özel etkinliğe davet ediyoruz. Detaylı bilgi ve kayıt için web sitemizi ziyaret edin.',
  'Bu yıl 200\'den fazla firmanın katılımıyla gerçekleşecek kariyer fuarı için ön kayıt işlemleri başlamıştır.',
  'Yeni akademik dönem takvimi rektörlük onayıyla kesinleşmiştir. Tüm öğrenci ve akademisyenlerin dikkatine.',
  'Alanında uzman konuşmacılarla gerçekleşecek seminerimize katılmak için kayıt yaptırabilirsiniz.',
  'Güz dönemi için staj başvuruları açılmıştır. Başvuru koşulları ve son tarih için bölüm panosunu takip edin.',
  'Bu hafta başarılı bir kariyer yolculuğunu paylaşan mezunumuzu ağırlıyoruz.',
  'Kampüs genelinde sürdürülen renovasyon çalışmaları hakkında güncel bilgileri bu sayfadan takip edebilirsiniz.',
  'Üst sınıf öğrencilerini alt sınıf öğrencileri ve mezunlarla buluşturan mentorluk programına başvurular başladı.',
  'AB destekli öğrenci ve akademisyen hareketlilik programı hakkında bilgilendirme toplantısı düzenlenecektir.',
  'Yüksek lisans ve doktora programları için başvuru koşulları ve kontenjanlar güncellenmiştir.',
];

// ─── Sekans sayacı ───────────────────────────────────────────────────────────

let _seq = 0;
const nextSeq = () => ++_seq;

// ─── Varsayılan değer üreteci ────────────────────────────────────────────────

function defaults() {
  const s = nextSeq();
  return {
    title:    TITLES[s % TITLES.length],
    content:  CONTENTS[s % CONTENTS.length],
    author:   AUTHORS[s % AUTHORS.length],
    category: CATEGORIES[s % CATEGORIES.length],
  };
}

// ─── Factory ─────────────────────────────────────────────────────────────────

const AnnouncementFactory = {
  /**
   * Varsayılan alanlarla düz bir duyuru nesnesi üretir (store'a dokunmaz).
   * @param {object} [overrides]
   * @returns {object}
   */
  build(overrides = {}) {
    return { ...defaults(), ...overrides };
  },

  /**
   * `count` adet düz duyuru nesnesi üretir.
   * @param {number} count
   * @param {object} [overrides]
   * @returns {object[]}
   */
  buildList(count, overrides = {}) {
    return Array.from({ length: count }, () => this.build(overrides));
  },

  /**
   * Yeni bir duyuru oluşturur ve AnnouncementStore'a kaydeder.
   * @param {object} [overrides]
   * @returns {Promise<{ success: boolean, announcement?: object, error?: string }>}
   */
  create(overrides = {}) {
    const { AnnouncementStore } = require('../../models/announcement.model');
    return AnnouncementStore.create(this.build(overrides));
  },

  /**
   * `count` adet duyuru oluşturur ve AnnouncementStore'a kaydeder.
   * @param {number} count
   * @param {object} [overrides]
   * @returns {Promise<Array>}
   */
  async createList(count, overrides = {}) {
    return Promise.all(Array.from({ length: count }, () => this.create(overrides)));
  },

  CATEGORIES,
  AUTHORS,
  TITLES,
};

module.exports = { AnnouncementFactory };
