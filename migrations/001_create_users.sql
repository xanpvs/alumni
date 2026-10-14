-- Migration: 001_create_users
-- Kaynak: DATA_DESIGN.md §7 — users tablosu
-- Çalıştırma: src/db/migrate.js veya docker-compose db init

CREATE TABLE IF NOT EXISTS users (
  id           INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(255)    NOT NULL,
  email        VARCHAR(255)    NOT NULL UNIQUE,
  role         ENUM('Alumni','Faculty','Admin') NOT NULL DEFAULT 'Alumni',
  department   VARCHAR(255)    NOT NULL DEFAULT 'Genel',
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME        NULL ON UPDATE CURRENT_TIMESTAMP
);
