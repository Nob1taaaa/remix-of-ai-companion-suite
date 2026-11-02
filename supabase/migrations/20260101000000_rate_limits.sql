-- Counters used by the edge functions to limit how often AI tools can be called.
-- Only the service role (used by the functions) can read or write this table.

CREATE TABLE IF NOT EXISTS public.rate_limits (
  key text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  count integer NOT NULL DEFAULT 0
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
-- No policies: anon and authenticated clients cannot touch this table.

CREATE OR REPLACE FUNCTION public.consume_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now timestamptz := now();
  v_expired boolean;
  v_count integer;
BEGIN
  INSERT INTO public.rate_limits AS r (key, window_start, count)
  VALUES (p_key, v_now, 1)
  ON CONFLICT (key) DO UPDATE SET
    window_start = CASE WHEN r.window_start < v_now - make_interval(secs => p_window_seconds) THEN v_now ELSE r.window_start END,
    count = CASE WHEN r.window_start < v_now - make_interval(secs => p_window_seconds) THEN 1 ELSE r.count + 1 END
  RETURNING count INTO v_count;

  RETURN v_count <= p_limit;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.consume_rate_limit(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(text, integer, integer) TO service_role;
