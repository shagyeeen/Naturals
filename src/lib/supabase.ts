import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'admin' | 'franchise_owner' | 'manager' | 'stylist' | 'customer'
export type Gender = 'male' | 'female' | 'other'
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'refunded'

export interface User {
  id: string
  email: string
  phone?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  user_id: string
  customer_code?: string
  full_name: string
  phone: string
  email?: string
  date_of_birth?: string
  gender?: Gender
  hairstyle_preference?: string
  profile_photo_url?: string
  ai_hairstyle_analysis?: any
  preferred_salon_id?: string
  notes?: string
  is_premium: boolean
  branch_name?: string
  created_at: string
  updated_at: string
}

export interface FranchiseOwner {
  id: string
  user_id: string
  full_name: string
  phone: string
  email?: string
  date_of_birth?: string
  franchise_name?: string
  franchise_address?: string
  branch_name?: string
  created_at: string
  updated_at: string
}

export interface Manager {
  id: string
  user_id: string
  franchise_owner_id?: string
  full_name: string
  phone: string
  email?: string
  date_of_birth?: string
  branch_name?: string
  created_at: string
  updated_at: string
}

export interface Stylist {
  id: string
  user_id: string
  manager_id?: string
  full_name: string
  phone: string
  email?: string
  date_of_birth?: string
  gender?: Gender
  experience_years: number
  specializations?: string[]
  profile_photo_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StylistSchedule {
  id: string
  stylist_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
  created_at: string
}

export interface Service {
  id: string
  name: string
  description?: string
  category?: string
  duration_minutes: number
  price: number
  is_active: boolean
  created_at: string
}

export interface Appointment {
  id: string
  customer_id: string
  stylist_id: string
  service_id?: string
  appointment_date: string
  start_time: string
  end_time: string
  status: AppointmentStatus
  notes?: string
  total_amount?: number
  payment_status: PaymentStatus
  created_at: string
  updated_at: string
  customer?: Customer
  stylist?: Stylist
  service?: Service
}

export interface CustomerHistory {
  id: string
  customer_id: string
  appointment_id?: string
  action_type: string
  details?: any
  performed_by?: string
  created_at: string
}

export interface AuditLog {
  id: string
  user_id?: string
  action: string
  table_affected?: string
  record_id?: string
  old_data?: any
  new_data?: any
  ip_address?: string
  created_at: string
}
