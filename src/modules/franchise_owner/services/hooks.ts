import { useState, useEffect } from 'react'
import { fetchCatalogue, addService, editService } from './service'
import type { Service } from '@/lib/supabase'

export const useServiceCatalogue = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCatalogue = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCatalogue()
      setServices(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const create = async (payload: Omit<Service, 'id' | 'created_at'>) => {
    try {
      await addService(payload)
      await loadCatalogue()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const update = async (id: string, payload: Partial<Service>) => {
    try {
      await editService(id, payload)
      await loadCatalogue()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    loadCatalogue()
  }, [])

  return { services, loading, error, create, update, refresh: loadCatalogue }
}
