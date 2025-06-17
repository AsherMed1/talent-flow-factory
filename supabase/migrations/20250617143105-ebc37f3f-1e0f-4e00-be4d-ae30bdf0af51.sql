
-- Enable RLS on candidates table if not already enabled
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert candidates (for public application form)
CREATE POLICY "Allow public candidate creation" 
  ON public.candidates 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow reading candidates (you may want to restrict this later)
CREATE POLICY "Allow public candidate reading" 
  ON public.candidates 
  FOR SELECT 
  USING (true);

-- Create policy to allow updating candidates
CREATE POLICY "Allow public candidate updates" 
  ON public.candidates 
  FOR UPDATE 
  USING (true);

-- Also ensure applications table has proper policies
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Allow public application creation
CREATE POLICY "Allow public application creation" 
  ON public.applications 
  FOR INSERT 
  WITH CHECK (true);

-- Allow reading applications
CREATE POLICY "Allow public application reading" 
  ON public.applications 
  FOR SELECT 
  USING (true);

-- Allow updating applications
CREATE POLICY "Allow public application updates" 
  ON public.applications 
  FOR UPDATE 
  USING (true);

-- Also ensure candidate_tags table has proper policies
ALTER TABLE public.candidate_tags ENABLE ROW LEVEL SECURITY;

-- Allow public candidate tag creation
CREATE POLICY "Allow public candidate tag creation" 
  ON public.candidate_tags 
  FOR INSERT 
  WITH CHECK (true);

-- Allow reading candidate tags
CREATE POLICY "Allow public candidate tag reading" 
  ON public.candidate_tags 
  FOR SELECT 
  USING (true);
