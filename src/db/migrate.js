/**
 * Migration Runner
 *
 * migrations/ klasöründeki SQL dosyalarını sıra numarasına göre çalıştırır.
 * Hangi migration'ların daha önce uygulandığını takip etmek için
 * veritabanında bir `_migrations` tablosu tutar.
 *
 * Kullanım:
 *   node src/db/migrate.js
 *   npm run migrate
 *
 * Gereksinimler:
 *   - MySQL çalışıyor ve .env'deki DB_* değişkenleri dolu olmalı
 *   - npm install (mysql2 bağımlılığı)
 *
 * Migration dosyası adlandırma kuralı:
 *   migrations/<NNN>_<açıklama>.sql   (örn. 001_create_users.sql)
 */

'use strict';

require('dotenv').config();

const fs   = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const MIGRATIONS_DIR = path.join(__dirname, '../../migrations');

const DB_CONFIG = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT, 10) || 3306,
  user:     process.env.DB_USER     || 'alumni_user',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'alumni_portal',
  multipleStatements: true,
};

// ─── Migration tablosunu oluştur (yoksa) ─────────────────────────────────────

async function ensureMigrationsTable(conn) {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      filename   VARCHAR(255) NOT NULL UNIQUE,
      applied_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// ─── Daha önce çalıştırılan migration'ları getir ─────────────────────────────

async function getApplied(conn) {
  const [rows] = await conn.execute('SELECT filename FROM _migrations ORDER BY filename');
  return new Set(rows.map(r => r.filename));
}

// ─── Tek bir SQL dosyasını çalıştır ──────────────────────────────────────────

async function runMigration(conn, filename) {
  const filepath = path.join(MIGRATIONS_DIR, filename);
  const sql = fs.readFileSync(filepath, 'utf8');

  console.log(`  → Applying: ${filename}`);
  await conn.query(sql);
  await conn.execute(
    'INSERT INTO _migrations (filename) VALUES (?)',
    [filename]
  );
  console.log(`  ✔ Done:     ${filename}`);
}

// ─── Ana runner ──────────────────────────────────────────────────────────────

async function migrate() {
  let conn;

  try {
    conn = await mysql.createConnection(DB_CONFIG);
    console.log('✔ Connected to MySQL:', DB_CONFIG.host, DB_CONFIG.database);

    await ensureMigrationsTable(conn);

    // SQL dosyalarını sırala (001_, 002_, ...)
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('ℹ No migration files found in', MIGRATIONS_DIR);
      return;
    }

    const applied = await getApplied(conn);
    const pending = files.filter(f => !applied.has(f));

    if (pending.length === 0) {
      console.log('✔ All migrations are already applied. Nothing to do.');
      return;
    }

    console.log(`\nRunning ${pending.length} pending migration(s)...\n`);
    for (const file of pending) {
      await runMigration(conn, file);
    }
    console.log('\n✔ Migration complete.');

  } catch (err) {
    console.error('\n✖ Migration failed:', err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

migrate();
