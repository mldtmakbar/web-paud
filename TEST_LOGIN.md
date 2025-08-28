# Test Login dan Dashboard TK Ceria

## Cara Testing

### 1. Login sebagai Parent
- Email: `parent@example.com`
- Password: `any password` (bisa diisi sembarang)
- Role: `parent`

### 2. Login sebagai Teacher  
- Email: `teacher@example.com`
- Password: `any password` (bisa diisi sembarang)
- Role: `teacher`

### 3. Login sebagai Admin
- Email: `admin@example.com`
- Password: `any password` (bisa diisi sembarang)
- Role: `admin`

## Data Mock yang Tersedia

### Parent dengan ID "1" (Budi Santoso)
- **Siswa 1**: Andi Santoso (TK A)
- **Siswa 2**: Siti Nurhaliza (TK B)

### Parent dengan ID "2" (Joko Widodo)  
- **Siswa 3**: Raden Mas Joko (TK A)
- **Siswa 4**: Putri Ayu (TK B)

## Fitur yang Bisa Diuji

### Dashboard Parent
- Melihat daftar siswa yang terdaftar
- Melihat profil lengkap siswa
- Melihat data pembayaran
- Melihat data kehadiran
- Melihat nilai siswa
- Export data ke PDF

### Dashboard Teacher
- Melihat statistik siswa
- Mengelola presensi siswa
- Mengelola nilai siswa

### Dashboard Admin
- Melihat statistik sekolah
- Manajemen guru
- Manajemen siswa
- Manajemen kelas
- Manajemen pembayaran
- Manajemen berita

## Troubleshooting

### Jika Dashboard Parent Kosong
1. Pastikan login dengan role "parent"
2. Pastikan user ID yang login adalah "1" atau "2"
3. Cek console browser untuk debug info
4. Pastikan data mock sudah ter-load dengan benar

### Jika Ada Error
1. Cek console browser
2. Pastikan semua dependencies ter-install
3. Restart development server
4. Clear localStorage browser

## Catatan
- Sistem ini menggunakan mock data untuk testing
- Untuk production, ganti `authenticateMock` dengan `loginWithCredentials` di `lib/auth.ts`
- Data mock bisa diubah di `lib/mock-data.ts`
