import { supabase } from '@/lib/supabase'

// GET — paginated visit history for a customer
export const getCustomerHistory = (customerId: string, limit = 20) =>
  supabase
    .from('customer_history')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(limit)
