import { checkRateLimit } from "../_shared/rateLimit.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_TEXT_LENGTH = 20000; // 20K chars for structured extraction

async function authenticateUser(req: Request): Promise<{ user: { id: string; email?: string } | null; error: Response | null }> {
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
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  const limited = await checkRateLimit(req, 'structured-studio');
  if (limited) return limited;

  // Authenticate user
  const { user, error: authError } = await authenticateUser(req);
  if (authError) return authError;

  console.log('Authenticated user:', user?.id ?? 'anonymous');

  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Input validation: limit text length
    if (text.length > MAX_TEXT_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Text too long. Maximum ${MAX_TEXT_LENGTH} characters allowed.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a structured extraction assistant.

Rules:
1. ONLY extract fields that are clearly and explicitly present in the text (like name, email, role, etc.).
2. NEVER invent keys such as skills or location if they do not appear.
3. Do not add keys with empty strings. If something is not present, simply omit that key.
4. In addition to JSON, also return a compact TOON (Token Object Oriented Notation) view.

TOON format definition:
- Single line or short multi-line.
- Each key is written as key=value, separated by semicolons.
- Example: name=harshit shah; role=computer science student

Return ONLY valid JSON with this exact shape and nothing else:
{
  "extracted": { "field": "value", ... },
  "toon": "key1=value1; key2=value2"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error (structured-studio):", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      console.error("Unexpected AI response format", data);
      throw new Error("Invalid AI response format");
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      const firstBrace = content.indexOf("{");
      const lastBrace = content.lastIndexOf("}");
      if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        console.error("Failed to locate JSON object in AI response", content);
        throw new Error("AI did not return valid JSON");
      }
      const jsonSlice = content.slice(firstBrace, lastBrace + 1);
      try {
        parsed = JSON.parse(jsonSlice);
      } catch (inner) {
        console.error("Failed to parse JSON slice from AI response", jsonSlice);
        throw new Error("AI did not return valid JSON");
      }
    }

    const safeExtracted = parsed.extracted && typeof parsed.extracted === "object" ? parsed.extracted : {};
    const safeToon = typeof parsed.toon === "string" ? parsed.toon : "";

    return new Response(
      JSON.stringify({ extracted: safeExtracted, toon: safeToon }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in structured-studio function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
