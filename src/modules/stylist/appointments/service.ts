import { getStylistAppointments, updateAppointmentStatus } from './dao'

export const fetchTodayQueue = async (stylistId: string) => {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await getStylistAppointments(stylistId, today)
  if (error) throw new Error(error.message)
  return data
}

export const updateStatus = async (appointmentId: string, status: string) => {
  const { data, error } = await updateAppointmentStatus(appointmentId, status)
  if (error) throw new Error(error.message)
  return data
}
