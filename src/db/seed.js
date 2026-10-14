/** Load missing starter records into MySQL through the entity factories. */
'use strict';

const { UserStore } = require('../models/user.model');
const { AnnouncementStore } = require('../models/announcement.model');
const { UserFactory } = require('./factories/user.factory');
const { AnnouncementFactory } = require('./factories/announcement.factory');

const USER_SEED = [
  { name: 'Berat Çelik', email: 'berat@alumni.edu', role: 'Alumni', department: 'Bilgisayar Mühendisliği' },
  { name: 'Prof. Dr. Ayşe Yılmaz', email: 'ayse.yilmaz@faculty.edu', role: 'Faculty', department: 'Yazılım Mühendisliği' },
  { name: 'Emre Kaya', email: 'emre.kaya@alumni.edu', role: 'Alumni', department: 'Elektrik-Elektronik Mühendisliği' },
];

const ANNOUNCEMENT_SEED = [
  { title: 'Alumni Portal’a Hoş Geldiniz', content: 'Mezunlar ve akademisyenler için duyuruları buradan takip edebilirsiniz.', author: 'Alumni Portal', category: 'Genel' },
  { title: 'Mezunlar Buluşması', content: 'Yeni etkinlik ve buluşma duyuruları bu alanda paylaşılacaktır.', author: 'Alumni Portal', category: 'Etkinlik' },
];

async function seedDatabase() {
  const existingUsers = await UserStore.getAll();
  for (const data of USER_SEED) {
    if (!existingUsers.some(user => user.email === data.email)) {
      const result = await UserFactory.create(data);
      if (!result.success) throw new Error(`Kullanıcı seed'i yüklenemedi: ${result.error}`);
    }
  }

  const existingAnnouncements = await AnnouncementStore.getAll();
  for (const data of ANNOUNCEMENT_SEED) {
    if (!existingAnnouncements.some(item => item.title === data.title)) {
      const result = await AnnouncementFactory.create(data);
      if (!result.success) throw new Error(`Duyuru seed'i yüklenemedi: ${result.error}`);
    }
  }

  return { users: (await UserStore.getAll()).length, announcements: (await AnnouncementStore.getAll()).length };
}

if (require.main === module) {
  seedDatabase()
    .then(counts => console.log(`Seed hazır: ${counts.users} kullanıcı, ${counts.announcements} duyuru.`))
    .catch(error => {
      console.error('Seed işlemi başarısız:', error.message);
      process.exitCode = 1;
    });
}

module.exports = { seedDatabase };
