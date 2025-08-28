# Debug Login - Step by Step

## 1. Buka Developer Tools
- Tekan **F12** atau **Ctrl+Shift+I**
- Pilih tab **Console**

## 2. Test Login Step by Step

### Step 1: Pilih Role
1. Klik dropdown "Role"
2. Pilih "Admin"
3. **Console harus menampilkan**: `Role selected: admin`

### Step 2: Masukkan Email
1. Klik field "Email"
2. Ketik: `admin@tkceria.com`
3. **Console harus menampilkan**: `Form data: {role: "admin", email: "admin@tkceria.com", password: ""}`

### Step 3: Masukkan Password
1. Klik field "Password"
2. Ketik: `123456`
3. **Console harus menampilkan**: `Form data: {role: "admin", email: "admin@tkceria.com", password: "123456"}`

### Step 4: Klik Button Masuk
1. Klik button "Masuk"
2. **Console harus menampilkan**:
   ```
   Form data: {role: "admin", email: "admin@tkceria.com", password: "123456"}
   Form validation: {hasRole: true, hasEmail: true, hasPassword: true, emailValid: true, passwordValid: true}
   Login attempt: {email: "admin@tkceria.com", role: "admin", passwordLength: 6}
   Mock auth successful: {id: "admin2", email: "admin@tkceria.com", ...}
   Login result: true
   Redirecting to: /dashboard/admin
   ```

## 3. Jika Ada Error

### Error: "Semua field harus diisi"
- Pastikan role dipilih
- Pastikan email diisi
- Pastikan password diisi

### Error: "Format email tidak valid"
- Pastikan email mengandung "@"

### Error: "Email, password, atau role tidak valid"
- Cek console untuk log auth
- Pastikan credentials benar

## 4. Test Credentials

| Role | Email | Password | Expected Console |
|------|-------|----------|------------------|
| Admin | `admin@tkceria.com` | `123456` | `Mock auth successful` |
| Parent | `parent@example.com` | `123456` | `Mock auth successful` |
| Teacher | `teacher@example.com` | `123456` | `Mock auth successful` |

## 5. Troubleshooting

### Button Tidak Bisa Di-klik
1. Cek apakah ada error di console
2. Cek apakah semua field terisi
3. Cek apakah ada JavaScript error

### Tidak Ada Log di Console
1. Pastikan Developer Tools terbuka
2. Pastikan tab Console aktif
3. Refresh halaman dan coba lagi

### Login Gagal
1. Cek log "Mock auth failed"
2. Pastikan email dan role cocok
3. Pastikan password tidak kosong
