
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
            {application.candidates.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-sm">{application.candidates.name}</div>
          <div className="text-xs text-gray-500">
            {application.job_roles && application.job_roles.name ? application.job_roles.name : 'Unknown Role'}
          </div>
        </div>
      </div>
      <RatingDisplay rating={application.rating} size="sm" showEmpty={false} />
    </div>
  );
};
