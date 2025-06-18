
-- Add the missing ai_tone_prompt column to job_roles table
ALTER TABLE public.job_roles 
ADD COLUMN ai_tone_prompt TEXT;

-- Also add the other missing columns that are referenced in the code
ALTER TABLE public.job_roles 
ADD COLUMN hiring_process TEXT,
ADD COLUMN screening_questions TEXT,
ADD COLUMN job_description TEXT;
