"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { isAuthorized } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string | string[]
  redirectTo?: string
}

export default function AuthGuard({ children, requiredRole, redirectTo = "/login" }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('AuthGuard: No user, redirecting to:', redirectTo)
        router.push(redirectTo)
        return
      }

      if (requiredRole && !isAuthorized(user, requiredRole)) {
        // Redirect to appropriate dashboard based on user role
        const dashboardRoutes = {
          parent: "/dashboard/parent",
          teacher: "/dashboard/teacher",
          admin: "/dashboard/admin",
        }
        console.log('AuthGuard: Unauthorized role, redirecting to:', dashboardRoutes[user.role])
        router.push(dashboardRoutes[user.role])
        return
      }
    }
  }, [user, loading, requiredRole, router, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || (requiredRole && !isAuthorized(user, requiredRole))) {
    return null
  }

  return <>{children}</>
}
