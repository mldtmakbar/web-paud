"use client"

import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TeacherManagement } from "@/components/dashboard/teacher-management"
import { StudentManagement } from "@/components/dashboard/student-management"
import ClassManagement from "@/components/dashboard/class-management"
import { PaymentManagement } from "@/components/dashboard/payment-management"
import { PaymentTypesManagement } from "@/components/dashboard/payment-types-management"
import { NewsManagement } from "@/components/dashboard/news-management"
import { Users, GraduationCap, BookOpen, CreditCard, Newspaper } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { LucideIcon } from "lucide-react"

interface Stat {
  title: string
  value: string
  icon: LucideIcon
  color: string
}

export default function AdminDashboard() {
  const { user } = useAuth()

  const [stats, setStats] = useState<Stat[]>([
    {
      title: "Total Siswa",
      value: "...",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Guru",
      value: "...",
      icon: GraduationCap,
      color: "text-green-600",
    },
    {
      title: "Total Kelas",
      value: "...",
      icon: BookOpen,
      color: "text-orange-600",
    }
  ])

  useEffect(() => {
    async function fetchStats() {
      if (!user) return

      const { data: studentsData } = await supabase
        .from('students')
        .select('id', { count: 'exact', head: true })
      
      const { data: teachersData } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'teacher')
      
      const { data: classesData } = await supabase
        .from('classes')
        .select('id', { count: 'exact', head: true })

      const studentsCount = studentsData?.length ?? 0
      const teachersCount = teachersData?.length ?? 0
      const classesCount = classesData?.length ?? 0

      setStats([
        {
          title: "Total Siswa",
          value: studentsCount.toString(),
          icon: Users,
          color: "text-blue-600",
        },
        {
          title: "Total Guru",
          value: teachersCount.toString(),
          icon: GraduationCap,
          color: "text-green-600",
        },
        {
          title: "Total Kelas",
          value: classesCount.toString(),
          icon: BookOpen,
          color: "text-orange-600",
        }
      ])
    }

    fetchStats()
  }, [user])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Selamat datang, {user?.name}! Kelola data guru, siswa, dan kelas TK Ceria.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
