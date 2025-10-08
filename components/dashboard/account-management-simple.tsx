"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, KeyIcon, User } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { hashPassword, verifyPassword } from '@/lib/password'
import { supabase } from '@/lib/supabase'

export function AccountManagementSimple() {
  const { user } = useAuth()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChangePassword = async () => {
    console.log('🔄 handleChangePassword called')
    console.log('User data:', user)
    console.log('Password data:', { 
      currentLength: passwordData.currentPassword.length,
      newLength: passwordData.newPassword.length,
      confirmLength: passwordData.confirmPassword.length
    })
    
    // Basic validation
    if (!passwordData.currentPassword) {
      alert('Harap masukkan password saat ini')
      return
    }
    
    if (!passwordData.newPassword) {
      alert('Harap masukkan password baru')
      return
    }
    
    if (!passwordData.confirmPassword) {
      alert('Harap konfirmasi password baru')
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok')
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password baru minimal 6 karakter')
      return
    }

    try {
      setIsLoading(true)
      console.log('✅ Starting password change process')

      // Hash password baru langsung tanpa verifikasi dulu (untuk testing)
      console.log('🔐 Hashing new password...')
      const hashedPassword = await hashPassword(passwordData.newPassword)
      console.log('✅ Password hashed successfully, length:', hashedPassword.length)

      // Update password berdasarkan role
      let updateError = null
      
      if (user?.role === 'parent' || user?.role === 'teacher') {
        console.log('📝 Updating password in user_accounts table for role:', user.role)
        const { error } = await supabase
          .from('user_accounts')
          .update({
            password: hashedPassword,
            updated_at: new Date().toISOString()
          })
          .eq('id', user?.id)
        updateError = error
        console.log('Update result:', { error })
      } else {
        console.log('📝 Updating password in users table for admin')
        const { error } = await supabase
          .from('users')
          .update({
            password_hash: hashedPassword,
            updated_at: new Date().toISOString()
          })
          .eq('id', user?.id)
        updateError = error
        console.log('Update result:', { error })
      }

      if (updateError) {
        console.error('❌ Error updating password:', updateError)
        alert(`Gagal mengubah password: ${updateError.message}`)
      } else {
        console.log('✅ Password updated successfully')
        alert('Password berhasil diubah!')
        setIsChangingPassword(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      console.error('❌ Error changing password:', error)
      alert(`Terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
      console.log('🏁 Password change process finished')
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Data pengguna tidak ditemukan</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informasi Akun (Simple Version for Testing)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Nama</Label>
              <p className="text-sm font-semibold">{user.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <p className="text-sm font-semibold">{user.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Role</Label>
              <p className="text-sm font-semibold capitalize">{user.role}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
              <p className="text-sm font-semibold">{user.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ubah Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyIcon className="h-5 w-5" />
            Ganti Password (Testing Version - No Verification)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isChangingPassword ? (
            <Button onClick={() => setIsChangingPassword(true)}>
              Ganti Password
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Password Saat Ini</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Masukkan password saat ini"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Password Baru</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Masukkan password baru (minimal 6 karakter)"
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Konfirmasi password baru"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false)
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    })
                  }}
                  disabled={isLoading}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Password (Simple Test)'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
