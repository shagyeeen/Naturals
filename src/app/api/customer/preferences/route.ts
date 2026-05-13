import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    if (!customerId) {
      return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('customer_preferences')
      .select('*')
      .eq('customer_id', customerId)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const { customerId, ...data } = payload

    if (!customerId) {
      return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
    }

    console.log('[API] Upserting preferences for:', customerId)

    const { data: updated, error } = await supabaseAdmin
      .from('customer_preferences')
      .upsert(
        { 
          ...data, 
          customer_id: customerId,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'customer_id' }
      )
      .select()
      .single()

    if (error) {
      console.error('[API] Preference Update Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(updated)
  } catch (err: any) {
    console.error('[API] Preference Crash:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
