import {
  listAllServices, createService, updateService, deactivateService,
  listAllOffers, createOffer, updateOffer, deactivateOffer,
  listAllAdmins, listAllStylists, updateAdmin, updateStylistAsOwner,
  toggleStaffActive, getBranchRevenue
} from './dao'
import type { Service, Offer, Admin, Stylist } from '@/lib/supabase'

export const fetchCatalogue = async (): Promise<Service[]> => {
  const { data, error } = await listAllServices()
  if (error) throw new Error(error.message)
  return (data ?? []) as Service[]
}
export const addService = async (payload: Omit<Service, 'id' | 'created_at'>) => {
  const { data, error } = await createService(payload)
  if (error) throw new Error(error.message)
  return data as Service
}
export const editService = async (id: string, payload: Partial<Service>) => {
  const { data, error } = await updateService(id, payload)
  if (error) throw new Error(error.message)
  return data as Service
}
export const removeService = async (id: string) => {
  const { error } = await deactivateService(id)
  if (error) throw new Error(error.message)
}

export const fetchActiveOffers = async (): Promise<Offer[]> => {
  const { data, error } = await listAllOffers()
  if (error) throw new Error(error.message)
  return (data ?? []) as Offer[]
}
export const addOffer = async (payload: Omit<Offer, 'id' | 'created_at'>) => {
  const { data, error } = await createOffer(payload)
  if (error) throw new Error(error.message)
  return data as Offer
}
export const editOffer = async (id: string, payload: Partial<Offer>) => {
  const { data, error } = await updateOffer(id, payload)
  if (error) throw new Error(error.message)
  return data as Offer
}
export const removeOffer = async (id: string) => {
  const { error } = await deactivateOffer(id)
  if (error) throw new Error(error.message)
}

export const fetchAllStaff = async () => {
  const [adminsRes, stylistsRes] = await Promise.all([listAllAdmins(), listAllStylists()])
  return {
    admins: (adminsRes.data ?? []) as Admin[],
    stylists: (stylistsRes.data ?? []) as Stylist[],
  }
}
export const editAdmin = async (id: string, payload: Partial<Admin>) => {
  const { data, error } = await updateAdmin(id, payload)
  if (error) throw new Error(error.message)
  return data as Admin
}
export const editStylist = async (id: string, payload: Partial<Stylist>) => {
  const { data, error } = await updateStylistAsOwner(id, payload)
  if (error) throw new Error(error.message)
  return data as Stylist
}
export const setStaffActive = async (table: 'admins' | 'stylists', id: string, isActive: boolean) => {
  const { error } = await toggleStaffActive(table, id, isActive)
  if (error) throw new Error(error.message)
}

export const fetchGlobalRevenue = async (): Promise<number> => {
  const { data, error } = await getBranchRevenue()
  if (error) throw new Error(error.message)
  return (data ?? []).reduce(
    (sum: number, row: { total_amount: number | null }) => sum + (row.total_amount ?? 0), 0
  )
}
