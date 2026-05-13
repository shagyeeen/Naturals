import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    
    const now = new Date();
    // Use local time for the comparison as the appointments are booked in local salon time
    // However, for consistency, we'll use the provided local time if possible or just the server time
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0];

    console.log(`[Maintenance] Checking appointments for ${userId}. Date: ${today}, Time: ${currentTime}`);

    // 1. Mark appointments from past dates as completed
    const { error: pastError } = await supabaseAdmin
      .from('appointments')
      .update({ status: 'completed' })
      .eq('customer_id', userId)
      .in('status', ['confirmed', 'pending'])
      .lt('appointment_date', today);

    if (pastError) console.error("[Maintenance] Past dates error:", pastError);

    // 2. Mark appointments from today with past end times as completed
    const { error: todayError } = await supabaseAdmin
      .from('appointments')
      .update({ status: 'completed' })
      .eq('customer_id', userId)
      .in('status', ['confirmed', 'pending'])
      .eq('appointment_date', today)
      .lt('end_time', currentTime);

    if (todayError) console.error("[Maintenance] Today past time error:", todayError);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Maintenance] API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
