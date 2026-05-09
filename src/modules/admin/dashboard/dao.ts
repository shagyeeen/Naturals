import { supabase } from '@/lib/supabase'

// GET — overall metrics
export const getAdminMetrics = async () => {
  const [customersCount, appointmentsCount, revenueData] = await Promise.all([
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('total_amount').eq('status', 'completed')
  ])

  const totalRevenue = revenueData.data?.reduce((sum, item) => sum + (Number(item.total_amount) || 0), 0) || 0

  return {
    customers: customersCount.count || 0,
    appointments: appointmentsCount.count || 0,
    revenue: totalRevenue
  }
}
