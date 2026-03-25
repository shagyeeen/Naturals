import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, userName } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

    if (apiKey) {
      console.log(`[AUTH CHECK] Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)} (Len: ${apiKey.length})`);
    }

    if (!apiKey || apiKey.length < 10) {
      console.error('Groq API Key missing or invalid in environment variables.');
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', 
        messages: [
          {
            role: 'system',
            content: `You are an advanced AI Beauty & Salon Assistant for Naturals salon. The customer you are speaking to is ${userName || 'a valued guest'}. Personalize your advice based on this context. Return only the direct response. DO NOT include status messages, introductory phrases, or robotic indicators. Just speak directly to the customer.`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Raw Error:', JSON.stringify(errorData, null, 2));
      throw new Error(errorData.error?.message || 'Groq API error');
    }

    const data = await response.json();
    const botMessage = data.choices[0].message.content;

    return NextResponse.json({ text: botMessage });
  } catch (error: any) {
    console.error('Chat API Error:', error.message);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
