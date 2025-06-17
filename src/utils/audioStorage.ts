
import { supabase } from '@/integrations/supabase/client';

export interface AudioUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadAudioFile = async (
  audioBlob: Blob,
  fileName: string
): Promise<AudioUploadResult> => {
  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${fileName}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('voice-recordings')
      .upload(uniqueFileName, audioBlob, {
        contentType: audioBlob.type || 'audio/webm',
        upsert: false
      });

    if (error) {
      console.error('Error uploading audio file:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('voice-recordings')
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('Unexpected error uploading audio:', error);
    return {
      success: false,
      error: 'Failed to upload audio file'
    };
  }
};

export const deleteAudioFile = async (filePath: string): Promise<boolean> => {
  try {
    // Extract filename from full URL if needed
    const fileName = filePath.includes('/voice-recordings/') 
      ? filePath.split('/voice-recordings/').pop() || filePath
      : filePath;

    const { error } = await supabase.storage
      .from('voice-recordings')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting audio file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting audio:', error);
    return false;
  }
};
