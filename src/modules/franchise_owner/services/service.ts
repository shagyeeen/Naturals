import { getServices, createService, updateService } from './dao'
import type { Service } from '@/lib/supabase'

export const fetchCatalogue = async () => {
  const { data, error } = await getServices()
  if (error) throw new Error(error.message)
  return data
}

export const addService = async (payload: Omit<Service, 'id' | 'created_at'>) => {
  const { data, error } = await createService(payload)
  if (error) throw new Error(error.message)
  return data
}

export const editService = async (id: string, payload: Partial<Service>) => {
  const { data, error } = await updateService(id, payload)
  if (error) throw new Error(error.message)
  return data
}
