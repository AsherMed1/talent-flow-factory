
-- Create a storage bucket for video uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('video-uploads', 'video-uploads', true);

-- Create policies to allow anonymous uploads for job applications
CREATE POLICY "Allow anonymous video uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'video-uploads'
);

-- Allow anonymous users to update videos (for re-upload functionality)
CREATE POLICY "Allow anonymous video updates" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'video-uploads'
);

-- Allow anonymous users to delete videos (for cleanup)
CREATE POLICY "Allow anonymous video deletions" ON storage.objects
FOR DELETE USING (
  bucket_id = 'video-uploads'
);

-- Allow public read access to uploaded videos
CREATE POLICY "Public access to video uploads" ON storage.objects
FOR SELECT USING (bucket_id = 'video-uploads');
