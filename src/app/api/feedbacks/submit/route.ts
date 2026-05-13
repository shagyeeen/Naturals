import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { appointmentId, customerId, rating, comment, serviceRating, staffRating, cleanlinessRating, pricingRating } = await req.json();

    if (!appointmentId || !customerId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log(`[Feedback] Submitting for appointment ${appointmentId}, customer ${customerId}`);

    // 1. Save to dedicated feedbacks table
    const { error: feedbackError } = await supabaseAdmin
      .from('feedbacks')
      .insert({
        appointment_id: appointmentId,
        customer_id: customerId,
        rating,
        comment,
        service_rating: serviceRating || 5,
        staff_behavior_rating: staffRating || 5,
        cleanliness_rating: cleanlinessRating || 5,
        pricing_rating: pricingRating || 5
      });

    if (feedbackError) throw feedbackError;

    // 2. Sync to appointments table for backward compatibility
    const { error: apptError } = await supabaseAdmin
      .from('appointments')
      .update({ rating, feedback: comment })
      .eq('id', appointmentId);

    if (apptError) {
      console.warn("[Feedback] Appointment sync failed:", apptError);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Feedback] API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
