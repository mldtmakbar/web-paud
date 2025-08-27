"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StudentCard from "@/components/dashboard/student-card"
import PaymentStatus from "@/components/dashboard/payment-status"
import AttendanceStatus from "@/components/dashboard/attendance-status"
import StudentGrades from "@/components/dashboard/student-grades"
import AuthGuard from "@/components/auth-guard"
import {
  getStudentsByParentId,
  getPaymentsByStudentId,
  getAttendanceByStudentId,
  getGradesByStudentId,
  getParentByStudentId,
  type Student,
} from "@/lib/mock-data"
import { exportStudentReportToPDF } from "@/lib/pdf-export"
import { Download, User, CreditCard, Calendar, BookOpen, Phone, Mail, MapPin, Users } from "lucide-react"

export default function ParentDashboard() {
  const { user } = useAuth()
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    if (user) {
      const userStudents = getStudentsByParentId(user.id)
      setStudents(userStudents)
      if (userStudents.length > 0) {
        setSelectedStudent(userStudents[0])
      }
    }
  }, [user])

  const handleExportPDF = () => {
    if (!selectedStudent) return

    const payments = getPaymentsByStudentId(selectedStudent.id)
    const attendance = getAttendanceByStudentId(selectedStudent.id)
    const grades = getGradesByStudentId(selectedStudent.id)

    exportStudentReportToPDF({
      student: selectedStudent,
      payments,
      attendance,
      grades,
    })
  }

  if (!selectedStudent) {
    return (
      <AuthGuard requiredRole="parent">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Tidak ada data siswa yang ditemukan.</p>
        </div>
      </AuthGuard>
    )
  }

  const payments = getPaymentsByStudentId(selectedStudent.id)
  const attendance = getAttendanceByStudentId(selectedStudent.id)
  const grades = getGradesByStudentId(selectedStudent.id)
  const parentData = getParentByStudentId(selectedStudent.id)

  return (
    <AuthGuard requiredRole="parent">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-serif">Dashboard Orang Tua</h1>
            <p className="text-muted-foreground">Selamat datang, {user?.name}</p>
          </div>
          <Button onClick={handleExportPDF} className="bg-primary hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>

        {/* Student Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pilih Siswa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                isSelected={selectedStudent?.id === student.id}
                onClick={() => setSelectedStudent(student)}
              />
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profil Siswa Lengkap</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Student Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    <img
                      src={selectedStudent.photo || "/placeholder.svg?height=96&width=96"}
                      alt={selectedStudent.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold">{selectedStudent.name}</h3>
                    <p className="text-muted-foreground">NISN: {selectedStudent.nisn}</p>
                    <p className="text-muted-foreground">Kelas: {selectedStudent.class}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tanggal Lahir</p>
                      <p className="text-base">{new Date(selectedStudent.dateOfBirth).toLocaleDateString("id-ID")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Jenis Kelamin</p>
                      <p className="text-base">{selectedStudent.gender === "L" ? "Laki-laki" : "Perempuan"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Golongan Darah</p>
                      <p className="text-base">{selectedStudent.bloodType}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Usia</p>
                      <p className="text-base">
                        {new Date().getFullYear() - new Date(selectedStudent.dateOfBirth).getFullYear()} tahun
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Alergi</p>
                      <p className="text-base">{selectedStudent.allergies}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Kontak Darurat</p>
                      <p className="text-base">{selectedStudent.emergencyContact}</p>
                      <p className="text-sm text-muted-foreground">{selectedStudent.emergencyPhone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Alamat</p>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <p className="text-base">{selectedStudent.address}</p>
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              {parentData && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="h-5 w-5" />
                    <h4 className="text-lg font-semibold">Data Orang Tua</h4>
                  </div>

                  {/* Father Information */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-primary">Data Ayah</h5>
                    <div className="grid grid-cols-1 gap-3 pl-4 border-l-2 border-blue-200">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Nama</p>
                        <p className="text-base">{parentData.nama_ayah}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pekerjaan</p>
                        <p className="text-base">{parentData.pekerjaan_ayah}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Alamat Pekerjaan</p>
                        <p className="text-base">{parentData.alamat_pekerjaan_ayah}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{parentData.nomor_telepon_ayah}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{parentData.email_ayah}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mother Information */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-pink-600">Data Ibu</h5>
                    <div className="grid grid-cols-1 gap-3 pl-4 border-l-2 border-pink-200">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Nama</p>
                        <p className="text-base">{parentData.nama_ibu}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pekerjaan</p>
                        <p className="text-base">{parentData.pekerjaan_ibu}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Alamat Pekerjaan</p>
                        <p className="text-base">{parentData.alamat_pekerjaan_ibu}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{parentData.nomor_telepon_ibu}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{parentData.email_ibu}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Home Address */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Alamat Rumah</p>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <p className="text-base">{parentData.alamat_rumah}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payments" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Pembayaran</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Kehadiran</span>
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Nilai</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payments">
            <PaymentStatus payments={payments} />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceStatus attendance={attendance} />
          </TabsContent>

          <TabsContent value="grades">
            <StudentGrades grades={grades} />
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  )
}
