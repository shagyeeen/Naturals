import { supabase } from '@/lib/supabase'
import type { Stylist } from '@/lib/supabase'

// GET — fetch stylist profile
export const getStylistProfile = (stylistId: string) =>
  supabase
    .from('stylists')
    .select('*')
    .eq('id', stylistId)
    .single()

// PUT — update stylist profile
export const updateStylistProfile = (
  stylistId: string,
  payload: Partial<Omit<Stylist, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) =>
  supabase
    .from('stylists')
    .update(payload)
    .eq('id', stylistId)
    .select()
    .single()
