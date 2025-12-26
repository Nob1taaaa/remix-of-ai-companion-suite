import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, fields, tones } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const effectiveFields = Array.isArray(fields) && fields.length > 0
      ? fields
      : ["name", "email", "role", "company", "skills", "location", "experience", "summary"];

    const effectiveTones = Array.isArray(tones) && tones.length > 0
      ? tones
      : ["formal", "casual", "recruiter", "friendly"];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a structured extraction and tone rewriting assistant.

1. NEVER hallucinate: if an input field cannot be found explicitly in the text, set its value to an empty string.
2. For the JSON extraction, only use keys from the provided field list.
3. For tone rewrites, preserve factual content but adjust style.
4. Keep all outputs concise and usable in real applications.

Return ONLY valid JSON with this exact shape and nothing else:
{
  "extracted": { "field": "value", ... },
  "rewrites": { "tone": "text", ... }
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
          {
            role: "user",
            content: `FIELDS: ${effectiveFields.join(", ")}\nTONES: ${effectiveTones.join(", ")}\n\nTEXT:\n${text}`,
          },
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
      console.error("Failed to parse JSON from AI response", content);
      throw new Error("AI did not return valid JSON");
    }

    const safeExtracted = parsed.extracted && typeof parsed.extracted === "object" ? parsed.extracted : {};
    const safeRewrites = parsed.rewrites && typeof parsed.rewrites === "object" ? parsed.rewrites : {};

    return new Response(
      JSON.stringify({ extracted: safeExtracted, rewrites: safeRewrites }),
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
