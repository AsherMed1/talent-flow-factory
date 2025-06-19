
import { useEffect, useState, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationFormData } from './formSchema';
import { saveFormData } from './formStorage';
import { debounce } from 'lodash';

export const useEnhancedAutoSave = (form: UseFormReturn<ApplicationFormData>) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const debouncedSave = useCallback(
    debounce(async (data: Partial<ApplicationFormData>) => {
      setIsSaving(true);
      try {
        // Enhanced save timing based on data type
        const hasLargeFiles = data.videoUpload || data.downloadSpeedScreenshot || 
                             data.uploadSpeedScreenshot || data.workstationPhoto;
        
        // Simulate appropriate delay based on content
        const delay = hasLargeFiles ? 500 : 200;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        saveFormData(data);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        
        console.log('Auto-save completed:', {
          hasVideoUpload: !!data.videoUpload,
          hasPortfolioUrl: !!data.portfolioUrl,
          hasVoiceRecordings: !!(data.introductionRecording || data.scriptRecording),
          hasFileUploads: hasLargeFiles
        });
      } catch (error) {
        console.error('Error saving form data:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000), // Slightly longer debounce for better UX
    []
  );

  const watchedValues = form.watch();
  
  useEffect(() => {
    setHasUnsavedChanges(true);
    debouncedSave(watchedValues);
  }, [watchedValues, debouncedSave]);

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
  };
};
