
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

  // Prepare comprehensive form data structure that aligns with database schema
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
    // Unified pre-screening structure for both roles
    preScreening: {
      motivationResponse: data.motivationResponse,
      experienceResponse: data.experienceResponse,
      availabilityResponse: data.availabilityResponse,
      // Optional collaboration response for video editors
      ...(isVideoEditor && data.collaborationResponse && {
        collaborationResponse: data.collaborationResponse
      })
    },
    // Video Editor specific sections
    ...(isVideoEditor && {
      portfolio: {
        portfolioUrl: data.portfolioUrl || null,
        videoUpload: data.videoUpload || null,
        hasPortfolioUrl: !!(data.portfolioUrl && data.portfolioUrl.trim()),
        hasVideoUpload: !!(data.videoUpload && data.videoUpload.trim()),
      },
      experience: {
        videoEditingExperience: data.videoEditingExperience || null,
        aiToolsExperience: data.aiToolsExperience || null,
        softwareSkills: data.softwareSkills || null,
        creativeProcess: data.creativeProcess || null,
        recentProjects: data.recentProjects || null,
      }
    }),
    // Appointment Setter specific sections
    ...(!isVideoEditor && {
      voiceRecordings: {
        hasIntroduction: !!(data.introductionRecording && data.introductionRecording.trim()),
        hasScript: !!(data.scriptRecording && data.scriptRecording.trim()),
        introductionRecording: data.introductionRecording || null,
        scriptRecording: data.scriptRecording || null,
      },
      listeningComprehension: {
        husbandName: data.husbandName || null,
        treatmentNotDone: data.treatmentNotDone || null,
      },
      uploads: {
        hasDownloadSpeed: !!(data.downloadSpeedScreenshot && data.downloadSpeedScreenshot.trim()),
        hasUploadSpeed: !!(data.uploadSpeedScreenshot && data.uploadSpeedScreenshot.trim()),
        hasWorkstation: !!(data.workstationPhoto && data.workstationPhoto.trim()),
        downloadSpeedScreenshot: data.downloadSpeedScreenshot || null,
        uploadSpeedScreenshot: data.uploadSpeedScreenshot || null,
        workstationPhoto: data.workstationPhoto || null,
      }
    }),
    // Store form metadata for tracking
    metadata: {
      roleType: isVideoEditor ? 'video_editor' : 'appointment_setter',
      submissionTimestamp: new Date().toISOString(),
      formVersion: '2.0'
    }
  };

  // Determine file flags for database columns
  const hasVoiceRecording = !!(data.introductionRecording || data.scriptRecording);
  const hasVideoUpload = !!(data.videoUpload && data.videoUpload.trim());

  // Create comprehensive notes based on role type
  const notes = isVideoEditor 
    ? `Video Editor application${existingApplication ? ' (Updated)' : ''}. Location: ${data.location}. Weekend availability: ${data.weekendAvailability}. Portfolio: ${data.portfolioUrl ? 'Yes' : 'No'}. Video demo: ${hasVideoUpload ? 'Yes' : 'No'}. Software skills: ${data.softwareSkills ? 'Provided' : 'Not provided'}.`
    : `Remote Appointment Setter application${existingApplication ? ' (Updated)' : ''}. Location: ${data.location}. Weekend availability: ${data.weekendAvailability}. Voice recordings: ${hasVoiceRecording ? 'Yes' : 'No'}. Listening test: ${data.husbandName || data.treatmentNotDone ? 'Completed' : 'Not completed'}.`;

  if (existingApplication) {
    // Update existing application
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        status: 'applied',
        form_data: formData,
        has_voice_recording: hasVoiceRecording,
        has_video: hasVideoUpload,
        notes: notes,
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
        notes: notes,
      })
      .select('id')
      .single();

    if (applicationError) throw applicationError;
    return { applicationId: newApplication.id, isUpdate: false };
  }
};
