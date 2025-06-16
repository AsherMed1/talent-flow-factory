
-- Add voice analysis fields to the applications table
ALTER TABLE applications 
ADD COLUMN voice_analysis_score INTEGER CHECK (voice_analysis_score >= 1 AND voice_analysis_score <= 10),
ADD COLUMN voice_analysis_feedback TEXT,
ADD COLUMN voice_transcription TEXT,
ADD COLUMN voice_analysis_completed_at TIMESTAMP WITH TIME ZONE;

-- Add comment to clarify the voice analysis score
COMMENT ON COLUMN applications.voice_analysis_score IS 'AI-generated voice analysis score from 1-10 based on clarity, communication skills, and suitability for appointment setting role';
