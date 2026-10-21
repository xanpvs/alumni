/**
 * JobPosting Factory
 *
 * Kullanım:
 *   const { JobPostingFactory } = require('../factories/jobPosting.factory');
 *   JobPostingFactory.build()               // → düz nesne (store'a dokunmaz)
 *   JobPostingFactory.build({ type: 'Internship' })
 *   JobPostingFactory.buildList(5)          // → 5 elemanlı dizi
 *   JobPostingFactory.create()              // → JobPostingStore.create() çağırır
 *   JobPostingFactory.createList(3)
 */

'use strict';

const { VALID_TYPES, VALID_STATUSES } = require('../../models/jobPosting.model');

const TITLES = [
  'Backend Developer',
  'Frontend Developer',
  'Full Stack Engineer',
  'Yazılım Stajyeri',
  'Yapay Zeka Araştırmacısı',
  'Mobil Uygulama Geliştirici (Flutter)',
  'DevOps & Cloud Engineer',
  'Veri Analisti',
];

const COMPANIES = [
  'TechCorp A.Ş.',
  'StartupX Bilişim',
  'DeepLab AI Labs',
  'Bulut Bilişim Çözümleri',
  'Akademi Ar-Ge Merkezi',
  'FinTech Solutions',
];

const LOCATIONS = [
  'İstanbul / Uzaktan',
  'Ankara / Hibrit',
  'İzmir',
  'Uzaktan (Remote)',
  'Teknopark İstanbul',
];

let _seq = 0;
const nextSeq = () => ++_seq;

function defaults() {
  const s = nextSeq();
  const title = TITLES[s % TITLES.length];
  const company = COMPANIES[s % COMPANIES.length];
  const location = LOCATIONS[s % LOCATIONS.length];
  const type = VALID_TYPES[s % VALID_TYPES.length];

  return {
    title: `${title} #${s}`,
    description: `${company} bünyesinde ${title} pozisyonunda görevlendirilmek üzere takım arkadaşı arıyoruz.`,
    company,
    location,
    type,
    salary_range: '30.000 - 50.000 TL',
    posted_by: null,
    status: 'Active',
    deadline: '2026-12-31',
  };
}

const JobPostingFactory = {
  build(overrides = {}) {
    return { ...defaults(), ...overrides };
  },

  buildList(count, overrides = {}) {
    return Array.from({ length: count }, () => this.build(overrides));
  },

  create(overrides = {}) {
    const { JobPostingStore } = require('../../models/jobPosting.model');
    return JobPostingStore.create(this.build(overrides));
  },

  async createList(count, overrides = {}) {
    return Promise.all(Array.from({ length: count }, () => this.create(overrides)));
  },

  TYPES: VALID_TYPES,
  STATUSES: VALID_STATUSES,
  TITLES,
  COMPANIES,
};

module.exports = { JobPostingFactory };
