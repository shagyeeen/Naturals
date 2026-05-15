import { supabaseAdmin } from './src/lib/supabase-admin';

async function listServices() {
  const { data } = await supabaseAdmin.from('services').select('name').eq('is_active', true);
  console.log(JSON.stringify(data, null, 2));
}

listServices();
