import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_TASK_LENGTH = 5000; // 5K chars for task description

async function authenticateUser(req: Request): Promise<{ user: any; error: Response | null }> {
  // Auth is optional: signed-out visitors proceed anonymously.
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return { user: null, error: null };
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return { user: null, error: null };
  }

  return { user, error: null };
};
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Authenticate user
  const { user, error: authError } = await authenticateUser(req);
  if (authError) return authError;

  console.log('Authenticated user:', user?.id ?? 'anonymous');

  try {
    const { task } = await req.json();
    
    if (!task) {
      return new Response(
        JSON.stringify({ error: 'Task is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Input validation: limit task length
    if (task.length > MAX_TASK_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Task too long. Maximum ${MAX_TASK_LENGTH} characters allowed.` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Starting multi-agent task:', task.substring(0, 100));

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
