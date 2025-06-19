
import { supabase } from '@/integrations/supabase/client';
import { ApplicationFormData } from '@/components/application/formSchema';

export interface CandidateResult {
  candidateId: string;
  isExisting: boolean;
}

export const createOrUpdateCandidate = async (data: ApplicationFormData): Promise<CandidateResult> => {
  const fullName = `${data.firstName} ${data.lastName}`;
  
  const { data: existingCandidate } = await supabase
    .from('candidates')
    .select('id')
    .eq('email', data.email)
    .single();

  if (existingCandidate) {
    await supabase
      .from('candidates')
      .update({
        name: fullName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingCandidate.id);

    return { candidateId: existingCandidate.id, isExisting: true };
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
    return { candidateId: newCandidate.id, isExisting: false };
  }
};

export const updateCandidateTags = async (candidateId: string, data: ApplicationFormData, isVideoEditor: boolean) => {
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
