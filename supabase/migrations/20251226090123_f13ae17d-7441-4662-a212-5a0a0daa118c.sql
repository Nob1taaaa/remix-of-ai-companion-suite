-- Create tables to store interaction history without requiring auth yet

-- Resume scan history
CREATE TABLE IF NOT EXISTS public.resume_scan_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  session_id text, -- anonymous session identifier if needed later
  resume_text text NOT NULL,
  job_description text NOT NULL,
  match_score numeric,
  matched_skills jsonb,
  missing_skills jsonb,
  analysis jsonb
);

ALTER TABLE public.resume_scan_history ENABLE ROW LEVEL SECURITY;

-- Allow public access for now (no auth implemented yet)
CREATE POLICY "Public read resume scans" ON public.resume_scan_history
  FOR SELECT USING (true);

CREATE POLICY "Public insert resume scans" ON public.resume_scan_history
  FOR INSERT WITH CHECK (true);


-- Text classification history
CREATE TABLE IF NOT EXISTS public.text_classification_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  session_id text,
  input_text text NOT NULL,
  category text NOT NULL,
  label text,
  confidence numeric,
  raw_result jsonb
);

ALTER TABLE public.text_classification_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read text classifications" ON public.text_classification_history
  FOR SELECT USING (true);

CREATE POLICY "Public insert text classifications" ON public.text_classification_history
  FOR INSERT WITH CHECK (true);


-- Agent task history (multi-agent system)
CREATE TABLE IF NOT EXISTS public.agent_task_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  session_id text,
  task text NOT NULL,
  planner_output text,
  researcher_output text,
  writer_output text,
  final_response text,
  raw_result jsonb
);

ALTER TABLE public.agent_task_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read agent tasks" ON public.agent_task_history
  FOR SELECT USING (true);

CREATE POLICY "Public insert agent tasks" ON public.agent_task_history
  FOR INSERT WITH CHECK (true);
