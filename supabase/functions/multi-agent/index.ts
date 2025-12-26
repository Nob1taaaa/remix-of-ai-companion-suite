import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { task } = await req.json();
    
    if (!task) {
      return new Response(
        JSON.stringify({ error: 'Task is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Starting multi-agent task:', task);

    // Agent 1: Planner
    const plannerResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a Planner agent. Break down user tasks into clear steps. Be concise.'
          },
          {
            role: 'user',
            content: task
          }
        ]
      }),
    });

    if (!plannerResponse.ok) throw new Error('Planner failed');
    const plannerData = await plannerResponse.json();
    const plan = plannerData.choices[0].message.content;

    // Agent 2: Researcher
    const researcherResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a Researcher agent. Provide key information and insights for the plan. Be factual and concise.'
          },
          {
            role: 'user',
            content: `Plan: ${plan}\n\nProvide relevant information to execute this plan.`
          }
        ]
      }),
    });

    if (!researcherResponse.ok) throw new Error('Researcher failed');
    const researcherData = await researcherResponse.json();
    const research = researcherData.choices[0].message.content;

    // Agent 3: Writer
    const writerResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a Writer agent. Synthesize the plan and research into a clear, actionable response.'
          },
          {
            role: 'user',
            content: `Task: ${task}\n\nPlan: ${plan}\n\nResearch: ${research}\n\nWrite a final response.`
          }
        ]
      }),
    });

    if (!writerResponse.ok) throw new Error('Writer failed');
    const writerData = await writerResponse.json();
    const final = writerData.choices[0].message.content;

    return new Response(
      JSON.stringify({
        agents: [
          { name: 'Planner', output: plan },
          { name: 'Researcher', output: research },
          { name: 'Writer', output: final }
        ],
        final
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in multi-agent function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
