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
          profile_photo_url: photoURL || null,
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
      if (existing) {
        const { error: err } = await supabaseAdmin.from('customers').update(payload).eq('id', existing.id);
        error = err;
      } else {
        const { error: err } = await supabaseAdmin.from('customers').insert({ ...payload, email: formattedEmail });
        error = err;
      }

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      
      await supabaseAdmin.from('users').update({ role: 'customer' }).eq('email', formattedEmail)
      
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
