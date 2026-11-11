'use strict';

const logger = require('./logger.middleware');
const guardian404 = require('./guardian404.middleware');
const guardian5xx = require('./guardian5xx.middleware');

module.exports = {
  logger,
  guardian404,
  guardian5xx,
};
