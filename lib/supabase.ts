import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wnfbhmeefhvpfkqqobhm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZmJobWVlZmh2cGZrcXFvYmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyOTM3ODcsImV4cCI6MjA3MTg2OTc4N30.Tld2gdhWap7AWXexI1Ex9cZd4CCX8GNbzzx0Mj0PK00'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'parent' | 'teacher' | 'admin'
          phone: string | null
          username: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          email: string
          name: string
          role: 'parent' | 'teacher' | 'admin'
          phone?: string
          username?: string
        }
        Update: {
          email?: string
          name?: string
          role?: 'parent' | 'teacher' | 'admin'
          phone?: string
          username?: string
        }
      }
      students: {
        Row: {
          id: string
          name: string
          date_of_birth: string | null
          gender: string | null
          class_id: string | null
          photo: string | null
          address: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          date_of_birth?: string
          gender?: string
          class_id?: string
          photo?: string
          address?: string
          status?: string
        }
        Update: {
          name?: string
          date_of_birth?: string
          gender?: string
          class_id?: string
          photo?: string
          address?: string
          status?: string
        }
      }
      // Add other table types as needed
    }
    Functions: {
      authenticate_user: {
        Args: { p_username: string; p_password: string }
        Returns: {
          id: string
          role: 'parent' | 'teacher' | 'admin'
          email: string
          name: string
          token: string
        }[]
      }
      register_user: {
        Args: {
          p_email: string
          p_password: string
          p_name: string
          p_role: 'parent' | 'teacher' | 'admin'
          p_username?: string
        }
        Returns: string
      }
      // Add other function types as needed
    }
  }
}
