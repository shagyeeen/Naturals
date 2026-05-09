import { supabase } from '@/lib/supabase'
import type { Customer } from '@/lib/supabase'

// GET — fetch basic profile
export const getProfile = (customerId: string) =>
  supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single()

// PUT — update profile
export const updateProfile = (
  customerId: string,
  payload: Partial<Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) =>
  supabase
    .from('customers')
    .update(payload)
    .eq('id', customerId)
    .select()
    .single()
