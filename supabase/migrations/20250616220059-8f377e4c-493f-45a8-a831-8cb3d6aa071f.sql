
-- Create webhook_configs table for Make.com integration
CREATE TABLE public.webhook_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('application_submitted', 'status_changed', 'interview_scheduled', 'offer_sent', 'candidate_hired', 'candidate_rejected')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.webhook_configs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is for admin use)
CREATE POLICY "Allow all operations on webhook_configs" ON public.webhook_configs
  FOR ALL 
  USING (true)
  WITH CHECK (true);
