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

    console.log(`[Maintenance] Running maintenance. Target User: ${userId || 'GLOBAL'}. Date: ${today}, Time: ${currentTime}`);
    
    // Create base queries
    let pastQuery = supabaseAdmin
      .from('appointments')
      .update({ status: 'completed' })
      .in('status', ['confirmed', 'pending'])
      .lt('appointment_date', today);
      
    let todayQuery = supabaseAdmin
      .from('appointments')
      .update({ status: 'completed' })
      .in('status', ['confirmed', 'pending'])
      .eq('appointment_date', today)
      .lt('end_time', currentTime);

    // Apply user filter only if userId is provided
    if (userId) {
      pastQuery = pastQuery.eq('customer_id', userId);
      todayQuery = todayQuery.eq('customer_id', userId);
    }

    const [{ error: pastError }, { error: todayError }] = await Promise.all([
      pastQuery,
      todayQuery
    ]);

    if (pastError) console.error("[Maintenance] Past dates error:", pastError);
    if (todayError) console.error("[Maintenance] Today past time error:", todayError);

    return NextResponse.json({ success: true, mode: userId ? 'user' : 'global' });
  } catch (err: any) {
    console.error("[Maintenance] API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
