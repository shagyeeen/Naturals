import { useState, useEffect } from 'react'
import { fetchSchedule, saveScheduleDay } from './service'

export const useStylistSchedule = (stylistId: string | undefined) => {
  const [schedule, setSchedule] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSchedule = async () => {
    if (!stylistId) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchSchedule(stylistId)
      setSchedule(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateDay = async (day: number, startTime: string, endTime: string, isAvailable: boolean) => {
    if (!stylistId) return
    setLoading(true)
    try {
      const data = await saveScheduleDay(stylistId, day, startTime, endTime, isAvailable)
      await loadSchedule()
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSchedule()
  }, [stylistId])

  return { schedule, loading, error, updateDay, refresh: loadSchedule }
}
