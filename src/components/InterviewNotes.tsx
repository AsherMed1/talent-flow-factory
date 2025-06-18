import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Search, Save, Calendar, Star, Video, ExternalLink, Link, CalendarDays, List, Clock } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { InterviewCalendar } from './InterviewCalendar';
import { DispositionDialog } from './DispositionDialog';

export const InterviewNotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
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
    ['interview_scheduled', 'interview_completed'].includes(app.status) &&
    (app.candidates.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     app.candidates.email.toLowerCase().includes(searchTerm.toLowerCase()))
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
        description: "Interview notes and recording link have been updated successfully.",
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 cursor-pointer ${
              index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => setRating(index + 1)}
          />
        ))}
      </div>
    );
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

  const renderRecordings = (application: any) => {
    const hasManualLink = application.interview_recording_link;
    const hasZoomRecording = application.zoom_recording_url || application.zoom_recording_files;

    if (!hasManualLink && !hasZoomRecording) {
      return (
        <div className="text-center text-gray-500 py-8">
          <Video className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-lg">No recordings available</p>
          <p className="text-sm">Add a recording link manually or wait for Zoom integration</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Interview Recordings</h4>
        
        {/* Manual Recording Link */}
        {hasManualLink && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Link className="w-4 h-4 text-blue-600" />
              <div>
                <span className="text-sm font-medium">Interview Recording</span>
                <div className="text-xs text-gray-500 truncate max-w-60">
                  {application.interview_recording_link}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(application.interview_recording_link, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View
            </Button>
          </div>
        )}

        {/* Zoom Recordings */}
        {application.zoom_recording_url && (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Zoom Recording (Auto)</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(application.zoom_recording_url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View
            </Button>
          </div>
        )}

        {application.zoom_recording_files && Array.isArray(application.zoom_recording_files) && (
          <div className="space-y-2">
            {application.zoom_recording_files.map((file: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-gray-600" />
                  <div>
                    <span className="text-sm font-medium">{file.type} Recording (Auto)</span>
                    {file.recording_start && (
                      <div className="text-xs text-gray-500">
                        {new Date(file.recording_start).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {file.play_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.play_url, '_blank')}
                    >
                      Play
                    </Button>
                  )}
                  {file.download_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.download_url, '_blank')}
                    >
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Interview Notes</h1>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            {interviewCandidates.length} candidates ready for interview
          </Badge>
          <div className="flex rounded-lg border">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-r-none"
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className="rounded-l-none"
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="space-y-6">
          <InterviewCalendar 
            applications={applications || []} 
            onSelectCandidate={handleSelectCandidate}
          />
          
          {/* Interview Notes Section for Calendar View */}
          {selectedApplication && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <div className="text-xl">{selectedApplication.candidates.name}</div>
                      <div className="text-sm text-gray-500 font-normal">
                        {selectedApplication.candidates.email} • {selectedApplication.job_roles?.name}
                      </div>
                      {/* Meeting Link and Time for Calendar View */}
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
                          onChange={(e) => setNotes(e.target.value)}
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
                          onChange={(e) => setInterviewRecordingLink(e.target.value)}
                          className="mt-2"
                        />
                        {interviewRecordingLink && (
                          <div className="mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(interviewRecordingLink, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Test Link
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="rating" className="space-y-6">
                      <div>
                        <Label className="text-base font-medium">Overall Rating</Label>
                        <div className="mt-2">
                          {renderStars(rating)}
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-medium">Interview Status</Label>
                        <RadioGroup
                          value={interviewStatus}
                          onValueChange={handleInterviewStatusChange}
                          className="mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="interview_completed" id="potential" />
                            <Label htmlFor="potential">Interview Complete - Ready for disposition</Label>
                          </div>
                        </RadioGroup>
                        <p className="text-sm text-gray-500 mt-2">
                          This will open the disposition dialog to make the final hiring decision.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="recordings" className="space-y-4">
                      {renderRecordings(selectedApplication)}
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      {selectedApplication.notes ? 'Last updated: ' + new Date(selectedApplication.updated_at || '').toLocaleString() : 'No previous notes'}
                    </div>
                    <Button onClick={handleSaveNotes} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Notes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidate List */}
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
              {interviewCandidates.map((application) => (
                <Card
                  key={application.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCandidate === application.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleSelectCandidate(application.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {application.candidates.name.split(' ').map(n => n[0]).join('')}
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
                        {/* Meeting Link for List View */}
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

            {interviewCandidates.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg">No candidates ready for interview</p>
                <p className="text-sm">Candidates will appear here when interviews are scheduled</p>
              </div>
            )}
          </div>

          {/* Interview Notes Section */}
          <div className="lg:col-span-2">
            {selectedApplication ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <div className="text-xl">{selectedApplication.candidates.name}</div>
                        <div className="text-sm text-gray-500 font-normal">
                          {selectedApplication.candidates.email} • {selectedApplication.job_roles?.name}
                        </div>
                        {/* Meeting Link and Time for List View Selected Candidate */}
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
                            onChange={(e) => setNotes(e.target.value)}
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
                            onChange={(e) => setInterviewRecordingLink(e.target.value)}
                            className="mt-2"
                          />
                          {interviewRecordingLink && (
                            <div className="mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(interviewRecordingLink, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Test Link
                              </Button>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="rating" className="space-y-6">
                        <div>
                          <Label className="text-base font-medium">Overall Rating</Label>
                          <div className="mt-2">
                            {renderStars(rating)}
                          </div>
                        </div>

                        <div>
                          <Label className="text-base font-medium">Interview Status</Label>
                          <RadioGroup
                            value={interviewStatus}
                            onValueChange={handleInterviewStatusChange}
                            className="mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="interview_completed" id="potential" />
                              <Label htmlFor="potential">Interview Complete - Ready for disposition</Label>
                            </div>
                          </RadioGroup>
                          <p className="text-sm text-gray-500 mt-2">
                            This will open the disposition dialog to make the final hiring decision.
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="recordings" className="space-y-4">
                        {renderRecordings(selectedApplication)}
                      </TabsContent>
                    </Tabs>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        {selectedApplication.notes ? 'Last updated: ' + new Date(selectedApplication.updated_at || '').toLocaleString() : 'No previous notes'}
                      </div>
                      <Button onClick={handleSaveNotes} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Notes'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-lg font-medium">Select a candidate</div>
                  <div className="text-sm">Choose a candidate from the list to start taking interview notes</div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Disposition Dialog */}
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
