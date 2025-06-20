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
import { CollaborationPanel } from '../collaboration/CollaborationPanel';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { InterviewGuide } from './InterviewGuide';
import { useInterviewGuides } from '@/hooks/useInterviewGuides';
import { useState } from 'react';

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
  const [isSavingRecording, setIsSavingRecording] = useState(false);
  
  // Add interview guide hook
  const { guide, loading: guideLoading, toggleStepComplete, updateStepNotes } = useInterviewGuides(
    selectedApplication?.job_role_id || ''
  );

  const generateInterviewSummary = async () => {
    // Mock implementation - replace with actual Supabase function call
    return { summary: 'Mock interview summary' };
  };

  const handleSaveNotesWithSummary = async () => {
    // Mock implementation - replace with actual Supabase function call
    onSaveNotes();
  };

  const handleRecordingLinkSave = async () => {
    setIsSavingRecording(true);
    try {
      // Mock implementation - replace with actual Supabase function call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Optimistically update the cache
      queryClient.setQueryData(['applications'], (old: any) => {
        if (!old) return old;
        return old.map((app: any) => {
          if (app.id === selectedApplication.id) {
            return { ...app, interview_recording_link: interviewRecordingLink };
          }
          return app;
        });
      });

      toast({
        title: "Recording Link Saved",
        description: "The recording link has been saved and is being analyzed.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save recording link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingRecording(false);
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
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex min-w-full w-max">
              <TabsTrigger value="notes" className="whitespace-nowrap">Interview Notes</TabsTrigger>
              <TabsTrigger value="guide" className="whitespace-nowrap">Interview Guide</TabsTrigger>
              <TabsTrigger value="recording" className="whitespace-nowrap">Recording Link</TabsTrigger>
              <TabsTrigger value="rating" className="whitespace-nowrap">Rating & Status</TabsTrigger>
              <TabsTrigger value="recordings" className="whitespace-nowrap">All Recordings</TabsTrigger>
              <TabsTrigger value="analysis" className="whitespace-nowrap">AI Analysis</TabsTrigger>
              <TabsTrigger value="collaboration" className="whitespace-nowrap">Team & Notes</TabsTrigger>
            </TabsList>
          </div>
          
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

          <TabsContent value="guide" className="space-y-4">
            {guideLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading interview guide...</div>
              </div>
            ) : guide ? (
              <InterviewGuide
                jobRole={selectedApplication.job_roles?.name || 'Position'}
                steps={guide.steps}
                onStepComplete={toggleStepComplete}
                onUpdateNotes={updateStepNotes}
                stepNotes={guide.stepNotes}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-lg font-medium">No Interview Guide Available</div>
                <div className="text-sm">Interview guides can be configured per job role</div>
              </div>
            )}
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
                    disabled={isSavingRecording}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSavingRecording ? 'Saving...' : 'Save & Analyze'}
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

          <TabsContent value="collaboration" className="space-y-4">
            <CollaborationPanel candidateId={selectedApplication.candidate_id} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            {selectedApplication.notes ? 'Last updated: ' + new Date(selectedApplication.updated_at || '').toLocaleString() : 'No previous notes'}
          </div>
          <Button onClick={handleSaveNotesWithSummary} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Notes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
