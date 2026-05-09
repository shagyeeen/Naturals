import { getBranchAdmins, getBranchStylists, deleteAdmin, deleteStylist } from './dao'

export const fetchStaff = async (ownerId: string) => {
  const [admins, stylists] = await Promise.all([
    getBranchAdmins(ownerId),
    getBranchStylists(ownerId)
  ])

  if (admins.error) throw new Error(admins.error.message)
  if (stylists.error) throw new Error(stylists.error.message)

  return {
    admins: admins.data || [],
    stylists: stylists.data || []
  }
}

export const removeAdmin = async (id: string) => {
  const { error } = await deleteAdmin(id)
  if (error) throw new Error(error.message)
  return true
}

export const removeStylist = async (id: string) => {
  const { error } = await deleteStylist(id)
  if (error) throw new Error(error.message)
  return true
}
