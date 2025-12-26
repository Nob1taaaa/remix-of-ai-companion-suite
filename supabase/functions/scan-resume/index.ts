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
    const { resumeText, jobDescription } = await req.json();
    
    if (!resumeText || !jobDescription) {
      return new Response(
        JSON.stringify({ error: 'Resume text and job description are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Scanning resume against job description...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: `You are an expert resume analyzer. Your job is to:
1. Compare a resume against a job description
2. Extract key skills, experience, and qualifications from both
3. Calculate a match score (0-100) based on alignment
4. Provide 3-5 specific, actionable feedback points

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "score": number (0-100),
  "feedback": [
    "Feedback point 1",
    "Feedback point 2",
    ...
  ],
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"]
}`
          },
          {
            role: 'user',
            content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_resume",
              description: "Analyze a resume against a job description and return structured scoring data",
              parameters: {
                type: "object",
                properties: {
                  score: {
                    type: "number",
                    description: "Match score from 0 to 100"
                  },
                  feedback: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 actionable feedback points"
                  },
                  matchedSkills: {
                    type: "array",
                    items: { type: "string" },
                    description: "Skills from resume that match job requirements"
                  },
                  missingSkills: {
                    type: "array",
                    items: { type: "string" },
                    description: "Important skills missing from resume"
                  }
                },
                required: ["score", "feedback", "matchedSkills", "missingSkills"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_resume" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('AI service error');
    }

    const data = await response.json();
    console.log('AI response received');

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error('Invalid AI response format');
    }

    const result = JSON.parse(toolCall.function.arguments);
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scan-resume function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
