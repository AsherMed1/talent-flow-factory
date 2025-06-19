
-- Add pipeline_stages column to job_roles table to store custom stages for each role
ALTER TABLE public.job_roles 
ADD COLUMN pipeline_stages jsonb DEFAULT '[
  {"name": "applied", "displayName": "Applied", "color": "bg-gray-100"},
  {"name": "reviewed", "displayName": "Reviewed", "color": "bg-blue-100"},
  {"name": "interview_scheduled", "displayName": "Interview Scheduled", "color": "bg-yellow-100"},
  {"name": "interview_completed", "displayName": "Interview Completed", "color": "bg-purple-100"},
  {"name": "offer_sent", "displayName": "Offer Sent", "color": "bg-green-100"},
  {"name": "hired", "displayName": "Hired", "color": "bg-emerald-100"}
]'::jsonb;

-- Update existing video editor roles to include sample project stages
UPDATE public.job_roles 
SET pipeline_stages = '[
  {"name": "applied", "displayName": "Applied", "color": "bg-gray-100"},
  {"name": "reviewed", "displayName": "Reviewed", "color": "bg-blue-100"},
  {"name": "interview_scheduled", "displayName": "Interview Scheduled", "color": "bg-yellow-100"},
  {"name": "interview_completed", "displayName": "Interview Completed", "color": "bg-purple-100"},
  {"name": "sample_project_assigned", "displayName": "Sample Project Assigned", "color": "bg-orange-100"},
  {"name": "sample_project_submitted", "displayName": "Sample Project Submitted", "color": "bg-cyan-100"},
  {"name": "sample_project_reviewed", "displayName": "Sample Project Reviewed", "color": "bg-indigo-100"},
  {"name": "offer_sent", "displayName": "Offer Sent", "color": "bg-green-100"},
  {"name": "hired", "displayName": "Hired", "color": "bg-emerald-100"}
]'::jsonb
WHERE LOWER(name) LIKE '%video%editor%' OR LOWER(name) LIKE '%video%';

-- Add a function to get pipeline stages for a specific job role
CREATE OR REPLACE FUNCTION get_pipeline_stages_for_role(role_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
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
