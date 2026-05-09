import { getActiveAppointments, createAppointment, cancelAppointment } from './dao'
import type { Appointment } from '@/lib/supabase'

export const fetchUpcomingBookings = async (customerId: string) => {
  const { data, error } = await getActiveAppointments(customerId)
  if (error) throw new Error(error.message)
  return data
}

export const bookNewService = async (payload: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await createAppointment(payload)
  if (error) throw new Error(error.message)
  return data
}

export const cancelBooking = async (appointmentId: string) => {
  const { error } = await cancelAppointment(appointmentId)
  if (error) throw new Error(error.message)
  return true
}
