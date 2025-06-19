
import { supabase } from '@/integrations/supabase/client';
import { ApplicationFormData } from '@/components/application/formSchema';
import { scorePreScreeningResponses } from '@/services/preScreeningScorer';

export const handlePreScreeningScoring = async (
  applicationId: string,
  data: ApplicationFormData,
  isVideoEditor: boolean
) => {
  // Both video editors and appointment setters now use the same unified field names
  if (data.motivationResponse && data.experienceResponse && data.availabilityResponse) {
    try {
      // Pass the collaboration response for video editors (optional field)
      const collaborationResponse = isVideoEditor ? data.collaborationResponse : undefined;
      
      const scores = await scorePreScreeningResponses(
        data.motivationResponse,
        data.experienceResponse,
        data.availabilityResponse,
        collaborationResponse,
        isVideoEditor
      );

      // Save pre-screening scores with unified field names
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
};
