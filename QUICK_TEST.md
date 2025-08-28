# Quick Test - Dashboard Parent

## Langkah Testing

1. **Buka aplikasi**: http://localhost:3000
2. **Login sebagai parent**:
   - Email: `parent@example.com`
   - Password: `123456`
   - Role: `parent`
3. **Klik "Masuk"**
4. **Harus redirect ke**: `/dashboard/parent`

## Expected Result

Dashboard harus menampilkan:
- ✅ Header "Dashboard Orang Tua"
- ✅ Nama user: "Budi Santoso"
- ✅ 2 siswa: Andi Santoso & Siti Nurhaliza
- ✅ Tab: Pembayaran, Kehadiran, Nilai
- ✅ Tombol Export PDF

## Jika Masih Kosong

1. **Buka Developer Tools** (F12)
2. **Lihat Console tab**
3. **Cari log debug**:
   ```
   User logged in: {id: "1", name: "Budi Santoso", ...}
   Found students: [2 siswa]
   Current students: [2 siswa]
   ```

## Debug Info

Dashboard akan menampilkan debug info jika tidak ada siswa:
- User ID: 1
- User Role: parent
- Total Students in System: 4
- Fallback Students: 1

## Data Mock

- Parent ID "1" → 2 siswa
- Parent ID "2" → 2 siswa
- Total: 4 siswa dalam sistem

## Troubleshooting

1. **Clear localStorage**: 
   ```javascript
   localStorage.clear()
   ```
2. **Restart server**: 
   ```bash
   npm run dev
   ```
3. **Check console errors**
