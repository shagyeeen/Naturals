import { getPreferencesByCustomerId, upsertPreferences } from './dao'
import type { CustomerPreferences } from '@/lib/supabase'

export const fetchPreferences = async (customerId: string): Promise<CustomerPreferences> => {
  const response = await fetch(`/api/customer/preferences?customerId=${customerId}`)
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to fetch preferences')
  }

  return response.json()
}

export const savePreferences = async (
  customerId: string,
  payload: Partial<Omit<CustomerPreferences, 'id' | 'customer_id' | 'created_at' | 'updated_at'>>
): Promise<CustomerPreferences> => {
  const response = await fetch('/api/customer/preferences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId, ...payload })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to save preferences')
  }

  return response.json()
}
