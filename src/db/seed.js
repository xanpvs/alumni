/** Load missing starter records into MySQL through the entity factories. */
'use strict';

const { UserStore } = require('../models/user.model');
const { AnnouncementStore } = require('../models/announcement.model');
const { JobPostingStore } = require('../models/jobPosting.model');
const { UserFactory } = require('./factories/user.factory');
const { AnnouncementFactory } = require('./factories/announcement.factory');
const { JobPostingFactory } = require('./factories/jobPosting.factory');

const USER_SEED = [
  { name: 'Berat Çelik', email: 'berat@alumni.edu', role: 'Alumni', department: 'Bilgisayar Mühendisliği' },
  { name: 'Prof. Dr. Ayşe Yılmaz', email: 'ayse.yilmaz@faculty.edu', role: 'Faculty', department: 'Yazılım Mühendisliği' },
  { name: 'Emre Kaya', email: 'emre.kaya@alumni.edu', role: 'Alumni', department: 'Elektrik-Elektronik Mühendisliği' },
];

const ANNOUNCEMENT_SEED = [
  { title: 'Alumni Portal’a Hoş Geldiniz', content: 'Mezunlar ve akademisyenler için duyuruları buradan takip edebilirsiniz.', author: 'Alumni Portal', category: 'Genel' },
  { title: 'Mezunlar Buluşması', content: 'Yeni etkinlik ve buluşma duyuruları bu alanda paylaşılacaktır.', author: 'Alumni Portal', category: 'Etkinlik' },
];

const JOB_POSTING_SEED = [
  {
    title: 'Backend Developer',
    description: 'Node.js, Express ve MySQL ile REST API ve mikroservis mimarileri geliştirecek takım arkadaşı arıyoruz.',
    company: 'TechCorp A.Ş.',
    location: 'İstanbul / Uzaktan',
    type: 'Full-time',
    salary_range: '35.000 - 55.000 TL',
    status: 'Active',
    deadline: '2026-12-31',
  },
  {
    title: 'Yazılım Stajyeri (Yaz Dönemi)',
    description: 'Bilgisayar veya Yazılım Mühendisliği 3./4. sınıf öğrencileri için tam zamanlı staj imkanı.',
    company: 'StartupX Bilişim',
    location: 'Uzaktan',
    type: 'Internship',
    salary_range: '15.000 - 20.000 TL',
    status: 'Active',
    deadline: '2026-06-30',
  },
  {
    title: 'Yapay Zeka ve Veri Araştırmacısı',
    description: 'Büyük dil modelleri ve veri analitiği üzerine akademik ve endüstriyel Ar-Ge projeleri.',
    company: 'DeepLab AI Labs',
    location: 'Ankara / Hibrit',
    type: 'Contract',
    salary_range: '50.000 - 75.000 TL',
    status: 'Active',
    deadline: '2026-11-15',
  },
];

async function seedDatabase() {
  const existingUsers = await UserStore.getAll();
  for (const data of USER_SEED) {
    if (!existingUsers.some(user => user.email === data.email)) {
      const result = await UserFactory.create(data);
      if (!result.success) throw new Error(`Kullanıcı seed'i yüklenemedi: ${result.error}`);
    }
  }

  const allUsers = await UserStore.getAll();
  const facultyUser = allUsers.find(u => u.role === 'Faculty') || allUsers[0];
  const alumniUser = allUsers.find(u => u.role === 'Alumni') || allUsers[0];

  const existingAnnouncements = await AnnouncementStore.getAll();
  for (const data of ANNOUNCEMENT_SEED) {
    if (!existingAnnouncements.some(item => item.title === data.title)) {
      const result = await AnnouncementFactory.create(data);
      if (!result.success) throw new Error(`Duyuru seed'i yüklenemedi: ${result.error}`);
    }
  }

  const existingJobs = await JobPostingStore.getAll();
  for (let i = 0; i < JOB_POSTING_SEED.length; i++) {
    const jobData = { ...JOB_POSTING_SEED[i] };
    if (!existingJobs.some(j => j.title === jobData.title && j.company === jobData.company)) {
      jobData.posted_by = i % 2 === 0 ? facultyUser?.id : alumniUser?.id;
      const result = await JobPostingFactory.create(jobData);
      if (!result.success) throw new Error(`İş ilanı seed'i yüklenemedi: ${result.error}`);
    }
  }

  return {
    users: (await UserStore.getAll()).length,
    announcements: (await AnnouncementStore.getAll()).length,
    jobPostings: (await JobPostingStore.getAll()).length,
  };
}

if (require.main === module) {
  seedDatabase()
    .then(counts => console.log(`Seed hazır: ${counts.users} kullanıcı, ${counts.announcements} duyuru, ${counts.jobPostings} iş ilanı.`))
    .catch(error => {
      console.error('Seed işlemi başarısız:', error.message);
      process.exitCode = 1;
    });
}

module.exports = { seedDatabase };
