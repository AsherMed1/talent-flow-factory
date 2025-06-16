import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Calendar, FileText, Play } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { supabase } from '@/integrations/supabase/client';

type ApplicationStatus = 'applied' | 'reviewed' | 'interview_scheduled' | 'interview_completed' | 'offer_sent' | 'hired' | 'rejected';

export const ApplicantPipeline = () => {
  const { data: applications, isLoading } = useApplications();

  const stages = [
    { name: 'applied' as ApplicationStatus, displayName: 'Applied', color: 'bg-gray-100' },
    { name: 'reviewed' as ApplicationStatus, displayName: 'Reviewed', color: 'bg-blue-100' },
    { name: 'interview_scheduled' as ApplicationStatus, displayName: 'Interview Scheduled', color: 'bg-yellow-100' },
    { name: 'interview_completed' as ApplicationStatus, displayName: 'Interview Completed', color: 'bg-purple-100' },
    { name: 'offer_sent' as ApplicationStatus, displayName: 'Offer Sent', color: 'bg-green-100' },
    { name: 'hired' as ApplicationStatus, displayName: 'Hired', color: 'bg-emerald-100' },
  ];

  const getApplicationsByStage = (stageName: string) => {
    return applications?.filter(app => app.status === stageName) || [];
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus, candidateData: any) => {
    console.log('Updating application status:', applicationId, newStatus);
    
    try {
      // Update the application status
      const { error } = await supabase
        .from('applications')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      // Trigger webhook for status change
      try {
        const webhookData = {
          application: {
            id: applicationId,
            previousStatus: candidateData.status,
            newStatus: newStatus,
          },
          candidate: candidateData.candidates,
          jobRole: candidateData.job_roles,
          timestamp: new Date().toISOString(),
        };

        await supabase.functions.invoke('trigger-webhook', {
          body: {
            eventType: 'status_changed',
            data: webhookData
          }
        });

        console.log('Webhook triggered for status change');
      } catch (webhookError) {
        console.error('Error triggering webhook:', webhookError);
      }

      // Refresh the data
      window.location.reload();
      
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Hiring Pipeline</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
        {stages.map((stage, index) => {
          const count = getApplicationsByStage(stage.name).length;
          return (
            <Card key={index} className={`${stage.color} border-0`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm font-medium text-gray-700">{stage.displayName}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto">
        {stages.map((stage, stageIndex) => {
          const stageApplications = getApplicationsByStage(stage.name);
          return (
            <div key={stageIndex} className="min-w-80">
              <div className={`p-3 rounded-t-lg ${stage.color} border-b-2 border-gray-200`}>
                <h3 className="font-semibold text-gray-900 text-center">
                  {stage.displayName} ({stageApplications.length})
                </h3>
              </div>
              
              <div className="space-y-3 p-3 bg-gray-50 min-h-96 rounded-b-lg">
                {stageApplications.map((application) => (
                  <Card key={application.id} className="hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {application.candidates.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{application.candidates.name}</div>
                            <div className="text-xs text-gray-500">{application.job_roles.name}</div>
                          </div>
                        </div>
                        {application.rating && (
                          <div className="flex gap-1">
                            {renderStars(application.rating)}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-3">
                        Applied: {new Date(application.applied_date).toLocaleDateString()}
                      </div>
                      
                      <div className="flex gap-1 mb-3">
                        {application.has_resume && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="w-3 h-3 mr-1" />
                            Resume
                          </Badge>
                        )}
                        {application.has_voice_recording && (
                          <Badge variant="outline" className="text-xs">
                            <Play className="w-3 h-3 mr-1" />
                            Voice
                          </Badge>
                        )}
                        {application.has_video && (
                          <Badge variant="outline" className="text-xs">
                            📹 Video
                          </Badge>
                        )}
                      </div>
                      
                      {/* Display candidate tags */}
                      {application.candidates.candidate_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {application.candidates.candidate_tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-blue-50">
                              {tag.tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
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
                      
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          className="text-xs h-7 bg-green-500 hover:bg-green-600"
                          onClick={() => {
                            const nextStageIndex = stageIndex + 1;
                            if (nextStageIndex < stages.length) {
                              handleStatusChange(application.id, stages[nextStageIndex].name, application);
                            } else {
                              handleStatusChange(application.id, 'hired', application);
                            }
                          }}
                        >
                          ✓
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="text-xs h-7"
                          onClick={() => handleStatusChange(application.id, 'rejected', application)}
                        >
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
          );
        })}
      </div>
    </div>
  );
};
