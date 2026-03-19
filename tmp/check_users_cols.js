const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1)
  
  if (error) {
    if (error.code === 'PGRST116') {
      console.log('Users table exists but is empty.')
    } else {
      console.error('Error:', error)
    }
  } else {
    console.log('Columns in users table:', data.length > 0 ? Object.keys(data[0]) : 'Table is empty')
  }
}

test()
