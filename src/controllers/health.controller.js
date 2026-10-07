/**
 * Health Controller
 *
 * Sunucu sağlık durumu endpoint'ini yönetir.
 *
 * MVC Katmanı: Controller — HTTP isteğini alır ve sağlık bilgisini döner.
 */

/**
 * GET /api/health
 * Sunucunun anlık çalışma durumunu ve zaman damgasını JSON olarak döner.
 */
const getStatus = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Alumni Portal API is running successfully',
    timestamp: new Date().toISOString()
  });
};

module.exports = { getStatus };
