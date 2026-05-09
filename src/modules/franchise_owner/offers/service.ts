import { getOffers, createOffer, updateOffer, deleteOffer } from './dao'
import type { Offer } from '@/lib/supabase'

export const fetchOffers = async (ownerId: string) => {
  const { data, error } = await getOffers(ownerId)
  if (error) throw new Error(error.message)
  return data
}

export const addOffer = async (payload: Omit<Offer, 'id' | 'created_at'>) => {
  const { data, error } = await createOffer(payload)
  if (error) throw new Error(error.message)
  return data
}

export const editOffer = async (id: string, payload: Partial<Offer>) => {
  const { data, error } = await updateOffer(id, payload)
  if (error) throw new Error(error.message)
  return data
}

export const removeOffer = async (id: string) => {
  const { error } = await deleteOffer(id)
  if (error) throw new Error(error.message)
  return true
}
