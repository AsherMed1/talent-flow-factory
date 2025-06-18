
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UploadedCandidate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  jobRole?: string;
  uploadedAt: string;
  hasApplied: boolean;
}

export const useUploadedCandidates = () => {
  return useQuery({
    queryKey: ['uploaded-candidates'],
    queryFn: async () => {
      // For now, we'll store uploaded candidates in a simple way
      // This could be expanded to use a dedicated table later
      const stored = localStorage.getItem('uploaded-candidates');
      return stored ? JSON.parse(stored) : [];
    }
  });
};

export const useAddUploadedCandidates = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (candidates: Omit<UploadedCandidate, 'id' | 'uploadedAt' | 'hasApplied'>[]) => {
      const existing = JSON.parse(localStorage.getItem('uploaded-candidates') || '[]');
      const existingEmails = existing.map((c: UploadedCandidate) => c.email.toLowerCase());
      
      const newCandidates = candidates
        .filter(candidate => !existingEmails.includes(candidate.email.toLowerCase()))
        .map(candidate => ({
          ...candidate,
          id: crypto.randomUUID(),
          uploadedAt: new Date().toISOString(),
          hasApplied: false
        }));
      
      const updated = [...existing, ...newCandidates];
      localStorage.setItem('uploaded-candidates', JSON.stringify(updated));
      
      return newCandidates;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploaded-candidates'] });
    }
  });
};

export const useUploadedCandidateStats = () => {
  return useQuery({
    queryKey: ['uploaded-candidate-stats'],
    queryFn: async () => {
      const stored = localStorage.getItem('uploaded-candidates');
      const candidates: UploadedCandidate[] = stored ? JSON.parse(stored) : [];
      
      return {
        totalUploaded: candidates.length,
        notYetApplied: candidates.filter(c => !c.hasApplied).length,
        uniqueEmails: new Set(candidates.map(c => c.email.toLowerCase())).size
      };
    }
  });
};
