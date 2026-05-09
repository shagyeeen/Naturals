import { useState, useEffect } from 'react'
import { fetchProfile, saveProfile } from './service'
import type { Stylist } from '@/lib/supabase'

export const useStylistProfile = (stylistId: string | undefined) => {
  const [profile, setProfile] = useState<Stylist | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = async () => {
    if (!stylistId) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProfile(stylistId)
      setProfile(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const update = async (payload: Partial<Stylist>) => {
    if (!stylistId) return
    setLoading(true)
    try {
      const data = await saveProfile(stylistId, payload)
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
  }, [stylistId])

  return { profile, loading, error, update, refresh: loadProfile }
}
