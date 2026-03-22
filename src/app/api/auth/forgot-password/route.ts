import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Initialize Supabase with Service Role Key to generate admin links
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (userError || !user) {
      // For security, don't reveal if user exists. 
      // But in this branded app, we might want to be helpful.
      return NextResponse.json({ error: 'Identity not found in our registry.' }, { status: 404 });
    }

    // 2. Generate a recovery link
    const { data, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${new URL(req.url).origin}/reset-password`,
      }
    });

    if (linkError || !data.properties?.action_link) {
      console.error('Link generation error:', linkError);
      return NextResponse.json({ error: 'Failed to generate secure recovery link.' }, { status: 500 });
    }

    // 3. Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Naturals AI <onboarding@resend.dev>',
      to: [email],
      subject: 'Secure Access Recovery | Naturals AI',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px;">
          <h1 style="color: #8E3E96; font-style: italic; font-weight: 900;">Identity Recovery</h1>
          <p style="color: #4B1D3F; font-size: 14px; line-height: 1.6;">A request has been initiated to reset the access key for your <strong>Naturals AI Beauty Passport</strong>.</p>
          <div style="margin: 30px 0;">
            <a href="${data.properties.action_link}" style="background: #8E3E96; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Authorize Reset</a>
          </div>
          <p style="color: #999; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">If you did not request this, please ignore this message. This link will expire in 24 hours.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="text-align: center; color: #ccc; font-size: 9px; font-weight: bold; letter-spacing: 3px;">PRECISION BEAUTY INTELLIGENCE</p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Email send error:', emailError);
      return NextResponse.json({ error: 'Communication failure: ' + emailError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Recovery link dispatched successfully.' });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
