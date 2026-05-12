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

    // 1. Resolve Role
    let userRole = 'GUEST';
    if (customerId) {
      userRole = 'CUSTOMER';
    }

    // Check for higher roles based on full_name
    if (userName) {
      const { data: foData } = await supabaseAdmin.from('franchise_owners').select('id').ilike('full_name', userName).limit(1);
      const { data: adminData } = await supabaseAdmin.from('admins').select('id').ilike('full_name', userName).limit(1);
      const { data: stylistData } = await supabaseAdmin.from('stylists').select('id').ilike('full_name', userName).limit(1);

      if (foData && foData.length > 0) userRole = 'FRANCHISE_OWNER';
      else if (adminData && adminData.length > 0) userRole = 'ADMIN';
      else if (stylistData && stylistData.length > 0) userRole = 'STYLIST';
    }

    // 2. Fetch Preferences if customerId exists
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

    // 3. Fetch Data for Prompt
    const { data: dbServices } = await supabaseAdmin
      .from('services')
      .select('name, price, duration_minutes, category')
      .eq('is_active', true)
      .order('category');

    const servicesList = dbServices?.map(s => 
      `- ${s.name} (${s.category}) | Price: ₹${s.price} | Duration: ${s.duration_minutes} min`
    ).join('\n') || "No services currently available.";

    const { data: dbStylists } = await supabaseAdmin
      .from('stylists')
      .select('full_name');

    const stylistsList = dbStylists?.map(s => `- ${s.full_name}`).join('\n') || "Our specialist team.";

    // 4. Define Tools
    const tools = [
      {
        type: 'function',
        function: {
          name: 'book_appointment',
          description: 'Book a salon appointment. ONLY call when user says "book it" or similar. You MUST ask for date, time, and stylist preference separately before calling this. Set explicit_date=false if user did NOT say the date, explicit_time=false if user did NOT say the time, explicit_stylist=false if user did NOT mention a stylist.',
          parameters: {
            type: 'object',
            properties: {
              customerId: { type: 'string', description: 'The UUID of the customer. Use the authenticated session ID, not a name.' },
              serviceName: { type: 'string', description: 'Name of the service' },
              stylistName: { type: 'string', description: 'Name of the preferred stylist — only if user mentioned one' },
              date: { type: 'string', description: 'Date (YYYY-MM-DD) — only if user explicitly stated it' },
              time: { type: 'string', description: 'Time (HH:MM) — only if user explicitly stated it' },
              explicit_date: { type: 'boolean', description: 'true ONLY if the user explicitly said the date in this conversation' },
              explicit_time: { type: 'boolean', description: 'true ONLY if the user explicitly said the time in this conversation' },
              explicit_stylist: { type: 'boolean', description: 'true ONLY if the user explicitly mentioned a stylist name' },
              notes: { type: 'string' }
            },
            required: ['serviceName', 'explicit_date', 'explicit_time', 'explicit_stylist']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'cancel_appointment',
          description: 'Cancel an existing appointment. ALWAYS ask "Are you sure?" and get confirmation before calling this.',
          parameters: {
            type: 'object',
            properties: {
              appointmentId: { type: 'string', description: 'The ID of the appointment to cancel' },
              reason: { type: 'string', description: 'Required for Admin/Owner, optional for Customer' }
            },
            required: ['appointmentId']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'reschedule_appointment',
          description: 'Change the date or time of an existing appointment.',
          parameters: {
            type: 'object',
            properties: {
              appointmentId: { type: 'string' },
              newDate: { type: 'string' },
              newTime: { type: 'string' }
            },
            required: ['appointmentId', 'newDate', 'newTime']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'search_customer',
          description: 'Search for a customer by name.',
          parameters: {
            type: 'object',
            properties: { name: { type: 'string' } },
            required: ['name']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'create_customer',
          description: 'Create a new customer profile for walk-ins (Admin only).',
          parameters: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              phone: { type: 'string' },
              email: { type: 'string' }
            },
            required: ['name', 'phone']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_customer_appointments',
          description: "Get appointments for a specific customer.",
          parameters: {
            type: 'object',
            properties: { customerId: { type: 'string' } },
            required: ['customerId']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_stylist_appointments',
          description: "Get schedule for a stylist.",
          parameters: {
            type: 'object',
            properties: {
              stylistName: { type: 'string' },
              date: { type: 'string' }
            },
            required: ['stylistName']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'update_preferences',
          description: "Update a customer's preferences.",
          parameters: {
            type: 'object',
            properties: {
              targetCustomerId: { type: 'string', description: 'ID of the customer to update' },
              hairwash_preference: { type: 'string', enum: ['Before SPA', 'After SPA', 'Both', 'None'] },
              water_temperature: { type: 'string', enum: ['Cold', 'Lukewarm', 'Warm', 'Hot'] },
              scalp_massage_intensity: { type: 'string', enum: ['Light', 'Medium', 'Strong', 'None'] },
              conversation_level: { type: 'string', enum: ['Quiet Professional', 'Friendly Chat', 'No Preference'] },
              preferred_hairstyle: { type: 'string' },
              special_instructions: { type: 'string' }
            }
          }
        }
      }
    ];    // 5. System Prompt Injection
    const systemPrompt = `You are the official AI assistant for Naturals Salon. Be warm, concise, and helpful.

ROLE: ${userRole} | USER: ${userName || 'Unknown'} | TODAY: ${new Date().toISOString().split('T')[0]}

STRICT TOOL USAGE RULES:
- get_stylist_appointments → ONLY call when user explicitly asks to see a stylist's schedule or timetable.
- get_customer_appointments → ONLY call when user asks to see THEIR OWN appointments.
- book_appointment → ONLY call after user confirms a specific service, date AND time.
- cancel_appointment → ONLY call after user explicitly confirms cancellation with "yes" or "confirm".
- search_customer → ONLY for STYLIST/ADMIN roles searching by name.
- update_preferences → ONLY when user explicitly wants to change a preference.
- NEVER call any tool for beauty advice, comparisons, or general questions. Answer those from your knowledge.
- NEVER guess dates or times. If not provided, ASK.
- NEVER show JSON, UUIDs, or Internal Reference blocks.

CUSTOMER RULES: CUSTOMER role can only access their own data. NEVER show other customers' names.

SERVICE CATALOG:
${servicesList}

STYLISTS:
${stylistsList}
${preferencesContext}`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
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
      throw new Error(errorData.error?.message || 'Groq API error');
    }

    const data = await response.json();
    const choice = data.choices[0];

    if (choice.message.tool_calls) {
      const toolCall = choice.message.tool_calls[0];
      const args = JSON.parse(toolCall.function.arguments);

      if (toolCall.function.name === 'book_appointment') {
        // Use authenticated customerId first, only fall back to args if it's a real UUID
        const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const targetId = UUID_REGEX.test(args.customerId || '') ? args.customerId : customerId;
        if (!targetId || !UUID_REGEX.test(targetId)) {
          return NextResponse.json({ text: "I couldn't identify your customer profile. Please make sure you're logged in and try again." });
        }

        // Block if AI didn't get date/time/stylist explicitly from the user
        const missing: string[] = [];
        if (!args.explicit_date || !args.date || args.date === 'null') missing.push('**date** (e.g. "26th May")');
        if (!args.explicit_time || !args.time || args.time === 'null') missing.push('**preferred time** (e.g. "3 PM")');
        if (!args.explicit_stylist) missing.push('**stylist preference** — or say "any available" and we\'ll assign the next free one');
        if (missing.length > 0) {
          return NextResponse.json({ text: `Before I book that, I just need a few details:\n${missing.map(m => `• ${m}`).join('\n')}` });
        }

        // Parse and validate working hours (10:00 AM - 7:00 PM)
        const [hours, minutes] = (args.time.includes(':') ? args.time : `${args.time}:00`).split(':');
        const startHour = parseInt(hours);
        if (startHour < 10 || startHour >= 19) {
          return NextResponse.json({ text: `Our salon is open from **10:00 AM to 7:00 PM**. Please choose a time within those hours.` });
        }

        const startTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;

        const { data: service, error: serviceError } = await supabaseAdmin.from('services').select('id, name, price, duration_minutes').ilike('name', `%${args.serviceName.trim()}%`).eq('is_active', true).limit(1).single();
        if (!service || serviceError) return NextResponse.json({ text: `Service "${args.serviceName}" not found in our catalog.` });

        const duration = service.duration_minutes || 60;
        const startDate = new Date(`2000-01-01T${startTime}`);
        const endDate = new Date(startDate.getTime() + duration * 60000);
        const endTime = endDate.toTimeString().split(' ')[0];

        // Validate that the appointment ends by 7:00 PM (19:00)
        const closingTime = new Date(`2000-01-01T19:00:00`);
        if (endDate > closingTime) {
          const latestStart = new Date(closingTime.getTime() - duration * 60000);
          const latestHr = latestStart.getHours().toString().padStart(2, '0');
          const latestMin = latestStart.getMinutes().toString().padStart(2, '0');
          const latestAmPm = latestStart.getHours() >= 12 ? 'PM' : 'AM';
          const latestHr12 = latestStart.getHours() % 12 || 12;
          return NextResponse.json({ text: `**${service.name}** takes ${duration} minutes, so booking at ${args.time} would run past our 7:00 PM closing time. The latest you can book this service is **${latestHr12}:${latestMin} ${latestAmPm}**. Would you like that slot instead?` });
        }

        // Build stylist priority: requested stylist first, then all active stylists
        const { data: allStylists } = await supabaseAdmin.from('stylists').select('id, full_name').eq('is_active', true);
        const requestedName = (args.stylistName || '').toLowerCase();
        const prioritized = [
          ...(allStylists?.filter(s => s.full_name.toLowerCase().includes(requestedName)) || []),
          ...(allStylists?.filter(s => !s.full_name.toLowerCase().includes(requestedName)) || [])
        ];

        // Find first available stylist (no overlapping confirmed appointment)
        let chosenStylist = null;
        for (const stylist of prioritized) {
          const { data: overlap } = await supabaseAdmin.from('appointments')
            .select('id')
            .eq('stylist_id', stylist.id)
            .eq('appointment_date', args.date)
            .eq('status', 'confirmed')
            .filter('start_time', 'lt', endTime)
            .filter('end_time', 'gt', startTime);

          if (!overlap || overlap.length === 0) {
            chosenStylist = stylist;
            break;
          }
        }

        if (!chosenStylist) {
          return NextResponse.json({ text: `All our stylists are fully booked on **${args.date} at ${args.time}**. Could you try a different time or date?` });
        }

        const wasPreferred = chosenStylist.full_name.toLowerCase().includes(requestedName);
        const stylistNote = wasPreferred ? '' : ` (Your preferred stylist was unavailable, so we've assigned **${chosenStylist.full_name}** who is free.)`;

        const { error } = await supabaseAdmin.from('appointments').insert({
          customer_id: targetId,
          service_id: service.id,
          stylist_id: chosenStylist.id,
          appointment_date: args.date,
          start_time: startTime,
          end_time: endTime,
          total_amount: service.price || 0,
          status: 'confirmed',
          notes: args.notes || 'Booked via AI Assistant'
        });

        if (error) return NextResponse.json({ text: `Booking failed: ${error.message}` });
        return NextResponse.json({ text: `✅ Booked **${service.name}** on **${args.date} at ${args.time}** with **${chosenStylist.full_name}**.${stylistNote}` });



      } else if (toolCall.function.name === 'cancel_appointment') {
        const { error } = await supabaseAdmin.from('appointments').update({ 
          status: 'cancelled',
          notes: `Cancelled by ${userName || userRole}. Reason: ${args.reason || 'No reason provided'}`
        }).eq('id', args.appointmentId);

        if (error) return NextResponse.json({ text: `Cancellation failed: ${error.message}` });
        return NextResponse.json({ text: `The appointment has been cancelled by ${userName || userRole}.` });

      } else if (toolCall.function.name === 'reschedule_appointment') {
        const { error } = await supabaseAdmin.from('appointments').update({
          appointment_date: args.newDate,
          start_time: args.newTime
        }).eq('id', args.appointmentId);

        if (error) return NextResponse.json({ text: `Rescheduling failed: ${error.message}` });
        return NextResponse.json({ text: `Success! Rescheduled to ${args.newDate} at ${args.newTime}.` });

      } else if (toolCall.function.name === 'search_customer') {
        if (userRole === 'CUSTOMER' || userRole === 'GUEST') return NextResponse.json({ text: "I'm sorry, but I can't look up other customer profiles. This feature is restricted to salon staff for security and privacy." });
        const { data } = await supabaseAdmin.from('customers').select('id, full_name').ilike('full_name', `%${args.name}%`).limit(1);
        if (!data?.[0]) return NextResponse.json({ text: `No customer found matching "${args.name}".` });
        
        const { data: prefs } = await supabaseAdmin.from('customer_preferences').select('*').eq('customer_id', data[0].id).single();
        return NextResponse.json({ text: `Found ${data[0].full_name} (ID: ${data[0].id}). Preferences: ${JSON.stringify(prefs || 'None')}` });

      } else if (toolCall.function.name === 'create_customer') {
        const { data, error } = await supabaseAdmin.from('customers').insert({ full_name: args.name, phone: args.phone, email: args.email }).select('id').single();
        if (error) return NextResponse.json({ text: `Failed to create customer: ${error.message}` });
        return NextResponse.json({ text: `New customer ${args.name} created with ID: ${data.id}. You can now book their appointment.` });

      } else if (toolCall.function.name === 'update_preferences') {
        const target = args.targetCustomerId || customerId;
        const { error } = await supabaseAdmin.from('customer_preferences').upsert({ customer_id: target, ...args });
        if (error) return NextResponse.json({ text: `Update failed: ${error.message}` });
        return NextResponse.json({ text: "Preferences updated successfully." });

      } else if (toolCall.function.name === 'get_customer_appointments') {
        const { data } = await supabaseAdmin.from('appointments').select('id, appointment_date, start_time, status, service:services(name)').eq('customer_id', args.customerId).order('appointment_date', { ascending: false }).limit(5);
        const list = data?.map(a => `- [ID: ${a.id.slice(0, 8)}...] ${(a.service as any)?.name || 'Standard Salon Service'} on ${a.appointment_date} at ${a.start_time} (${a.status})`).join('\n') || "No appointments found.";
        // Include full IDs in a hidden way for the AI
        const rawData = JSON.stringify(data?.map(a => ({ id: a.id, service: (a.service as any)?.name, date: a.appointment_date, time: a.start_time })));
        return NextResponse.json({ text: `${list}\n\n(Internal Reference: ${rawData})` });

      } else if (toolCall.function.name === 'get_stylist_appointments') {
        // HARD SECURITY GATE: Stylist schedules are STAFF-ONLY
        if (userRole === 'CUSTOMER' || userRole === 'GUEST') {
          return NextResponse.json({ text: "I'm sorry, stylist schedules are not available to customers. I can help you book an appointment instead!" });
        }
        const { data: stylist } = await supabaseAdmin.from('stylists').select('id, full_name').ilike('full_name', `%${args.stylistName}%`).single();
        if (!stylist) return NextResponse.json({ text: "Stylist not found." });
        const { data } = await supabaseAdmin.from('appointments').select('*, customer:customers(full_name), service:services(name)').eq('stylist_id', stylist.id).gte('appointment_date', args.date || new Date().toISOString().split('T')[0]).order('appointment_date').limit(20);
        
        const tableHeader = "| Time | Service | Customer | Date | Status |\n| :--- | :--- | :--- | :--- | :--- |\n";
        const tableRows = data?.map(a => `| ${a.start_time} | ${(a.service as any)?.name || 'Standard Salon Service'} | ${userRole === 'CUSTOMER' ? 'Hidden' : (a.customer as any)?.full_name || 'Walk-in'} | ${a.appointment_date} | ${a.status} |`).join('\n');
        return NextResponse.json({ text: `### Schedule for ${stylist.full_name}\n\n${tableHeader}${tableRows}` });
      }
    }

    return NextResponse.json({ text: choice.message.content });
  } catch (error: any) {
    console.error('Chat API Error:', error.message);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
