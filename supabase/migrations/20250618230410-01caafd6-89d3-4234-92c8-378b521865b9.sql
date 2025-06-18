
-- Add enhanced video analysis columns to applications table
ALTER TABLE applications ADD COLUMN IF NOT EXISTS video_analysis_status TEXT DEFAULT 'pending';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS video_analysis_error TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS video_analysis_retry_count INTEGER DEFAULT 0;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS video_analysis_started_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS video_analysis_completed_at TIMESTAMP WITH TIME ZONE;

-- Create a dedicated table for detailed video analysis results
CREATE TABLE IF NOT EXISTS video_analysis_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  analysis_version INTEGER DEFAULT 1,
  
  -- Speaker diarization data
  speaker_segments JSONB, -- Array of {start_time, end_time, speaker, confidence}
  interviewer_speaking_time INTEGER, -- in seconds
  candidate_speaking_time INTEGER, -- in seconds
  
  -- Sentiment analysis over time
  sentiment_timeline JSONB, -- Array of {timestamp, sentiment, confidence}
  sentiment_trends JSONB, -- Overall trends and patterns
  
  -- Communication skills scoring
  pace_score INTEGER, -- 1-10 scale
  tone_score INTEGER, -- 1-10 scale
  filler_words_count INTEGER,
  filler_words_rate DECIMAL(5,2), -- per minute
  clarity_score INTEGER, -- 1-10 scale
  confidence_score INTEGER, -- 1-10 scale
  
  -- Key moments and highlights
  key_moments JSONB, -- Array of {timestamp, type, description, importance}
  interview_highlights JSONB, -- Top moments for review
  
  -- Analysis metadata
  ai_model_used TEXT,
  processing_duration INTEGER, -- in seconds
  confidence_level DECIMAL(3,2), -- overall confidence in analysis
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_video_analysis_status ON applications(video_analysis_status);
CREATE INDEX IF NOT EXISTS idx_applications_video_analysis_timestamp ON applications(video_analysis_timestamp);
CREATE INDEX IF NOT EXISTS idx_applications_video_analysis_completed_at ON applications(video_analysis_completed_at);
CREATE INDEX IF NOT EXISTS idx_video_analysis_details_application_id ON video_analysis_details(application_id);
CREATE INDEX IF NOT EXISTS idx_video_analysis_details_created_at ON video_analysis_details(created_at);

-- Create a table for analysis error logging and retry tracking
CREATE TABLE IF NOT EXISTS video_analysis_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  attempt_number INTEGER DEFAULT 1,
  status TEXT NOT NULL, -- 'started', 'completed', 'failed', 'retrying'
  error_type TEXT, -- 'api_error', 'timeout', 'invalid_video', 'processing_error'
  error_message TEXT,
  error_details JSONB,
  processing_time INTEGER, -- in seconds
  ai_model_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for analysis logs
CREATE INDEX IF NOT EXISTS idx_video_analysis_logs_application_id ON video_analysis_logs(application_id);
CREATE INDEX IF NOT EXISTS idx_video_analysis_logs_status ON video_analysis_logs(status);
CREATE INDEX IF NOT EXISTS idx_video_analysis_logs_created_at ON video_analysis_logs(created_at);

-- Add constraint to ensure valid analysis status
ALTER TABLE applications ADD CONSTRAINT check_video_analysis_status 
  CHECK (video_analysis_status IN ('pending', 'processing', 'completed', 'failed', 'retrying'));

-- Add constraint to ensure valid error types
ALTER TABLE video_analysis_logs ADD CONSTRAINT check_error_type 
  CHECK (error_type IN ('api_error', 'timeout', 'invalid_video', 'processing_error', 'quota_exceeded', 'network_error'));
