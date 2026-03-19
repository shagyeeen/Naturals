const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .limit(5)
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Customers found:', data)
  }
}

test()
