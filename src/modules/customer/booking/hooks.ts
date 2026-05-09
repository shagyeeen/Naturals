import { useState, useEffect } from 'react'
import { fetchUpcomingBookings, bookNewService, cancelBooking } from './service'
import type { Appointment } from '@/lib/supabase'

export const useCustomerBookings = (customerId: string | undefined) => {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadBookings = async () => {
    if (!customerId) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchUpcomingBookings(customerId)
      setBookings(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const book = async (payload: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true)
    try {
      const data = await bookNewService(payload)
      await loadBookings()
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const cancel = async (id: string) => {
    setLoading(true)
    try {
      await cancelBooking(id)
      await loadBookings()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [customerId])

  return { bookings, loading, error, book, cancel, refresh: loadBookings }
}
