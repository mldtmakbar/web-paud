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
  console.log('🔍 [DB] getStudentsByParentId called with parentId:', parentId)
  
  try {
    // Method 1: Direct query to students table
    console.log('📋 [DB] Trying direct query to students table...')
    const { data: allStudents, error: allStudentsError } = await supabase
      .from('students')
      .select('*')
    
    console.log('📊 [DB] All students in database:', allStudents)
    console.log('❌ [DB] Query error:', allStudentsError)
    
    if (allStudentsError) {
      console.error('Error querying students table:', allStudentsError)
      return []
    }

    // For now, return all students to debug the structure
    // Later we'll filter by the actual parent relationship
    return allStudents || []
    
  } catch (error) {
    console.error('Exception in getStudentsByParentId:', error)
    return []
  }
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
  console.log('getAttendance called with studentId:', studentId, 'startDate:', startDate, 'endDate:', endDate)
  
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
  
  console.log('Attendance data found:', data)
  return data || []
}

// Payments
export async function getPayments(studentId: string) {
  console.log('getPayments called with studentId:', studentId)
  
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('student_id', studentId)
  
  if (error) {
    console.error('Error fetching payments:', error)
    return []
  }
  
  console.log('Payments data found:', data)
  return data || []
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
  console.log('getGrades called with studentId:', studentId, 'semester:', semester)
  
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
  
  console.log('Grades data found:', data)
  return data || []
}
