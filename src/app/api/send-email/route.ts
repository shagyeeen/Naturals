import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json();
    console.log(`[Email API] Attempting to send to: ${to}`);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY?.trim()}`,
      },
      body: JSON.stringify({
        from: "Naturals Salon <onboarding@resend.dev>",
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error("[Email API] Resend Error:", data);
      return NextResponse.json({ error: data.message || "Failed to send email" }, { status: res.status });
    }

    console.log("[Email API] Success:", data.id);
    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    console.error("Email API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
