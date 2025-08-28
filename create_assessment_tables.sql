-- ====================================================================
-- SQL Script untuk membuat tabel Aspek Penilaian dan Semester
-- yang dapat dikelola secara dinamis oleh admin
-- ====================================================================

-- 1. Tabel untuk menyimpan data semester/tahun ajaran
CREATE TABLE IF NOT EXISTS semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- contoh: "Semester 1 - 2024/2025"
    year VARCHAR(20) NOT NULL, -- contoh: "2024/2025"
    semester_number INTEGER NOT NULL CHECK (semester_number IN (1, 2)), -- 1 atau 2
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false, -- hanya satu semester yang aktif
    is_current BOOLEAN DEFAULT false, -- semester saat ini
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_accounts(id),
    
    -- Constraint untuk memastikan hanya satu semester aktif
    CONSTRAINT unique_active_semester EXCLUDE (is_active WITH =) WHERE (is_active = true),
    -- Constraint untuk memastikan hanya satu semester current
    CONSTRAINT unique_current_semester EXCLUDE (is_current WITH =) WHERE (is_current = true)
);

-- 2. Tabel untuk menyimpan aspek penilaian
CREATE TABLE IF NOT EXISTS assessment_aspects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL, -- contoh: "Nilai Agama dan Budi Pekerti"
    code VARCHAR(50) UNIQUE NOT NULL, -- contoh: "AGAMA_BUDI_PEKERTI"
    description TEXT,
    display_order INTEGER DEFAULT 0, -- urutan tampilan
    is_active BOOLEAN DEFAULT true,
    is_required BOOLEAN DEFAULT true, -- apakah wajib dinilai
    category VARCHAR(50) DEFAULT 'academic', -- academic, character, skill, etc
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_accounts(id)
);

-- 3. Tabel untuk menyimpan sub aspek penilaian (opsional, untuk penilaian yang lebih detail)
CREATE TABLE IF NOT EXISTS assessment_sub_aspects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aspect_id UUID NOT NULL REFERENCES assessment_aspects(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(aspect_id, code)
);

-- 4. Update tabel grades untuk menggunakan relasi ke tabel baru
-- Backup existing grades table structure
CREATE TABLE IF NOT EXISTS grades_backup AS SELECT * FROM grades;

-- Drop dan recreate grades table dengan struktur baru
DROP TABLE IF EXISTS grades CASCADE;

CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    aspect_id UUID NOT NULL REFERENCES assessment_aspects(id) ON DELETE CASCADE,
    sub_aspect_id UUID REFERENCES assessment_sub_aspects(id) ON DELETE SET NULL,
    description TEXT NOT NULL, -- Deskripsi penilaian (untuk TK biasanya deskriptif)
    score VARCHAR(10), -- Opsional: A, B, C atau Berkembang, Mulai Berkembang, dll
    notes TEXT, -- Catatan tambahan dari guru
    assessed_by UUID REFERENCES user_accounts(id), -- Guru yang menilai
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint untuk memastikan satu nilai per siswa per aspek per semester
    UNIQUE(student_id, semester_id, aspect_id, sub_aspect_id)
);

-- 5. Insert data default untuk semester
INSERT INTO semesters (name, year, semester_number, start_date, end_date, is_active, is_current) VALUES
('Semester 1 - 2024/2025', '2024/2025', 1, '2024-07-01', '2024-12-20', true, true),
('Semester 2 - 2024/2025', '2024/2025', 2, '2025-01-07', '2025-06-20', false, false);

-- 6. Insert data default untuk aspek penilaian
INSERT INTO assessment_aspects (name, code, description, display_order, category) VALUES
('Nilai Agama dan Budi Pekerti', 'AGAMA_BUDI_PEKERTI', 'Penilaian terhadap pemahaman nilai-nilai agama dan akhlak', 1, 'character'),
('Jati Diri', 'JATI_DIRI', 'Penilaian terhadap pembentukan karakter dan kepribadian anak', 2, 'character'),
('Literasi', 'LITERASI', 'Penilaian kemampuan membaca, menulis, dan berbahasa', 3, 'academic'),
('Numerasi', 'NUMERASI', 'Penilaian kemampuan berhitung dan pemahaman matematika dasar', 4, 'academic'),
('Sains dan Teknologi', 'SAINS_TEKNOLOGI', 'Penilaian pemahaman sains sederhana dan teknologi', 5, 'academic'),
('Seni dan Budaya', 'SENI_BUDAYA', 'Penilaian kreativitas dan apresiasi seni', 6, 'skill'),
('Kesehatan dan Olahraga', 'KESEHATAN_OLAHRAGA', 'Penilaian kesehatan fisik dan kemampuan motorik', 7, 'physical');

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_grades_student_semester ON grades(student_id, semester_id);
CREATE INDEX IF NOT EXISTS idx_grades_aspect ON grades(aspect_id);
CREATE INDEX IF NOT EXISTS idx_assessment_aspects_active ON assessment_aspects(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_semesters_active ON semesters(is_active, is_current);

-- 8. Create triggers untuk auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers untuk semua tabel
CREATE TRIGGER update_semesters_updated_at
    BEFORE UPDATE ON semesters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_aspects_updated_at
    BEFORE UPDATE ON assessment_aspects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_sub_aspects_updated_at
    BEFORE UPDATE ON assessment_sub_aspects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at
    BEFORE UPDATE ON grades
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Create function untuk mengatur semester aktif (hanya satu yang bisa aktif)
CREATE OR REPLACE FUNCTION set_active_semester(semester_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Set semua semester menjadi tidak aktif
    UPDATE semesters SET is_active = false, is_current = false;
    
    -- Set semester yang dipilih menjadi aktif
    UPDATE semesters 
    SET is_active = true, is_current = true 
    WHERE id = semester_id;
    
    RETURN true;
END;
$$ language 'plpgsql';

-- 10. Create views untuk kemudahan query
CREATE OR REPLACE VIEW v_student_grades AS
SELECT 
    g.id,
    g.student_id,
    s.name as student_name,
    sem.name as semester_name,
    sem.year as academic_year,
    aa.name as aspect_name,
    aa.code as aspect_code,
    aa.category as aspect_category,
    asa.name as sub_aspect_name,
    g.description,
    g.score,
    g.notes,
    g.assessed_at,
    u.user_name as assessed_by_name
FROM grades g
JOIN students s ON g.student_id = s.id
JOIN semesters sem ON g.semester_id = sem.id
JOIN assessment_aspects aa ON g.aspect_id = aa.id
LEFT JOIN assessment_sub_aspects asa ON g.sub_aspect_id = asa.id
LEFT JOIN user_accounts u ON g.assessed_by = u.id
ORDER BY s.name, aa.display_order, asa.display_order;

-- 11. Grant permissions (sesuaikan dengan role yang ada)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON semesters TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON assessment_aspects TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON assessment_sub_aspects TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON grades TO authenticated;

-- 12. Create RLS policies (Row Level Security) - opsional
-- ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE assessment_aspects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE assessment_sub_aspects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- Example RLS policy
-- CREATE POLICY "Allow all for authenticated users" ON semesters FOR ALL TO authenticated USING (true);

-- ====================================================================
-- Selesai! Sekarang Anda memiliki:
-- 1. Tabel semesters untuk mengelola semester/tahun ajaran
-- 2. Tabel assessment_aspects untuk aspek penilaian
-- 3. Tabel assessment_sub_aspects untuk sub aspek (opsional)
-- 4. Tabel grades yang sudah diperbarui dengan relasi yang tepat
-- 5. Views untuk kemudahan query
-- 6. Functions dan triggers untuk otomasi
-- ====================================================================
