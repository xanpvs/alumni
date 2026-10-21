-- Migration: 004_create_applications
-- Kaynak: DATA_DESIGN.md §3.4 — applications tablosu
-- Çalıştırma: src/db/migrate.js veya docker-compose db init

CREATE TABLE IF NOT EXISTS applications (
  id             INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  job_posting_id INT UNSIGNED    NOT NULL,
  applicant_id   INT UNSIGNED    NOT NULL,
  cover_letter   TEXT            NULL,
  status         ENUM('Pending','Reviewed','Accepted','Rejected') NOT NULL DEFAULT 'Pending',
  applied_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME        NULL ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_application (job_posting_id, applicant_id),
  FOREIGN KEY (job_posting_id) REFERENCES job_postings(id) ON DELETE CASCADE,
  FOREIGN KEY (applicant_id)   REFERENCES users(id)        ON DELETE CASCADE
);
