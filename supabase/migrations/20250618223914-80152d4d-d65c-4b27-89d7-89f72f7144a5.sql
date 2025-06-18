
-- Add video analysis fields to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS video_analysis_results TEXT,
ADD COLUMN IF NOT EXISTS video_analysis_timestamp TIMESTAMP WITH TIME ZONE;

-- Add index for better performance when querying analyzed videos
CREATE INDEX IF NOT EXISTS idx_applications_video_analysis_timestamp 
ON applications(video_analysis_timestamp) 
WHERE video_analysis_timestamp IS NOT NULL;
