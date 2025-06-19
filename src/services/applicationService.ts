
import { supabase } from '@/integrations/supabase/client';
import { ApplicationFormData } from '@/components/application/formSchema';

export interface ApplicationResult {
  applicationId: string;
  isUpdate: boolean;
}

export const createOrUpdateApplication = async (
  candidateId: string, 
  jobRoleId: string | undefined, 
  data: ApplicationFormData,
  isVideoEditor: boolean
): Promise<ApplicationResult> => {
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

  // Prepare form data based on role type
  const formData = isVideoEditor ? {
    basicInfo: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      location: data.location,
    },
    availability: {
      weekendAvailability: data.weekendAvailability,
    },
    videoEditorPreScreening: {
      motivationResponse: data.videoEditorMotivation,
      experienceResponse: data.videoEditorExperience,
      availabilityResponse: data.videoEditorAvailability,
      clientCollaboration: data.clientCollaboration,
      projectTimelines: data.projectTimelines,
      creativeProcessApproach: data.creativeProcessApproach,
    },
    portfolio: {
      portfolioUrl: data.portfolioUrl,
      videoUpload: data.videoUpload,
      hasPortfolioUrl: !!data.portfolioUrl,
      hasVideoUpload: !!data.videoUpload,
    },
    experience: {
      videoEditingExperience: data.videoEditingExperience,
      aiToolsExperience: data.aiToolsExperience,
      softwareSkills: data.softwareSkills,
      creativeProcess: data.creativeProcess,
      recentProjects: data.recentProjects,
    },
  } : {
    basicInfo: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      location: data.location,
    },
    availability: {
      weekendAvailability: data.weekendAvailability,
    },
    preScreening: {
      motivationResponse: data.motivationResponse,
      experienceResponse: data.experienceResponse,
      availabilityResponse: data.availabilityResponse,
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
  const hasVideoUpload = !!data.videoUpload;

  if (existingApplication) {
    // Update existing application
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        status: 'applied',
        form_data: formData,
        has_voice_recording: hasVoiceRecording,
        has_video: hasVideoUpload,
        notes: isVideoEditor 
          ? `Video Editor application (Updated). Location: ${data.location}. Weekend availability: ${data.weekendAvailability}. Portfolio and experience submitted.`
          : `Remote Appointment Setter application (Updated). Location: ${data.location}. Weekend availability: ${data.weekendAvailability}. Pre-screening and listening test completed.`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingApplication.id);

    if (updateError) throw updateError;
    return { applicationId: existingApplication.id, isUpdate: true };
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
        has_video: hasVideoUpload,
        notes: isVideoEditor 
          ? `Video Editor application. Location: ${data.location}. Weekend availability: ${data.weekendAvailability}. Portfolio and experience submitted.`
          : `Remote Appointment Setter application. Location: ${data.location}. Weekend availability: ${data.weekendAvailability}. Pre-screening and listening test completed.`,
      })
      .select('id')
      .single();

    if (applicationError) throw applicationError;
    return { applicationId: newApplication.id, isUpdate: false };
  }
};
