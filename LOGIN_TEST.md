# Test Login - Step by Step

## 1. Pastikan Server Berjalan

```bash
# Di PowerShell Windows
npm run dev
```

## 2. Test Login Admin

1. **Buka**: http://localhost:3000/login
2. **Pilih Role**: `Admin`
3. **Email**: `admin@tkceria.com`
4. **Password**: `123456`
5. **Klik Button "Masuk"**

## 3. Test Login Parent

1. **Pilih Role**: `Orang Tua`
2. **Email**: `parent@example.com`
3. **Password**: `123456`
4. **Klik Button "Masuk"**

## 4. Debug Info

**Buka Developer Tools (F12) → Console tab**

Anda akan melihat log:
```
Login attempt: { email: "admin@tkceria.com", role: "admin", passwordLength: 6 }
Mock auth successful: { id: "admin2", email: "admin@tkceria.com", ... }
Login result: true
Redirecting to: /dashboard/admin
```

## 5. Expected Result

- ✅ **Admin**: Redirect ke `/dashboard/admin`
- ✅ **Parent**: Redirect ke `/dashboard/parent`
- ✅ **Teacher**: Redirect ke `/dashboard/teacher`

## 6. Jika Button Tidak Bisa Di-klik

**Periksa Console untuk Error:**
- Form validation error
- JavaScript error
- Network error

**Periksa Form:**
- Role harus dipilih
- Email harus valid
- Password harus diisi
- Button tidak disabled

## 7. Troubleshooting

### Button Disabled
- Pastikan semua field terisi
- Pastikan role dipilih
- Pastikan email format valid

### Console Error
- Cek error message
- Cek network tab
- Cek apakah ada JavaScript error

### Tidak Redirect
- Cek apakah login success
- Cek console log
- Cek router.push error

## 8. Test Credentials

| Role | Email | Password | Expected |
|------|-------|----------|----------|
| Admin | `admin@tkceria.com` | `123456` | `/dashboard/admin` |
| Admin | `admin@example.com` | `123456` | `/dashboard/admin` |
| Parent | `parent@example.com` | `123456` | `/dashboard/parent` |
| Teacher | `teacher@example.com` | `123456` | `/dashboard/teacher` |
