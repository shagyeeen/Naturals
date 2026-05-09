import { supabase } from '@/lib/supabase'
import type { CustomerPreferences } from '@/lib/supabase'

// GET — fetch preferences for a customer
export const getPreferencesByCustomerId = (customerId: string) =>
  supabase
    .from('customer_preferences')
    .select('*')
    .eq('customer_id', customerId)
    .maybeSingle()

// PUT — update (upsert) preference record
export const upsertPreferences = (
  customerId: string,
  payload: Partial<Omit<CustomerPreferences, 'id' | 'customer_id' | 'created_at' | 'updated_at'>>
) =>
  supabase
    .from('customer_preferences')
    .upsert({ ...payload, customer_id: customerId })
    .select()
    .single()
