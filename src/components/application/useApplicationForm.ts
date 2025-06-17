
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema, ApplicationFormData } from './formSchema';
import { loadSavedFormData, saveFormData, clearSavedData } from './formStorage';

export const useApplicationForm = () => {
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  // Auto-save functionality
  useEffect(() => {
    const savedData = loadSavedFormData();
    if (savedData) {
      Object.keys(savedData).forEach(key => {
        if (savedData[key as keyof ApplicationFormData] !== undefined && savedData[key as keyof ApplicationFormData] !== '') {
          form.setValue(key as keyof ApplicationFormData, savedData[key as keyof ApplicationFormData]);
        }
      });
    }
  }, [form]);

  const watchedValues = form.watch();
  useEffect(() => {
    saveFormData(watchedValues);
  }, [watchedValues]);

  const handleClearSavedData = () => {
    clearSavedData();
    form.reset();
    return "All saved form data has been cleared.";
  };

  return {
    form,
    handleClearSavedData,
  };
};
