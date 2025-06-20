
-- First, let's create a temporary table to identify which candidates to keep
CREATE TEMP TABLE candidates_to_keep AS (
  SELECT DISTINCT ON (email) id
  FROM public.candidates 
  ORDER BY email, created_at DESC NULLS LAST, id
);

-- Delete applications for candidates we're going to remove
DELETE FROM public.applications 
WHERE candidate_id NOT IN (SELECT id FROM candidates_to_keep);

-- Delete candidate tags for candidates we're going to remove
DELETE FROM public.candidate_tags 
WHERE candidate_id NOT IN (SELECT id FROM candidates_to_keep);

-- Now delete the duplicate candidates, keeping only the ones in our temp table
DELETE FROM public.candidates 
WHERE id NOT IN (SELECT id FROM candidates_to_keep);

-- Drop the temp table
DROP TABLE candidates_to_keep;

-- Now we can safely add the unique constraint
ALTER TABLE public.candidates ADD CONSTRAINT unique_candidate_email UNIQUE (email);

-- Add the foreign key constraints
ALTER TABLE public.applications 
ADD CONSTRAINT fk_applications_candidate 
FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE;

ALTER TABLE public.applications 
ADD CONSTRAINT fk_applications_job_role 
FOREIGN KEY (job_role_id) REFERENCES public.job_roles(id) ON DELETE SET NULL;

ALTER TABLE public.candidate_tags 
ADD CONSTRAINT fk_candidate_tags_candidate 
FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE;

ALTER TABLE public.pre_screening_responses 
ADD CONSTRAINT fk_pre_screening_application 
FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;

ALTER TABLE public.video_analysis_details 
ADD CONSTRAINT fk_video_analysis_application 
FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;

ALTER TABLE public.video_analysis_logs 
ADD CONSTRAINT fk_video_logs_application 
FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;

-- Remove duplicate candidate tags first
WITH duplicate_tags AS (
  SELECT candidate_id, tag, 
         array_agg(id ORDER BY created_at DESC NULLS LAST) as tag_ids
  FROM public.candidate_tags 
  GROUP BY candidate_id, tag 
  HAVING count(*) > 1
),
tags_to_delete AS (
  SELECT unnest(tag_ids[2:]) as id_to_delete
  FROM duplicate_tags
)
DELETE FROM public.candidate_tags 
WHERE id IN (SELECT id_to_delete FROM tags_to_delete);

-- Add unique constraint for candidate tags
ALTER TABLE public.candidate_tags ADD CONSTRAINT unique_candidate_tag UNIQUE (candidate_id, tag);

-- Enable Row Level Security on core tables
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_screening_responses ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allowing all authenticated users for now)
CREATE POLICY "Allow authenticated users to view candidates" 
  ON public.candidates FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage candidates" 
  ON public.candidates FOR ALL 
  TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view applications" 
  ON public.applications FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage applications" 
  ON public.applications FOR ALL 
  TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view job roles" 
  ON public.job_roles FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage job roles" 
  ON public.job_roles FOR ALL 
  TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view candidate tags" 
  ON public.candidate_tags FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage candidate tags" 
  ON public.candidate_tags FOR ALL 
  TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view pre screening responses" 
  ON public.pre_screening_responses FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage pre screening responses" 
  ON public.pre_screening_responses FOR ALL 
  TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON public.applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_role_id ON public.applications(job_role_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_date ON public.applications(applied_date);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON public.candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidate_tags_candidate_id ON public.candidate_tags(candidate_id);
