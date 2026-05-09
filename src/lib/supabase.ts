import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// ENUM TYPES
// ============================================

export type UserRole = 'franchise_owner' | 'admin' | 'stylist' | 'customer'
export type Gender = 'male' | 'female' | 'other'
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'refunded'
export type DiscountType = 'percentage' | 'flat'
export type HairwashTiming = 'Before SPA' | 'After SPA' | 'Both'
export type WaterTemp = 'Cold' | 'Lukewarm' | 'Warm'
export type MassageIntensity = 'Soft' | 'Medium' | 'Strong' | 'None'
export type ConversationLevel = 'Quiet Professional' | 'Friendly Chat' | 'Social/Engaging'

// ============================================
// ENTITY INTERFACES
// ============================================

export interface User {
  id: string
  auth_id?: string
  email: string
  phone?: string
  role: UserRole
  full_name?: string
  gender?: Gender
  location?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FranchiseOwner {
  id: string
  user_id: string
  full_name: string
  phone: string
  email?: string
  franchise_name: string
  branch_name?: string
  branch_address?: string
  logo_url?: string
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  user_id: string
  franchise_owner_id?: string
  branch_location?: string
  full_name: string
  phone: string
  email?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

/** @deprecated Use Admin instead */
export type Manager = Admin

export interface Stylist {
  id: string
  user_id: string
  franchise_owner_id?: string
  branch_location?: string
  full_name: string
  phone: string
  email?: string
  gender?: Gender
  experience_years: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  user_id?: string
  customer_code?: string
  full_name: string
  phone: string
  email?: string
  date_of_birth?: string
  gender?: Gender
  hairstyle_preference?: string
  ai_hairstyle_analysis?: Record<string, unknown>
  preferred_branch_location?: string
  preferred_salon_id?: string
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
  // joined relations
  customer_preferences?: CustomerPreferences
  preferred_salon?: Pick<FranchiseOwner, 'id' | 'branch_name' | 'franchise_name'>
}

export interface CustomerPreferences {
  id: string
  customer_id: string
  hairwash_preference: HairwashTiming
  preferred_hairstyle?: string
  water_temperature: WaterTemp
  scalp_massage_intensity: MassageIntensity
  conversation_level: ConversationLevel
  special_instructions?: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description?: string
  category?: string
  gender_applicability: 'Women' | 'Men' | 'Both'
  duration_minutes: number
  price: number
  is_active: boolean
  created_at: string
}

export interface Offer {
  id: string
  franchise_owner_id?: string
  title: string
  description?: string
  promo_code?: string
  discount_type: DiscountType
  discount_value: number
  applicable_service_id?: string
  min_amount: number
  valid_from: string
  valid_until: string
  is_active: boolean
  created_at: string
}

export interface StylistSchedule {
  id: string
  stylist_id: string
  day_of_week: number // 0=Sun, 1=Mon ... 6=Sat
  start_time: string
  end_time: string
  is_available: boolean
  created_at: string
}

export interface Appointment {
  id: string
  customer_id: string
  stylist_id: string
  service_id?: string
  booked_by?: string
  offer_id?: string
  appointment_date: string
  start_time: string
  end_time: string
  status: AppointmentStatus
  notes?: string
  total_amount?: number
  discount_amount: number
  payment_status: PaymentStatus
  rating?: number
  feedback?: string
  created_at: string
  updated_at: string
  // joined relations
  customer?: Pick<Customer, 'id' | 'full_name' | 'phone' | 'email' | 'customer_code'>
  stylist?: Pick<Stylist, 'id' | 'full_name' | 'phone'>
  service?: Pick<Service, 'id' | 'name' | 'duration_minutes' | 'price'>
}

export interface CustomerHistory {
  id: string
  customer_id: string
  appointment_id?: string
  action_type: string
  details?: Record<string, unknown>
  performed_by?: string
  created_at: string
}
