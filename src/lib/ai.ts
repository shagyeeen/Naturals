const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

interface HairstyleAnalysis {
  faceShape: string
  hairType: string
  hairCondition: string
  recommendedStyles: string[]
  colorSuggestions: string[]
  stylingTips: string[]
}

export async function analyzeHairstyle(imageBase64: string): Promise<HairstyleAnalysis> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are an expert hairstylist AI. Analyze the person's hair in this image and provide a detailed hairstyle analysis. Return ONLY valid JSON with this exact structure:
                {
                  "faceShape": "oval/square/round/heart/oblong/diamond",
                  "hairType": "straight/wavy/curly/coily/thick/thin",
                  "hairCondition": "healthy/damaged/dry/oily/normal",
                  "recommendedStyles": ["style1", "style2", "style3"],
                  "colorSuggestions": ["color1", "color2", "color3"],
                  "stylingTips": ["tip1", "tip2", "tip3"]
                }`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || '{}'
    
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Failed to parse AI response')
  } catch (error) {
    console.error('Hairstyle analysis error:', error)
    return {
      faceShape: 'oval',
      hairType: 'wavy',
      hairCondition: 'healthy',
      recommendedStyles: ['layered', 'waves', 'natural'],
      colorSuggestions: ['brown', 'black', 'highlights'],
      stylingTips: ['use heat protectant', 'trim regularly', 'moisturize']
    }
  }
}

export async function getHairstyleRecommendations(
  faceShape: string,
  hairType: string,
  occasion: string = 'casual'
): Promise<string[]> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: `Based on a ${faceShape} face shape with ${hairType} hair, suggest 5 hairstyles suitable for ${occasion} occasions. Return ONLY a JSON array of style names.`
          }
        ],
        temperature: 0.5,
        max_tokens: 256
      })
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || '[]'
    
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return ['classic', 'modern', 'elegant']
  } catch (error) {
    console.error('Recommendation error:', error)
    return ['classic', 'modern', 'elegant']
  }
}
