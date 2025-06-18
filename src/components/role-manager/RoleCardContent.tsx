
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { JobRole } from '@/hooks/useJobRoles';

interface RoleCardContentProps {
  role: JobRole;
}

export const RoleCardContent = ({ role }: RoleCardContentProps) => {
  return (
    <div className="space-y-3">
      <div>
        <span className="font-medium text-gray-500 text-sm">Booking Link:</span>
        {role.booking_link ? (
          <div className="flex items-center gap-2 mt-1">
            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex-1 truncate">
              {role.booking_link}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(role.booking_link, '_blank')}
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="text-xs text-gray-400 italic mt-1">No custom booking link set</div>
        )}
      </div>

      {role.hiring_process && (
        <div>
          <span className="font-medium text-gray-500 text-sm">Hiring Process:</span>
          <div className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded whitespace-pre-wrap">
            {role.hiring_process.slice(0, 150)}{role.hiring_process.length > 150 ? '...' : ''}
          </div>
        </div>
      )}

      {role.ai_tone_prompt && (
        <div>
          <span className="font-medium text-gray-500 text-sm">AI Expertise:</span>
          <div className="text-xs text-purple-600 mt-1 bg-purple-50 p-2 rounded">
            {role.ai_tone_prompt.slice(0, 100)}{role.ai_tone_prompt.length > 100 ? '...' : ''}
          </div>
        </div>
      )}
    </div>
  );
};
