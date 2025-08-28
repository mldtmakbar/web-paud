// Student Types
export interface Student {
  id: string
  name: string
  class_id: string | null
  birth_date: string
  gender: string
  blood_type?: string
  allergies?: string
  emergency_contact?: string
  emergency_phone?: string
  nisn?: string
  father_name?: string
  father_occupation?: string
  father_work_address?: string
  father_phone?: string
  father_email?: string
  mother_name?: string
  mother_occupation?: string
  mother_work_address?: string
  mother_phone?: string
  mother_email?: string
  home_address: string
  status: string
  created_at: string
  updated_at: string
}

// Teacher Types
export interface Teacher {
  id: string
  name: string
  nip: string
  gender: string
  date_of_birth: string
  address: string
  phone: string
  email: string
  position: string
  status: string
  created_at: string
  updated_at: string
}

// Class Types
export interface Class {
  id: string
  name: string
  code: string
  teacher_id: string | null
  school_year: string
  capacity?: number
  current_students?: number
  room?: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

// Attendance Types
export interface Attendance {
  id: string
  student_id: string
  date: string
  status: 'present' | 'absent' | 'sick' | 'permission'
  notes?: string
  created_at: string
  updated_at: string
}

// Payment Types
export interface Payment {
  id: string
  student_id: string
  payment_type_id: string
  semester: string
  academic_year: string
  amount: number
  discount: number
  scholarship: number
  total_due: number
  status: 'paid' | 'pending' | 'overdue'
  due_date?: string
  payment_date?: string
  created_at: string
  updated_at: string
  // Relationship data
  students?: {
    name: string
    nisn?: string
  }
  payment_types?: {
    name: string
    code: string
    category: string
  }
}

export interface PaymentType {
  id: string
  name: string
  code: string
  description?: string
  default_amount: number
  is_active: boolean
  category: 'Wajib' | 'Opsional' | 'Potongan'
  display_order: number
  created_at: string
  updated_at: string
}

// Account Types
export interface UserAccount {
  id: string
  email: string
  password: string
  role: 'parent' | 'teacher'
  user_id: string
  user_name: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

// Grade Types
export interface Grade {
  id: string
  student_id: string
  subject: string
  description: string
  semester: string
  created_at: string
  updated_at: string
}

// News Types
export interface News {
  id: string
  title: string
  excerpt: string
  content: string
  author_id: string
  publish_date: string
  status: 'published' | 'draft' | 'archived'
  category: string
  image: string
  tags: string
  featured: boolean
  created_at: string
  updated_at: string
  users?: {
    name: string
  }
}
