import { getCustomerHistory } from './dao'

export const fetchVisitHistory = async (customerId: string, limit?: number) => {
  const { data, error } = await getCustomerHistory(customerId, limit)
  if (error) throw new Error(error.message)
  return data
}
