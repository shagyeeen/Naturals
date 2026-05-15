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
    const catalogNames = dbServices?.map(s => s.name) || [];

    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
    const isBooking = /book|confirm|yes|sure|slot|schedule|pick|at|on|10:00|11:00|12:00|13:00|14:00|15:00|16:00|17:00|18:00|19:00/i.test(lastMsg);

    const tools = [
      {
        type: 'function',
        function: {
          name: 'book_salon_appointment',
          description: 'ONLY call when user picks a slot. Requires exact serviceName, date (YYYY-MM-DD), and time (HH:MM).',
          parameters: {
            type: 'object',
            properties: {
              serviceName: { type: 'string' },
              date: { type: 'string', description: "Format: YYYY-MM-DD" },
              time: { type: 'string', description: "Format: HH:MM" }
            },
            required: ['serviceName', 'date', 'time']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_available_slots',
          description: 'List available times for a date as a table.',
          parameters: {
            type: 'object',
            properties: { "date": { "type": "string" } },
            required: ["date"]
          }
        }
      }
    ];

    const systemPrompt = `You are "Natural Shyne", the salon expert.
    
    CRITICAL:
    1. To book, you MUST provide date as YYYY-MM-DD and time as HH:MM.
    2. Today is ${new Date().toISOString().split('T')[0]}.
    3. Always confirm the service name from this list: ${catalogNames.join(', ')}.
    4. If booking fails, check if the slot is still available.`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        tools: isBooking || lastMsg.includes('slot') ? tools : undefined,
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
        const busy = appts?.map(a => a.start_time.substring(0, 5)) || [];
        const slots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
        const free = slots.filter(s => !busy.includes(s));
        
        let table = `| Time Slot | Availability |\n| :--- | :--- |\n`;
        free.forEach(s => { table += `| ${s} | Available |\n`; });
        return NextResponse.json({ text: `On ${date}, we have the following slots available:\n\n${table}\n\nWhich one would you like to pick?` });
      }

      if (toolCall.function.name === 'book_salon_appointment') {
        if (!customerId) return NextResponse.json({ text: "Please sign in to book your appointment!" });

        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
        const target = normalize(args.serviceName || '');
        let service = dbServices?.find(s => normalize(s.name).includes(target) || target.includes(normalize(s.name)));

        if (!service) return NextResponse.json({ text: `I need to know which service you'd like (e.g., ${catalogNames[0]}).` });

        // Calculate end_time (Required by DB)
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

        if (error) {
            console.error('Insert Error Details:', error);
            return NextResponse.json({ text: `I'm having trouble securing that slot. Error: ${error.message}` });
        }
        return NextResponse.json({ text: `✅ All set! I've booked your **${service.name}** for **${args.date}** at **${args.time}**.` });
      }
    }

    return NextResponse.json({ text: choice.message.content || "How can I help you today?" });
  } catch (error: any) {
    return NextResponse.json({ text: "Technical error. Try again!" });
  }
}
