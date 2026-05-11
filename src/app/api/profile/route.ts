import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'No email provided' }, { status: 400 })
    }

    const formattedEmail = email.trim().toLowerCase()
    console.log('[API] Fetching profile for:', formattedEmail)
    
    // Fetch User with case-insensitive check and extra logging
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .ilike('email', formattedEmail)
      .maybeSingle()

    // Fetch Customer with case-insensitive check
    const { data: customerData, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('*')
      .ilike('email', formattedEmail)
      .maybeSingle()

    if (userError || customerError) {
       console.error('[API] Supabase Error Detail:', { 
         userError, 
         customerError,
         email: formattedEmail,
         timestamp: new Date().toISOString()
       })
    }

    console.log('[API] Results for:', formattedEmail, { 
      foundUser: !!userData, 
      foundCustomer: !!customerData,
      role: userData?.role
    })

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
