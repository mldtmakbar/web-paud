"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TeacherDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is loaded and is a teacher, redirect to the correct URL with ID
    if (user && user.role === 'teacher') {
      console.log("Redirecting to correct teacher dashboard URL with ID")
      console.log("User ID for redirect:", user.id)
      const redirectUrl = `/dashboard/teacher/${user.id}`
      console.log("Redirect URL:", redirectUrl)
      router.replace(redirectUrl)
    }
  }, [user, router])

  // Show loading/redirect message
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
        Mengalihkan ke dashboard guru yang benar...
      </p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
