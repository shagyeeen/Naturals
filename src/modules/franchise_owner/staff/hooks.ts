import { useState, useEffect } from 'react'
import { fetchStaff, removeAdmin, removeStylist } from './service'

export const useBranchStaff = (ownerId: string | undefined) => {
  const [staff, setStaff] = useState<{ admins: any[], stylists: any[] }>({ admins: [], stylists: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStaff = async () => {
    if (!ownerId) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchStaff(ownerId)
      setStaff(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteAdminRecord = async (id: string) => {
    try {
      await removeAdmin(id)
      await loadStaff()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteStylistRecord = async (id: string) => {
    try {
      await removeStylist(id)
      await loadStaff()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    loadStaff()
  }, [ownerId])

  return { staff, loading, error, deleteAdmin: deleteAdminRecord, deleteStylist: deleteStylistRecord, refresh: loadStaff }
}
