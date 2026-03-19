const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
  console.log('Seeding elite stylists...')
  
  const stylists = [
    { 
      full_name: 'Suresh Kumar', 
      experience_years: 12, 
      specializations: ['Advanced Architecture', 'Men\'s Dynamic Styling'],
      is_active: true
    },
    { 
      full_name: 'Tharikasini', 
      experience_years: 8, 
      specializations: ['Molecular Colouring', 'Bridal Transformations'],
      is_active: true
    }
  ]

  const { data, error } = await supabase
    .from('stylists')
    .insert(stylists)
    .select()

  if (error) {
    if (error.code === '42501') {
      console.error('Error: RLS policy is blocking the insert. Please use the Supabase SQL Editor to run the unlock command I provided.')
    } else {
      console.error('Error seeding stylists:', error)
    }
  } else {
    console.log('Successfully seeded stylists:', data.length)
  }
}

seed()
