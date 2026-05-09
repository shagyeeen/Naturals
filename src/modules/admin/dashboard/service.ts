import { getAdminMetrics } from './dao'

export const fetchDashboardMetrics = async () => {
  return await getAdminMetrics()
}
