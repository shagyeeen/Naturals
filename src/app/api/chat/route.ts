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

    // 1. Fetch Preferences if customerId exists
    let preferencesContext = "";
    if (customerId) {
      const { data: prefData } = await supabaseAdmin
        .from('customer_preferences')
        .select('*')
        .eq('customer_id', customerId)
        .single();

      if (prefData) {
        preferencesContext = `
        CUSTOMER PREFERENCES:
        - Hairwash Timing: ${prefData.hairwash_preference}
        - Preferred Hairstyle: ${prefData.preferred_hairstyle || 'Not specified'}
        - Water Temperature: ${prefData.water_temperature}
        - Massage Intensity: ${prefData.scalp_massage_intensity}
        - Conversation Level: ${prefData.conversation_level}
        - Special Instructions: ${prefData.special_instructions || 'None'}
        `;
      }
    }

    const tools = [
      {
        type: 'function',
        function: {
          name: 'book_appointment',
          description: 'Book a salon appointment for the current customer.',
          parameters: {
            type: 'object',
            properties: {
              serviceName: { type: 'string', description: 'Name of the service' },
              stylistName: { type: 'string', description: 'Name of the preferred stylist' },
              date: { type: 'string', description: 'Date (YYYY-MM-DD)' },
              time: { type: 'string', description: 'Time (HH:MM)' },
              notes: { type: 'string', description: 'Special requests' }
            },
            required: ['serviceName', 'date', 'time']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'search_customer',
          description: 'Search for a customer by name to get their ID and details. Useful for stylists.',
          parameters: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'The name of the customer to search for' }
            },
            required: ['name']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_customer_appointments',
          description: "Get a list of appointments for a specific customer ID. Useful to see what they've booked today.",
          parameters: {
            type: 'object',
            properties: {
              customerId: { type: 'string', description: 'The UUID of the customer' }
            },
            required: ['customerId']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_stylist_appointments',
          description: "Get the appointment schedule for a specific stylist by name. Can be filtered by date.",
          parameters: {
            type: 'object',
            properties: {
              stylistName: { type: 'string', description: 'The name of the stylist' },
              date: { type: 'string', description: 'Optional date (YYYY-MM-DD). If omitted, shows upcoming appointments.' }
            },
            required: ['stylistName']
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
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an advanced AI Beauty & Salon Assistant for Naturals salon. 
            ${preferencesContext}

            USER CONTEXT:
            - Current User: ${userName || 'a valued guest'}
            - STYLIST IDENTITIES: If the user is 'Colin', 'Daphne', or 'Eloise', THEY ARE STYLISTS.
            
            CAPABILITIES:
            1. BOOK appointments using 'book_appointment'.
            2. SEARCH for customers using 'search_customer' (especially for Stylists).
            3. GET schedules using 'get_stylist_appointments' or 'get_customer_appointments'.
            
            ROUTING LOGIC:
            - If a STYLIST (Colin, Daphne, Eloise) asks "What are my appointments?" or "Show my schedule", ALWAYS use 'get_stylist_appointments' with their name.
            - If they ask for "today only", pass the current date (${new Date().toISOString().split('T')[0]}) to the 'date' parameter.
            - DO NOT use 'get_customer_appointments' for Stylists checking their own day.
            
            PRESENTATION:
            - Always present appointment schedules as a clean Markdown TABLE.
            - TABLE COLUMNS: Time | Service | Customer | Date
            
            CRITICAL RULES:
            1. NEVER hallucinate or assume booking details (Service, Date, Time, Stylist).
            2. If any information is missing, DO NOT call the 'book_appointment' tool. Instead, ask the user for the missing details.
            3. REQUIRED DETAILS: 'serviceName', 'date', 'time'.
            4. If a Stylist asks about a customer's preferences and they aren't listed above, use 'search_customer' to find them.
            5. ONLY call the booking tool after the user has explicitly confirmed all three required details.
            
            AVAILABLE STYLISTS:
            - Colin (Senior Stylist, Men/Women)
            - Daphne (Styling Expert, Women)
            - Eloise (Skincare & Hair Specialist)
            
            TOP SERVICES:
            - Haircut (Basic) [Men]
            - Haircut (Signature) [Men]
            - Hair Cut (Basic Trim) [Women]
            - Hair Styling
            - Gold Facial
            - Brightening Facial
            - Basic Manicure / Spa Pedicure
            - Hair Spa (Basic)
            
            Current Date: ${new Date().toISOString().split('T')[0]}.`
          },
          ...messages
        ],
        tools: tools,
        tool_choice: 'auto',
        temperature: 0.1,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);

      if (errorData.error?.message?.includes('tool call validation failed') || errorData.error?.message?.includes('Failed to call a function') || errorData.error?.failed_generation) {
        return NextResponse.json({
          text: "I'm having a little trouble understanding or booking that right now. Could you please provide your details a bit more clearly, or rephrase your request?"
        });
      }
      throw new Error(errorData.error?.message || 'Groq API error');
    }

    const data = await response.json();
    const choice = data.choices[0];

    if (choice.message.tool_calls) {
      const toolCall = choice.message.tool_calls[0];
      if (toolCall.function.name === 'book_appointment') {
        const args = JSON.parse(toolCall.function.arguments);

        if (!args.serviceName || !args.date || !args.time || args.date === 'null' || args.time === 'null') {
          return NextResponse.json({
            text: "I'm ready to book for you! I just need to know the specific service, date, and time you'd like."
          });
        }

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
      } else if (toolCall.function.name === 'search_customer') {
        const args = JSON.parse(toolCall.function.arguments);
        const { data: customerData } = await supabaseAdmin
          .from('customers')
          .select('id, full_name, email, phone')
          .ilike('full_name', `%${args.name}%`)
          .limit(1);

        if (!customerData || customerData.length === 0) {
          return NextResponse.json({ text: `I couldn't find a customer named "${args.name}". Could you double-check the spelling?` });
        }

        const customer = customerData[0];

        // Fetch Preferences
        const { data: prefData } = await supabaseAdmin
          .from('customer_preferences')
          .select('*')
          .eq('customer_id', customer.id)
          .single();

        let prefText = "";
        if (prefData) {
          prefText = `
          Preferences for ${customer.full_name}:
          - Hairwash: ${prefData.hairwash_preference}
          - Style: ${prefData.preferred_hairstyle || 'Not specified'}
          - Water: ${prefData.water_temperature}
          - Massage: ${prefData.scalp_massage_intensity}
          - Chat Level: ${prefData.conversation_level}
          - Instructions: ${prefData.special_instructions || 'None'}
          `;
        } else {
          prefText = `I found ${customer.full_name}, but they don't have any specific preferences recorded yet.`;
        }

        return NextResponse.json({ text: `I've retrieved the records for ${customer.full_name}. ${prefText}` });
      } else if (toolCall.function.name === 'get_customer_appointments') {
        const args = JSON.parse(toolCall.function.arguments);
        const { data: appts } = await supabaseAdmin
          .from('appointments')
          .select('*, service:services(name, price)')
          .eq('customer_id', args.customerId)
          .order('appointment_date', { ascending: false })
          .limit(5);

        if (!appts || appts.length === 0) {
          return NextResponse.json({ text: "I couldn't find any recent or upcoming appointments for this customer." });
        }

        const apptList = appts.map(a => `- ${a.service?.name} on ${a.appointment_date} at ${a.start_time.slice(0, 5)} (Status: ${a.status})`).join('\n');
        return NextResponse.json({ text: `Here are the appointments I found for this customer:\n${apptList}` });
      } else if (toolCall.function.name === 'get_stylist_appointments') {
        const args = JSON.parse(toolCall.function.arguments);

        // 1. Find Stylist ID
        const { data: stylistData } = await supabaseAdmin
          .from('stylists')
          .select('id, full_name')
          .ilike('full_name', `%${args.stylistName}%`)
          .limit(1);

        if (!stylistData || stylistData.length === 0) {
          return NextResponse.json({ text: `I couldn't find a stylist named "${args.stylistName}".` });
        }

        const stylist = stylistData[0];

        // 2. Fetch Appointments for Stylist
        let query = supabaseAdmin
          .from('appointments')
          .select('*, customer:customers(full_name), service:services(name)')
          .eq('stylist_id', stylist.id);
        
        if (args.date) {
          query = query.eq('appointment_date', args.date);
        } else {
          query = query.gte('appointment_date', new Date().toISOString().split('T')[0]);
        }

        const { data: appts } = await query
          .order('appointment_date', { ascending: true })
          .order('start_time', { ascending: true })
          .limit(20);

        if (!appts || appts.length === 0) {
          const dateStr = args.date ? ` on ${args.date}` : "";
          return NextResponse.json({ text: `I couldn't find any appointments for ${stylist.full_name}${dateStr}.` });
        }

        const tableHeader = "| Time | Service | Customer | Date |\n| :--- | :--- | :--- | :--- |\n";
        const tableRows = appts.map(a => 
          `| ${a.start_time.slice(0, 5)} | ${a.service?.name || 'Styling Service'} | ${a.customer?.full_name || 'Guest'} | ${a.appointment_date} |`
        ).join('\n');
        
        return NextResponse.json({ text: `### Schedule for ${stylist.full_name}\n\n${tableHeader}${tableRows}` });
      }
    }

    return NextResponse.json({ text: choice.message.content || "Operational synchronization complete. How else may I assist you?" });
  } catch (error: any) {
    console.error('Chat API Error:', error.message);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
