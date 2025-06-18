
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useApplications } from '@/hooks/useApplications';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { InterviewCalendar } from './InterviewCalendar';
import { DispositionDialog } from './DispositionDialog';
import { InterviewNotesHeader } from './interview/InterviewNotesHeader';
import { CandidateList } from './interview/CandidateList';
import { InterviewNotesContent } from './interview/InterviewNotesContent';

export const InterviewNotes = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [interviewRecordingLink, setInterviewRecordingLink] = useState('');
  const [interviewStatus, setInterviewStatus] = useState<'hired' | 'rejected' | 'interview_completed'>('interview_completed');
  const [rating, setRating] = useState<number>(3);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showDispositionDialog, setShowDispositionDialog] = useState(false);
  
  const { data: applications, isLoading } = useApplications();
  const { toast } = useToast();

  // Filter candidates that have interviews scheduled or are in interview
  const interviewCandidates = applications?.filter(app => 
    ['interview_scheduled', 'interview_completed'].includes(app.status)
  ) || [];

  const selectedApplication = applications?.find(app => app.id === selectedCandidate);

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidate(candidateId);
    const application = applications?.find(app => app.id === candidateId);
    if (application) {
      setNotes(application.notes || '');
      setInterviewRecordingLink(application.interview_recording_link || '');
      setRating(application.rating || 3);
      setInterviewStatus(application.status as any);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedCandidate) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          notes: notes,
          interview_recording_link: interviewRecordingLink || null,
          status: interviewStatus,
          rating: rating,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCandidate);

      if (error) throw error;

      toast({
        title: "Notes Saved",
        description: "Interview notes have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save interview notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interview_scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'interview_completed':
        return 'bg-yellow-100 text-yellow-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatInterviewTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Time TBD';
    }
  };

  const getMeetingLink = (application: any) => {
    // Check GHL appointment data first
    if (application.ghl_appointment_data?.calendar?.address) {
      return application.ghl_appointment_data.calendar.address;
    }
    
    // Fallback to manual recording link if no GHL data
    return application.interview_recording_link;
  };

  const handleInterviewStatusChange = (value: string) => {
    setInterviewStatus(value as any);
    if (value === 'interview_completed') {
      setShowDispositionDialog(true);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Interview Notes</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <InterviewNotesHeader
        candidateCount={interviewCandidates.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === 'calendar' ? (
        <div className="space-y-6">
          <InterviewCalendar 
            applications={applications || []} 
            onSelectCandidate={handleSelectCandidate}
          />
          
          {selectedApplication && (
            <InterviewNotesContent
              selectedApplication={selectedApplication}
              notes={notes}
              interviewRecordingLink={interviewRecordingLink}
              rating={rating}
              interviewStatus={interviewStatus}
              isSaving={isSaving}
              onNotesChange={setNotes}
              onRecordingLinkChange={setInterviewRecordingLink}
              onRatingChange={setRating}
              onStatusChange={handleInterviewStatusChange}
              onSaveNotes={handleSaveNotes}
              getStatusColor={getStatusColor}
              formatInterviewTime={formatInterviewTime}
              getMeetingLink={getMeetingLink}
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CandidateList
            candidates={interviewCandidates}
            selectedCandidate={selectedCandidate}
            onSelectCandidate={handleSelectCandidate}
            getStatusColor={getStatusColor}
            formatInterviewTime={formatInterviewTime}
            getMeetingLink={getMeetingLink}
          />

          <div className="lg:col-span-2">
            <InterviewNotesContent
              selectedApplication={selectedApplication}
              notes={notes}
              interviewRecordingLink={interviewRecordingLink}
              rating={rating}
              interviewStatus={interviewStatus}
              isSaving={isSaving}
              onNotesChange={setNotes}
              onRecordingLinkChange={setInterviewRecordingLink}
              onRatingChange={setRating}
              onStatusChange={handleInterviewStatusChange}
              onSaveNotes={handleSaveNotes}
              getStatusColor={getStatusColor}
              formatInterviewTime={formatInterviewTime}
              getMeetingLink={getMeetingLink}
            />
          </div>
        </div>
      )}

      {selectedApplication && (
        <DispositionDialog
          application={selectedApplication}
          isOpen={showDispositionDialog}
          onClose={() => setShowDispositionDialog(false)}
          onDispositionComplete={() => {
            setSelectedCandidate(null);
            setShowDispositionDialog(false);
          }}
        />
      )}
    </div>
  );
};
