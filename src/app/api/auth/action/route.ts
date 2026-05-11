import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  try {
    const { email, fullName, customerCode, photoURL, action, payload } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'No email provided' }, { status: 400 })
    }

    const formattedEmail = email.toLowerCase()

    if (action === 'ensure') {
      const { data: existingCustomer, error: findError } = await supabaseAdmin
        .from('customers')
        .select('id')
        .eq('email', formattedEmail)
        .maybeSingle()

      if (findError) return NextResponse.json({ error: findError.message }, { status: 500 })

      if (!existingCustomer) {
        const { error: insertError } = await supabaseAdmin.from('customers').insert({
          email: formattedEmail,
          full_name: fullName || "Google User",
          customer_code: customerCode,
          phone: 'PENDING', // Requirement: Phone is NOT NULL in DB, will be updated during onboarding
          is_active: true
        })
        if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })
      }
      return NextResponse.json({ success: true })

    } else if (action === 'update') {
      const { data: existing } = await supabaseAdmin
        .from('customers')
        .select('id')
        .eq('email', formattedEmail)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      let error;
      let customerId;

      if (existing) {
        customerId = existing.id;
        const { error: err } = await supabaseAdmin.from('customers').update(payload).eq('id', customerId);
        error = err;
      } else {
        const { data: newCustomer, error: err } = await supabaseAdmin.from('customers').insert({ ...payload, email: formattedEmail }).select('id').single();
        error = err;
        customerId = newCustomer?.id;
      }

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      
      // Sync to customer_preferences table if preferences exist in payload
      if (customerId && payload.ai_hairstyle_analysis?.questionnaire_results) {
        const prefs = payload.ai_hairstyle_analysis.questionnaire_results;
        const hairstyle = prefs.hairstyle_female?.[0] || prefs.hairstyle_male?.[0] || prefs.preferred_hairstyle;
        
        await supabaseAdmin.from('customer_preferences').upsert({
          customer_id: customerId,
          hairwash_preference: prefs.hair_wash_preference || undefined,
          preferred_hairstyle: typeof hairstyle === 'string' ? hairstyle : undefined,
          water_temperature: prefs.water_temp || undefined,
          scalp_massage_intensity: prefs.scalp_massage || undefined,
          conversation_level: prefs.conversation || undefined,
          updated_at: new Date().toISOString()
        }, { onConflict: 'customer_id' });
      }

      await supabaseAdmin.from('users').update({ role: 'customer' }).eq('email', formattedEmail)
      
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
