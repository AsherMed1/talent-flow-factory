
import { Application } from '@/hooks/useApplications';
import { stages, ApplicationStatus } from './PipelineStages';
import { ApplicationRow } from './ApplicationRow';

interface KanbanBoardProps {
  applications: Application[];
}

export const KanbanBoard = ({ applications }: KanbanBoardProps) => {
  const getApplicationsByStage = (stageName: ApplicationStatus) => {
    return applications?.filter(app => app.status === stageName) || [];
  };

  return (
    <div className="space-y-6">
      {stages.map((stage, stageIndex) => {
        const stageApplications = getApplicationsByStage(stage.name);
        return (
          <div key={stageIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Stage Header */}
            <div className={`p-4 ${stage.color} border-b border-gray-200`}>
              <h3 className="font-semibold text-gray-900">
                {stage.displayName} ({stageApplications.length})
              </h3>
            </div>
            
            {/* Table Header */}
            {stageApplications.length > 0 && (
              <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <div className="col-span-3">Candidate</div>
                <div className="col-span-2">Applied</div>
                <div className="col-span-3">Files & Audio</div>
                <div className="col-span-2">Rating</div>
                <div className="col-span-2">Actions</div>
              </div>
            )}
            
            {/* Applications Rows */}
            <div>
              {stageApplications.length > 0 ? (
                stageApplications.map((application) => (
                  <ApplicationRow 
                    key={application.id} 
                    application={application} 
                    stageIndex={stageIndex}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No applications in this stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
