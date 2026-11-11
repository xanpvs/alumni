'use strict';

/**
 * Logger Middleware
 * Terminale her gelen isteğin zamanını, HTTP metodunu, rotasını,
 * yanıt durum kodunu ve işlem süresini (ms) yazdırır.
 *
 * Format: time method route res.type duration
 * Örn: 10:20:30 POST /user 201 18ms
 */
const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;

    const method = req.method;
    const route = req.originalUrl || req.url;
    const resType = res.statusCode; // HTTP response status

    console.log(`${time} ${method} ${route} ${resType} ${duration}ms`);
  });

  next();
};

module.exports = loggerMiddleware;
