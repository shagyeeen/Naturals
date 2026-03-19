const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function audit() {
  console.log('--- Active Registry Check ---')
  
  const { data: stylists } = await supabase.from('stylists').select('full_name, is_active')
  console.log('Stylists:', stylists)

  const { data: services } = await supabase.from('services').select('name, is_active')
  console.log('Services:', services)
}

audit()
