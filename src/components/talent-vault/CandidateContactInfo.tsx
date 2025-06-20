
import { Mail, Phone } from 'lucide-react';

interface CandidateContactInfoProps {
  email: string;
  phone?: string | null;
}

export const CandidateContactInfo = ({ email, phone }: CandidateContactInfoProps) => {
  return (
    <div className="space-y-2 min-w-0">
      <div className="flex items-center gap-2 text-sm min-w-0">
        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="truncate min-w-0 flex-1" title={email}>
          {email}
        </span>
      </div>
      {phone && (
        <div className="flex items-center gap-2 text-sm min-w-0">
          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate min-w-0 flex-1" title={phone}>
            {phone}
          </span>
        </div>
      )}
    </div>
  );
};
