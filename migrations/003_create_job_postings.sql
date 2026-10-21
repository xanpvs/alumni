-- Migration: 003_create_job_postings
-- Kaynak: DATA_DESIGN.md §7 — job_postings tablosu
-- Çalıştırma: src/db/migrate.js veya docker-compose db init

CREATE TABLE IF NOT EXISTS job_postings (
  id           INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255)    NOT NULL,
  description  TEXT            NOT NULL,
  company      VARCHAR(255)    NOT NULL,
  location     VARCHAR(255)    NOT NULL DEFAULT 'Uzaktan',
  type         ENUM('Full-time','Part-time','Internship','Contract') NOT NULL DEFAULT 'Full-time',
  salary_range VARCHAR(100)    NULL,
  posted_by    INT UNSIGNED    NULL,
  status       ENUM('Active','Closed') NOT NULL DEFAULT 'Active',
  deadline     DATE            NULL,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME        NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
);
