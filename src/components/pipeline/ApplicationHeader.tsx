
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Application } from '@/hooks/useApplications';
import { RatingDisplay } from './RatingDisplay';

interface ApplicationHeaderProps {
  application: Application;
}

export const ApplicationHeader = ({ application }: ApplicationHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-xs">
            {application.candidate.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-sm">{application.candidate.name}</div>
          <div className="text-xs text-gray-600">{application.candidate.email}</div>
          <div className="text-xs text-gray-500">
            {application.job_role && application.job_role.name ? application.job_role.name : 'Unknown Role'}
          </div>
        </div>
      </div>
      <RatingDisplay rating={application.rating} size="sm" showEmpty={false} />
    </div>
  );
};
