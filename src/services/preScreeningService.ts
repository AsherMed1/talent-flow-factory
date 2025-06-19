
import { supabase } from '@/integrations/supabase/client';
import { ApplicationFormData } from '@/components/application/formSchema';
import { scorePreScreeningResponses } from '@/services/preScreeningScorer';

export const handlePreScreeningScoring = async (
  applicationId: string,
  data: ApplicationFormData,
  isVideoEditor: boolean
) => {
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
};
