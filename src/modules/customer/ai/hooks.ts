import { useState, useEffect } from 'react'
import { fetchAiAnalysis, saveAiAnalysis } from './service'

export const useCustomerAiAnalysis = (customerId: string | undefined) => {
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAnalysis = async () => {
    if (!customerId) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAiAnalysis(customerId)
      setAnalysis(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const update = async (newAnalysis: any) => {
    if (!customerId) return
    setLoading(true)
    try {
      const data = await saveAiAnalysis(customerId, newAnalysis)
      setAnalysis(data)
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalysis()
  }, [customerId])

  return { analysis, loading, error, update, refresh: loadAnalysis }
}
