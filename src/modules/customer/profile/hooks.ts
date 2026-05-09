import { useState, useEffect } from 'react'
import { fetchProfile, saveProfile } from './service'
import type { Customer } from '@/lib/supabase'

export const useCustomerProfile = (customerId: string | undefined) => {
  const [profile, setProfile] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = async () => {
    if (!customerId) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProfile(customerId)
      setProfile(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const update = async (payload: Partial<Customer>) => {
    if (!customerId) return
    setLoading(true)
    try {
      const data = await saveProfile(customerId, payload)
      setProfile(data)
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [customerId])

  return { profile, loading, error, update, refresh: loadProfile }
}
