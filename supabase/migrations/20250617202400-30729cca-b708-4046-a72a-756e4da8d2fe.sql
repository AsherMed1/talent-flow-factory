
-- Create a storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('voice-recordings', 'voice-recordings', true);

-- Create a policy to allow authenticated users to upload their own recordings
CREATE POLICY "Users can upload voice recordings" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'voice-recordings' AND
  auth.role() = 'authenticated'
);

-- Create a policy to allow public read access to voice recordings
CREATE POLICY "Public access to voice recordings" ON storage.objects
FOR SELECT USING (bucket_id = 'voice-recordings');

-- Create a policy to allow users to update their own recordings
CREATE POLICY "Users can update their voice recordings" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'voice-recordings' AND
  auth.role() = 'authenticated'
);

-- Create a policy to allow users to delete their own recordings
CREATE POLICY "Users can delete their voice recordings" ON storage.objects
FOR DELETE USING (
  bucket_id = 'voice-recordings' AND
  auth.role() = 'authenticated'
);
