
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
    }
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
    }
  });
};
