import { useState, useEffect } from 'react'
import { fetchBranchPerformance } from './service'

export const useBranchOverview = (ownerId: string | undefined) => {
  const [metrics, setMetrics] = useState({ stylists: 0, appointments: 0, revenue: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMetrics = async () => {
    if (!ownerId) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBranchPerformance(ownerId)
      if (data) setMetrics(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
  }, [ownerId])

  return { metrics, loading, error, refresh: loadMetrics }
}
