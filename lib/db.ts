import { supabase } from './supabase'

// Students
export async function getStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('*')
  
  if (error) {
    console.error('Error fetching students:', error)
    return []
  }
  
  return data
}

export async function getStudentsByParentId(parentId: string) {
  const { data, error } = await supabase
    .from('parent_students')
    .select('student_id')
    .eq('parent_id', parentId)
  
  if (error || !data) {
    console.error('Error fetching student ids:', error)
    return []
  }

  const studentIds = data.map(ps => ps.student_id)
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('*')
    .in('id', studentIds)
  
  if (studentsError) {
    console.error('Error fetching students:', studentsError)
    return []
  }

  return students
}

// Teachers
export async function getTeachers() {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
  
  if (error) {
    console.error('Error fetching teachers:', error)
    return []
  }
  
  return data
}

// Classes
export async function getClasses() {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
  
  if (error) {
    console.error('Error fetching classes:', error)
    return []
  }
  
  return data
}

// Attendance
export async function getAttendance(studentId: string, startDate?: string, endDate?: string) {
  let query = supabase
    .from('attendance')
    .select('*')
    .eq('student_id', studentId)
  
  if (startDate) {
    query = query.gte('date', startDate)
  }
  if (endDate) {
    query = query.lte('date', endDate)
  }

  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching attendance:', error)
    return []
  }
  
  return data
}

// Payments
export async function getPayments(studentId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('student_id', studentId)
  
  if (error) {
    console.error('Error fetching payments:', error)
    return []
  }
  
  return data
}

// Payment Types
export async function getPaymentTypes() {
  const { data, error } = await supabase
    .from('payment_types')
    .select('*')
  
  if (error) {
    console.error('Error fetching payment types:', error)
    return []
  }
  
  return data
}

// News
export async function getNews(limit = 10, offset = 0) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching news:', error)
    return []
  }
  
  return data
}

// Grades
export async function getGrades(studentId: string, semester?: string) {
  let query = supabase
    .from('grades')
    .select('*')
    .eq('student_id', studentId)
  
  if (semester) {
    query = query.eq('semester', semester)
  }

  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching grades:', error)
    return []
  }
  
  return data
}
