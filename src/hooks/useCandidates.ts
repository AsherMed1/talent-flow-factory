
import { useQuery } from '@tanstack/react-query';
import { CandidateService } from '@/services/database/candidateService';

// Re-export types for backward compatibility
export type { SafeCandidate as Candidate } from '@/services/database/types';

export const useCandidates = () => {
  return useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      const result = await CandidateService.getAll();
      if (result.error) {
        throw result.error;
      }
      return result.data || [];
    }
  });
};
