# Password Security Update

## Perubahan yang Telah Dibuat

### 1. **Implementasi bcrypt untuk Hashing Password**
- Semua password baru akan di-hash menggunakan bcrypt dengan salt rounds 12
- Password lama masih menggunakan plain text dan perlu diupdate

### 2. **Komponen yang Diupdate**
- `lib/password.ts` - Utility functions untuk hash dan verify password
- `lib/auth.ts` - Update fungsi autentikasi untuk menggunakan bcrypt
- `components/dashboard/teacher-management.tsx` - Hash password saat membuat akun guru
- `components/dashboard/student-management.tsx` - Hash password saat membuat akun parent
- `components/dashboard/account-management.tsx` - Fitur ubah password untuk admin

### 3. **Fitur Baru untuk Admin**
- Tab "Akun Admin" di dashboard admin
- Fitur ubah password admin dengan validasi
- Interface untuk mengelola akun admin

## Langkah-langkah Migration Password Lama

### Step 1: Update Password Admin
Jalankan query berikut di Supabase SQL Editor:

```sql
-- Update password admin menjadi 'admin123' (hashed)
UPDATE users 
SET password_hash = '$2b$12$CZiapESx46fXP.xnrni8auqaU0mh2u5DciNXJ8rkjjV6zCD2JUQVy' 
WHERE email = 'admin@tkanida.com';
```

### Step 2: Update Password Teacher (Opsional)
Jika ada akun teacher yang sudah ada dengan password lama:

```sql
-- Update semua password teacher menjadi 'teacher123' (hashed)
UPDATE user_accounts 
SET password = '$2b$12$ZoxIcLs44HMrKXHFBUnv3.0zHnix/bR2Wqx/AlPIqOjfZ1hGG1XYe' 
WHERE role = 'teacher';
```

### Step 3: Update Password Parent (Opsional)
Jika ada akun parent yang sudah ada dengan password lama:

```sql
-- Update semua password parent menjadi 'parent123' (hashed)
UPDATE user_accounts 
SET password = '$2b$12$SLHNYUWfc6gZKub8MpqQ.uMnGtpo5RZmUZHTkSp0cIjOWMuc5WCMC' 
WHERE role = 'parent';
```

## Cara Penggunaan

### 1. **Login Admin**
- Email: admin@tkanida.com
- Password: admin123 (setelah migration)

### 2. **Ubah Password Admin**
1. Login ke dashboard admin
2. Klik tab "Akun Admin"
3. Klik "Ubah Password"
4. Masukkan password lama dan password baru
5. Klik "Simpan Password"

### 3. **Membuat Akun Baru**
Semua akun guru dan parent yang dibuat melalui interface admin akan otomatis menggunakan bcrypt hashing.

## Password Default untuk Testing

### Admin
- Email: admin@tkanida.com
- Password: admin123

### Teacher (default)
- Password: teacher123

### Parent (default)
- Password: parent123

## Keamanan

### Password Requirements
- Minimal 6 karakter
- Hashing menggunakan bcrypt dengan salt rounds 12
- Password lama akan ter-verify sampai diupdate

### Best Practices
1. Ubah password default setelah migration
2. Gunakan password yang kuat (kombinasi huruf, angka, simbol)
3. Update password secara berkala
4. Backup database sebelum menjalankan migration

## Troubleshooting

### Jika Login Gagal Setelah Migration
1. Pastikan hash password sudah benar di database
2. Cek apakah email sudah benar
3. Coba dengan password default sesuai dokumentasi di atas

### Jika Hash Password Error
1. Pastikan bcryptjs sudah terinstall dengan benar
2. Restart aplikasi setelah migration
3. Cek console untuk error messages
