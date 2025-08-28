# Quick Test Guide

## Test Login Parent

1. Buka http://localhost:3000/login
2. Pilih role: "parent"
3. Email: `parent@example.com`
4. Password: `123456`
5. Klik "Masuk"
6. Harus redirect ke `/dashboard/parent`

## Expected Result

Dashboard parent harus menampilkan:
- Header dengan nama "Budi Santoso"
- 2 siswa: Andi Santoso dan Siti Nurhaliza
- Tab untuk pembayaran, kehadiran, dan nilai
- Tombol export PDF

## Jika Masih Kosong

1. Buka Developer Tools (F12)
2. Lihat Console tab
3. Cari log debug yang menampilkan:
   - User logged in: {id: "1", name: "Budi Santoso", ...}
   - Found students: [2 siswa]
   - Current students: [2 siswa]

## Debug Info

Dashboard akan menampilkan debug info jika tidak ada siswa:
- User ID: 1
- User Role: parent
- Total Students in System: 4

## Data Mock

- Parent ID "1" → 2 siswa
- Parent ID "2" → 2 siswa
- Total: 4 siswa dalam sistem
