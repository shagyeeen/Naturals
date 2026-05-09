import { useState, useEffect } from 'react'
import { fetchDashboardMetrics } from './service'

export const useAdminDashboard = () => {
  const [metrics, setMetrics] = useState({ customers: 0, appointments: 0, revenue: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMetrics = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchDashboardMetrics()
      setMetrics(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
  }, [])

  return { metrics, loading, error, refresh: loadMetrics }
}
