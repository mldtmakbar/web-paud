-- Insert test data for user_accounts table

-- First, let's add a test student
INSERT INTO public.students (
    id,
    name,
    birth_date,
    gender,
    father_name,
    mother_name,
    father_phone,
    mother_phone,
    address,
    registration_date,
    status
) VALUES (
    'test-student-001',
    'Anak Test',
    '2020-05-15',
    'L',
    'Bapak Test',
    'Ibu Test',
    '081234567890',
    '081234567891',
    'Jl. Test No. 123',
    NOW(),
    'active'
) ON CONFLICT (id) DO NOTHING;

-- Insert a test parent account
INSERT INTO public.user_accounts (
    id,
    email,
    password,
    role,
    user_id,
    user_name,
    status
) VALUES (
    'parent-test-001',
    'parent@test.com',
    'password123',
    'parent',
    'test-student-001',
    'Orang Tua Test',
    'active'
) ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    user_name = EXCLUDED.user_name;

-- Insert a test teacher
INSERT INTO public.teachers (
    id,
    name,
    email,
    phone,
    specialization,
    hire_date,
    status
) VALUES (
    'test-teacher-001',
    'Guru Test',
    'teacher@test.com',
    '081234567892',
    'PAUD',
    NOW(),
    'active'
) ON CONFLICT (id) DO NOTHING;

-- Insert a test teacher account
INSERT INTO public.user_accounts (
    id,
    email,
    password,
    role,
    user_id,
    user_name,
    status
) VALUES (
    'teacher-test-001',
    'teacher@test.com',
    'password123',
    'teacher',
    'test-teacher-001',
    'Guru Test',
    'active'
) ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    user_name = EXCLUDED.user_name;

-- Insert admin user in users table (old format)
INSERT INTO public.users (
    id,
    email,
    password_hash,
    name,
    role,
    username,
    phone
) VALUES (
    'admin-test-001',
    'admin@test.com',
    'password123',
    'Admin Test',
    'admin',
    'admin@test.com',
    '081234567893'
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    name = EXCLUDED.name;
