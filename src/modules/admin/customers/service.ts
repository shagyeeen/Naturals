import { getAllCustomers, deleteCustomer, findCustomerByQuery } from './dao'

export const fetchCustomers = async () => {
  const { data, error } = await getAllCustomers()
  if (error) throw new Error(error.message)
  return data
}

export const removeCustomer = async (id: string) => {
  const { error } = await deleteCustomer(id)
  if (error) throw new Error(error.message)
  return true
}

export const searchCustomer = async (query: string) => {
  const { data, error } = await findCustomerByQuery(query)
  if (error) return null
  return data
}
