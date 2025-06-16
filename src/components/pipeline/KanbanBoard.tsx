
import { Application } from '@/hooks/useApplications';
import { stages, ApplicationStatus } from './PipelineStages';
import { ApplicationCard } from './ApplicationCard';

interface KanbanBoardProps {
  applications: Application[];
}

export const KanbanBoard = ({ applications }: KanbanBoardProps) => {
  const getApplicationsByStage = (stageName: ApplicationStatus) => {
    return applications?.filter(app => app.status === stageName) || [];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto">
      {stages.map((stage, stageIndex) => {
        const stageApplications = getApplicationsByStage(stage.name);
        return (
          <div key={stageIndex} className="min-w-80">
            <div className={`p-3 rounded-t-lg ${stage.color} border-b-2 border-gray-200`}>
              <h3 className="font-semibold text-gray-900 text-center">
                {stage.displayName} ({stageApplications.length})
              </h3>
            </div>
            
            <div className="space-y-3 p-3 bg-gray-50 min-h-96 rounded-b-lg">
              {stageApplications.map((application) => (
                <ApplicationCard 
                  key={application.id} 
                  application={application} 
                  stageIndex={stageIndex}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
