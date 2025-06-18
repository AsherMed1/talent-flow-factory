
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, List } from 'lucide-react';

interface InterviewNotesHeaderProps {
  candidateCount: number;
  viewMode: 'list' | 'calendar';
  onViewModeChange: (mode: 'list' | 'calendar') => void;
}

export const InterviewNotesHeader = ({ 
  candidateCount, 
  viewMode, 
  onViewModeChange 
}: InterviewNotesHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-900">Interview Notes</h1>
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="text-sm">
          {candidateCount} candidates ready for interview
        </Badge>
        <div className="flex rounded-lg border">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="rounded-r-none"
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('calendar')}
            className="rounded-l-none"
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Calendar
          </Button>
        </div>
      </div>
    </div>
  );
};
