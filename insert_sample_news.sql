-- Insert sample news data for testing
-- Run this in your Supabase SQL Editor

-- First, make sure we have some users to be authors
INSERT INTO users (id, name, email, role, username, phone) VALUES 
('admin-news-author', 'Admin Berita', 'admin@tkceria.com', 'admin', 'admin@tkceria.com', '081234567890')
ON CONFLICT (id) DO NOTHING;

-- Insert sample news
INSERT INTO news (
  id, 
  title, 
  excerpt, 
  content, 
  author_id, 
  publish_date, 
  status, 
  category, 
  image, 
  tags, 
  featured,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  'Pendaftaran Siswa Baru TK Ceria Tahun Ajaran 2025/2026',
  'TK Ceria membuka pendaftaran siswa baru untuk tahun ajaran 2025/2026. Daftarkan putra-putri Anda sekarang!',
  'TK Ceria dengan bangga mengumumkan pembukaan pendaftaran siswa baru untuk tahun ajaran 2025/2026. Kami menyediakan program pendidikan yang berkualitas dengan metode pembelajaran yang menyenangkan dan sesuai dengan perkembangan anak usia dini.\n\nFasilitas yang tersedia:\n- Ruang kelas yang nyaman dan aman\n- Playground yang luas\n- Perpustakaan anak\n- Laboratorium komputer\n- Ruang seni dan musik\n\nPendaftaran dibuka mulai tanggal 1 Januari 2025 sampai dengan 31 Maret 2025. Jangan lewatkan kesempatan emas ini!',
  'admin-news-author',
  '2025-01-15',
  'published',
  'Pendaftaran',
  '/kindergarten-registration.png',
  'pendaftaran, siswa baru, tk ceria',
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Kegiatan Field Trip ke Kebun Binatang',
  'Siswa-siswi TK Ceria melakukan kunjungan edukatif ke kebun binatang untuk belajar tentang berbagai jenis hewan.',
  'Pada hari Jumat, 10 Januari 2025, siswa-siswi TK Ceria melakukan kegiatan field trip ke Kebun Binatang Ragunan. Kegiatan ini bertujuan untuk memberikan pengalaman langsung kepada anak-anak dalam mengenal berbagai jenis hewan dan habitatnya.\n\nDalam kegiatan ini, anak-anak dapat:\n- Melihat berbagai jenis hewan secara langsung\n- Belajar tentang makanan dan habitat hewan\n- Mengembangkan rasa cinta terhadap alam\n- Meningkatkan keterampilan observasi\n\nAntusiasme anak-anak sangat tinggi dan mereka sangat senang dapat melihat gajah, singa, dan berbagai hewan lainnya secara langsung.',
  'admin-news-author',
  '2025-01-12',
  'published',
  'Kegiatan',
  '/children-zoo-field-trip.png',
  'field trip, kebun binatang, edukasi',
  false,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Workshop Parenting: Mendidik Anak di Era Digital',
  'TK Ceria mengadakan workshop untuk orang tua tentang cara mendidik anak di era digital yang penuh tantangan.',
  'TK Ceria mengundang seluruh orang tua siswa untuk mengikuti workshop parenting dengan tema "Mendidik Anak di Era Digital". Workshop ini akan diselenggarakan pada:\n\nHari/Tanggal: Sabtu, 25 Januari 2025\nWaktu: 09.00 - 12.00 WIB\nTempat: Aula TK Ceria\nPembicara: Dr. Siti Nurhaliza, M.Psi (Psikolog Anak)\n\nMateri yang akan dibahas:\n- Dampak teknologi terhadap perkembangan anak\n- Cara mengatur screen time yang sehat\n- Tips mengajarkan literasi digital sejak dini\n- Strategi komunikasi efektif dengan anak\n\nWorkshop ini gratis untuk semua orang tua siswa. Pendaftaran dapat dilakukan melalui WhatsApp sekolah.',
  'admin-news-author',
  '2025-01-20',
  'published',
  'Workshop',
  '/parenting-workshop-digital-era-presentation.png',
  'workshop, parenting, era digital',
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Perayaan Hari Kartini di TK Ceria',
  'Siswa-siswi TK Ceria merayakan Hari Kartini dengan mengenakan pakaian tradisional dan belajar tentang budaya Indonesia.',
  'Dalam rangka memperingati Hari Kartini, TK Ceria mengadakan perayaan istimewa pada tanggal 21 April 2024. Seluruh siswa dan guru mengenakan pakaian tradisional Indonesia yang indah dan beragam.\n\nKegiatan yang dilakukan:\n- Fashion show pakaian tradisional\n- Pengenalan tokoh-tokoh wanita Indonesia\n- Cerita tentang perjuangan R.A. Kartini\n- Lomba mewarnai gambar Kartini\n- Tarian tradisional\n\nMelalui kegiatan ini, anak-anak belajar tentang keberagaman budaya Indonesia dan pentingnya menghargai perjuangan para pahlawan wanita. Semua siswa terlihat antusias dan bangga mengenakan pakaian tradisional mereka.',
  'admin-news-author',
  '2024-04-21',
  'published',
  'Perayaan',
  '/kartini-day-celebration-kindergarten-traditional-c.png',
  'hari kartini, perayaan, budaya indonesia',
  false,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Prestasi Membanggakan: Juara Lomba Mewarnai Tingkat Kecamatan',
  'Siswa TK Ceria berhasil meraih juara dalam lomba mewarnai tingkat kecamatan. Selamat untuk para juara!',
  'TK Ceria berbangga mengumumkan prestasi membanggakan dari siswa-siswi kami dalam Lomba Mewarnai Tingkat Kecamatan yang diselenggarakan pada tanggal 15 Desember 2024.\n\nPara juara:\n- Juara 1: Aditya Pratama (Kelas B1)\n- Juara 2: Sari Indah Putri (Kelas B2)\n- Juara 3: Muhammad Rizki (Kelas A)\n- Juara Harapan 1: Zahra Aulia (Kelas B1)\n- Juara Harapan 2: Dimas Aryo (Kelas A)\n\nLomba ini diikuti oleh 50 peserta dari 10 TK se-kecamatan. Tema lomba adalah "Keindahan Alam Indonesia" dan para siswa kami menunjukkan kreativitas yang luar biasa.\n\nSelamat kepada semua pemenang! Prestasi ini membuktikan bahwa pembinaan seni di TK Ceria memberikan hasil yang maksimal.',
  'admin-news-author',
  '2024-12-16',
  'published',
  'Prestasi',
  '/children-coloring-competition-winners-kindergarten.png',
  'prestasi, lomba mewarnai, juara',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
