import { supabase } from '@/lib/supabase'
import type { Appointment } from '@/lib/supabase'

// GET — fetch active/upcoming appointments
export const getActiveAppointments = (customerId: string) =>
  supabase
    .from('appointments')
    .select('*, stylist:stylists(id, full_name), service:services(id, name, duration_minutes, price)')
    .eq('customer_id', customerId)
    .in('status', ['pending', 'confirmed'])
    .order('appointment_date', { ascending: true })

// POST — book a new appointment
export const createAppointment = (payload: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) =>
  supabase
    .from('appointments')
    .insert(payload)
    .select()
    .single()

// DELETE — cancel an appointment
export const cancelAppointment = (appointmentId: string) =>
  supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', appointmentId)
