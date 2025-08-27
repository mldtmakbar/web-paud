"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AttendanceEditor } from "@/components/dashboard/attendance-editor"
import { GradesEditor } from "@/components/dashboard/grades-editor"
import { Users, Calendar, GraduationCap, BookOpen } from "lucide-react"
import { mockStudents } from "@/lib/mock-data"

export default function TeacherDashboard() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Total Siswa",
      value: mockStudents.length,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Hadir Hari Ini",
      value: mockStudents.length - 2,
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Mata Pelajaran",
      value: 7,
      icon: BookOpen,
      color: "text-purple-600",
    },
    {
      title: "Nilai Terupdate",
      value: 45,
      icon: GraduationCap,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Guru</h1>
        <p className="text-muted-foreground">Selamat datang, {user?.name}! Kelola presensi dan nilai siswa Anda.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Editor */}
      <AttendanceEditor />

      {/* Grades Editor */}
      <GradesEditor />
    </div>
  )
}
