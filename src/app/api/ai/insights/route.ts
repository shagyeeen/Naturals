import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { trends, sentiment, quality, ratings, reviews, instagram } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

    if (!apiKey) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (trends) {
      const trendsList = trends.map((t: any) => `- ${t.name}: +${t.growth}% growth (up: ${t.up})`).join("\n");
      systemPrompt = `You are an expert Salon Business Consultant. 
      Analyze the provided service trends and provide actionable business insights.
      Do not use markdown bolding (**).
      
      FORMAT:
      "Service Trend Analysis: [Summary]
      
      REASONS:
      [Explain why they are popular based on salon trends, prices, seasonality, or beauty industry standards]
      
      STRATEGY TO INCREASE:
      [Specific actionable advice on how to further capitalize on these trends]"`;
      userPrompt = `Here are the service trends for this month:\n${trendsList}`;
    } else if (sentiment) {
      const { positive, neutral, negative } = sentiment;
      systemPrompt = `You are an expert Customer Experience Consultant.
      Analyze the customer sentiment data and provide insights on satisfaction.
      Do not use markdown bolding (**).
      
      FORMAT:
      "Sentiment Analysis: [Summary]
      
      KEY REASONS:
      [Identify potential issues or successes based on the breakdown]
      
      STRATEGY TO IMPROVE:
      [Actionable advice on how to improve customer feelings]"`;
      userPrompt = `Customer sentiment breakdown:\n- Positive: ${positive}%\n- Neutral: ${neutral}%\n- Negative: ${negative}%`;
    } else if (quality) {
      const qualityList = Object.entries(quality).map(([k, v]) => `- ${k}: ${v}/5`).join("\n");
      systemPrompt = `You are a Salon Operations Auditor.
      Analyze the quality scores across different dimensions.
      Do not use markdown bolding (**).
      
      FORMAT:
      "Operational Excellence Report: [Summary]
      
      CRITICAL GAPS:
      [Identify areas needing immediate attention based on low scores]
      
      IMPROVEMENT PLAN:
      [Actionable steps to raise quality standards across all categories]"`;
      userPrompt = `Service quality scores:\n${qualityList}`;
    } else if (ratings) {
      const ratingsList = Object.entries(ratings).map(([k, v]) => `- ${k} Star: ${v} reviews`).join("\n");
      systemPrompt = `You are a Reputation Management Expert.
      Analyze the rating distribution and provide brand strategy.
      Do not use markdown bolding (**).
      
      FORMAT:
      "Reputation Scorecard: [Summary]
      
      RISK ASSESSMENT:
      [Identify risks from low-star ratings or missed opportunities]
      
      REPUTATION STRATEGY:
      [How to increase 5-star reviews and manage lower ratings]"`;
      userPrompt = `Rating distribution:\n${ratingsList}`;
    } else if (reviews) {
      const reviewText = reviews.map((r: any) => `"${r.comment}" (${r.rating} stars)`).join("\n");
      systemPrompt = `You are a Customer Insight Analyst.
      Analyze these raw customer comments to find deep patterns.
      Do not use markdown bolding (**).
      
      FORMAT:
      "Voice of Customer Report: [Summary of themes]
      
      RECURRING PAIN POINTS:
      [Common complaints found in the text]
      
      WINNING STRATEGIES:
      [What customers love and how to double down on it]"`;
      userPrompt = `Recent customer reviews:\n${reviewText}`;
    } else if (instagram) {
      const { followers, posts, engagement } = instagram;
      systemPrompt = `You are a Social Media Marketing Strategist for beauty brands.
      Analyze these Instagram metrics and provide a growth strategy.
      Do not use markdown bolding (**).
      
      FORMAT:
      "Digital Presence Audit: [Summary]
      
      CONTENT OPPORTUNITIES:
      [What to post to increase engagement based on current metrics]
      
      GROWTH BLUEPRINT:
      [How to increase followers and conversion from social media to bookings]"`;
      userPrompt = `Instagram stats:\n- Followers: ${followers}\n- Posts: ${posts}\n- Engagement Rate: ${engagement}%`;
    }

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
    const insight = data.choices[0].message.content.replace(/\*\*/g, '');
    return NextResponse.json({ insight });
  } catch (err: any) {
    console.error("AI Insights Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
