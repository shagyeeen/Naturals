import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'No email provided' }, { status: 400 })
    }

    const formattedEmail = email.toLowerCase()
    console.log('[API] Fetching profile for:', formattedEmail)
    
    // Fetch User
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', formattedEmail)
      .maybeSingle()

    // Fetch Customer
    const { data: customerData, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('email', formattedEmail)
      .maybeSingle()

    if (userError || customerError) {
       console.error('[API] Supabase Error:', { userError, customerError })
    }

    return NextResponse.json({
      userData: userData || null,
      customerData: customerData || null,
      userError: userError?.message || null,
      customerError: customerError?.message || null
    })
  } catch (err: any) {
    console.error('[API] Crash:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
