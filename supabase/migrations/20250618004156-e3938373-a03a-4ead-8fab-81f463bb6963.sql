
-- Add interview recording link field to applications table
ALTER TABLE applications 
ADD COLUMN interview_recording_link TEXT;

-- Add comment to clarify the purpose
COMMENT ON COLUMN applications.interview_recording_link IS 'Manual entry field for interview recording links (Loom, Zoom, etc.)';
