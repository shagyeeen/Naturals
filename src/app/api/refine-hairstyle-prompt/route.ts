import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userPrompt } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API Key missing" }, { status: 500 });
    }

    const systemPrompt = `You are a professional AI Prompt Engineer for a high-end salon.
    Your task is to take a Guest's simple hairstyle request and transform it into a high-fidelity Stable Diffusion / FLUX generation prompt.
    
    CRITICAL INSTRUCTION: The generated image MUST PRESERVE the Guest's original facial structure, eyes, nose, and mouth perfectly. 
    The ONLY thing that should change is the hair.
    
    User Request: "${userPrompt}"
    
    Your Refined Prompt should be:
    1. Highly detailed about the hair texture, color, and flow.
    2. Explicit about maintaining facial identity: "Maintaining the exact facial features and identity of the person in the original photo".
    3. Technical: Include terms like "4k, high resolution, professional studio lighting, sharp focus, individual hair strands".
    4. Format: Return ONLY the refined prompt string, no explanations.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a specialized prompt engineer." },
          { role: "user", content: systemPrompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    let refinedPrompt = data.choices?.[0]?.message?.content?.trim();

    if (!refinedPrompt) {
      // Fallback: Use user prompt with professional salon quality wrapper
      refinedPrompt = `(high-end professional salon portrait:1.2), maintaining exact facial features, ${userPrompt}, sharp focus, individual hair strands, studio lighting, 8k resolution`;
    }

    return NextResponse.json({ refinedPrompt });

    return NextResponse.json({ refinedPrompt });
  } catch (error: any) {
    console.error("Critical System Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
