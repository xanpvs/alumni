-- Migration: 002_create_announcements
-- Kaynak: DATA_DESIGN.md §7 — announcements tablosu
-- Çalıştırma: src/db/migrate.js veya docker-compose db init

CREATE TABLE IF NOT EXISTS announcements (
  id           INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(160)    NOT NULL,
  content      TEXT            NOT NULL,
  author       VARCHAR(255)    NOT NULL DEFAULT 'Alumni Portal',
  category     VARCHAR(100)    NOT NULL DEFAULT 'Genel',
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME        NULL ON UPDATE CURRENT_TIMESTAMP
);
