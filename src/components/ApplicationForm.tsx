
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ApplicationFormHeader } from './application/ApplicationFormHeader';
import { BasicInfoSection } from './application/BasicInfoSection';
import { VoiceRecordingSection } from './application/VoiceRecordingSection';
import { FileUploadSection } from './application/FileUploadSection';
import { ListeningTestSection } from './application/ListeningTestSection';
import { TermsSection } from './application/TermsSection';
import { applicationSchema, ApplicationFormData } from './application/formSchema';
import { loadSavedFormData, saveFormData, clearSavedData } from './application/formStorage';

interface ApplicationFormProps {
  jobRoleId?: string;
  onSuccess?: () => void;
}

export const ApplicationForm = ({ jobRoleId, onSuccess }: ApplicationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
    toast({
      title: "Form Cleared",
      description: "All saved form data has been cleared.",
    });
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    console.log('Submitting application:', data);

    try {
      // Create or find the candidate
      const fullName = `${data.firstName} ${data.lastName}`;
      
      let candidateId: string;
      
      const { data: existingCandidate } = await supabase
        .from('candidates')
        .select('id')
        .eq('email', data.email)
        .single();

      if (existingCandidate) {
        candidateId = existingCandidate.id;
        
        await supabase
          .from('candidates')
          .update({
            name: fullName,
            updated_at: new Date().toISOString(),
          })
          .eq('id', candidateId);
      } else {
        const { data: newCandidate, error: candidateError } = await supabase
          .from('candidates')
          .insert({
            name: fullName,
            email: data.email,
          })
          .select('id')
          .single();

        if (candidateError) throw candidateError;
        candidateId = newCandidate.id;
      }

      // Get job role ID
      let roleId = jobRoleId;
      if (!roleId) {
        const { data: appointmentSetterRole } = await supabase
          .from('job_roles')
          .select('id')
          .eq('name', 'Appointment Setter')
          .single();
        
        roleId = appointmentSetterRole?.id;
      }

      // Check if application already exists for this candidate and role
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('candidate_id', candidateId)
        .eq('job_role_id', roleId)
        .single();

      // Prepare form data
      const formData = {
        basicInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          location: data.location,
        },
        availability: {
          weekendAvailability: data.weekendAvailability,
        },
        voiceRecordings: {
          hasIntroduction: !!data.introductionRecording,
          hasScript: !!data.scriptRecording,
        },
        listeningComprehension: {
          husbandName: data.husbandName,
          treatmentNotDone: data.treatmentNotDone,
        },
        uploads: {
          hasDownloadSpeed: !!data.downloadSpeedScreenshot,
          hasUploadSpeed: !!data.uploadSpeedScreenshot,
          hasWorkstation: !!data.workstationPhoto,
        },
      };

      if (existingApplication) {
        // Update existing application
        const { error: updateError } = await supabase
          .from('applications')
          .update({
            status: 'applied',
            form_data: formData,
            has_voice_recording: !!(data.introductionRecording || data.scriptRecording),
            notes: `Remote Appointment Setter application (Updated). Location: ${data.location}. Weekend availability: ${data.weekendAvailability}. Listening test completed.`,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingApplication.id);

        if (updateError) throw updateError;

        toast({
          title: "Application Updated Successfully!",
          description: "Your existing application has been updated with the new information.",
        });
      } else {
        // Create new application
        const { data: newApplication, error: applicationError } = await supabase
          .from('applications')
          .insert({
            candidate_id: candidateId,
            job_role_id: roleId,
            status: 'applied',
            form_data: formData,
            has_voice_recording: !!(data.introductionRecording || data.scriptRecording),
            notes: `Remote Appointment Setter application. Location: ${data.location}. Weekend availability: ${data.weekendAvailability}. Listening test completed.`,
          })
          .select('id')
          .single();

        if (applicationError) throw applicationError;

        toast({
          title: "Application Submitted Successfully!",
          description: "Thank you for your interest. We'll review your application and get back to you soon.",
        });
      }

      // Add or update tags (remove existing tags first to avoid duplicates)
      await supabase
        .from('candidate_tags')
        .delete()
        .eq('candidate_id', candidateId);

      const tags = ['Remote Worker', 'Weekend Available'];
      if (data.introductionRecording && data.scriptRecording) tags.push('Voice Submitted');
      
      for (const tag of tags) {
        await supabase
          .from('candidate_tags')
          .insert({
            candidate_id: candidateId,
            tag: tag,
          });
      }

      // Clear saved data
      clearSavedData();
      form.reset();
      
      // Navigate to thank you page instead of calling onSuccess
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <ApplicationFormHeader onClearSavedData={handleClearSavedData} />
      
      <Card>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BasicInfoSection form={form} />
            <VoiceRecordingSection isSubmitting={isSubmitting} />
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
