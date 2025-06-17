
-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "Users can upload voice recordings" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their voice recordings" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their voice recordings" ON storage.objects;

-- Create new policies that allow anonymous uploads for job applications
CREATE POLICY "Allow anonymous voice recording uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'voice-recordings'
);

-- Allow anonymous users to update recordings (for re-recording functionality)
CREATE POLICY "Allow anonymous voice recording updates" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'voice-recordings'
);

-- Allow anonymous users to delete recordings (for cleanup)
CREATE POLICY "Allow anonymous voice recording deletions" ON storage.objects
FOR DELETE USING (
  bucket_id = 'voice-recordings'
);
