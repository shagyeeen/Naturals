import { supabase } from '@/lib/supabase'

// GET — fetch all customers
export const getAllCustomers = () =>
  supabase
    .from('customers')
    .select('*')
    .order('full_name', { ascending: true })

// DELETE — remove customer
export const deleteCustomer = (id: string) =>
  supabase
    .from('customers')
    .delete()
    .eq('id', id)

// GET — search customer by phone or code
export const findCustomerByQuery = (query: string) =>
  supabase
    .from('customers')
    .select('*')
    .or(`phone.ilike.%${query}%,customer_code.ilike.%${query}%,full_name.ilike.%${query}%`)
    .limit(1)
    .single()
