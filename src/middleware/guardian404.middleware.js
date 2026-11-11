'use strict';

/**
 * 404 Guardian Middleware
 * Sistemde tanımlı olmayan rotalara yapılan istekleri yakalar.
 * - API istekleri için JSON formatında sebep (reason) içeren 404 döner.
 * - Web arayüzü isteklerini generic 404 sayfasına (/404) yönlendirir (redirect).
 */
const guardian404 = (req, res, next) => {
  const reason = `Tanımsız rota: '${req.method} ${req.originalUrl}' uç noktası sistemde bulunamadı.`;

  // API isteği veya JSON kabul eden istemciler için JSON formatında yanıt dön
  if (
    req.path.startsWith('/api') ||
    req.xhr ||
    (req.headers.accept && req.headers.accept.includes('application/json'))
  ) {
    return res.status(404).json({
      success: false,
      status: 404,
      error: 'Not Found',
      reason,
    });
  }

  // Web tarayıcı isteklerini generic 404 sayfasına yönlendir (redirect)
  const redirectUrl = `/404?url=${encodeURIComponent(req.originalUrl)}&reason=${encodeURIComponent(reason)}`;
  return res.redirect(redirectUrl);
};

module.exports = guardian404;
