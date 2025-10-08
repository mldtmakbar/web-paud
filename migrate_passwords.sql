-- Migration script untuk hash existing passwords
-- Jalankan script ini sekali saja untuk mengupdate password yang sudah ada

-- Update password di table users (admin accounts)
-- Script ini harus dijalankan secara manual di Supabase SQL Editor

-- Contoh untuk password 'admin123' menjadi bcrypt hash
-- Anda perlu mengganti password_hash dengan hasil hash yang sesuai

-- UPDATE users 
-- SET password_hash = '$2a$12$...' -- hash dari bcrypt untuk password yang diinginkan
-- WHERE email = 'admin@tkanida.com';

-- Update password di table user_accounts (teacher dan parent accounts) 
-- UPDATE user_accounts 
-- SET password = '$2a$12$...' -- hash dari bcrypt untuk password yang diinginkan
-- WHERE role = 'teacher' OR role = 'parent';

-- Untuk testing, bisa membuat admin dengan password yang sudah di-hash
-- INSERT INTO users (name, email, username, password_hash, role, phone, status, created_at, updated_at)
-- VALUES (
--   'Admin TK Anida',
--   'admin@tkanida.com',
--   'admin',
--   '$2a$12$LJNukYgIxJ3UdxJJ8o7nH.123ExampleHashForTesting456',
--   'admin',
--   '08123456789',
--   'active',
--   NOW(),
--   NOW()
-- );

-- CATATAN PENTING:
-- 1. Script ini hanya contoh
-- 2. Anda harus menggenerate hash bcrypt yang sebenarnya untuk setiap password
-- 3. Jangan gunakan hash example di atas untuk production
-- 4. Backup database sebelum menjalankan script ini
