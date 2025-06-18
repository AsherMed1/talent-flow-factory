
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ApplicationFormHeader } from './application/ApplicationFormHeader';
import { BasicInfoSection } from './application/BasicInfoSection';
import { VoiceRecordingSection } from './application/VoiceRecordingSection';
import { FileUploadSection } from './application/FileUploadSection';
import { ListeningTestSection } from './application/ListeningTestSection';
import { PreScreeningSection } from './application/PreScreeningSection';
import { TermsSection } from './application/TermsSection';
import { AutoSaveIndicator } from './application/AutoSaveIndicator';
import { ApplicationFormData } from './application/formSchema';
import { useApplicationForm } from './application/useApplicationForm';
import { useEnhancedAutoSave } from './application/useEnhancedAutoSave';
import { submitApplication } from './application/ApplicationFormSubmission';

interface ApplicationFormProps {
  jobRoleId?: string;
  onSuccess?: () => void;
}

export const ApplicationForm = ({ jobRoleId, onSuccess }: ApplicationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { form, handleClearSavedData } = useApplicationForm();
  const { isSaving, lastSaved, hasUnsavedChanges } = useEnhancedAutoSave(form);

  const handleClearData = () => {
    const message = handleClearSavedData();
    toast({
      title: "Form Cleared",
      description: message,
    });
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);

    try {
      const result = await submitApplication(data, jobRoleId);

      toast({
        title: result.isUpdate ? "Application Updated Successfully!" : "Application Submitted Successfully!",
        description: result.message,
      });

      form.reset();
      navigate('/thank-you');
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <ApplicationFormHeader onClearSavedData={handleClearData} />
      
      <AutoSaveIndicator 
        isSaving={isSaving}
        lastSaved={lastSaved}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      
      <Card>
        <CardContent className="p-4 md:p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BasicInfoSection form={form} />
            <PreScreeningSection form={form} />
            <VoiceRecordingSection isSubmitting={isSubmitting} form={form} />
            <FileUploadSection form={form} />
            <ListeningTestSection form={form} />
            <TermsSection form={form} />

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isSubmitting ? 'Submitting...' : 'Submit!'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
