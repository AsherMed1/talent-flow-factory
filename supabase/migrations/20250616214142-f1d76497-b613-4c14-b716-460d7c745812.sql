
-- Create enum for application statuses
CREATE TYPE application_status AS ENUM (
  'applied',
  'reviewed', 
  'interview_scheduled',
  'interview_completed',
  'offer_sent',
  'hired',
  'rejected'
);

-- Create enum for role status
CREATE TYPE role_status AS ENUM ('active', 'draft', 'closed');

-- Create profiles table for team members
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'recruiter',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job roles table
CREATE TABLE public.job_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status role_status DEFAULT 'draft',
  form_fields JSONB DEFAULT '[]',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create candidates table
CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
  job_role_id UUID REFERENCES public.job_roles(id) ON DELETE CASCADE,
  status application_status DEFAULT 'applied',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  form_data JSONB DEFAULT '{}',
  has_resume BOOLEAN DEFAULT FALSE,
  has_voice_recording BOOLEAN DEFAULT FALSE,
  has_video BOOLEAN DEFAULT FALSE,
  interview_date TIMESTAMP WITH TIME ZONE,
  offer_sent_date TIMESTAMP WITH TIME ZONE,
  applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(candidate_id, job_role_id)
);

-- Create tags table for candidate tagging
CREATE TABLE public.candidate_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for job roles
CREATE POLICY "Anyone can view active job roles" ON public.job_roles FOR SELECT USING (status = 'active' OR auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can create job roles" ON public.job_roles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update job roles" ON public.job_roles FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete job roles" ON public.job_roles FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create RLS policies for candidates
CREATE POLICY "Authenticated users can view candidates" ON public.candidates FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Anyone can create candidates" ON public.candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update candidates" ON public.candidates FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create RLS policies for applications
CREATE POLICY "Authenticated users can view applications" ON public.applications FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Anyone can create applications" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update applications" ON public.applications FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create RLS policies for candidate tags
CREATE POLICY "Authenticated users can view candidate tags" ON public.candidate_tags FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage candidate tags" ON public.candidate_tags FOR ALL USING (auth.uid() IS NOT NULL);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample data
INSERT INTO public.job_roles (name, description, status, form_fields) VALUES
('Appointment Setter', 'Schedule appointments and manage client outreach', 'active', '[{"name": "Basic Info", "required": true}, {"name": "Voice Recording", "required": true}, {"name": "Availability", "required": true}, {"name": "Experience", "required": false}]'),
('Virtual Assistant', 'Provide administrative support and manage tasks', 'active', '[{"name": "Basic Info", "required": true}, {"name": "Portfolio", "required": true}, {"name": "Skills Assessment", "required": true}, {"name": "Time Zone", "required": true}]'),
('Sales Closer', 'Close sales calls and convert qualified leads', 'draft', '[{"name": "Basic Info", "required": true}, {"name": "Sales Experience", "required": true}, {"name": "Video Pitch", "required": true}, {"name": "Objection Handling", "required": false}]');

-- Insert sample candidates
INSERT INTO public.candidates (name, email, phone) VALUES
('Sarah Johnson', 'sarah.j@email.com', '+1 (555) 123-4567'),
('Mike Chen', 'mike.chen@email.com', '+1 (555) 234-5678'),
('Emma Davis', 'emma.davis@email.com', '+1 (555) 345-6789'),
('James Wilson', 'james.wilson@email.com', '+1 (555) 456-7890');

-- Insert sample applications
INSERT INTO public.applications (candidate_id, job_role_id, status, rating, notes, has_resume, has_voice_recording, has_video, interview_date, offer_sent_date) VALUES
((SELECT id FROM public.candidates WHERE email = 'sarah.j@email.com'), (SELECT id FROM public.job_roles WHERE name = 'Appointment Setter'), 'applied', NULL, 'Excellent communication skills, previous healthcare experience', true, true, false, NULL, NULL),
((SELECT id FROM public.candidates WHERE email = 'mike.chen@email.com'), (SELECT id FROM public.job_roles WHERE name = 'Virtual Assistant'), 'interview_scheduled', 4, 'Strong technical background, great portfolio', true, true, true, '2024-03-18 14:00:00+00', NULL),
((SELECT id FROM public.candidates WHERE email = 'emma.davis@email.com'), (SELECT id FROM public.job_roles WHERE name = 'Appointment Setter'), 'offer_sent', 5, 'Outstanding interview performance, immediate availability', true, true, true, NULL, '2024-03-16 10:00:00+00'),
((SELECT id FROM public.candidates WHERE email = 'james.wilson@email.com'), (SELECT id FROM public.job_roles WHERE name = 'Sales Closer'), 'reviewed', 3, 'Good potential, needs more training', true, false, false, NULL, NULL);

-- Insert sample candidate tags
INSERT INTO public.candidate_tags (candidate_id, tag) VALUES
((SELECT id FROM public.candidates WHERE email = 'sarah.j@email.com'), 'Top Performer'),
((SELECT id FROM public.candidates WHERE email = 'sarah.j@email.com'), 'Spanish Speaker'),
((SELECT id FROM public.candidates WHERE email = 'mike.chen@email.com'), 'Tech Savvy'),
((SELECT id FROM public.candidates WHERE email = 'mike.chen@email.com'), 'Project Management'),
((SELECT id FROM public.candidates WHERE email = 'emma.davis@email.com'), 'Top Setter'),
((SELECT id FROM public.candidates WHERE email = 'emma.davis@email.com'), 'Quick Learner'),
((SELECT id FROM public.candidates WHERE email = 'james.wilson@email.com'), 'Sales Experience'),
((SELECT id FROM public.candidates WHERE email = 'james.wilson@email.com'), 'Follow Up');
