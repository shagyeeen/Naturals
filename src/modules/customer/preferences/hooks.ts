'use client'
import { useState, useEffect, useCallback } from 'react'
import { fetchPreferences, savePreferences } from './service'
import type { CustomerPreferences } from '@/lib/supabase'

export function usePreferences(customerId: string | undefined) {
  const [preferences, setPreferences] = useState<CustomerPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!customerId) { setLoading(false); return }
    try {
      setLoading(true)
      const data = await fetchPreferences(customerId)
      setPreferences(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load preferences')
    } finally {
      setLoading(false)
    }
  }, [customerId])

  useEffect(() => { load() }, [load])

  const save = useCallback(async (
    payload: Partial<Omit<CustomerPreferences, 'id' | 'customer_id' | 'created_at' | 'updated_at'>>
  ) => {
    if (!customerId) return
    setSaving(true)
    try {
      const updated = await savePreferences(customerId, payload)
      setPreferences(updated)
      return updated
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save preferences')
      throw e
    } finally {
      setSaving(false)
    }
  }, [customerId])

  return { preferences, loading, saving, error, save, refetch: load }
}
