
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
        // Simulate API delay for better UX feedback
        await new Promise(resolve => setTimeout(resolve, 300));
        saveFormData(data);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Error saving form data:', error);
      } finally {
        setIsSaving(false);
      }
    }, 800),
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
