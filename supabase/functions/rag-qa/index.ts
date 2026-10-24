import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_DOCUMENT_LENGTH = 100000; // 100K chars for documents
const MAX_QUESTION_LENGTH = 2000; // 2K chars for questions

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Authenticate user
  const { user, error: authError } = await authenticateUser(req);
  if (authError) return authError;

  console.log('Authenticated user:', user?.id ?? 'anonymous');

  try {
    const { documentText, image, question } = await req.json();

    if (!question || (!documentText && !image)) {
      return new Response(
        JSON.stringify({ error: "Question and at least one document (text, PDF, or image) are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Input validation: limit question length
    if (question.length > MAX_QUESTION_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Question too long. Maximum ${MAX_QUESTION_LENGTH} characters allowed.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Input validation: limit document length
    if (documentText && documentText.length > MAX_DOCUMENT_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Document too long. Maximum ${MAX_DOCUMENT_LENGTH} characters allowed.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userContentParts: any[] = [];

    if (documentText) {
      userContentParts.push({
        type: "text",
        text: `DOCUMENT:\n${documentText}\n\nQUESTION:\n${question}`,
      });
    } else {
      userContentParts.push({
        type: "text",
        text: `QUESTION about the provided image:\n${question}`,
      });
    }

    if (image) {
      userContentParts.push({
        type: "image_url",
        image_url: {
          url: image,
        },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a retrieval-augmented QA assistant. Answer questions using ONLY the provided document/image. Quote short phrases or sentences from the source in your answer, and say clearly when the answer is not present.",
          },
          {
            role: "user",
            content: userContentParts,
          },
        ],
        modalities: ["image", "text"],
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
      console.error("AI Gateway error (rag-qa):", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;

    if (!answer || typeof answer !== "string") {
      console.error("Unexpected AI response format", data);
      throw new Error("Invalid AI response format");
    }

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in rag-qa function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
