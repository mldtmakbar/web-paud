import { supabase } from '@/lib/supabase'
import { Student, Teacher, Class, Payment, Attendance } from '@/lib/types'

// Student Management
export async function getStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching students:', error)
    return []
  }
  return data
}

export async function addStudent(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('students')
    .insert([{
      ...student,
      class_id: student.class_id || null,
      birth_date: student.birth_date,
      gender: student.gender,
      blood_type: student.blood_type,
      allergies: student.allergies,
      emergency_contact: student.emergency_contact,
      emergency_phone: student.emergency_phone,
      nisn: student.nisn,
      father_name: student.father_name,
      father_occupation: student.father_occupation,
      father_work_address: student.father_work_address,
      father_phone: student.father_phone,
      father_email: student.father_email,
      mother_name: student.mother_name,
      mother_occupation: student.mother_occupation,
      mother_work_address: student.mother_work_address,
      mother_phone: student.mother_phone,
      mother_email: student.mother_email,
      home_address: student.home_address,
      status: student.status
    }])
    .select()
    .single()

  if (error) {
    console.error('Error adding student:', error)
    return null
  }
  return data
}

export async function updateStudent(id: string, student: Partial<Student>) {
  const { data, error } = await supabase
    .from('students')
    .update(student)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating student:', error)
    return null
  }
  return data
}

export async function deleteStudent(id: string) {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting student:', error)
    throw error
  }
  return true
}

// Teacher Management
export async function getTeachers() {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching teachers:', error)
    return []
  }
  return data
}

export async function addTeacher(teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('teachers')
    .insert([{
      name: teacher.name,
      nip: teacher.nip,
      gender: teacher.gender,
      date_of_birth: teacher.date_of_birth,
      address: teacher.address,
      phone: teacher.phone,
      email: teacher.email,
      position: teacher.position,
      status: teacher.status
    }])
    .select()
    .single()

  if (error) {
    console.error('Error adding teacher:', error)
    return null
  }
  return data
}

export async function updateTeacher(id: string, teacher: Partial<Teacher>) {
  const { data, error } = await supabase
    .from('teachers')
    .update(teacher)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating teacher:', error)
    return null
  }
  return data
}

// Class Management
export async function getClasses() {
  const { data, error } = await supabase
    .from('classes')
    .select('*, teachers(name)')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching classes:', error)
    return []
  }
  return data
}

export async function addClass(class_: Omit<Class, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('classes')
    .insert([{
      ...class_,
      teacher_id: class_.teacher_id || null
    }])
    .select()
    .single()

  if (error) {
    console.error('Error adding class:', error)
    throw error
  }
  return data
}

export async function updateClass(id: string, class_: Partial<Class>) {
  const { data, error } = await supabase
    .from('classes')
    .update(class_)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating class:', error)
    return null
  }
  return data
}

export async function deleteClass(id: string) {
  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting class:', error)
    throw error
  }
  return true
}

// Payment Management
export async function getPayments(studentId?: string) {
  let query = supabase
    .from('payments')
    .select('*, students(name)')
    .order('created_at', { ascending: false })

  if (studentId) {
    query = query.eq('student_id', studentId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching payments:', error)
    return []
  }
  return data
}

export async function addPayment(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('payments')
    .insert([payment])
    .select()
    .single()

  if (error) {
    console.error('Error adding payment:', error)
    return null
  }
  return data
}

export async function updatePayment(id: string, payment: Partial<Payment>) {
  const { data, error } = await supabase
    .from('payments')
    .update(payment)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating payment:', error)
    return null
  }
  return data
}

// Attendance Management
export async function getAttendance(studentId?: string, date?: string) {
  let query = supabase
    .from('attendance')
    .select('*, students(name)')
    .order('date', { ascending: false })

  if (studentId) {
    query = query.eq('student_id', studentId)
  }
  
  if (date) {
    query = query.eq('date', date)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching attendance:', error)
    return []
  }
  return data
}

export async function addAttendance(attendance: Omit<Attendance, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('attendance')
    .insert([attendance])
    .select()
    .single()

  if (error) {
    console.error('Error adding attendance:', error)
    return null
  }
  return data
}

export async function updateAttendance(id: string, attendance: Partial<Attendance>) {
  const { data, error } = await supabase
    .from('attendance')
    .update(attendance)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating attendance:', error)
    return null
  }
  return data
}

// Payment Types
export async function getPaymentTypes() {
  const { data, error } = await supabase
    .from('payment_types')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching payment types:', error)
    return []
  }
  return data
}
