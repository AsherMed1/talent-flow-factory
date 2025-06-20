
import { useQuery } from '@tanstack/react-query';
import { ApplicationService } from '@/services/database/applicationService';

// Re-export types for backward compatibility
export type { SafePreScreeningResponse as PreScreeningResponse, SafeApplication as Application } from '@/services/database/types';

export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const result = await ApplicationService.getAll();
      if (result.error) {
        throw result.error;
      }
      return result.data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes in cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  });
};

export const useApplicationStats = () => {
  return useQuery({
    queryKey: ['application-stats'],
    queryFn: async () => {
      const result = await ApplicationService.getStats();
      if (result.error) {
        throw result.error;
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - stats don't change often
    gcTime: 15 * 60 * 1000, // 15 minutes in cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
};
