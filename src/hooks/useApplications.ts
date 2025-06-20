
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
    staleTime: 3 * 60 * 1000, // 3 minutes - increased for better caching
    gcTime: 15 * 60 * 1000, // 15 minutes - increased cache time
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1, // Reduced from 2 to 1 for faster failure
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
    staleTime: 10 * 60 * 1000, // 10 minutes - stats change less frequently
    gcTime: 30 * 60 * 1000, // 30 minutes - keep stats cached longer
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
};
