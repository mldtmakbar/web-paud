"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TeacherManagement } from "@/components/dashboard/teacher-management"
import { StudentManagement } from "@/components/dashboard/student-management"
import ClassManagement from "@/components/dashboard/class-management"
import { PaymentManagement } from "@/components/dashboard/payment-management"
import { PaymentTypesManagement } from "@/components/dashboard/payment-types-management"
import { NewsManagement } from "@/components/dashboard/news-management"
import SemesterManagement from "@/components/dashboard/semester-management"
import AssessmentManagement from "@/components/dashboard/assessment-management"
import { Users, GraduationCap, BookOpen, CreditCard, Newspaper, Calendar, FileText } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { LucideIcon } from "lucide-react"

interface Stat {
  title: string
  value: string
  icon: LucideIcon
  color: string
}

export default function AdminDashboardWithId() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [isRendered, setIsRendered] = useState(false)
  const [stats, setStats] = useState<Stat[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  const userId = params.id as string

  // Debug: Log current state
  console.log("=== ADMIN DASHBOARD DEBUG ===")
  console.log("AdminDashboardWithId rendered")
  console.log("Current user:", user)
  console.log("Loading state:", loading)
  console.log("URL params:", params)
  console.log("User ID from URL:", userId)

  useEffect(() => {
    setIsRendered(true)
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Load statistics
      const [studentsCount, teachersCount, classesCount, paymentsCount] = await Promise.all([
        supabase.from('students').select('id', { count: 'exact' }),
        supabase.from('teachers').select('id', { count: 'exact' }),
        supabase.from('classes').select('id', { count: 'exact' }),
        supabase.from('payments').select('id', { count: 'exact' })
      ])

      setStats([
        {
          title: "Total Siswa",
          value: studentsCount.count?.toString() || "0",
          icon: Users,
          color: "text-blue-600"
        },
        {
          title: "Total Guru",
          value: teachersCount.count?.toString() || "0",
          icon: GraduationCap,
          color: "text-green-600"
        },
        {
          title: "Total Kelas",
          value: classesCount.count?.toString() || "0",
          icon: BookOpen,
          color: "text-purple-600"
        },
        {
          title: "Total Pembayaran",
          value: paymentsCount.count?.toString() || "0",
          icon: CreditCard,
          color: "text-orange-600"
        }
      ])
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <h2 style={{ marginTop: '20px', color: '#333' }}>Memuat Dashboard Admin...</h2>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Show error if no user
  if (!user) {
    router.push('/login')
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2 style={{ color: '#dc3545' }}>Tidak ada user yang login</h2>
        <p style={{ color: '#666' }}>Mengalihkan ke halaman login...</p>
      </div>
    )
  }

  // Check if user role is admin
  if (user.role !== 'admin') {
    router.push(`/dashboard/${user.role}`)
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2 style={{ color: '#dc3545' }}>Akses Ditolak</h2>
        <p style={{ color: '#666' }}>Role user tidak sesuai untuk halaman admin</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div style={{ 
        padding: '30px', 
        backgroundColor: '#1e40af',
        color: 'white',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>
          🎉 HALLO {user.name}!
        </h1>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>
          Selamat Datang di Dashboard Administrator
        </h2>
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.2)',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "overview", label: "Overview" },
            { id: "students", label: "Manajemen Siswa" },
            { id: "teachers", label: "Manajemen Guru" },
            { id: "classes", label: "Manajemen Kelas" },
            { id: "payments", label: "Manajemen Pembayaran" },
            { id: "payment-types", label: "Jenis Pembayaran" },
            { id: "news", label: "Manajemen Berita" },
            { id: "semesters", label: "Manajemen Semester" },
            { id: "assessments", label: "Aspek Penilaian" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Dashboard Overview</h3>
            <p>Selamat datang di dashboard administrator TK Ceria. Gunakan tab di atas untuk mengelola sistem.</p>
          </div>
        )}
        {activeTab === "students" && <StudentManagement />}
        {activeTab === "teachers" && <TeacherManagement />}
        {activeTab === "classes" && <ClassManagement />}
        {activeTab === "payments" && <PaymentManagement />}
        {activeTab === "payment-types" && <PaymentTypesManagement />}
        {activeTab === "news" && <NewsManagement />}
        {activeTab === "semesters" && <SemesterManagement />}
        {activeTab === "assessments" && <AssessmentManagement />}
      </div>
    </div>
  )
}
