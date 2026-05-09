import { getStylistProfile, updateStylistProfile } from './dao'
import type { Stylist } from '@/lib/supabase'

export const fetchProfile = async (stylistId: string): Promise<Stylist> => {
  const { data, error } = await getStylistProfile(stylistId)
  if (error) throw new Error(error.message)
  return data as Stylist
}

export const saveProfile = async (
  stylistId: string,
  payload: Partial<Omit<Stylist, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<Stylist> => {
  const { data, error } = await updateStylistProfile(stylistId, payload)
  if (error) throw new Error(error.message)
  return data as Stylist
}
