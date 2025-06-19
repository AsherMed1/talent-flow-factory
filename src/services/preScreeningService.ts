
import { supabase } from '@/integrations/supabase/client';
import { ApplicationFormData } from '@/components/application/formSchema';
import { scorePreScreeningResponses } from '@/services/preScreeningScorer';

export const handlePreScreeningScoring = async (
  applicationId: string,
  data: ApplicationFormData,
  isVideoEditor: boolean
) => {
  // Ensure we have the unified pre-screening responses
  if (data.motivationResponse && data.experienceResponse && data.availabilityResponse) {
    try {
      console.log('Processing pre-screening for:', isVideoEditor ? 'Video Editor' : 'Appointment Setter');
      
      // Score the responses with role-specific logic
      const scores = await scorePreScreeningResponses(
        data.motivationResponse,
        data.experienceResponse,
        data.availabilityResponse,
        data.collaborationResponse, // This is optional and only for video editors
        isVideoEditor
      );

      console.log('Pre-screening scores calculated:', scores);

      // Save pre-screening scores to database
      const { error } = await supabase
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

      if (error) {
        console.error('Error saving pre-screening scores:', error);
        throw error;
      }

      console.log('Pre-screening scores saved successfully');
    } catch (scoringError) {
      console.error('Error in pre-screening scoring process:', scoringError);
      // Don't throw here to prevent blocking application submission
      // Just log the error for debugging
    }
  } else {
    console.warn('Missing required pre-screening responses:', {
      motivationResponse: !!data.motivationResponse,
      experienceResponse: !!data.experienceResponse,
      availabilityResponse: !!data.availabilityResponse
    });
  }
};
