
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Save, ExternalLink, Link, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { InterviewRecordings } from './InterviewRecordings';
import { InterviewStatusSection } from './InterviewStatusSection';
import { VideoAnalysisPanel } from '../video/VideoAnalysisPanel';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface InterviewNotesContentProps {
  selectedApplication: any;
  notes: string;
  interviewRecordingLink: string;
  rating: number;
  interviewStatus: string;
  isSaving: boolean;
  onNotesChange: (notes: string) => void;
  onRecordingLinkChange: (link: string) => void;
  onRatingChange: (rating: number) => void;
  onStatusChange: (status: string) => void;
  onSaveNotes: () => void;
  getStatusColor: (status: string) => string;
  formatInterviewTime: (dateString: string) => string;
  getMeetingLink: (application: any) => string | null;
}

export const InterviewNotesContent = ({
  selectedApplication,
  notes,
  interviewRecordingLink,
  rating,
  interviewStatus,
  isSaving,
  onNotesChange,
  onRecordingLinkChange,
  onRatingChange,
  onStatusChange,
  onSaveNotes,
  getStatusColor,
  formatInterviewTime,
  getMeetingLink
}: InterviewNotesContentProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRecordingLinkSave = async () => {
    if (!selectedApplication || !interviewRecordingLink) return;
    
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          interview_recording_link: interviewRecordingLink,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedApplication.id);

      if (error) throw error;

      // Refresh the data to trigger auto-analysis
      await queryClient.invalidateQueries({ queryKey: ['applications'] });

      toast({
        title: "Recording Link Saved",
        description: "Video analysis will start automatically.",
      });
    } catch (error) {
      console.error('Error saving recording link:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save recording link. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!selectedApplication) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium">Select a candidate</div>
          <div className="text-sm">Choose a candidate from the list to start taking interview notes</div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <div className="text-xl">{selectedApplication.candidates.name}</div>
            <div className="text-sm text-gray-500 font-normal">
              {selectedApplication.candidates.email} • {selectedApplication.job_roles?.name}
            </div>
            {selectedApplication.interview_date && (
              <div className="flex items-center gap-4 mt-2">
                <div className="text-xs text-blue-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatInterviewTime(selectedApplication.interview_date)}
                </div>
                {getMeetingLink(selectedApplication) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getMeetingLink(selectedApplication), '_blank')}
                    className="text-xs h-6"
                  >
                    <Link className="w-3 h-3 mr-1" />
                    Join Meeting
                  </Button>
                )}
              </div>
            )}
          </div>
          <Badge className={getStatusColor(selectedApplication.status)}>
            {selectedApplication.status.replace('_', ' ')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="notes" className="w-full">
          <TabsList>
            <TabsTrigger value="notes">Interview Notes</TabsTrigger>
            <TabsTrigger value="recording">Recording Link</TabsTrigger>
            <TabsTrigger value="rating">Rating & Status</TabsTrigger>
            <TabsTrigger value="recordings">All Recordings</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes" className="space-y-4">
            <div>
              <Label htmlFor="notes" className="text-base font-medium">
                Interview Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Take notes during the interview..."
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                className="mt-2 min-h-64 resize-none"
              />
            </div>
          </TabsContent>

          <TabsContent value="recording" className="space-y-4">
            <div>
              <Label htmlFor="recording-link" className="text-base font-medium">
                Interview Recording Link
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                Add a link to the interview recording (Loom, Zoom, Google Drive, etc.)
              </p>
              <Input
                id="recording-link"
                placeholder="https://loom.com/share/... or https://zoom.us/rec/..."
                value={interviewRecordingLink}
                onChange={(e) => onRecordingLinkChange(e.target.value)}
                className="mt-2"
              />
              {interviewRecordingLink && (
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(interviewRecordingLink, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Test Link
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRecordingLinkSave}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save & Analyze
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="rating" className="space-y-6">
            <InterviewStatusSection
              rating={rating}
              interviewStatus={interviewStatus}
              onRatingChange={onRatingChange}
              onStatusChange={onStatusChange}
            />
          </TabsContent>

          <TabsContent value="recordings" className="space-y-4">
            <InterviewRecordings application={selectedApplication} />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <VideoAnalysisPanel 
              application={selectedApplication} 
              autoAnalyze={true}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            {selectedApplication.notes ? 'Last updated: ' + new Date(selectedApplication.updated_at || '').toLocaleString() : 'No previous notes'}
          </div>
          <Button onClick={onSaveNotes} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Notes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
