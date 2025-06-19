
import { supabase } from '@/integrations/supabase/client';
import { ApplicationFormData } from './formSchema';
import { clearSavedData } from './formStorage';
import { scorePreScreeningResponses } from '@/services/preScreeningScorer';

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

    // Determine if this is a video editor application
    const isVideoEditor = !!(data.videoEditingExperience || data.portfolioUrl || data.videoUpload);

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

    let applicationId: string;

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
      applicationId = existingApplication.id;
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
      applicationId = newApplication.id;
    }

    // Score the pre-screening responses
    if (isVideoEditor) {
      // Score video editor pre-screening responses
      if (data.videoEditorMotivation && data.videoEditorExperience && data.videoEditorAvailability) {
        try {
          const scores = await scorePreScreeningResponses(
            data.videoEditorMotivation,
            data.videoEditorExperience,
            data.videoEditorAvailability
          );

          // Save pre-screening scores
          await supabase
            .from('pre_screening_responses')
            .upsert({
              application_id: applicationId,
              motivation_response: data.videoEditorMotivation,
              motivation_score: scores.motivationScore,
              experience_response: data.videoEditorExperience,
              experience_score: scores.experienceScore,
              availability_response: data.videoEditorAvailability,
              availability_score: scores.availabilityScore,
              communication_score: scores.communicationScore,
              overall_prescreening_score: scores.overallScore,
              scored_at: new Date().toISOString(),
            });

          console.log('Video editor pre-screening scores saved:', scores);
        } catch (scoringError) {
          console.error('Error scoring video editor pre-screening responses:', scoringError);
        }
      }
    } else {
      // Score appointment setter pre-screening responses
      if (data.motivationResponse && data.experienceResponse && data.availabilityResponse) {
        try {
          const scores = await scorePreScreeningResponses(
            data.motivationResponse,
            data.experienceResponse,
            data.availabilityResponse
          );

          // Save pre-screening scores
          await supabase
            .from('pre_screening_responses')
            .upsert({
              application_id: applicationId,
              motivation_response: data.motivationResponse,
              motivation_score: scores.motivationScore,
              experience_response: data.experienceResponse,
              experience_score: scores.experienceScore,
              availability_response: data.availabilityResponse,
              availability_score: scores.availabilityScore,
              communication_score: scores.communicationScore,
              overall_prescreening_score: scores.overallScore,
              scored_at: new Date().toISOString(),
            });

          console.log('Pre-screening scores saved:', scores);
        } catch (scoringError) {
          console.error('Error scoring pre-screening responses:', scoringError);
        }
      }
    }

    // Update candidate tags
    await updateCandidateTags(candidateId, data, isVideoEditor);

    // Trigger AI analysis if there are voice recordings
    if (hasVoiceRecording && (data.introductionRecording || data.scriptRecording)) {
      console.log('Triggering AI analysis for new application:', applicationId);
      
      try {
        const audioData = data.introductionRecording || data.scriptRecording;
        
        // Trigger the analyze-voice edge function in the background
        supabase.functions.invoke('analyze-voice', {
          body: {
            applicationId: applicationId,
            audioData: audioData
          }
        }).then(({ data: analysisData, error: analysisError }) => {
          if (analysisError) {
            console.error('Error in background AI analysis:', analysisError);
          } else {
            console.log('Background AI analysis completed:', analysisData);
          }
        });
        
      } catch (analysisError) {
        console.error('Error triggering AI analysis:', analysisError);
      }
    }

    // Clear saved data
    clearSavedData();

    return {
      success: true,
      message: existingApplication 
        ? "Your existing application has been updated with the new information." 
        : "Thank you for your interest. We'll review your application and get back to you soon.",
      isUpdate: !!existingApplication,
    };
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

const updateCandidateTags = async (candidateId: string, data: ApplicationFormData, isVideoEditor: boolean) => {
  // Remove existing tags first to avoid duplicates
  await supabase
    .from('candidate_tags')
    .delete()
    .eq('candidate_id', candidateId);

  const tags = ['Remote Worker'];
  
  if (isVideoEditor) {
    tags.push('Video Editor', 'Creative Professional');
    if (data.portfolioUrl) tags.push('Portfolio Submitted');
    if (data.videoUpload) tags.push('Demo Reel Uploaded');
    if (data.aiToolsExperience) tags.push('AI Tools Experience');
  } else {
    tags.push('Weekend Available', 'Pre-Screened');
    if (data.introductionRecording && data.scriptRecording) tags.push('Voice Submitted');
  }
  
  for (const tag of tags) {
    await supabase
      .from('candidate_tags')
      .insert({
        candidate_id: candidateId,
        tag: tag,
      });
  }
};
