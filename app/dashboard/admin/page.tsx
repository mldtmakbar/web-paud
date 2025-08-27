"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TeacherManagement } from "@/components/dashboard/teacher-management"
import { StudentManagement } from "@/components/dashboard/student-management"
import { ClassManagement } from "@/components/dashboard/class-management"
import { PaymentManagement } from "@/components/dashboard/payment-management"
import { PaymentTypesManagement } from "@/components/dashboard/payment-types-management"
import { NewsManagement } from "@/components/dashboard/news-management"
import { Users, GraduationCap, UserCheck, BookOpen, CreditCard, Newspaper } from "lucide-react"
import { mockStudents, mockClasses, mockPayments, mockNews } from "@/lib/mock-data"

export default function AdminDashboard() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Total Siswa",
      value: mockStudents.length,
      icon: GraduationCap,
      color: "text-blue-600",
    },
    {
      title: "Total Guru",
      value: 8,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Siswa Aktif",
      value: mockStudents.filter((s) => s.status === "active").length,
      icon: UserCheck,
      color: "text-purple-600",
    },
    {
      title: "Kelas Tersedia",
      value: mockClasses.filter((c) => c.status === "active").length,
      icon: BookOpen,
      color: "text-orange-600",
    },
    {
      title: "Pembayaran Lunas",
      value: mockPayments.filter((p) => p.status === "paid").length,
      icon: CreditCard,
      color: "text-emerald-600",
    },
    {
      title: "Artikel Dipublikasi",
      value: mockNews.filter((n) => n.status === "published").length,
      icon: Newspaper,
      color: "text-indigo-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Super Admin</h1>
        <p className="text-muted-foreground">
          Selamat datang, {user?.name}! Kelola data guru, siswa, dan kelas TK Ceria.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
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

      <NewsManagement />

      {/* Payment Management */}
      <PaymentManagement />

      <PaymentTypesManagement />

      <ClassManagement />

      {/* Teacher Management */}
      <TeacherManagement />

      {/* Student Management */}
      <StudentManagement />
    </div>
  )
}
