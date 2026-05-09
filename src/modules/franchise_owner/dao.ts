import { supabase } from '@/lib/supabase'
import type { Service, Offer, Stylist, Admin } from '@/lib/supabase'

// ── SERVICES ──────────────────────────────────────────────
export const listAllServices = () =>
  supabase.from('services').select('*').order('category').order('name')

export const createService = (payload: Omit<Service, 'id' | 'created_at'>) =>
  supabase.from('services').insert(payload).select().single()

export const updateService = (id: string, payload: Partial<Service>) =>
  supabase.from('services').update(payload).eq('id', id).select().single()

export const deactivateService = (id: string) =>
  supabase.from('services').update({ is_active: false }).eq('id', id)

// ── OFFERS ────────────────────────────────────────────────
export const listAllOffers = () =>
  supabase.from('offers').select('*').order('valid_until', { ascending: false })

export const createOffer = (payload: Omit<Offer, 'id' | 'created_at'>) =>
  supabase.from('offers').insert(payload).select().single()

export const updateOffer = (id: string, payload: Partial<Offer>) =>
  supabase.from('offers').update(payload).eq('id', id).select().single()

export const deactivateOffer = (id: string) =>
  supabase.from('offers').update({ is_active: false }).eq('id', id)

// ── STAFF (Admins + Stylists) ─────────────────────────────
export const listAllAdmins = () =>
  supabase.from('admins').select('*').order('full_name')

export const listAllStylists = () =>
  supabase.from('stylists').select('*, stylist_schedule(*)').order('full_name')

export const updateAdmin = (id: string, payload: Partial<Admin>) =>
  supabase.from('admins').update(payload).eq('id', id).select().single()

export const updateStylistAsOwner = (id: string, payload: Partial<Stylist>) =>
  supabase.from('stylists').update(payload).eq('id', id).select().single()

export const toggleStaffActive = (table: 'admins' | 'stylists', id: string, isActive: boolean) =>
  supabase.from(table).update({ is_active: isActive }).eq('id', id).select().single()

// ── OVERVIEW METRICS ──────────────────────────────────────
export const getBranchRevenue = () =>
  supabase
    .from('appointments')
    .select('total_amount, stylist:stylists(branch_location)')
    .eq('status', 'completed')
    .not('total_amount', 'is', null)
