# Dokumentasi Sistem Penilaian Dinamis PAUD

## 🎯 Overview
Sistem ini mengubah aspek penilaian dan semester dari data hardcoded menjadi dinamis dan dapat dikelola melalui database. Admin dapat menambah, mengubah, dan mengelola aspek penilaian serta semester melalui interface yang user-friendly.

## 📊 Database Schema

### 1. Tabel `semesters`
Menyimpan informasi semester dan tahun ajaran.

```sql
CREATE TABLE semesters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  year VARCHAR(20) NOT NULL,
  semester_number INTEGER NOT NULL CHECK (semester_number IN (1, 2)),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_current BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);
```

**Fitur:**
- ✅ Hanya satu semester yang bisa menjadi `is_current = true`
- ✅ Trigger otomatis untuk update timestamp
- ✅ Index untuk performa query

### 2. Tabel `assessment_aspects`
Menyimpan aspek penilaian utama (seperti Sosial Emosional, Kognitif, dll).

```sql
CREATE TABLE assessment_aspects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  is_required BOOLEAN DEFAULT false,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);
```

**Kategori yang tersedia:**
- `sosial_emosional` - Sosial Emosional
- `kognitif` - Kognitif  
- `fisik_motorik` - Fisik Motorik
- `bahasa` - Bahasa
- `agama_moral` - Agama dan Moral
- `seni` - Seni

### 3. Tabel `assessment_sub_aspects`
Menyimpan sub aspek dari setiap aspek penilaian utama.

```sql
CREATE TABLE assessment_sub_aspects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aspect_id UUID NOT NULL REFERENCES assessment_aspects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(15) NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 4. Tabel `grades` (Updated)
Tabel penilaian yang sudah diperbarui untuk menggunakan reference ke aspek dan semester dinamis.

```sql
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
  aspect_id UUID NOT NULL REFERENCES assessment_aspects(id) ON DELETE CASCADE,
  sub_aspect_id UUID REFERENCES assessment_sub_aspects(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  score VARCHAR(10),
  notes TEXT,
  assessed_by UUID REFERENCES auth.users(id),
  assessed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## 🔧 Fitur Database

### Views untuk Laporan
```sql
-- View untuk mempermudah query penilaian siswa
CREATE VIEW student_grades_view AS
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
  u.name as assessed_by_name
FROM grades g
JOIN students s ON g.student_id = s.id
JOIN semesters sem ON g.semester_id = sem.id
JOIN assessment_aspects aa ON g.aspect_id = aa.id
LEFT JOIN assessment_sub_aspects asa ON g.sub_aspect_id = asa.id
LEFT JOIN auth.users u ON g.assessed_by = u.id;
```

### Functions Utility
```sql
-- Function untuk set semester aktif
CREATE OR REPLACE FUNCTION set_current_semester(semester_id UUID)
RETURNS void AS $$
BEGIN
  -- Set semua semester ke tidak aktif
  UPDATE semesters SET is_current = false;
  -- Set semester yang dipilih menjadi aktif
  UPDATE semesters SET is_current = true WHERE id = semester_id;
END;
$$ LANGUAGE plpgsql;

-- Function untuk mendapatkan semester aktif
CREATE OR REPLACE FUNCTION get_current_semester()
RETURNS semesters AS $$
DECLARE
  current_sem semesters%ROWTYPE;
BEGIN
  SELECT * INTO current_sem FROM semesters WHERE is_current = true;
  RETURN current_sem;
END;
$$ LANGUAGE plpgsql;
```

## 🖥️ Frontend Components

### 1. Semester Management (`components/dashboard/semester-management.tsx`)
**Fitur:**
- ✅ CRUD operations untuk semester
- ✅ Set semester aktif dengan satu klik
- ✅ Validasi form dengan toast notifications
- ✅ Filter dan sorting
- ✅ Responsive design

**API Functions:**
- `getSemesters()` - Ambil semua semester
- `getCurrentSemester()` - Ambil semester aktif
- `createSemester()` - Buat semester baru
- `updateSemester()` - Update semester

### 2. Assessment Management (`components/dashboard/assessment-management.tsx`)
**Fitur:**
- ✅ CRUD operations untuk aspek dan sub aspek
- ✅ Collapsible design untuk hierarchical view
- ✅ Drag & drop untuk urutan tampil (future)
- ✅ Category-based filtering
- ✅ Bulk operations (future)

**API Functions:**
- `getAssessmentAspects()` - Ambil aspek penilaian
- `getAssessmentSubAspects()` - Ambil sub aspek
- `createAssessmentAspect()` - Buat aspek baru
- `updateAssessmentAspect()` - Update aspek

### 3. Enhanced Grades Editor (`components/dashboard/grades-editor.tsx`)
**Fitur:**
- ✅ Dynamic dropdown untuk semester dan aspek
- ✅ Conditional sub aspek selection
- ✅ Batch save dengan pending changes tracking
- ✅ Real-time validation
- ✅ Integration dengan database baru

## 📁 File Structure
```
components/
├── dashboard/
│   ├── semester-management.tsx       # Kelola semester
│   ├── assessment-management.tsx     # Kelola aspek penilaian
│   └── grades-editor.tsx            # Input nilai (updated)
├── ui/
│   ├── collapsible.tsx              # Collapsible component
│   └── ...
app/
├── dashboard/
│   └── admin/
│       └── management/
│           └── page.tsx             # Halaman admin utama
lib/
├── db.ts                           # Database functions (updated)
├── types.ts                        # TypeScript interfaces (updated)
└── ...
```

## 🚀 Cara Implementasi

### 1. Jalankan SQL Schema
```sql
-- Copy paste isi dari create_assessment_tables.sql ke Supabase SQL Editor
-- Atau gunakan migration tools
```

### 2. Update Frontend Components
- ✅ Semester management sudah siap
- ✅ Assessment management sudah siap  
- ✅ Grades editor sudah diperbarui

### 3. Set Default Data
```sql
-- Data akan otomatis terisi dari script SQL
-- Termasuk semester dan aspek penilaian default
```

## 🔒 Security & Permissions

### Row Level Security (RLS)
```sql
-- Enable RLS pada semua tabel baru
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_aspects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sub_aspects ENABLE ROW LEVEL SECURITY;

-- Policy untuk admin
CREATE POLICY "Admin can manage semesters" ON semesters
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Policy untuk teacher (read only)
CREATE POLICY "Teachers can read semesters" ON semesters
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('teacher', 'admin'));
```

## 📈 Benefits

### Before (Hardcoded)
- ❌ Aspek penilaian fixed di code
- ❌ Semester tidak fleksibel
- ❌ Perlu deployment untuk perubahan
- ❌ Tidak ada audit trail

### After (Dynamic)
- ✅ Fully configurable via admin panel
- ✅ Real-time changes tanpa deployment
- ✅ Complete audit trail
- ✅ Flexible semester management
- ✅ Hierarchical assessment structure
- ✅ Better user experience

## 🧪 Testing

### Test Scenarios
1. **Create Semester**
   - ✅ Valid data input
   - ✅ Duplicate prevention
   - ✅ Date validation

2. **Assessment Management**
   - ✅ Aspect CRUD operations
   - ✅ Sub-aspect relationship
   - ✅ Category filtering

3. **Grades Integration**
   - ✅ Dynamic dropdowns
   - ✅ Data consistency
   - ✅ Batch operations

## 🔮 Future Enhancements
- [ ] Drag & drop reordering
- [ ] Bulk import/export
- [ ] Assessment templates
- [ ] Academic year auto-creation
- [ ] Advanced reporting
- [ ] API versioning
- [ ] Backup/restore functionality
