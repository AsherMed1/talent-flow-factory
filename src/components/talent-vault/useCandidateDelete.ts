
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useCandidateDelete = (refetch: () => Promise<any>) => {
  const [deletingCandidateId, setDeletingCandidateId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteCandidate = async (candidateId: string, candidateName: string) => {
    setDeletingCandidateId(candidateId);
    
    try {
      console.log('Starting deletion process for candidate:', candidateId, 'Name:', candidateName);
      
      // Check if candidate exists first
      const { data: candidateCheck, error: checkError } = await supabase
        .from('candidates')
        .select('id, name, email')
        .eq('id', candidateId)
        .single();

      if (checkError) {
        console.error('Error checking candidate existence:', checkError);
        throw new Error(`Cannot find candidate: ${checkError.message}`);
      }

      console.log('Found candidate to delete:', candidateCheck);

      // Get all applications for this candidate first
      const { data: applications, error: getAppsError } = await supabase
        .from('applications')
        .select('id')
        .eq('candidate_id', candidateId);

      if (getAppsError) {
        console.error('Error getting applications:', getAppsError);
        throw getAppsError;
      }

      console.log(`Found ${applications?.length || 0} applications to delete`);

      // Delete applications first
      if (applications && applications.length > 0) {
        const { error: applicationsError } = await supabase
          .from('applications')
          .delete()
          .eq('candidate_id', candidateId);

        if (applicationsError) {
          console.error('Error deleting applications:', applicationsError);
          throw new Error(`Failed to delete applications: ${applicationsError.message}`);
        }
        console.log('Successfully deleted applications');
      }

      // Delete candidate tags
      const { error: tagsError } = await supabase
        .from('candidate_tags')
        .delete()
        .eq('candidate_id', candidateId);

      if (tagsError) {
        console.error('Error deleting tags:', tagsError);
        throw new Error(`Failed to delete tags: ${tagsError.message}`);
      }
      console.log('Successfully deleted tags');

      // Finally delete the candidate
      const { error: candidateError } = await supabase
        .from('candidates')
        .delete()
        .eq('id', candidateId);

      if (candidateError) {
        console.error('Error deleting candidate:', candidateError);
        throw new Error(`Failed to delete candidate: ${candidateError.message}`);
      }

      console.log('Successfully deleted candidate:', candidateId);

      toast({
        title: "Candidate Deleted",
        description: `${candidateName} has been successfully removed from the system.`,
      });

      // Force refresh the candidates list
      await refetch();
      
    } catch (error) {
      console.error('Detailed error during candidate deletion:', error);
      toast({
        title: "Deletion Failed",
        description: error instanceof Error ? error.message : "Failed to delete candidate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingCandidateId(null);
    }
  };

  return {
    deletingCandidateId,
    handleDeleteCandidate
  };
};
