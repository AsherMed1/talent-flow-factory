
import { supabase } from '@/integrations/supabase/client';
import { ApplicationFormData } from './formSchema';
import { clearSavedData } from './formStorage';

export interface SubmissionResult {
  success: boolean;
  message: string;
  isUpdate?: boolean;
}

export const submitApplication = async (
  data: ApplicationFormData,
  jobRoleId?: string
): Promise<SubmissionResult> => {
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

    // Prepare form data with voice recordings and uploaded files
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
        introductionRecording: data.introductionRecording,
        scriptRecording: data.scriptRecording,
      },
      listeningComprehension: {
        husbandName: data.husbandName,
        treatmentNotDone: data.treatmentNotDone,
      },
      uploads: {
        hasDownloadSpeed: !!data.downloadSpeedScreenshot,
        hasUploadSpeed: !!data.uploadSpeedScreenshot,
        hasWorkstation: !!data.workstationPhoto,
        downloadSpeedScreenshot: data.downloadSpeedScreenshot,
        uploadSpeedScreenshot: data.uploadSpeedScreenshot,
        workstationPhoto: data.workstationPhoto,
      },
    };

    const hasVoiceRecording = !!(data.introductionRecording || data.scriptRecording);

    if (existingApplication) {
      // Update existing application
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'applied',
          form_data: formData,
          has_voice_recording: hasVoiceRecording,
          notes: `Remote Appointment Setter application (Updated). Location: ${data.location}. Weekend availability: ${data.weekendAvailability}. Listening test completed.`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingApplication.id);

      if (updateError) throw updateError;

      // Update candidate tags
      await updateCandidateTags(candidateId, data);

      // Clear saved data
      clearSavedData();

      return {
        success: true,
        message: "Your existing application has been updated with the new information.",
        isUpdate: true,
      };
    } else {
      // Create new application
      const { data: newApplication, error: applicationError } = await supabase
        .from('applications')
        .insert({
          candidate_id: candidateId,
          job_role_id: roleId,
          status: 'applied',
          form_data: formData,
          has_voice_recording: hasVoiceRecording,
          notes: `Remote Appointment Setter application. Location: ${data.location}. Weekend availability: ${data.weekendAvailability}. Listening test completed.`,
        })
        .select('id')
        .single();

      if (applicationError) throw applicationError;

      // Update candidate tags
      await updateCandidateTags(candidateId, data);

      // Clear saved data
      clearSavedData();

      return {
        success: true,
        message: "Thank you for your interest. We'll review your application and get back to you soon.",
        isUpdate: false,
      };
    }
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

const updateCandidateTags = async (candidateId: string, data: ApplicationFormData) => {
  // Remove existing tags first to avoid duplicates
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
};
