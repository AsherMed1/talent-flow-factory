
import { SafeApplication, DatabaseResult } from './types';
import { ApplicationTransformers } from './applicationTransformers';
import { ApplicationQueries } from './applicationQueries';

export class OptimizedApplicationService {
  // Get optimized paginated results with proper relationship specification
  static async getPaginatedOptimized(
    offset: number, 
    limit: number, 
    status?: string, 
    jobRoleId?: string
  ): Promise<DatabaseResult<{ applications: SafeApplication[], totalCount: number }>> {
    try {
      // Use the optimized database function instead of direct query to avoid relationship issues
      const paginatedResult = await ApplicationQueries.getPaginatedData(offset, limit, status, jobRoleId);
      
      if (paginatedResult.error) {
        return { data: null, error: paginatedResult.error };
      }

      const data = paginatedResult.data;
      if (!data || data.length === 0) {
        return { data: { applications: [], totalCount: 0 }, error: null };
      }

      // Now get the full application data for the IDs we found
      const applicationIds = data.map((item: any) => item.id);
      
      const fullApplicationsResult = await ApplicationQueries.getFullApplicationData(applicationIds);
      
      if (fullApplicationsResult.error) {
        return { data: null, error: fullApplicationsResult.error };
      }

      // Transform to SafeApplication format using our transformer
      const applications: SafeApplication[] = (fullApplicationsResult.data || []).map(
        ApplicationTransformers.transformToSafeApplication
      );
      const totalCount = data.length > 0 ? Number(data[0].total_count) : 0;

      return { 
        data: { 
          applications, 
          totalCount 
        }, 
        error: null 
      };

    } catch (err) {
      console.error('Unexpected error in getPaginatedOptimized:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Unknown error occurred') 
      };
    }
  }

  // Get optimized stats
  static async getOptimizedStats(): Promise<DatabaseResult<any>> {
    return ApplicationQueries.getStats();
  }

  // Get summary data for quick overview
  static async getSummaryData(offset: number, limit: number): Promise<DatabaseResult<any[]>> {
    return ApplicationQueries.getSummaryData(offset, limit);
  }

  // Refresh materialized view (if implemented later)
  static async refreshSummaryView(): Promise<void> {
    return ApplicationQueries.refreshSummaryView();
  }
}
