
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Calendar, FileText, Play } from 'lucide-react';

export const ApplicantPipeline = () => {
  const stages = [
    { name: 'Applied', count: 12, color: 'bg-gray-100' },
    { name: 'Reviewed', count: 8, color: 'bg-blue-100' },
    { name: 'Interview Scheduled', count: 4, color: 'bg-yellow-100' },
    { name: 'Interview Completed', count: 3, color: 'bg-purple-100' },
    { name: 'Offer Sent', count: 1, color: 'bg-green-100' },
    { name: 'Hired', count: 2, color: 'bg-emerald-100' },
  ];

  const candidates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Appointment Setter',
      stage: 'Applied',
      rating: 0,
      appliedDate: '2024-03-15',
      email: 'sarah.j@email.com',
      hasResume: true,
      hasVoice: true,
      hasVideo: false,
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Virtual Assistant',
      stage: 'Interview Scheduled',
      rating: 4,
      appliedDate: '2024-03-12',
      email: 'mike.chen@email.com',
      hasResume: true,
      hasVoice: true,
      hasVideo: true,
      interviewDate: '2024-03-18 2:00 PM',
    },
    {
      id: 3,
      name: 'Emma Davis',
      role: 'Appointment Setter',
      stage: 'Offer Sent',
      rating: 5,
      appliedDate: '2024-03-10',
      email: 'emma.davis@email.com',
      hasResume: true,
      hasVoice: true,
      hasVideo: true,
      offerSent: '2024-03-16',
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getCandidatesByStage = (stage: string) => {
    return candidates.filter(candidate => candidate.stage === stage);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Hiring Pipeline</h1>
        <div className="flex gap-2">
          <Button variant="outline">Filter by Role</Button>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stages.map((stage, index) => (
          <Card key={index} className={`${stage.color} border-0`}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stage.count}</div>
              <div className="text-sm font-medium text-gray-700">{stage.name}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto">
        {stages.map((stage, stageIndex) => (
          <div key={stageIndex} className="min-w-80">
            <div className={`p-3 rounded-t-lg ${stage.color} border-b-2 border-gray-200`}>
              <h3 className="font-semibold text-gray-900 text-center">
                {stage.name} ({stage.count})
              </h3>
            </div>
            
            <div className="space-y-3 p-3 bg-gray-50 min-h-96 rounded-b-lg">
              {getCandidatesByStage(stage.name).map((candidate) => (
                <Card key={candidate.id} className="hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{candidate.name}</div>
                          <div className="text-xs text-gray-500">{candidate.role}</div>
                        </div>
                      </div>
                      {candidate.rating > 0 && (
                        <div className="flex gap-1">
                          {renderStars(candidate.rating)}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      Applied: {candidate.appliedDate}
                    </div>
                    
                    <div className="flex gap-1 mb-3">
                      {candidate.hasResume && (
                        <Badge variant="outline" className="text-xs">
                          <FileText className="w-3 h-3 mr-1" />
                          Resume
                        </Badge>
                      )}
                      {candidate.hasVoice && (
                        <Badge variant="outline" className="text-xs">
                          <Play className="w-3 h-3 mr-1" />
                          Voice
                        </Badge>
                      )}
                      {candidate.hasVideo && (
                        <Badge variant="outline" className="text-xs">
                          📹 Video
                        </Badge>
                      )}
                    </div>
                    
                    {candidate.interviewDate && (
                      <div className="text-xs text-blue-600 mb-2">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {candidate.interviewDate}
                      </div>
                    )}
                    
                    {candidate.offerSent && (
                      <div className="text-xs text-green-600 mb-2">
                        Offer sent: {candidate.offerSent}
                      </div>
                    )}
                    
                    <div className="flex gap-1">
                      <Button size="sm" className="text-xs h-7 bg-green-500 hover:bg-green-600">
                        ✓
                      </Button>
                      <Button size="sm" variant="destructive" className="text-xs h-7">
                        ✕
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        ⏳
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
