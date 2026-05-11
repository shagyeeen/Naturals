import { supabase } from '@/lib/supabase'

// GET — admins under owner
export const getBranchAdmins = (ownerId?: string) => {
  let query = supabase.from('admins').select('*')
  if (ownerId) query = query.eq('franchise_owner_id', ownerId)
  return query.order('full_name', { ascending: true })
}

// GET — stylists under owner
export const getBranchStylists = (ownerId?: string) => {
  let query = supabase.from('stylists').select('*')
  if (ownerId) query = query.eq('franchise_owner_id', ownerId)
  return query.order('full_name', { ascending: true })
}

// DELETE — remove admin
export const deleteAdmin = (id: string) =>
  supabase
    .from('admins')
    .delete()
    .eq('id', id)

// DELETE — remove stylist
export const deleteStylist = (id: string) =>
  supabase
    .from('stylists')
    .delete()
    .eq('id', id)
