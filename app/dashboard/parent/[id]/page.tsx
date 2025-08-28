"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ParentDashboardWithId() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [isRendered, setIsRendered] = useState(false)

  const userId = params.id as string

  // Debug: Log current state
  console.log("=== PARENT DASHBOARD DEBUG ===")
  console.log("ParentDashboardWithId rendered")
  console.log("Current user:", user)
  console.log("Loading state:", loading)
  console.log("URL params:", params)
  console.log("User ID from URL:", userId)
  console.log("Component state:", { isRendered })

  useEffect(() => {
    // Set rendered flag after component mounts
    setIsRendered(true)
    console.log("Component mounted, isRendered set to true")
    
    // For testing - if no user is logged in, let's create a mock user
    if (!loading && !user) {
      console.log("No user found, creating test user for debugging")
      // This is for testing only - remove in production
      const testUser = {
        id: userId,
        email: "parent@example.com",
        name: "Test Parent",
        role: "parent" as const,
        username: "parent@example.com",
        phone: "081234567890"
      }
      // We can't set the user from here, so we'll just show a test message
    }
  }, [])

  // Show loading state
  if (loading) {
    console.log("Showing loading state")
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <h2 style={{ marginTop: '20px', color: '#333' }}>Memuat Dashboard...</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>Mohon tunggu sebentar</p>
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <p style={{ margin: '0', fontSize: '12px', color: '#1976d2' }}>
            <strong>Debug:</strong> Loading state aktif
          </p>
        </div>
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
    console.log("No user found, redirecting to login")
    router.push('/login')
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffebee'
      }}>
        <h2 style={{ color: '#dc3545' }}>Tidak ada user yang login</h2>
        <p style={{ color: '#666' }}>Mengalihkan ke halaman login...</p>
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffcdd2', borderRadius: '4px' }}>
          <p style={{ margin: '0', fontSize: '12px', color: '#c62828' }}>
            <strong>Debug:</strong> User tidak ditemukan, URL ID: {userId}
          </p>
        </div>
      </div>
    )
  }

  // Check if user role is parent
  if (user.role !== 'parent') {
    console.log("User role is not parent:", user.role)
    router.push(`/dashboard/${user.role}`)
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff3e0'
      }}>
        <h2 style={{ color: '#dc3545' }}>Akses Ditolak</h2>
        <p style={{ color: '#666' }}>Role user tidak sesuai untuk halaman ini</p>
        <p style={{ color: '#666' }}>Mengalihkan ke dashboard yang sesuai...</p>
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffe0b2', borderRadius: '4px' }}>
          <p style={{ margin: '0', fontSize: '12px', color: '#ef6c00' }}>
            <strong>Debug:</strong> Role user: {user.role}
          </p>
        </div>
      </div>
    )
  }

  console.log("=== RENDERING DASHBOARD ===")
  console.log("Rendering dashboard for parent user:", user.name, "with ID:", user.id)
  console.log("Component will render with data")

  // SIMPLE DASHBOARD - Just basic welcome message
  return (
    <div style={{ 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#4caf50',
      color: 'white',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '30px' }}>
        🎉 HALLO {userId}!
      </h1>
      <h2 style={{ fontSize: '32px', marginBottom: '30px' }}>
        Selamat Datang di Halaman Orang Tua
      </h2>
      
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '600px',
        marginTop: '30px'
      }}>
        <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>✅ Dashboard Berhasil Di-Render!</h3>
        <div style={{ textAlign: 'left', fontSize: '18px' }}>
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Nama:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>URL ID:</strong> {userId}</p>
          <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
        </div>
      </div>

      <div style={{ 
        marginTop: '40px',
        padding: '20px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '10px',
        fontSize: '16px'
      }}>
        <p><strong>Status:</strong> Halaman dashboard parent berfungsi dengan baik!</p>
        <p><strong>Component Rendered:</strong> {isRendered ? 'Yes' : 'No'}</p>
      </div>
    </div>
  )
}
