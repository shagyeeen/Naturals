import { getProfile, updateProfile } from './dao'
import type { Customer } from '@/lib/supabase'

export const fetchProfile = async (customerId: string): Promise<Customer> => {
  const { data, error } = await getProfile(customerId)
  if (error) throw new Error(error.message)
  return data as Customer
}

export const saveProfile = async (
  customerId: string,
  payload: Partial<Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<Customer> => {
  const { data, error } = await updateProfile(customerId, payload)
  if (error) throw new Error(error.message)
  return data as Customer
}
