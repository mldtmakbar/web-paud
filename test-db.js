import { supabase } from './lib/supabase'

async function testDatabaseConnection() {
  console.log('Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .limit(5)
    
    console.log('User accounts data:', data)
    console.log('User accounts error:', error)
    
    // Test users table
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5)
    
    console.log('Users data:', usersData)
    console.log('Users error:', usersError)
    
    // Test students table
    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .limit(5)
    
    console.log('Students data:', studentsData)
    console.log('Students error:', studentsError)
    
    // Test teachers table
    const { data: teachersData, error: teachersError } = await supabase
      .from('teachers')
      .select('*')
      .limit(5)
    
    console.log('Teachers data:', teachersData)
    console.log('Teachers error:', teachersError)
    
  } catch (err) {
    console.error('Database connection error:', err)
  }
}

// For browser console
if (typeof window !== 'undefined') {
  window.testDB = testDatabaseConnection
}

export { testDatabaseConnection }
