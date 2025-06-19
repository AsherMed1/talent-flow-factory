
import { ApplicationFormData } from './formSchema';
import { clearSavedData } from './formStorage';
import { createOrUpdateCandidate, updateCandidateTags } from '@/services/candidateService';
import { createOrUpdateApplication } from '@/services/applicationService';
import { handlePreScreeningScoring } from '@/services/preScreeningService';
import { triggerVoiceAnalysis } from '@/services/voiceAnalysisService';

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
    const { candidateId } = await createOrUpdateCandidate(data);

    // Determine if this is a video editor application
    const isVideoEditor = !!(data.videoEditingExperience || data.portfolioUrl || data.videoUpload);

    // Create or update application
    const { applicationId, isUpdate } = await createOrUpdateApplication(
      candidateId, 
      jobRoleId, 
      data, 
      isVideoEditor
    );

    // Handle pre-screening scoring
    await handlePreScreeningScoring(applicationId, data, isVideoEditor);

    // Update candidate tags
    await updateCandidateTags(candidateId, data, isVideoEditor);

    // Trigger AI analysis if there are voice recordings
    await triggerVoiceAnalysis(
      applicationId,
      data.introductionRecording,
      data.scriptRecording
    );

    // Clear saved data
    clearSavedData();

    return {
      success: true,
      message: isUpdate 
        ? "Your existing application has been updated with the new information." 
        : "Thank you for your interest. We'll review your application and get back to you soon.",
      isUpdate,
    };
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};
