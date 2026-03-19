const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function audit() {
  console.log('--- Digital Registry Audit ---')
  
  const tables = ['stylists', 'services', 'customers']
  
  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .limit(1)
    
    if (error) {
       console.log(`${table}: [Vault Locked] (${error.message})`)
    } else {
       console.log(`${table}: [Active] - Found ${count} records.`)
    }
  }
}

audit()
