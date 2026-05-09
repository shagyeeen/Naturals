import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase Admin Client: Missing environment variables. Server-side auth may fail.')
}

// This client MUST ONLY BE USED ON THE SERVER
// It bypasses RLS and handles system-level operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || '', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
})
