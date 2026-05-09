import { getPreferencesByCustomerId, upsertPreferences } from './dao'
import type { CustomerPreferences } from '@/lib/supabase'

export const fetchPreferences = async (customerId: string): Promise<CustomerPreferences> => {
  const { data, error } = await getPreferencesByCustomerId(customerId)
  if (error) throw new Error(error.message)
  return data as CustomerPreferences
}

export const savePreferences = async (
  customerId: string,
  payload: Partial<Omit<CustomerPreferences, 'id' | 'customer_id' | 'created_at' | 'updated_at'>>
): Promise<CustomerPreferences> => {
  const { data, error } = await upsertPreferences(customerId, payload)
  if (error) throw new Error(error.message)
  return data as CustomerPreferences
}
