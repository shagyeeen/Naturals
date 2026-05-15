import { supabaseAdmin } from './src/lib/supabase-admin';

async function checkSchema() {
  const { data, error } = await supabaseAdmin
    .from('appointments')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Error fetching appointment:', error);
  } else {
    console.log('Sample appointment columns:', Object.keys(data[0] || {}));
  }
}

checkSchema();
