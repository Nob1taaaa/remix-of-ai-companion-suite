import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Limits can be tuned per deployment with Supabase function secrets.
const PER_IP_LIMIT = Number(Deno.env.get("RATE_LIMIT_PER_IP_PER_HOUR") ?? 30);
const GLOBAL_DAILY_LIMIT = Number(Deno.env.get("RATE_LIMIT_GLOBAL_PER_DAY") ?? 2000);

const HOUR = 60 * 60;
const DAY = 24 * HOUR;

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Returns a 429 Response when the caller is over a limit, otherwise null.
 * Counts are stored in the public.rate_limits table via consume_rate_limit().
 * If the counter itself fails, the request is allowed and the error is logged,
 * so a database hiccup does not take the tools down.
 */
export async function checkRateLimit(req: Request, fnName: string): Promise<Response | null> {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const checks: Array<[string, number, number]> = [
    [`ip:${fnName}:${clientIp(req)}`, PER_IP_LIMIT, HOUR],
    [`global:${fnName}`, GLOBAL_DAILY_LIMIT, DAY],
  ];

  for (const [key, limit, windowSeconds] of checks) {
    const { data, error } = await supabase.rpc("consume_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (error) {
      console.error("rate limit check failed", error.message);
      return null;
    }
    if (data !== true) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(windowSeconds),
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
          },
        },
      );
    }
  }
  return null;
}
