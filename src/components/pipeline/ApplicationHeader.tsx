
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Application } from '@/hooks/useApplications';

interface ApplicationHeaderProps {
  application: Application;
}

export const ApplicationHeader = ({ application }: ApplicationHeaderProps) => {
  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

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
      {application.rating && (
        <div className="flex gap-1">
          {renderStars(application.rating)}
        </div>
      )}
    </div>
  );
};
