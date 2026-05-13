import { getActiveAppointments, createAppointment, cancelAppointment } from './dao'
import { supabase } from '@/lib/supabase'
import type { Appointment } from '@/lib/supabase'

export const autoCompleteAppointments = async (customerId?: string) => {
  
  try {
    await fetch('/api/appointments/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: customerId })
    });
  } catch (err) {
    console.error("[Maintenance] Auto-complete trigger failed:", err);
  }
}

export const fetchUpcomingBookings = async (customerId: string) => {
  // Run maintenance before fetching
  await autoCompleteAppointments(customerId);
  
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
