import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { trends } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

    if (!apiKey) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
    }

    const trendsList = trends.map((t: any) => `- ${t.name}: +${t.growth}% growth (up: ${t.up})`).join("\n");

    const systemPrompt = `You are an expert Salon Business Consultant. 
    Analyze the provided service trends and provide actionable business insights.
    
    FORMAT:
    "These are most requested services: [List Services]
    
    REASONS:
    [Explain why they are popular based on salon trends, seasonality, or beauty industry standards]
    
    STRATEGY TO INCREASE:
    [Specific actionable advice on how to further capitalize on these trends, e.g., bundling, memberships, or stylist training]"
    
    Be professional, concise, and insightful.`;

    const userPrompt = `Here are the service trends for this month:\n${trendsList}`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Groq API error");
    }

    const data = await response.json();
    return NextResponse.json({ insight: data.choices[0].message.content });
  } catch (err: any) {
    console.error("AI Insights Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
