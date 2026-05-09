import { useState, useEffect } from 'react'
import { fetchTodayQueue, updateStatus } from './service'

export const useStylistAppointments = (stylistId: string | undefined) => {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadQueue = async () => {
    if (!stylistId) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTodayQueue(stylistId)
      setAppointments(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const changeStatus = async (id: string, status: string) => {
    setLoading(true)
    try {
      await updateStatus(id, status)
      await loadQueue()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQueue()
  }, [stylistId])

  return { appointments, loading, error, changeStatus, refresh: loadQueue }
}
