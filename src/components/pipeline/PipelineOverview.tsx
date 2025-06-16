
import { Card, CardContent } from '@/components/ui/card';
import { Application } from '@/hooks/useApplications';
import { stages, ApplicationStatus } from './PipelineStages';

interface PipelineOverviewProps {
  applications: Application[];
}

export const PipelineOverview = ({ applications }: PipelineOverviewProps) => {
  const getApplicationsByStage = (stageName: ApplicationStatus) => {
    return applications?.filter(app => app.status === stageName) || [];
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stages.map((stage, index) => {
        const count = getApplicationsByStage(stage.name).length;
        return (
          <Card key={index} className={`${stage.color} border-0`}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm font-medium text-gray-700">{stage.displayName}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
