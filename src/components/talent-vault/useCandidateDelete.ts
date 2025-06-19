
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useCandidateDelete = (refetch: () => Promise<any>) => {
  const [deletingCandidateId, setDeletingCandidateId] = useState<string | null>(null);
  const [deletedCandidateIds, setDeletedCandidateIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleDeleteCandidate = async (candidateId: string, candidateName: string) => {
    // Immediately mark candidate as being deleted and remove from UI
    setDeletingCandidateId(candidateId);
    setDeletedCandidateIds(prev => new Set([...prev, candidateId]));
    
    try {
      console.log('Starting comprehensive deletion process for candidate:', candidateId, 'Name:', candidateName);
      
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

      // Delete all related data in the correct order
      if (applications && applications.length > 0) {
        const applicationIds = applications.map(app => app.id);

        // Delete pre-screening responses for each application
        const { error: preScreeningError } = await supabase
          .from('pre_screening_responses')
          .delete()
          .in('application_id', applicationIds);

        if (preScreeningError) {
          console.error('Error deleting pre-screening responses:', preScreeningError);
          throw new Error(`Failed to delete pre-screening responses: ${preScreeningError.message}`);
        }
        console.log('Successfully deleted pre-screening responses');

        // Delete video analysis details for each application
        const { error: videoAnalysisError } = await supabase
          .from('video_analysis_details')
          .delete()
          .in('application_id', applicationIds);

        if (videoAnalysisError) {
          console.error('Error deleting video analysis details:', videoAnalysisError);
          throw new Error(`Failed to delete video analysis details: ${videoAnalysisError.message}`);
        }
        console.log('Successfully deleted video analysis details');

        // Delete video analysis logs for each application
        const { error: videoLogsError } = await supabase
          .from('video_analysis_logs')
          .delete()
          .in('application_id', applicationIds);

        if (videoLogsError) {
          console.error('Error deleting video analysis logs:', videoLogsError);
          throw new Error(`Failed to delete video analysis logs: ${videoLogsError.message}`);
        }
        console.log('Successfully deleted video analysis logs');

        // Delete applications
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
        title: "Candidate Completely Removed",
        description: `${candidateName} and all associated records have been permanently removed from the entire system.`,
      });

      // Force refresh the candidates list and any other dependent data
      await refetch();
      
    } catch (error) {
      console.error('Detailed error during comprehensive candidate deletion:', error);
      
      // If deletion failed, remove from deleted set so they reappear
      setDeletedCandidateIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(candidateId);
        return newSet;
      });
      
      toast({
        title: "Deletion Failed",
        description: error instanceof Error ? error.message : "Failed to delete candidate completely. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingCandidateId(null);
    }
  };

  return {
    deletingCandidateId,
    deletedCandidateIds,
    handleDeleteCandidate
  };
};
