import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ratingFilter = searchParams.get('rating');
    const searchFilter = searchParams.get('search');

    console.log(`[Feedback] Fetching list with filters: rating=${ratingFilter}, search=${searchFilter}`);

    let query = supabaseAdmin
      .from('feedbacks')
      .select(`
        *,
        customer:customers(id, full_name, phone),
        appointment:appointments(
          id, 
          appointment_date, 
          start_time, 
          service:services(id, name)
        )
      `)
      .order('created_at', { ascending: false });

    if (ratingFilter && ratingFilter !== 'all') {
      query = query.eq('rating', parseInt(ratingFilter));
    }

    const { data, error } = await query;

    if (error) throw error;

    // Apply search filter in memory if provided
    let filteredData = data || [];
    if (searchFilter) {
      const searchLower = searchFilter.toLowerCase();
      filteredData = filteredData.filter(f => 
        (f.comment && f.comment.toLowerCase().includes(searchLower)) ||
        (f.customer?.full_name && f.customer.full_name.toLowerCase().includes(searchLower))
      );
    }

    return NextResponse.json(filteredData);
  } catch (err: any) {
    console.error("[Feedback] List API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
