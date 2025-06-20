
-- Fix search_path security for existing functions
-- This prevents potential SQL injection attacks through search_path manipulation

-- Update get_pipeline_stages_for_role function with secure search_path
CREATE OR REPLACE FUNCTION public.get_pipeline_stages_for_role(role_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(pipeline_stages, '[
      {"name": "applied", "displayName": "Applied", "color": "bg-gray-100"},
      {"name": "reviewed", "displayName": "Reviewed", "color": "bg-blue-100"},
      {"name": "interview_scheduled", "displayName": "Interview Scheduled", "color": "bg-yellow-100"},
      {"name": "interview_completed", "displayName": "Interview Completed", "color": "bg-purple-100"},
      {"name": "offer_sent", "displayName": "Offer Sent", "color": "bg-green-100"},
      {"name": "hired", "displayName": "Hired", "color": "bg-emerald-100"}
    ]'::jsonb)
    FROM public.job_roles 
    WHERE id = role_id
  );
END;
$$;

-- Update handle_new_user function with secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;
