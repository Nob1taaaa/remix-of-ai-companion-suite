-- Fix 1: Restrict profile visibility to authenticated users only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Fix 2: Add UPDATE and DELETE policies for agent_task_history
CREATE POLICY "Users can update own agent tasks" 
  ON public.agent_task_history FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own agent tasks" 
  ON public.agent_task_history FOR DELETE 
  USING (auth.uid() = user_id);

-- Fix 3: Update handle_new_user to sanitize username input
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  clean_username TEXT;
BEGIN
  -- Extract and sanitize username (max 50 chars, alphanumeric + underscore/dash only)
  clean_username := COALESCE(
    SUBSTRING(regexp_replace(NEW.raw_user_meta_data->>'username', '[^a-zA-Z0-9_-]', '', 'g'), 1, 50),
    SUBSTRING(split_part(NEW.email, '@', 1), 1, 50)
  );
  
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, clean_username);
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;