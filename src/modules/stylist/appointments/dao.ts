import { supabase } from '@/lib/supabase'

// GET — fetch stylist's appointments for today
export const getStylistAppointments = (stylistId: string, date: string) =>
  supabase
    .from('appointments')
    .select('*, customer:customers(id, full_name, phone), service:services(id, name, price)')
    .eq('stylist_id', stylistId)
    .eq('appointment_date', date)
    .order('start_time', { ascending: true })

// PATCH — update appointment status (confirmed, completed, cancelled)
export const updateAppointmentStatus = (appointmentId: string, status: string) =>
  supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId)
    .select()
    .single()
