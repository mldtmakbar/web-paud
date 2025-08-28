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

// Mock authentication for testing (temporary)
export async function authenticateMock(
  usernameOrEmail: string,
  password: string,
  role?: string
): Promise<User | null> {
  // Simple mock authentication for testing
  const mockUsers = [
    {
      id: "1",
      email: "parent@example.com",
      name: "Budi Santoso",
      role: "parent" as const,
      username: "parent@example.com",
      phone: "081234567890",
      studentIds: ["student1", "student2"]
    },
    {
      id: "2", 
      email: "teacher@example.com",
      name: "Bu Sarah Wijaya",
      role: "teacher" as const,
      username: "teacher@example.com",
      phone: "081234567891"
    },
    {
      id: "admin",
      email: "admin@example.com", 
      name: "Admin TK Ceria",
      role: "admin" as const,
      username: "admin@example.com",
      phone: "081234567892"
    },
    {
      id: "admin2",
      email: "admin@tkceria.com", 
      name: "Admin TK Ceria",
      role: "admin" as const,
      username: "admin@tkceria.com",
      phone: "081234567893"
    }
  ]

  // Find user by email and role
  const user = mockUsers.find(u => 
    u.email === usernameOrEmail && 
    (role ? u.role === role : true) // If role is specified, check it matches
  )
  
  if (user && password.length > 0) { // Accept any password for testing
    console.log("Mock auth successful:", user)
    return user
  }
  
  console.log("Mock auth failed:", { usernameOrEmail, role, passwordLength: password.length })
  return null
}

export async function authenticate(
  usernameOrEmail: string,
  password: string,
  role?: string
): Promise<User | null> {
  try {
    // Use real auth with Supabase
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
    // First, try to find user in user_accounts table (for parents and teachers)
    const { data: accountData, error: accountError } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('email', identifier)
      .single()

    if (accountData) {
      // User found in user_accounts table
      // Verify password
      if (accountData.password !== password) {
        console.error('Invalid password')
        return null
      }

      // Verify role if specified
      if (role && accountData.role !== role) {
        console.error('Invalid role')
        return null
      }

      // Get additional user data based on role
      let userData: any = null
      if (accountData.role === 'parent') {
        // For parent accounts, user_id points to the student they have access to
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', accountData.user_id)
          .single()
        
        if (studentData) {
          userData = {
            id: accountData.id,
            name: accountData.user_name,
            email: accountData.email,
            role: accountData.role,
            username: accountData.email, // Use email as username
            phone: studentData.father_phone || studentData.mother_phone || '',
            created_at: accountData.created_at,
            updated_at: accountData.updated_at,
            studentIds: [accountData.user_id] // Parent has access to their child
          }
        }
      } else if (accountData.role === 'teacher') {
        // Get teacher data
        const { data: teacherData, error: teacherError } = await supabase
          .from('teachers')
          .select('*')
          .eq('id', accountData.user_id)
          .single()
        
        if (teacherData) {
          userData = {
            id: accountData.id,
            name: accountData.user_name,
            email: accountData.email,
            role: accountData.role,
            username: accountData.email, // Use email as username
            phone: teacherData.phone || '',
            created_at: accountData.created_at,
            updated_at: accountData.updated_at
          }
        }
      }

      if (!userData) {
        console.error('User data not found for role:', accountData.role)
        return null
      }

      const user: User = userData
      storeUser(user)
      return user
    }

    // If not found in user_accounts, try the old users table (for admin accounts)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', identifier)
      .single()

    if (userError || !userData) {
      console.error('User not found in both tables:', userError?.message)
      return null
    }

    // Verify password for old users table
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

