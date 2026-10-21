/**
 * Application Factory
 *
 * Kullanım:
 *   const { ApplicationFactory } = require('../factories/application.factory');
 *   ApplicationFactory.build()
 *   ApplicationFactory.create({ job_posting_id: 1, applicant_id: 2 })
 */

'use strict';

const { VALID_STATUSES } = require('../../models/application.model');

let _seq = 0;
const nextSeq = () => ++_seq;

function defaults() {
  const s = nextSeq();
  return {
    job_posting_id: 1,
    applicant_id: 1,
    cover_letter: `İlanınızla yakından ilgileniyorum, yetkinliklerimin pozisyona uygun olduğunu düşünüyorum #${s}.`,
    status: 'Pending',
  };
}

const ApplicationFactory = {
  build(overrides = {}) {
    return { ...defaults(), ...overrides };
  },

  buildList(count, overrides = {}) {
    return Array.from({ length: count }, () => this.build(overrides));
  },

  create(overrides = {}) {
    const { ApplicationStore } = require('../../models/application.model');
    return ApplicationStore.create(this.build(overrides));
  },

  async createList(count, overrides = {}) {
    return Promise.all(Array.from({ length: count }, () => this.create(overrides)));
  },

  STATUSES: VALID_STATUSES,
};

module.exports = { ApplicationFactory };
