
-- Enable Row Level Security on the three tables
ALTER TABLE public.zoom_recordings_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_analysis_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_analysis_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for zoom_recordings_log
-- This table logs unmatched Zoom recordings, so we'll allow read access to authenticated users
-- and system-level insert access (since it's populated by webhooks)
CREATE POLICY "Allow authenticated users to view zoom recordings log" 
  ON public.zoom_recordings_log 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Allow system to insert zoom recordings" 
  ON public.zoom_recordings_log 
  FOR INSERT 
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update processed status" 
  ON public.video_analysis_logs 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Create policies for video_analysis_details
-- This table contains detailed analysis results tied to applications
-- Users should only see analysis for applications they have access to
CREATE POLICY "Users can view video analysis details for their applications" 
  ON public.video_analysis_details 
  FOR SELECT 
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM public.applications
    )
  );

CREATE POLICY "System can insert video analysis details" 
  ON public.video_analysis_details 
  FOR INSERT 
  TO service_role
  WITH CHECK (true);

CREATE POLICY "System can update video analysis details" 
  ON public.video_analysis_details 
  FOR UPDATE 
  TO service_role
  USING (true);

-- Create policies for video_analysis_logs
-- This table logs analysis attempts and errors
CREATE POLICY "Users can view video analysis logs for their applications" 
  ON public.video_analysis_logs 
  FOR SELECT 
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM public.applications
    )
  );

CREATE POLICY "System can insert video analysis logs" 
  ON public.video_analysis_logs 
  FOR INSERT 
  TO service_role
  WITH CHECK (true);

CREATE POLICY "System can update video analysis logs" 
  ON public.video_analysis_logs 
  FOR UPDATE 
  TO service_role
  USING (true);
