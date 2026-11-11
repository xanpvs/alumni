'use strict';

const fs = require('fs');
const path = require('path');

// Proje kökündeki logs klasörü
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
  } catch (err) {
    console.error('Logs klasörü oluşturulamadı:', err.message);
  }
}

const errorLogPath = path.join(logsDir, 'error.logs');

/**
 * Hata kayıtlarını logs/error.logs dosyasına zaman damgasıyla yazar.
 *
 * @param {object} params
 * @param {import('express').Request} [params.req]
 * @param {number} [params.statusCode=500]
 * @param {string} [params.error]
 * @param {string} [params.reason]
 * @param {string} [params.stack]
 */
function logErrorToFile({ req, statusCode = 500, error, reason, stack }) {
  const now = new Date();
  const timeStr = now.toISOString();
  const method = req ? req.method : 'UNKNOWN';
  const url = req ? (req.originalUrl || req.url) : 'UNKNOWN';
  const ip = req ? (req.ip || req.connection?.remoteAddress || '-') : '-';
  const message = reason || error || 'Bilinmeyen hata';

  const entry = [
    `[${timeStr}]`,
    `[${method} ${url}]`,
    `[Status: ${statusCode}]`,
    `[IP: ${ip}]`,
    `Reason: ${message}`,
    stack ? `\nStack:\n${stack}` : '',
    '\n---\n',
  ].filter(Boolean).join(' ');

  fs.appendFile(errorLogPath, entry, (err) => {
    if (err) {
      console.error('[ErrorLogger] logs/error.logs dosyasına yazılamadı:', err.message);
    }
  });
}

module.exports = {
  logErrorToFile,
  errorLogPath,
};
