-- Fix 1: Add policy for users to view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Fix 2: Update handle_new_user function with input validation and proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Fix 3: Update handle_updated_at function to set proper search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;