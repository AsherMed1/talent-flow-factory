
import { Application } from '@/hooks/useApplications';
import { ExpandableCard } from './ExpandableCard';

interface ApplicationCardProps {
  application: Application;
  stageIndex: number;
}

export const ApplicationCard = ({ application, stageIndex }: ApplicationCardProps) => {
  return <ExpandableCard application={application} stageIndex={stageIndex} />;
};
