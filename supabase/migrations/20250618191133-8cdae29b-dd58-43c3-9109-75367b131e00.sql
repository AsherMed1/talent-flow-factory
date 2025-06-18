
-- Enable RLS on job_roles table (if not already enabled)
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read job roles
CREATE POLICY "Allow public job role reading" 
  ON public.job_roles 
  FOR SELECT 
  USING (true);

-- Create policy to allow anyone to insert job roles
CREATE POLICY "Allow public job role creation" 
  ON public.job_roles 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow anyone to update job roles
CREATE POLICY "Allow public job role updates" 
  ON public.job_roles 
  FOR UPDATE 
  USING (true);

-- Create policy to allow anyone to delete job roles (optional)
CREATE POLICY "Allow public job role deletion" 
  ON public.job_roles 
  FOR DELETE 
  USING (true);
