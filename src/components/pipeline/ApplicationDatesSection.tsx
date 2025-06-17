
import { Calendar } from 'lucide-react';
import { Application } from '@/hooks/useApplications';

interface ApplicationDatesSectionProps {
  application: Application;
}

export const ApplicationDatesSection = ({ application }: ApplicationDatesSectionProps) => {
  return (
    <>
      <div className="text-xs text-gray-500 mb-3">
        Applied: {new Date(application.applied_date).toLocaleDateString()}
      </div>
      
      {application.interview_date && (
        <div className="text-xs text-blue-600 mb-2">
          <Calendar className="w-3 h-3 inline mr-1" />
          {new Date(application.interview_date).toLocaleDateString()}
        </div>
      )}
      
      {application.offer_sent_date && (
        <div className="text-xs text-green-600 mb-2">
          Offer sent: {new Date(application.offer_sent_date).toLocaleDateString()}
        </div>
      )}
    </>
  );
};
