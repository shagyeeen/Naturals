'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  fetchCatalogue, addService, editService, removeService,
  fetchActiveOffers, addOffer, editOffer, removeOffer,
  fetchAllStaff, setStaffActive, fetchGlobalRevenue
} from './service'
import type { Service, Offer, Admin, Stylist } from '@/lib/supabase'

// ── Services ──────────────────────────────────────────────

export function useServiceCatalogue() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetchCatalogue().then(setServices).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  return { services, loading, refetch: load }
}

export function useServiceMutations(onSuccess: () => void) {
  const [loading, setLoading] = useState(false)

  const add = useCallback(async (payload: Omit<Service, 'id' | 'created_at'>) => {
    setLoading(true)
    try { await addService(payload); onSuccess() } finally { setLoading(false) }
  }, [onSuccess])

  const edit = useCallback(async (id: string, payload: Partial<Service>) => {
    setLoading(true)
    try { await editService(id, payload); onSuccess() } finally { setLoading(false) }
  }, [onSuccess])

  const remove = useCallback(async (id: string) => {
    setLoading(true)
    try { await removeService(id); onSuccess() } finally { setLoading(false) }
  }, [onSuccess])

  return { add, edit, remove, loading }
}

// ── Offers ────────────────────────────────────────────────

export function useOffers() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetchActiveOffers().then(setOffers).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  return { offers, loading, refetch: load }
}

export function useOfferMutations(onSuccess: () => void) {
  const [loading, setLoading] = useState(false)

  const add = useCallback(async (payload: Omit<Offer, 'id' | 'created_at'>) => {
    setLoading(true)
    try { await addOffer(payload); onSuccess() } finally { setLoading(false) }
  }, [onSuccess])

  const edit = useCallback(async (id: string, payload: Partial<Offer>) => {
    setLoading(true)
    try { await editOffer(id, payload); onSuccess() } finally { setLoading(false) }
  }, [onSuccess])

  const remove = useCallback(async (id: string) => {
    setLoading(true)
    try { await removeOffer(id); onSuccess() } finally { setLoading(false) }
  }, [onSuccess])

  return { add, edit, remove, loading }
}

// ── Staff ─────────────────────────────────────────────────

export function useAllStaff() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetchAllStaff()
      .then(({ admins, stylists }) => { setAdmins(admins); setStylists(stylists) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const toggleActive = useCallback(async (table: 'admins' | 'stylists', id: string, isActive: boolean) => {
    await setStaffActive(table, id, isActive)
    load()
  }, [load])

  return { admins, stylists, loading, toggleActive, refetch: load }
}

// ── Overview Metrics ──────────────────────────────────────

export function useGlobalRevenue() {
  const [revenue, setRevenue] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGlobalRevenue().then(setRevenue).finally(() => setLoading(false))
  }, [])

  return { revenue, loading }
}
