import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name: string
  role: "parent" | "teacher" | "admin"
  username: string
  phone: string
  created_at?: string
  updated_at?: string
  studentIds?: string[] // For parents
}

export async function authenticate(
  usernameOrEmail: string,
  password: string,
  role?: string
): Promise<User | null> {
  try {
    return loginWithCredentials(usernameOrEmail, password, role)
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

const USER_STORAGE_KEY = 'tk_ceria_user'

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(USER_STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

export function storeUser(user: User): void {
  if (typeof window === "undefined") return
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

export function clearUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(USER_STORAGE_KEY)
}

export async function logout(): Promise<void> {
  clearUser()
  await supabase.auth.signOut()
}

export function isAuthorized(user: User | null, requiredRole: string): boolean {
  if (!user) return false
  
  // Admin can access everything
  if (user.role === 'admin') return true
  
  // Check if user role matches required role
  return user.role === requiredRole
}

// Helper function to check if email or username
export function isEmail(str: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(str)
}

export async function loginWithCredentials(
  identifier: string, // can be email or username
  password: string,
  role?: string
): Promise<User | null> {
  try {
    // Determine if identifier is email or username
    const field = isEmail(identifier) ? 'email' : 'username'
    
    // Find user by email or username
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq(field, identifier)
      .single()

    if (userError || !userData) {
      console.error('User not found:', userError?.message)
      return null
    }

    // Verify password
    if (userData.password_hash !== password) {
      console.error('Invalid password')
      return null
    }

    // Verify role if specified
    if (role && userData.role !== role) {
      console.error('Invalid role')
      return null
    }

    const user: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      username: userData.username,
      phone: userData.phone,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      studentIds: undefined // Will be populated for parents
    }

    // Get student IDs if parent
    if (userData.role === 'parent') {
      const { data: parentStudents } = await supabase
        .from('parent_students')
        .select('student_id')
        .eq('parent_id', userData.id)
      
      user.studentIds = parentStudents?.map(ps => ps.student_id)
    }

    // Store user in local storage
    storeUser(user)
    return user

  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}
