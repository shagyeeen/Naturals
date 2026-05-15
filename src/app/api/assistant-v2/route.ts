import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { messages, userName, customerId } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

    if (!apiKey || apiKey.length < 10) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    const { data: dbServices } = await supabaseAdmin.from('services').select('id, name, price, duration_minutes').eq('is_active', true);
    const catalogNames = (dbServices || []).map((s: any) => s.name);

    const lastMsg = (messages[messages.length - 1]?.content || "").toLowerCase();
    
    // Strict Intent Detection
    const isAdvice = /skin|hair|trend|recommend|suggest|what|how|tips|best|routine|product|color|style|look/i.test(lastMsg);
    const isBookingIntent = /book|confirm|yes|sure|slot|schedule|pick|at|on|10:|11:|12:|13:|14:|15:|16:|17:|18:|19:/i.test(lastMsg);

    const tools = [
      {
        type: 'function',
        function: {
          name: 'book_salon_appointment',
          description: 'ONLY call when user explicitly confirms a time/slot for a service.',
          parameters: {
            type: 'object',
            properties: {
              serviceName: { type: 'string' },
              date: { type: 'string', description: "YYYY-MM-DD" },
              time: { type: 'string', description: "HH:MM" }
            },
            required: ['serviceName', 'date', 'time']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_available_slots',
          description: 'Call when user asks for available times or free slots.',
          parameters: {
            type: 'object',
            properties: { "date": { "type": "string" } },
            required: ["date"]
          }
        }
      }
    ];

    const systemPrompt = `You are "Natural Shyne", a premium Beauty Expert at Naturals Salon.
    
    Today's Date: ${new Date().toISOString().split('T')[0]}
    Services: ${catalogNames.join(', ')}
    
    GUIDELINES:
    1. If the user is asking for beauty advice, skin tips, hair trends, or product recommendations, provide a DETAILED and PROFESSIONAL text response. 
    2. DO NOT include technical tags like <function> or json in your text response. 
    3. Use 'get_available_slots' ONLY if they ask for free times.
    4. Maintain a high-end, luxury salon tone.`;

    // Only provide tools if it's NOT a pure advice question
    const activeTools = (isAdvice && !isBookingIntent) ? undefined : tools;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        tools: activeTools,
        tool_choice: 'auto',
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    const choice = data.choices[0];

    if (choice.message.tool_calls) {
      const toolCall = choice.message.tool_calls[0];
      const args = JSON.parse(toolCall.function.arguments);

      if (toolCall.function.name === 'get_available_slots') {
        const date = args.date || new Date().toISOString().split('T')[0];
        const { data: appts } = await supabaseAdmin.from('appointments').select('start_time').eq('appointment_date', date).eq('status', 'confirmed');
        const busy = (appts || []).map((a: any) => a.start_time.substring(0, 5));
        const slots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
        const free = slots.filter(s => !busy.includes(s));
        
        let table = `| Time Slot | Availability |\n| :--- | :--- |\n`;
        free.forEach(s => { table += `| ${s} | Available |\n`; });
        return NextResponse.json({ text: `Certainly! For ${date}, here are our current openings:\n\n${table}\n\nWould you like to reserve one of these times?` });
      }

      if (toolCall.function.name === 'book_salon_appointment') {
        if (!customerId) return NextResponse.json({ text: "Please log in to your Beauty Passport to finalize this booking." });

        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
        const target = normalize(args.serviceName || '');
        let service = (dbServices || []).find((s: any) => normalize(s.name).includes(target) || target.includes(normalize(s.name)));

        if (!service) return NextResponse.json({ text: `I'm ready to book that for you! Just to confirm, which service from our catalog (e.g., ${catalogNames[0]}) should I schedule?` });

        const [hours, minutes] = args.time.split(':').map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0);
        const endDate = new Date(startDate.getTime() + (service.duration_minutes || 60) * 60000);
        const endTimeStr = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}:00`;

        const { data: stylists } = await supabaseAdmin.from('stylists').select('id').eq('is_active', true).limit(1);
        const stylistId = stylists?.[0]?.id;

        const { error } = await supabaseAdmin.from('appointments').insert({
          customer_id: customerId,
          service_id: service.id,
          stylist_id: stylistId || null,
          appointment_date: args.date,
          start_time: `${args.time}:00`,
          end_time: endTimeStr,
          status: 'confirmed',
          total_amount: service.price || 0
        });

        if (error) return NextResponse.json({ text: "I apologize, but that slot was just reserved. May I find you another opening?" });
        return NextResponse.json({ text: `✅ It's a date! Your **${service.name}** is confirmed for **${args.date}** at **${args.time}**. We can't wait to pamper you!` });
      }
    }

    return NextResponse.json({ text: choice.message.content || "I'm here to assist you with all your beauty needs." });
  } catch (error: any) {
    return NextResponse.json({ text: "I'm experiencing a minor technical delay. How else can I help you?" });
  }
}
