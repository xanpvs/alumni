'use strict';

const { logErrorToFile } = require('../utils/errorLogger');

/**
 * 5xx Guardian Middleware
 * Uygulama genelinde fırlatılan veya işlenemeyen 5xx sunucu hatalarını yakalar,
 * konsola log basar, logs/error.logs dosyasına kaydeder ve istemciye bir sebep (reason)
 * ile güvenli hata yanıtı döner.
 */
const guardian5xx = (err, req, res, next) => {
  const statusCode = err.status && err.status >= 400 ? err.status : 500;
  const reason = err.message || 'Sunucu tarafında beklenmeyen bir hata oluştu.';

  console.error(`[5xx Guardian] [${req.method} ${req.originalUrl}] Hata:`, err.stack || err.message);

  // Hatanın detaylarını logs/error.logs dosyasına yaz
  logErrorToFile({
    req,
    statusCode,
    error: err.name || 'ServerError',
    reason,
    stack: err.stack,
  });

  if (res.headersSent) {
    return next(err);
  }

  if (req.path.startsWith('/api') || req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    return res.status(statusCode).json({
      success: false,
      status: statusCode,
      error: statusCode === 500 ? 'Internal Server Error' : (err.name || 'Error'),
      reason,
    });
  }

  return res.status(statusCode).send(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>500 Sunucu Hatası</title></head><body style="font-family:sans-serif;padding:2rem;"><h1>500 Sunucu Hatası</h1><p><strong>Neden (Reason):</strong> ${reason}</p><p><a href="/">Ana Sayfaya Dön</a></p></body></html>`
  );
};

module.exports = guardian5xx;
