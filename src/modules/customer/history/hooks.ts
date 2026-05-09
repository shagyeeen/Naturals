import { useState, useEffect } from 'react'
import { fetchVisitHistory } from './service'

export const useCustomerHistory = (customerId: string | undefined) => {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadHistory = async () => {
    if (!customerId) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchVisitHistory(customerId)
      setHistory(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [customerId])

  return { history, loading, error, refresh: loadHistory }
}
