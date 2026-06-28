-- DecodeLabs Project 3 — Database Setup
-- Run this in phpMyAdmin or MySQL CLI before starting the app

CREATE DATABASE IF NOT EXISTS decodelabs_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE decodelabs_db;

CREATE TABLE IF NOT EXISTS interns (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  batch      VARCHAR(10)  NOT NULL DEFAULT '2026',
  domain     VARCHAR(100) NOT NULL,
  status     ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT IGNORE INTO interns (name, email, batch, domain, status) VALUES
('Aryan Sharma',  'aryan@decodelabs.tech',  '2026', 'Full Stack Development', 'active'),
('Priya Verma',   'priya@decodelabs.tech',   '2026', 'Frontend Development',  'active'),
('Rohit Kumar',   'rohit@decodelabs.tech',   '2026', 'Backend API',           'active'),
('Sneha Gupta',   'sneha@decodelabs.tech',   '2026', 'Database Design',       'inactive');
