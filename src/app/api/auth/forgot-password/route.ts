import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'Identity not found in our registry.' }, { status: 404 });
    }

    // Use Supabase built-in password recovery (sends email via Supabase SMTP)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${new URL(req.url).origin}/reset-password`,
    });

    if (resetError) {
      console.error('Password reset error:', resetError);
      return NextResponse.json({ error: 'Failed to dispatch recovery link.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Recovery link dispatched successfully.' });
  } catch (error: unknown) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
