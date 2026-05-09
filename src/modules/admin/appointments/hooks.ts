import { useState, useEffect } from 'react'
import { fetchAllBookings, changeBookingStatus, removeBooking } from './service'

export const useAdminAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAppointments = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllBookings()
      setAppointments(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await changeBookingStatus(id, status)
      await loadAppointments()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const remove = async (id: string) => {
    try {
      await removeBooking(id)
      await loadAppointments()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  return { appointments, loading, error, updateStatus, remove, refresh: loadAppointments }
}
