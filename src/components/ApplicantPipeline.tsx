
import { Button } from '@/components/ui/button';
import { useApplications } from '@/hooks/useApplications';
import { PipelineOverview } from './pipeline/PipelineOverview';
import { KanbanBoard } from './pipeline/KanbanBoard';

export const ApplicantPipeline = () => {
  const { data: applications, isLoading } = useApplications();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Hiring Pipeline</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="p-4">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Hiring Pipeline</h1>
        <div className="flex gap-2">
          <Button variant="outline">Filter by Role</Button>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>

      {/* Pipeline Overview */}
      <PipelineOverview applications={applications || []} />

      {/* Kanban Board */}
      <KanbanBoard applications={applications || []} />
    </div>
  );
};
