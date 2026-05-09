import { supabase } from '@/lib/supabase'

// GET — branch metrics for owner
export const getBranchMetrics = async (ownerId: string) => {
  const { data: owner } = await supabase
    .from('franchise_owners')
    .select('id')
    .eq('id', ownerId)
    .single()

  if (!owner) return null

  const [stylistsCount, appointmentsCount, revenueData] = await Promise.all([
    supabase.from('stylists').select('*', { count: 'exact', head: true }).eq('franchise_owner_id', owner.id),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).in('stylist_id', (await supabase.from('stylists').select('id').eq('franchise_owner_id', owner.id)).data?.map(s => s.id) || []),
    supabase.from('appointments').select('total_amount').eq('status', 'completed').in('stylist_id', (await supabase.from('stylists').select('id').eq('franchise_owner_id', owner.id)).data?.map(s => s.id) || [])
  ])

  const totalRevenue = revenueData.data?.reduce((sum, item) => sum + (Number(item.total_amount) || 0), 0) || 0

  return {
    stylists: stylistsCount.count || 0,
    appointments: appointmentsCount.count || 0,
    revenue: totalRevenue
  }
}
