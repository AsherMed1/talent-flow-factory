
-- Add Zoom recording columns to applications table
ALTER TABLE public.applications 
ADD COLUMN zoom_recording_url text,
ADD COLUMN zoom_recording_files jsonb;

-- Create a table to log Zoom recordings that couldn't be automatically matched
CREATE TABLE public.zoom_recordings_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id TEXT NOT NULL,
  meeting_uuid TEXT NOT NULL,
  topic TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  share_url TEXT NOT NULL,
  recording_files JSONB,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for faster lookups
CREATE INDEX idx_zoom_recordings_log_processed ON public.zoom_recordings_log(processed);
CREATE INDEX idx_zoom_recordings_log_meeting_id ON public.zoom_recordings_log(meeting_id);
