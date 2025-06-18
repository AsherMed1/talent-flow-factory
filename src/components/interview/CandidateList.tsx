
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Calendar, Video, Link } from 'lucide-react';

interface CandidateListProps {
  candidates: any[];
  selectedCandidate: string | null;
  onSelectCandidate: (candidateId: string) => void;
  getStatusColor: (status: string) => string;
  formatInterviewTime: (dateString: string) => string;
  getMeetingLink: (application: any) => string | null;
}

export const CandidateList = ({
  candidates,
  selectedCandidate,
  onSelectCandidate,
  getStatusColor,
  formatInterviewTime,
  getMeetingLink
}: CandidateListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCandidates = candidates.filter(app => 
    app.candidates.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.candidates.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredCandidates.map((application) => (
          <Card
            key={application.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCandidate === application.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onSelectCandidate(application.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>
                    {application.candidates.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {application.candidates.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {application.job_roles?.name}
                  </div>
                  {application.interview_date && (
                    <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(application.interview_date).toLocaleDateString()} • {formatInterviewTime(application.interview_date)}
                    </div>
                  )}
                  {(application.interview_recording_link || application.zoom_recording_url) && (
                    <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <Video className="w-3 h-3" />
                      Recording Available
                    </div>
                  )}
                  {getMeetingLink(application) && (
                    <div className="mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(getMeetingLink(application), '_blank');
                        }}
                        className="text-xs h-6"
                      >
                        <Link className="w-3 h-3 mr-1" />
                        Join Meeting
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <Badge className={`text-xs ${getStatusColor(application.status)}`}>
                  {application.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p className="text-lg">No candidates ready for interview</p>
          <p className="text-sm">Candidates will appear here when interviews are scheduled</p>
        </div>
      )}
    </div>
  );
};
