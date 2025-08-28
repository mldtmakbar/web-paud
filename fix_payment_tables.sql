-- Fix Payment Tables Structure
-- Run these queries in your Supabase SQL Editor

-- 1. Update payment_types table structure to match frontend
ALTER TABLE payment_types 
ADD COLUMN IF NOT EXISTS code VARCHAR(50),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS default_amount DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Wajib',
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 2. Update payments table structure to match frontend
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES students(id),
ADD COLUMN IF NOT EXISTS payment_type_id UUID REFERENCES payment_types(id),
ADD COLUMN IF NOT EXISTS semester VARCHAR(20),
ADD COLUMN IF NOT EXISTS academic_year VARCHAR(20),
ADD COLUMN IF NOT EXISTS amount DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS scholarship DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS due_date DATE;

-- Make total_due a generated column (computed automatically)
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS total_due DECIMAL(15,2) GENERATED ALWAYS AS (amount - discount - scholarship) STORED;

-- 3. Insert sample payment types (Jenis Pembayaran)
INSERT INTO payment_types (id, name, code, description, default_amount, is_active, category, display_order) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'UP3', 'up3', 'Uang Pangkal Semester 3', 9000000, true, 'Wajib', 1),
('550e8400-e29b-41d4-a716-446655440002', 'SDP2', 'sdp2', 'Sumbangan Dana Pendidikan 2', 11000000, true, 'Wajib', 2),
('550e8400-e29b-41d4-a716-446655440003', 'BPP Paket', 'bpp_paket', 'Biaya Penyelenggaraan Pendidikan Paket', 9000000, true, 'Wajib', 3),
('550e8400-e29b-41d4-a716-446655440004', 'BPP Non Paket', 'bpp_non_paket', 'Biaya Penyelenggaraan Pendidikan Non Paket', 0, true, 'Opsional', 4),
('550e8400-e29b-41d4-a716-446655440005', 'SKS', 'sks', 'Sistem Kredit Semester', 0, true, 'Opsional', 5),
('550e8400-e29b-41d4-a716-446655440006', 'Perpustakaan', 'perpustakaan', 'Biaya Perpustakaan', 0, true, 'Opsional', 6),
('550e8400-e29b-41d4-a716-446655440007', 'Biaya Kesehatan', 'biaya_kesehatan', 'Biaya Pemeriksaan Kesehatan', 150000, true, 'Wajib', 7),
('550e8400-e29b-41d4-a716-446655440008', 'Potongan', 'potongan', 'Berbagai Jenis Potongan', 0, true, 'Potongan', 8),
('550e8400-e29b-41d4-a716-446655440009', 'Beasiswa', 'beasiswa', 'Bantuan Beasiswa', 0, true, 'Potongan', 9)
ON CONFLICT (id) DO UPDATE SET
name = EXCLUDED.name,
code = EXCLUDED.code,
description = EXCLUDED.description,
default_amount = EXCLUDED.default_amount,
is_active = EXCLUDED.is_active,
category = EXCLUDED.category,
display_order = EXCLUDED.display_order;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_type_id ON payments(payment_type_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);
CREATE INDEX IF NOT EXISTS idx_payment_types_active ON payment_types(is_active);
CREATE INDEX IF NOT EXISTS idx_payment_types_category ON payment_types(category);

-- 5. Insert sample payment data (optional - for testing)
-- You can run this to create some test payment records
INSERT INTO payments (
    id, 
    student_id, 
    payment_type_id, 
    semester, 
    academic_year, 
    amount, 
    discount, 
    scholarship, 
    total_due, 
    status, 
    due_date,
    created_at,
    updated_at
) 
SELECT 
    gen_random_uuid(),
    s.id,
    pt.id,
    'Semester 1',
    '2024/2025',
    pt.default_amount,
    0,
    0,
    pt.default_amount,
    CASE 
        WHEN random() < 0.3 THEN 'paid'
        WHEN random() < 0.6 THEN 'pending' 
        ELSE 'overdue'
    END,
    CURRENT_DATE + INTERVAL '30 days',
    NOW(),
    NOW()
FROM students s
CROSS JOIN payment_types pt
WHERE pt.category = 'Wajib'
AND NOT EXISTS (
    SELECT 1 FROM payments p 
    WHERE p.student_id = s.id 
    AND p.payment_type_id = pt.id 
    AND p.semester = 'Semester 1' 
    AND p.academic_year = '2024/2025'
)
LIMIT 50; -- Limit to avoid too many records

-- 6. Update existing payment_types if they exist but with different structure
UPDATE payment_types SET 
    code = LOWER(REPLACE(name, ' ', '_')),
    is_active = true,
    display_order = 
        CASE name
            WHEN 'UP3' THEN 1
            WHEN 'SDP2' THEN 2  
            WHEN 'BPP Paket' THEN 3
            WHEN 'BPP Non Paket' THEN 4
            WHEN 'SKS' THEN 5
            WHEN 'Perpustakaan' THEN 6
            WHEN 'Biaya Kesehatan' THEN 7
            WHEN 'Potongan' THEN 8
            WHEN 'Beasiswa' THEN 9
            ELSE 10
        END
WHERE code IS NULL;

-- 7. Clean up any orphaned records (optional)
-- DELETE FROM payments WHERE student_id NOT IN (SELECT id FROM students);
-- DELETE FROM payments WHERE payment_type_id NOT IN (SELECT id FROM payment_types);
