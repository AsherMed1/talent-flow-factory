
-- Add individual trait score columns to the applications table
ALTER TABLE applications 
ADD COLUMN voice_clarity_score INTEGER CHECK (voice_clarity_score >= 1 AND voice_clarity_score <= 10),
ADD COLUMN voice_pacing_score INTEGER CHECK (voice_pacing_score >= 1 AND voice_pacing_score <= 10),
ADD COLUMN voice_tone_score INTEGER CHECK (voice_tone_score >= 1 AND voice_tone_score <= 10),
ADD COLUMN voice_energy_score INTEGER CHECK (voice_energy_score >= 1 AND voice_energy_score <= 10),
ADD COLUMN voice_confidence_score INTEGER CHECK (voice_confidence_score >= 1 AND voice_confidence_score <= 10);

-- Add comments to clarify each trait score
COMMENT ON COLUMN applications.voice_clarity_score IS 'AI-generated clarity score (1-10) - How understandable is the speaker?';
COMMENT ON COLUMN applications.voice_pacing_score IS 'AI-generated pacing score (1-10) - Speaking speed and rhythm evaluation';
COMMENT ON COLUMN applications.voice_tone_score IS 'AI-generated tone score (1-10) - Warmth, friendliness, and professionalism';
COMMENT ON COLUMN applications.voice_energy_score IS 'AI-generated energy score (1-10) - Enthusiasm and engagement level';
COMMENT ON COLUMN applications.voice_confidence_score IS 'AI-generated confidence score (1-10) - Hesitation, clarity of speech, filler words';
