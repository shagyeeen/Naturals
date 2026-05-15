import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { image, services } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    const servicesList = services.map((s: any) => `${s.name} (${s.category})`).join(", ");

    const prompt = `You are an elite beauty and hair consultant at Naturals Salon. 
    Analyze this image and provide a structured report.
    
    IMPORTANT: You MUST start your response with this exact metadata line for our system:
    METADATA: FACE_SHAPE=[Shape], SKIN_TYPE=[Type], FACE_SERVICE=[Face Service Name], HAIR_SERVICE=[Hair Service Name]
    
    Then provide the full report:
    
    ANALYSIS 1: FACE & SKIN
    - Face Shape: Identify the face shape.
    - Face Type: Describe facial structure.
    - Skin Type: Estimate skin type.
    - Recommended Face Service: Suggest exactly ONE specific service from [${servicesList}].
    
    ANALYSIS 2: HAIR
    - Current Hairstyle: Describe the current look.
    - Hair Type/Texture: Identify hair characteristics.
    - Suited Hairstyle: Recommend the best style for their face shape.
    - Recommended Hair Service: Suggest exactly ONE specific service from [${servicesList}].
    
    Use a premium, professional tone. Refer to the user as "Guest".`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: image // This expects data:image/jpeg;base64,...
                }
              }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq Vision Error:', errorData);
      throw new Error(errorData.error?.message || 'Groq Vision API error');
    }

    const data = await response.json();
    return NextResponse.json({ text: data.choices[0].message.content });
  } catch (error: any) {
    console.error('Analyze Image Error:', error.message);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
