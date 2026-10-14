/**
 * Database Connection Pool
 *
 * MySQL bağlantı havuzu — mysql2/promise kullanır.
 * CRUD store'larının kullandığı MySQL bağlantı havuzu.
 *
 * Ortam değişkenleri (.env):
 *   DB_HOST     — MySQL sunucu adresi  (varsayılan: localhost)
 *   DB_PORT     — MySQL portu          (varsayılan: 3306)
 *   DB_USER     — Kullanıcı adı        (varsayılan: alumni_user)
 *   DB_PASSWORD — Parola               (varsayılan: '')
 *   DB_NAME     — Veritabanı adı       (varsayılan: alumni_portal)
 */

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT, 10) || 3306,
  user:     process.env.DB_USER     || 'alumni_user',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'alumni_portal',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

module.exports = pool;
