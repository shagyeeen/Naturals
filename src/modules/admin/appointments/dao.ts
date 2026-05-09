import { supabase } from '@/lib/supabase'

// GET — all appointments with details
export const getAllAppointments = () =>
  supabase
    .from('appointments')
    .select('*, customer:customers!customer_id(id, full_name, phone), stylist:stylists!stylist_id(id, full_name), service:services!service_id(id, name, price)')
    .order('appointment_date', { ascending: false })

// PATCH — global status update
export const updateAppointmentStatus = (id: string, status: string) =>
  supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

// DELETE — remove appointment
export const deleteAppointment = (id: string) =>
  supabase
    .from('appointments')
    .delete()
    .eq('id', id)
