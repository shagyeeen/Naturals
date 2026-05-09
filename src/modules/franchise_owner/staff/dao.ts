import { supabase } from '@/lib/supabase'

// GET — admins under owner
export const getBranchAdmins = (ownerId: string) =>
  supabase
    .from('admins')
    .select('*')
    .eq('franchise_owner_id', ownerId)
    .order('full_name', { ascending: true })

// GET — stylists under owner
export const getBranchStylists = (ownerId: string) =>
  supabase
    .from('stylists')
    .select('*')
    .eq('franchise_owner_id', ownerId)
    .order('full_name', { ascending: true })

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
