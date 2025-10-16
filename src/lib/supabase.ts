import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://inghpkfrteirazykiica.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluZ2hwa2ZydGVpcmF6eWtpaWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNjM2NjQsImV4cCI6MjA3NTkzOTY2NH0.AbVrzrncFUwqnu1kqH1z0L2Um8cTnuyZoQTiQUK-Cw4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (you can generate these from your Supabase dashboard)
export interface Database {
  public: {
    Tables: {
      // Add your table types here as you create them
      // Example:
      // users: {
      //   Row: {
      //     id: string
      //     email: string
      //     created_at: string
      //   }
      //   Insert: {
      //     id?: string
      //     email: string
      //     created_at?: string
      //   }
      //   Update: {
      //     id?: string
      //     email?: string
      //     created_at?: string
      //   }
      // }
    }
  }
}
