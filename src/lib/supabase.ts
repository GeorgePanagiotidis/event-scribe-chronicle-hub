
import { createClient } from '@supabase/supabase-js'

// Supabase configuration for self-hosted instance
// These URLs will point to your local Docker setup
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:8000'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMAs_-EmCU'

// Create Supabase client instance
// This client handles all communication with your self-hosted Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure auth settings for self-hosted environment
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database table types for type safety
export interface DatabaseEvent {
  id: string
  title: string
  description: string
  date: string
  start_time: string
  end_time?: string
  location?: string
  position?: string
  notes?: string
  created_by: string
  created_at: string
  updated_at?: string
}

export interface DatabaseEventImage {
  id: string
  event_id: string
  image_url: string
  created_at: string
}

// Database schema types
export interface Database {
  public: {
    Tables: {
      events: {
        Row: DatabaseEvent
        Insert: Omit<DatabaseEvent, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DatabaseEvent, 'id' | 'created_at'>>
      }
      event_images: {
        Row: DatabaseEventImage
        Insert: Omit<DatabaseEventImage, 'id' | 'created_at'>
        Update: Partial<Omit<DatabaseEventImage, 'id' | 'created_at'>>
      }
    }
  }
}
