"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { CalendarDays, User, GraduationCap, CreditCard, FileText, Heart, Phone, MapPin, AlertCircle, CheckCircle, Clock, XCircle, Edit, Save, X, Eye, EyeOff, Settings } from "lucide-react"
import { getStudentsByParentId, getAttendance, getPayments, getGrades, getClasses } from "@/lib/db"
import { Student, Attendance, Payment, Grade, Class } from "@/lib/types"
import { supabase } from "@/lib/supabase"

export default function ParentDashboardWithId() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  // State for data
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  
  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [profileData, setProfileData] = useState({
    father_name: '',
    father_occupation: '',
    father_work_address: '',
    father_phone: '',
    father_email: '',
    mother_name: '',
    mother_occupation: '',
    mother_work_address: '',
    mother_phone: '',
    mother_email: '',
    home_address: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })

  // Load students data on component mount
  useEffect(() => {
    if (user && user.role === 'parent') {
      loadStudentsData()
    }
  }, [user])

  // Load student details when student is selected
  useEffect(() => {
    if (selectedStudent) {
      loadStudentDetails(selectedStudent.id)
    }
  }, [selectedStudent])

  const loadStudentsData = async () => {
    try {
      setDataLoading(true)
      console.log('Loading students data for parent ID:', userId)
      
      const studentsData = await getStudentsByParentId(userId)
      console.log('Students data received:', studentsData)
      
      const classesData = await getClasses()
      console.log('Classes data received:', classesData)
      
      setStudents(studentsData)
      setClasses(classesData)
      
      // Load profile data from first student's parent info
      if (studentsData.length > 0) {
        const student = studentsData[0]
        setProfileData({
          father_name: student.father_name || '',
          father_occupation: student.father_occupation || '',
          father_work_address: student.father_work_address || '',
          father_phone: student.father_phone || '',
          father_email: student.father_email || '',
          mother_name: student.mother_name || '',
          mother_occupation: student.mother_occupation || '',
          mother_work_address: student.mother_work_address || '',
          mother_phone: student.mother_phone || '',
          mother_email: student.mother_email || '',
          home_address: student.home_address || ''
        })
        setSelectedStudent(studentsData[0])
        console.log('Auto-selected first student and loaded profile data:', studentsData[0])
      } else {
        console.log('No students found for parent ID:', userId)
      }
    } catch (error) {
      console.error('Error loading students data:', error)
    } finally {
      setDataLoading(false)
    }
  }

  const loadStudentDetails = async (studentId: string) => {
    try {
      const [attendanceData, paymentsData, gradesData] = await Promise.all([
        getAttendance(studentId),
        getPayments(studentId),
        getGrades(studentId)
      ])

      setAttendance(attendanceData)
      setPayments(paymentsData)
      setGrades(gradesData)
    } catch (error) {
      console.error('Error loading student details:', error)
    }
  }

  const getStudentClass = (classId: string | null) => {
    if (!classId) return 'Belum ada kelas'
    const studentClass = classes.find(c => c.id === classId)
    return studentClass ? studentClass.name : 'Kelas tidak ditemukan'
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const handleSaveProfile = async () => {
    try {
      // Update student record with new parent information
      if (selectedStudent) {
        const { error } = await supabase
          .from('students')
          .update({
            father_name: profileData.father_name,
            father_occupation: profileData.father_occupation,
            father_work_address: profileData.father_work_address,
            father_phone: profileData.father_phone,
            father_email: profileData.father_email,
            mother_name: profileData.mother_name,
            mother_occupation: profileData.mother_occupation,
            mother_work_address: profileData.mother_work_address,
            mother_phone: profileData.mother_phone,
            mother_email: profileData.mother_email,
            home_address: profileData.home_address,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedStudent.id)

        if (error) {
          console.error('Error updating profile:', error)
          toast({
            title: "Error",
            description: "Gagal menyimpan profil. Silakan coba lagi.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Berhasil",
            description: "Profil berhasil disimpan!",
            variant: "default",
          })
          setIsEditingProfile(false)
          // Reload data to reflect changes
          await loadStudentsData()
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan profil.",
        variant: "destructive",
      })
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password baru dan konfirmasi password tidak sama!",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password baru minimal 6 karakter!",
        variant: "destructive",
      })
      return
    }

    try {
      // Update password in user_accounts table
      const { error } = await supabase
        .from('user_accounts')
        .update({
          password: passwordData.newPassword, // In production, this should be hashed
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Error updating password:', error)
        toast({
          title: "Error",
          description: "Gagal mengubah password. Silakan coba lagi.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Berhasil",
          description: "Password berhasil diubah!",
          variant: "default",
        })
        setIsEditingPassword(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengubah password.",
        variant: "destructive",
      })
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error if no user
  if (!user) {
    router.push('/login')
    return null
  }

  // Check if user role is parent
  if (user.role !== 'parent') {
    router.push(`/dashboard/${user.role}`)
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Orang Tua</h1>
          <p className="text-muted-foreground">Selamat datang, {user.name}</p>
        </div>
      </div>

      {dataLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Memuat data anak...</p>
          </div>
        </div>
      ) : students.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Data Anak</h3>
            <p className="text-muted-foreground mb-4">
              Tidak ada data anak yang terdaftar dengan akun Anda.
            </p>
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Hubungi Sekolah
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Students Selection */}
          {students.length > 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pilih Anak</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                  <Card
                    key={student.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedStudent?.id === student.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder-user.jpg" alt={student.name} />
                          <AvatarFallback>
                            {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Kelas: {getStudentClass(student.class_id)}
                          </p>
                          <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {student.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Student Details */}
          {selectedStudent && (
            <div className="space-y-6">
              {/* Parent Profile Card */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profil Orang Tua
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingPassword(!isEditingPassword)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Ganti Password
                      </Button>
                      {!isEditingProfile ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingProfile(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profil
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingProfile(false)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Batal
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveProfile}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Simpan
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Password Change Section */}
                  {isEditingPassword && (
                    <div className="mb-6 p-4 border rounded-lg bg-blue-50">
                      <h4 className="font-semibold mb-3">Ganti Password</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
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
                        <div>
                          <Label htmlFor="newPassword">Password Baru</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showPassword.new ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                              placeholder="Masukkan password baru"
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
                        <div>
                          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
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
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditingPassword(false)
                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                          }}
                        >
                          Batal
                        </Button>
                        <Button onClick={handleChangePassword}>
                          Simpan Password
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Profile Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Father Information */}
                    <div>
                      <h4 className="font-semibold mb-3 text-blue-600">Data Ayah</h4>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="father_name">Nama Ayah</Label>
                          {isEditingProfile ? (
                            <Input
                              id="father_name"
                              value={profileData.father_name}
                              onChange={(e) => setProfileData(prev => ({ ...prev, father_name: e.target.value }))}
                              placeholder="Nama lengkap ayah"
                            />
                          ) : (
                            <p className="text-sm p-2 bg-gray-50 rounded">{profileData.father_name || 'Belum diisi'}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="father_occupation">Pekerjaan Ayah</Label>
                          {isEditingProfile ? (
                            <Input
                              id="father_occupation"
                              value={profileData.father_occupation}
                              onChange={(e) => setProfileData(prev => ({ ...prev, father_occupation: e.target.value }))}
                              placeholder="Pekerjaan ayah"
                            />
                          ) : (
                            <p className="text-sm p-2 bg-gray-50 rounded">{profileData.father_occupation || 'Belum diisi'}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="father_work_address">Alamat Kerja Ayah</Label>
                          {isEditingProfile ? (
                            <Textarea
                              id="father_work_address"
                              value={profileData.father_work_address}
                              onChange={(e) => setProfileData(prev => ({ ...prev, father_work_address: e.target.value }))}
                              placeholder="Alamat tempat kerja ayah"
                              rows={2}
                            />
                          ) : (
                            <p className="text-sm p-2 bg-gray-50 rounded">{profileData.father_work_address || 'Belum diisi'}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="father_phone">Nomor HP Ayah</Label>
                          {isEditingProfile ? (
                            <Input
                              id="father_phone"
                              value={profileData.father_phone}
                              onChange={(e) => setProfileData(prev => ({ ...prev, father_phone: e.target.value }))}
                              placeholder="Nomor telepon ayah"
                            />
                          ) : (
                            <p className="text-sm p-2 bg-gray-50 rounded">{profileData.father_phone || 'Belum diisi'}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="father_email">Email Ayah</Label>
                          {isEditingProfile ? (
                            <Input
                              id="father_email"
                              type="email"
                              value={profileData.father_email}
                              onChange={(e) => setProfileData(prev => ({ ...prev, father_email: e.target.value }))}
                              placeholder="Email ayah"
                            />
                          ) : (
                            <p className="text-sm p-2 bg-gray-50 rounded">{profileData.father_email || 'Belum diisi'}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mother Information */}
                    <div>
                      <h4 className="font-semibold mb-3 text-pink-600">Data Ibu</h4>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="mother_name">Nama Ibu</Label>
                          {isEditingProfile ? (
                            <Input
                              id="mother_name"
                              value={profileData.mother_name}
                              onChange={(e) => setProfileData(prev => ({ ...prev, mother_name: e.target.value }))}
                              placeholder="Nama lengkap ibu"
                            />
                          ) : (
                            <p className="text-sm p-2 bg-gray-50 rounded">{profileData.mother_name || 'Belum diisi'}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="mother_occupation">Pekerjaan Ibu</Label>
                          {isEditingProfile ? (
                            <Input
                              id="mother_occupation"
                              value={profileData.mother_occupation}
                              onChange={(e) => setProfileData(prev => ({ ...prev, mother_occupation: e.target.value }))}
                              placeholder="Pekerjaan ibu"
                            />
                          ) : (
                            <p className="text-sm p-2 bg-gray-50 rounded">{profileData.mother_occupation || 'Belum diisi'}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="mother_work_address">Alamat Kerja Ibu</Label>
                          {isEditingProfile ? (
                            <Textarea
                              id="mother_work_address"
                              value={profileData.mother_work_address}
                              onChange={(e) => setProfileData(prev => ({ ...prev, mother_work_address: e.target.value }))}
                              placeholder="Alamat tempat kerja ibu"
                              rows={2}
                            />
                          ) : (
                            <p className="text-sm p-2 bg-gray-50 rounded">{profileData.mother_work_address || 'Belum diisi'}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="mother_phone">Nomor HP Ibu</Label>
                          {isEditingProfile ? (
                            <Input
                              id="mother_phone"
                              value={profileData.mother_phone}
                              onChange={(e) => setProfileData(prev => ({ ...prev, mother_phone: e.target.value }))}
                              placeholder="Nomor telepon ibu"
                            />
                          ) : (
                            <p className="text-sm p-2 bg-gray-50 rounded">{profileData.mother_phone || 'Belum diisi'}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="mother_email">Email Ibu</Label>
                          {isEditingProfile ? (
                            <Input
                              id="mother_email"
                              type="email"
                              value={profileData.mother_email}
                              onChange={(e) => setProfileData(prev => ({ ...prev, mother_email: e.target.value }))}
                              placeholder="Email ibu"
                            />
                          ) : (
                            <p className="text-sm p-2 bg-gray-50 rounded">{profileData.mother_email || 'Belum diisi'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Home Address */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3 text-green-600">Alamat Rumah</h4>
                    <div>
                      <Label htmlFor="home_address">Alamat Lengkap</Label>
                      {isEditingProfile ? (
                        <Textarea
                          id="home_address"
                          value={profileData.home_address}
                          onChange={(e) => setProfileData(prev => ({ ...prev, home_address: e.target.value }))}
                          placeholder="Alamat lengkap rumah"
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm p-2 bg-gray-50 rounded">{profileData.home_address || 'Belum diisi'}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for different sections */}
              <Tabs defaultValue="student" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="student" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Data Anak
                  </TabsTrigger>
                  <TabsTrigger value="attendance" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Kehadiran
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Pembayaran
                  </TabsTrigger>
                  <TabsTrigger value="grades" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Nilai
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="student" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profil Anak
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src="/placeholder-user.jpg" alt={selectedStudent.name} />
                            <AvatarFallback className="text-2xl">
                              {selectedStudent.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-2xl font-bold mb-2">{selectedStudent.name}</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                <span>Kelas: {getStudentClass(selectedStudent.class_id)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <span>Umur: {calculateAge(selectedStudent.birth_date)} tahun</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>Gender: {selectedStudent.gender}</span>
                              </div>
                              {selectedStudent.nisn && (
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span>NISN: {selectedStudent.nisn}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            {selectedStudent.blood_type && (
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-red-500" />
                                <span>Golongan Darah: {selectedStudent.blood_type}</span>
                              </div>
                            )}
                            {selectedStudent.allergies && (
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                                <span>Alergi: {selectedStudent.allergies}</span>
                              </div>
                            )}
                            {selectedStudent.emergency_contact && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-blue-500" />
                                <span>Kontak Darurat: {selectedStudent.emergency_contact}</span>
                              </div>
                            )}
                            {selectedStudent.emergency_phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-blue-500" />
                                <span>No. Darurat: {selectedStudent.emergency_phone}</span>
                              </div>
                            )}
                            <Badge variant={selectedStudent.status === 'active' ? 'default' : 'secondary'}>
                              {selectedStudent.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="attendance" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">
                          {attendance.filter(a => a.status === 'present').length}
                        </div>
                        <p className="text-sm text-muted-foreground">Hadir</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-600">
                          {attendance.filter(a => a.status === 'absent').length}
                        </div>
                        <p className="text-sm text-muted-foreground">Tidak Hadir</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Heart className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-yellow-600">
                          {attendance.filter(a => a.status === 'sick').length}
                        </div>
                        <p className="text-sm text-muted-foreground">Sakit</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">
                          {attendance.filter(a => a.status === 'permission').length}
                        </div>
                        <p className="text-sm text-muted-foreground">Izin</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {attendance.length > 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Riwayat Kehadiran</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {attendance.slice(0, 10).map((record) => (
                            <div key={record.id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                {record.status === 'present' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                {record.status === 'absent' && <XCircle className="h-4 w-4 text-red-500" />}
                                {record.status === 'sick' && <Heart className="h-4 w-4 text-yellow-500" />}
                                {record.status === 'permission' && <Clock className="h-4 w-4 text-blue-500" />}
                                <span className="font-medium">
                                  {new Date(record.date).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              <Badge variant={
                                record.status === 'present' ? 'default' :
                                record.status === 'absent' ? 'destructive' :
                                record.status === 'sick' ? 'secondary' : 'outline'
                              }>
                                {record.status === 'present' ? 'Hadir' :
                                 record.status === 'absent' ? 'Tidak Hadir' :
                                 record.status === 'sick' ? 'Sakit' : 'Izin'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Belum ada data kehadiran</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="payments" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">
                          {payments.filter(p => p.status === 'paid').length}
                        </div>
                        <p className="text-sm text-muted-foreground">Lunas</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-yellow-600">
                          {payments.filter(p => p.status === 'pending').length}
                        </div>
                        <p className="text-sm text-muted-foreground">Menunggu</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-600">
                          {payments.filter(p => p.status === 'overdue').length}
                        </div>
                        <p className="text-sm text-muted-foreground">Terlambat</p>
                      </CardContent>
                    </Card>
                  </div>

                  {payments.length > 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Riwayat Pembayaran</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {payments.map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between p-3 border rounded">
                              <div>
                                <p className="font-medium">{payment.semester} - {payment.academic_year}</p>
                                <p className="text-sm text-muted-foreground">
                                  Total: Rp {payment.total_due.toLocaleString('id-ID')}
                                </p>
                                {payment.due_date && (
                                  <p className="text-xs text-muted-foreground">
                                    Jatuh tempo: {new Date(payment.due_date).toLocaleDateString('id-ID')}
                                  </p>
                                )}
                              </div>
                              <Badge variant={
                                payment.status === 'paid' ? 'default' :
                                payment.status === 'pending' ? 'secondary' : 'destructive'
                              }>
                                {payment.status === 'paid' ? 'Lunas' :
                                 payment.status === 'pending' ? 'Menunggu' : 'Terlambat'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Belum ada data pembayaran</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="grades" className="space-y-4">
                  {grades.length > 0 ? (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Ringkasan Nilai</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {new Set(grades.map(g => g.subject)).size}
                              </div>
                              <p className="text-sm text-muted-foreground">Mata Pelajaran</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                {grades.length}
                              </div>
                              <p className="text-sm text-muted-foreground">Total Penilaian</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Detail Penilaian</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Array.from(new Set(grades.map(g => g.subject))).map(subject => {
                              const subjectGrades = grades.filter(g => g.subject === subject)
                              return (
                                <div key={subject} className="border rounded-lg p-4">
                                  <h4 className="font-semibold mb-2">{subject}</h4>
                                  <div className="space-y-2">
                                    {subjectGrades.map(grade => (
                                      <div key={grade.id} className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <p className="text-sm font-medium">{grade.description}</p>
                                          <p className="text-xs text-muted-foreground">{grade.semester}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Belum ada data nilai</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </>
      )}
    </div>
  )
}
