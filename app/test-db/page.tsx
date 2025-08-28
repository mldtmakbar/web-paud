"use client"

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function TestDBPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function testConnection() {
      try {
        console.log('Testing database connection...')
        
        // Test user_accounts table
        const { data: userAccounts, error: userAccountsError } = await supabase
          .from('user_accounts')
          .select('*')
          .limit(5)
        
        // Test users table
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*')
          .limit(5)
        
        // Test students table
        const { data: students, error: studentsError } = await supabase
          .from('students')
          .select('*')
          .limit(5)
        
        // Test teachers table
        const { data: teachers, error: teachersError } = await supabase
          .from('teachers')
          .select('*')
          .limit(5)
        
        setResults({
          userAccounts: { data: userAccounts, error: userAccountsError },
          users: { data: users, error: usersError },
          students: { data: students, error: studentsError },
          teachers: { data: teachers, error: teachersError }
        })
        
        console.log('Database test results:', {
          userAccounts: { data: userAccounts, error: userAccountsError },
          users: { data: users, error: usersError },
          students: { data: students, error: studentsError },
          teachers: { data: teachers, error: teachersError }
        })
      } catch (err) {
        console.error('Database test error:', err)
        setResults({ error: err })
      } finally {
        setLoading(false)
      }
    }
    
    testConnection()
  }, [])

  if (loading) {
    return <div style={{ padding: '20px' }}>Testing database connection...</div>
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Database Connection Test</h1>
      
      <h2>User Accounts Table:</h2>
      <pre>{JSON.stringify(results.userAccounts, null, 2)}</pre>
      
      <h2>Users Table:</h2>
      <pre>{JSON.stringify(results.users, null, 2)}</pre>
      
      <h2>Students Table:</h2>
      <pre>{JSON.stringify(results.students, null, 2)}</pre>
      
      <h2>Teachers Table:</h2>
      <pre>{JSON.stringify(results.teachers, null, 2)}</pre>
    </div>
  )
}
