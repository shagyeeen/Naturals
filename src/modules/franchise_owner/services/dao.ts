import { supabase } from '@/lib/supabase'
import type { Service } from '@/lib/supabase'

// GET — all services
export const getServices = () =>
  supabase
    .from('services')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true })

// POST — add service
export const createService = (payload: Omit<Service, 'id' | 'created_at'>) =>
  supabase
    .from('services')
    .insert(payload)
    .select()
    .single()

// PUT — update service
export const updateService = (id: string, payload: Partial<Service>) =>
  supabase
    .from('services')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
