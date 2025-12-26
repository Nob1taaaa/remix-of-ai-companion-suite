-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table with username, avatar, and role
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles are viewable by everyone (for displaying usernames/avatars)
CREATE POLICY "Profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can view roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can manage roles
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger to update profiles updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add user_id columns to history tables and update RLS policies

-- Resume scan history
ALTER TABLE public.resume_scan_history 
  ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "Public read resume scans" ON public.resume_scan_history;
DROP POLICY IF EXISTS "Public insert resume scans" ON public.resume_scan_history;

CREATE POLICY "Users can view own resume scans" 
  ON public.resume_scan_history FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resume scans" 
  ON public.resume_scan_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Text classification history
ALTER TABLE public.text_classification_history 
  ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "Public read text classifications" ON public.text_classification_history;
DROP POLICY IF EXISTS "Public insert text classifications" ON public.text_classification_history;

CREATE POLICY "Users can view own classifications" 
  ON public.text_classification_history FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own classifications" 
  ON public.text_classification_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Agent task history
ALTER TABLE public.agent_task_history 
  ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "Public read agent tasks" ON public.agent_task_history;
DROP POLICY IF EXISTS "Public insert agent tasks" ON public.agent_task_history;

CREATE POLICY "Users can view own agent tasks" 
  ON public.agent_task_history FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own agent tasks" 
  ON public.agent_task_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);