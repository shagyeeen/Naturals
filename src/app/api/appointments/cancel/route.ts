import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const { appointmentId } = await request.json();

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    console.log(`[API] Attempting to cancel appointment: ${appointmentId}`);

    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId)
      .select();

    if (error) {
      console.error('[API] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.warn(`[API] No appointment found with ID: ${appointmentId}`);
      return NextResponse.json({ error: 'Appointment not found or already cancelled' }, { status: 404 });
    }

    console.log(`[API] Successfully cancelled appointment: ${appointmentId}`);
    return NextResponse.json({ success: true, data: data[0] });

  } catch (error: any) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
