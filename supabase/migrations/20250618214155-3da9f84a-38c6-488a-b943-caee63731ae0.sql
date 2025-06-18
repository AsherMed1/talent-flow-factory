
-- Create pre_screening_responses table to store candidate responses and scores
CREATE TABLE public.pre_screening_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  motivation_response TEXT,
  motivation_score INTEGER CHECK (motivation_score >= 0 AND motivation_score <= 100),
  experience_response TEXT,
  experience_score INTEGER CHECK (experience_score >= 0 AND experience_score <= 100),
  availability_response TEXT,
  availability_score INTEGER CHECK (availability_score >= 0 AND availability_score <= 100),
  communication_score INTEGER CHECK (communication_score >= 0 AND communication_score <= 100),
  overall_prescreening_score INTEGER CHECK (overall_prescreening_score >= 0 AND overall_prescreening_score <= 100),
  scored_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX idx_pre_screening_application_id ON public.pre_screening_responses(application_id);
CREATE INDEX idx_pre_screening_overall_score ON public.pre_screening_responses(overall_prescreening_score);

-- Add RLS policies
ALTER TABLE public.pre_screening_responses ENABLE ROW LEVEL SECURITY;
