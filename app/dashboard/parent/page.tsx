"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ParentDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Debug: Log current state
  console.log("ParentDashboard rendered")
  console.log("Current user:", user)
  console.log("Loading state:", loading)

  useEffect(() => {
    // If user is loaded and is a parent, redirect to the correct URL with ID
    if (!loading && user && user.role === 'parent') {
      console.log("Redirecting to correct parent dashboard URL with ID")
      console.log("User ID for redirect:", user.id)
      const redirectUrl = `/dashboard/parent/${user.id}`
      console.log("Redirect URL:", redirectUrl)
      router.replace(redirectUrl)
    }
  }, [user, loading, router])

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
        <h2 style={{ marginTop: '20px', color: '#333' }}>Memuat Dashboard...</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>Mohon tunggu sebentar</p>
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
        alignItems: 'center'
      }}>
        <h2 style={{ color: '#dc3545' }}>Tidak ada user yang login</h2>
        <p style={{ color: '#666' }}>Mengalihkan ke halaman login...</p>
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
        alignItems: 'center'
      }}>
        <h2 style={{ color: '#dc3545' }}>Akses Ditolak</h2>
        <p style={{ color: '#666' }}>Role user tidak sesuai untuk halaman ini</p>
        <p style={{ color: '#666' }}>Mengalihkan ke dashboard yang sesuai...</p>
      </div>
    )
  }

  // Show redirect message
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
        width: '60px',
        height: '60px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }}></div>
      <h2 style={{ color: '#333', marginBottom: '10px' }}>Mengalihkan...</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Mengalihkan ke dashboard yang benar untuk user: {user.name}
      </p>
      <div style={{ 
        padding: '15px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        border: '1px solid #2196f3',
        maxWidth: '400px'
      }}>
        <p style={{ margin: '0', fontSize: '14px', color: '#1976d2' }}>
          <strong>Info:</strong> Halaman ini akan otomatis mengalihkan ke <br/>
          <code style={{ backgroundColor: '#f5f5f5', padding: '2px 4px', borderRadius: '3px' }}>
            /dashboard/parent/{user.id}
          </code>
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
