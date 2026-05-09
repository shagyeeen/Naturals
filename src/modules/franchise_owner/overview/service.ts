import { getBranchMetrics } from './dao'

export const fetchBranchPerformance = async (ownerId: string) => {
  return await getBranchMetrics(ownerId)
}
