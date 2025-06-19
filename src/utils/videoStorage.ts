
import { supabase } from '@/integrations/supabase/client';

export interface VideoUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadVideoFile = async (
  videoFile: File,
  fileName: string
): Promise<VideoUploadResult> => {
  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${fileName}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('video-uploads')
      .upload(uniqueFileName, videoFile, {
        contentType: videoFile.type,
        upsert: false
      });

    if (error) {
      console.error('Error uploading video file:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('video-uploads')
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('Unexpected error uploading video:', error);
    return {
      success: false,
      error: 'Failed to upload video file'
    };
  }
};

export const deleteVideoFile = async (filePath: string): Promise<boolean> => {
  try {
    // Extract filename from full URL if needed
    const fileName = filePath.includes('/video-uploads/') 
      ? filePath.split('/video-uploads/').pop() || filePath
      : filePath;

    const { error } = await supabase.storage
      .from('video-uploads')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting video file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting video:', error);
    return false;
  }
};
