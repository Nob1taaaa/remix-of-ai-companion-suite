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
    const { text, category } = await req.json();
    
    if (!text || !category) {
      return new Response(
        JSON.stringify({ error: 'Text and category are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let labels: string[] = [];

    if (category === 'sentiment') {
      systemPrompt = 'Classify the sentiment of the text as positive, negative, or neutral.';
      labels = ['positive', 'negative', 'neutral'];
    } else if (category === 'spam') {
      systemPrompt = 'Classify if the text is spam or not spam (legitimate).';
      labels = ['spam', 'not spam'];
    } else if (category === 'topic') {
      systemPrompt = 'Classify the main topic of the text.';
      labels = ['technology', 'business', 'sports', 'entertainment', 'politics', 'science', 'other'];
    }

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
            content: systemPrompt + ' Return ONLY valid JSON.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_text",
              description: "Classify the text and provide confidence score",
              parameters: {
                type: "object",
                properties: {
                  label: {
                    type: "string",
                    description: "The predicted label",
                    enum: labels
                  },
                  confidence: {
                    type: "number",
                    description: "Confidence score from 0 to 1"
                  },
                  explanation: {
                    type: "string",
                    description: "Brief explanation of the classification"
                  }
                },
                required: ["label", "confidence", "explanation"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "classify_text" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('AI service error');
    }

    const data = await response.json();
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
    console.error('Error in classify-text function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
