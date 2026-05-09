import { getAllAppointments, updateAppointmentStatus, deleteAppointment } from './dao'

export const fetchAllBookings = async () => {
  const { data, error } = await getAllAppointments()
  if (error) throw new Error(error.message)
  return data
}

export const changeBookingStatus = async (id: string, status: string) => {
  const { data, error } = await updateAppointmentStatus(id, status)
  if (error) throw new Error(error.message)
  return data
}

export const removeBooking = async (id: string) => {
  const { error } = await deleteAppointment(id)
  if (error) throw new Error(error.message)
  return true
}
