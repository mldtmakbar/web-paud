"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, getStoredUser, storeUser, clearUser, authenticate } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = getStoredUser()
    setUser(storedUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    try {
      console.log("Auth context login attempt:", { email, role })
      
      // Use real database authentication
      const authenticatedUser = await authenticate(email, password, role)
      console.log("Auth context - authenticated user:", authenticatedUser)

      if (authenticatedUser) {
        setUser(authenticatedUser)
        storeUser(authenticatedUser)
        return true
      }

      return false
    } catch (error) {
      console.error("Login error in auth context:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    clearUser()
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
