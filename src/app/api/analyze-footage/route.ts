import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    // Prepare the prompt
    const prompt = `You are a specialized AI monitoring system for Naturals Salon. 
    Analyze this CCTV footage screenshot carefully.
    - Explain what you see in the frame (staff, customers, activities).
    - If the image is very dark or black, conclude that it is night time and the salon is likely closed.
    - Note that this is CCTV footage being analyzed for operational standards (SOP).
    - Be professional and concise.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: image, // base64 encoded image
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API Error:", data);
      return NextResponse.json({ error: data.error?.message || "AI Analysis failed" }, { status: response.status });
    }

    return NextResponse.json({ analysis: data.choices[0].message.content });
  } catch (error: any) {
    console.error("Vision Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
