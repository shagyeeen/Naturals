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

    const tools = [
      {
        type: 'function',
        function: {
          name: 'book_appointment',
          description: 'Book a salon appointment for the current customer. Only use this if the customer explicitly asks to book or confirms a booking detail.',
          parameters: {
            type: 'object',
            properties: {
              serviceName: { type: 'string', description: 'Name of the service (e.g. Haircut, Facial, Hair Spa)' },
              stylistName: { type: 'string', description: 'Name of the preferred stylist' },
              date: { type: 'string', description: 'Date of appointment in YYYY-MM-DD format' },
              time: { type: 'string', description: 'Time of appointment in HH:MM format' },
              notes: { type: 'string', description: 'Any special requests or preferences' }
            },
            required: ['serviceName', 'date', 'time']
          }
        }
      }
    ];

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
            content: `You are an advanced AI Beauty & Salon Assistant for Naturals salon. The customer you are speaking to is ${userName || 'a valued guest'}. 
            You have the capability to actually BOOK appointments using the 'book_appointment' tool.
            
            AVAILABLE STYLISTS:
            - Colin Bridgerton (Senior Stylist, Men/Women)
            - Daphne Bridgerton (Styling Expert, Women)
            - Eloise Bridgerton (Skincare & Hair Specialist)
            
            TOP SERVICES:
            - Haircut (Basic) [Men]
            - Haircut (Signature) [Men]
            - Hair Cut (Basic Trim) [Women]
            - Hair Styling
            - Gold Facial
            - Brightening Facial
            - Basic Manicure / Spa Pedicure
            - Hair Spa (Basic)
            
            When a user wants to book:
            1. Ask for the service (specify if it's for Men or Women if ambiguous).
            2. Ask for the date and time.
            3. Suggest one of our stylists if they haven't picked one.
            4. Once they confirm, call the 'book_appointment' tool. 
            
            DO NOT just say you booked it; you MUST call the tool.
            Current Date: ${new Date().toISOString().split('T')[0]}.`
          },
          ...messages
        ],
        tools: tools,
        tool_choice: 'auto',
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      throw new Error(errorData.error?.message || 'Groq API error');
    }

    const data = await response.json();
    const choice = data.choices[0];
    
    if (choice.message.tool_calls) {
      const toolCall = choice.message.tool_calls[0];
      if (toolCall.function.name === 'book_appointment') {
        const args = JSON.parse(toolCall.function.arguments);
        
        // 1. Resolve Service ID and Price
        const { data: serviceData } = await supabaseAdmin
          .from('services')
          .select('id, name, price')
          .ilike('name', `%${args.serviceName}%`)
          .limit(1);

        const service = serviceData?.[0];

        // 2. Resolve Stylist ID
        let stylistId = null;
        if (args.stylistName) {
          const { data: stylistData } = await supabaseAdmin
            .from('stylists')
            .select('id, full_name')
            .ilike('full_name', `%${args.stylistName}%`)
            .limit(1);
          
          stylistId = stylistData?.[0]?.id;
        }

        // Fallback for Stylist (Required)
        if (!stylistId) {
          const { data: defaultStylist } = await supabaseAdmin
            .from('stylists')
            .select('id')
            .limit(1);
          stylistId = defaultStylist?.[0]?.id;
        }

        // 3. Create Appointment
        if (customerId && stylistId) {
          const [hours, minutes] = (args.time.includes(':') ? args.time : `${args.time}:00`).split(':');
          const endHours = (parseInt(hours) + 1).toString().padStart(2, '0');
          const endTime = `${endHours}:${minutes}:00`;
          const startTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;

          const { error: insertError } = await supabaseAdmin
            .from('appointments')
            .insert({
              customer_id: customerId,
              stylist_id: stylistId,
              service_id: service?.id,
              appointment_date: args.date,
              start_time: startTime,
              end_time: endTime,
              total_amount: service?.price || 0,
              status: 'confirmed',
              notes: args.notes || 'Booked via AI Neural Assistant'
            });

          if (insertError) {
            console.error('Booking Insert Error:', insertError);
            return NextResponse.json({ text: `Technical error during booking: ${insertError.message}` });
          }

          return NextResponse.json({ 
            text: `Perfect! I've officially booked your ${service?.name || args.serviceName} for ${args.date} at ${args.time} with our specialist. Your total is ₹${service?.price || 0}, and you can view it in your appointments tab now.` 
          });
        }
      }
    }

    return NextResponse.json({ text: choice.message.content || "Operational synchronization complete. How else may I assist you?" });
  } catch (error: any) {
    console.error('Chat API Error:', error.message);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
