// Mock authentication system - replace with real auth later
export interface User {
  id: string
  email: string
  name: string
  role: "parent" | "teacher" | "admin"
  username?: string
  password?: string // Only used in demo/development
  studentIds?: string[] // For parents
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "parent@example.com",
    username: "budi",
    password: "parent123",
    name: "Budi Santoso",
    role: "parent",
    studentIds: ["student1"],
  },
  {
    id: "2",
    email: "teacher@example.com",
    username: "sarah",
    password: "teacher123",
    name: "Sarah Wijaya",
    role: "teacher",
  },
  {
    id: "3",
    email: "admin@example.com",
    username: "admin",
    password: "admin123",
    name: "Admin TK Ceria",
    role: "admin",
  },
]

export async function authenticate(email: string, password: string, role: string): Promise<User | null> {
  // Mock authentication - in real app, this would validate against database
  const user = mockUsers.find((u) => u.email === email && u.role === role)

  // For demo purposes, accept any password
  if (user && password.length > 0) {
    return user
  }

  return null
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem("tk-user")
  return stored ? JSON.parse(stored) : null
}

export function storeUser(user: User): void {
  if (typeof window === "undefined") return

  localStorage.setItem("tk-user", JSON.stringify(user))
}

export function clearUser(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem("tk-user")
}

export function isAuthorized(user: User | null, requiredRole: string | string[]): boolean {
  if (!user) return false

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role)
  }

  return user.role === requiredRole
}
