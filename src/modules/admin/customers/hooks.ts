import { useState, useEffect } from 'react'
import { fetchCustomers, removeCustomer } from './service'

export const useAdminCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCustomers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCustomers()
      setCustomers(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id: string) => {
    try {
      await removeCustomer(id)
      await loadCustomers()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  return { customers, loading, error, remove, refresh: loadCustomers }
}
