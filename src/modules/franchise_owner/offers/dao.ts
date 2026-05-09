import { supabase } from '@/lib/supabase'
import type { Offer } from '@/lib/supabase'

// GET — all offers for a franchise
export const getOffers = (ownerId: string) =>
  supabase
    .from('offers')
    .select('*, service:services(id, name)')
    .eq('franchise_owner_id', ownerId)
    .order('created_at', { ascending: false })

// GET — all active offers for public
export const getAllActiveOffers = () =>
  supabase
    .from('offers')
    .select('*, service:services(id, name)')
    .eq('is_active', true)
    .order('valid_until', { ascending: true })

// POST — create offer
export const createOffer = (payload: Omit<Offer, 'id' | 'created_at'>) =>
  supabase
    .from('offers')
    .insert(payload)
    .select()
    .single()

// PUT — update offer
export const updateOffer = (id: string, payload: Partial<Offer>) =>
  supabase
    .from('offers')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

// DELETE — remove offer
export const deleteOffer = (id: string) =>
  supabase
    .from('offers')
    .delete()
    .eq('id', id)
