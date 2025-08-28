import { supabase } from './supabase'
import type { 
  Grade, 
  Semester, 
  AssessmentAspect, 
  AssessmentSubAspect, 
  StudentGradeView 
} from './types'

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
    .from('v_student_grades')
    .select('*')
    .eq('student_id', studentId)
  
  if (semester) {
    query = query.eq('semester_name', semester)
  }

  const { data, error } = await query.order('assessed_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching grades:', error)
    return []
  }
  
  console.log('Grades data found:', data)
  return data || []
}

// ==============================
// SEMESTER FUNCTIONS
// ==============================
export async function getSemesters() {
  const { data, error } = await supabase
    .from('semesters')
    .select('*')
    .order('year', { ascending: false })
    .order('semester_number', { ascending: false })
  
  if (error) {
    console.error('Error fetching semesters:', error)
    return []
  }
  
  return data || []
}

export async function getCurrentSemester() {
  const { data, error } = await supabase
    .from('semesters')
    .select('*')
    .eq('is_current', true)
    .single()
  
  if (error) {
    console.error('Error fetching current semester:', error)
    return null
  }
  
  return data
}

export async function getActiveSemester() {
  const { data, error } = await supabase
    .from('semesters')
    .select('*')
    .eq('is_active', true)
    .single()
  
  if (error) {
    console.error('Error fetching active semester:', error)
    return null
  }
  
  return data
}

export async function createSemester(semester: Omit<Semester, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('semesters')
    .insert([semester])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating semester:', error)
    throw error
  }
  
  return data
}

export async function updateSemester(id: string, updates: Partial<Semester>) {
  const { data, error } = await supabase
    .from('semesters')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating semester:', error)
    throw error
  }
  
  return data
}

// ==============================
// ASSESSMENT ASPECT FUNCTIONS
// ==============================
export async function getAssessmentAspects() {
  const { data, error } = await supabase
    .from('assessment_aspects')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
  
  if (error) {
    console.error('Error fetching assessment aspects:', error)
    return []
  }
  
  return data || []
}

export async function getAssessmentAspectsByCategory(category: string) {
  const { data, error } = await supabase
    .from('assessment_aspects')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .order('display_order')
  
  if (error) {
    console.error('Error fetching assessment aspects by category:', error)
    return []
  }
  
  return data || []
}

export async function createAssessmentAspect(aspect: Omit<AssessmentAspect, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('assessment_aspects')
    .insert([aspect])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating assessment aspect:', error)
    throw error
  }
  
  return data
}

export async function updateAssessmentAspect(id: string, updates: Partial<AssessmentAspect>) {
  const { data, error } = await supabase
    .from('assessment_aspects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating assessment aspect:', error)
    throw error
  }
  
  return data
}

// ==============================
// ASSESSMENT SUB ASPECT FUNCTIONS  
// ==============================
export async function getAssessmentSubAspects(aspectId?: string) {
  let query = supabase
    .from('assessment_sub_aspects')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
  
  if (aspectId) {
    query = query.eq('aspect_id', aspectId)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching assessment sub aspects:', error)
    return []
  }
  
  return data || []
}

export async function createAssessmentSubAspect(subAspect: Omit<AssessmentSubAspect, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('assessment_sub_aspects')
    .insert([subAspect])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating assessment sub aspect:', error)
    throw error
  }
  
  return data
}

export async function updateAssessmentSubAspect(id: string, updates: Partial<AssessmentSubAspect>) {
  const { data, error } = await supabase
    .from('assessment_sub_aspects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating assessment sub aspect:', error)
    throw error
  }
  
  return data
}

// ==============================
// ENHANCED GRADE FUNCTIONS
// ==============================
export async function getStudentGrades(studentId: string, semesterId?: string) {
  let query = supabase
    .from('v_student_grades')
    .select('*')
    .eq('student_id', studentId)
  
  if (semesterId) {
    query = query.eq('semester_id', semesterId)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching student grades:', error)
    return []
  }
  
  return data || []
}

export async function createGrade(grade: Omit<Grade, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('grades')
    .insert([grade])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating grade:', error)
    throw error
  }
  
  return data
}

export async function updateGrade(id: string, updates: Partial<Grade>) {
  const { data, error } = await supabase
    .from('grades')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating grade:', error)
    throw error
  }
  
  return data
}

export async function getGradesByClass(classId: string, semesterId?: string) {
  let query = supabase
    .from('v_student_grades')
    .select('*')
    .in('student_id', [
      // Subquery to get student IDs from class
      supabase
        .from('students')
        .select('id')
        .eq('class_id', classId)
    ])
  
  if (semesterId) {
    query = query.eq('semester_id', semesterId)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching grades by class:', error)
    return []
  }
  
  return data || []
}

export async function getGradesByAspect(aspectId: string, semesterId?: string) {
  let query = supabase
    .from('grades')
    .select(`
      *,
      students!inner (
        id,
        name,
        class_id,
        classes (
          name,
          level
        )
      ),
      semesters!inner (
        name,
        year
      ),
      assessment_aspects!inner (
        name,
        code,
        category
      ),
      assessment_sub_aspects (
        name,
        code
      )
    `)
    .eq('aspect_id', aspectId)
  
  if (semesterId) {
    query = query.eq('semester_id', semesterId)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching grades by aspect:', error)
    return []
  }
  
  return data || []
}
