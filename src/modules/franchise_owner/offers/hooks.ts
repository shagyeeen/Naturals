import { useState, useEffect } from 'react'
import { fetchOffers, addOffer, editOffer, removeOffer } from './service'
import type { Offer } from '@/lib/supabase'

export const useFranchiseOffers = (ownerId: string | undefined) => {
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadOffers = async () => {
    if (!ownerId) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchOffers(ownerId)
      setOffers(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const create = async (payload: Omit<Offer, 'id' | 'created_at'>) => {
    try {
      await addOffer(payload)
      await loadOffers()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const update = async (id: string, payload: Partial<Offer>) => {
    try {
      await editOffer(id, payload)
      await loadOffers()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const remove = async (id: string) => {
    try {
      await removeOffer(id)
      await loadOffers()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    loadOffers()
  }, [ownerId])

  return { offers, loading, error, create, update, remove, refresh: loadOffers }
}
