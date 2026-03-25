import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'No email provided' }, { status: 400 })
  }

  try {
    const formattedEmail = email.toLowerCase()
    
    // Fetch User
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', formattedEmail)
      .order('updated_at', { ascending: false })
      .maybeSingle()

    // Fetch Customer
    const { data: customerData, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('email', formattedEmail)
      .order('updated_at', { ascending: false })
      .maybeSingle()

    return NextResponse.json({
      userData,
      customerData,
      userError: userError?.message,
      customerError: customerError?.message
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
