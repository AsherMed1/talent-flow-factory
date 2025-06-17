
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Search, Save, Calendar, Star } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export const InterviewNotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [interviewStatus, setInterviewStatus] = useState<'hired' | 'rejected' | 'interview_completed'>('interview_completed');
  const [rating, setRating] = useState<number>(3);
  const [isSaving, setIsSaving] = useState(false);
  
  const { data: applications, isLoading } = useApplications();
  const { toast } = useToast();

  // Filter candidates that have interviews scheduled or are in interview
  const interviewCandidates = applications?.filter(app => 
    ['interview_scheduled', 'interview_completed'].includes(app.status) &&
    (app.candidates.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     app.candidates.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const selectedApplication = applications?.find(app => app.id === selectedCandidate);

  const handleSaveNotes = async () => {
    if (!selectedCandidate) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          notes: notes,
          status: interviewStatus,
          rating: rating,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCandidate);

      if (error) throw error;

      toast({
        title: "Notes Saved",
        description: "Interview notes and status have been updated successfully.",
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
        <Badge variant="outline" className="text-sm">
          {interviewCandidates.length} candidates ready for interview
        </Badge>
      </div>

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
                onClick={() => {
                  setSelectedCandidate(application.id);
                  setNotes(application.notes || '');
                  setRating(application.rating || 3);
                  setInterviewStatus(application.status as any);
                }}
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
                          {new Date(application.interview_date).toLocaleDateString()}
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <div className="text-xl">{selectedApplication.candidates.name}</div>
                    <div className="text-sm text-gray-500 font-normal">
                      {selectedApplication.candidates.email} • {selectedApplication.job_roles?.name}
                    </div>
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
                    <TabsTrigger value="rating">Rating & Status</TabsTrigger>
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
                  
                  <TabsContent value="rating" className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Overall Rating</Label>
                      <div className="mt-2">
                        {renderStars(rating)}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Interview Outcome</Label>
                      <RadioGroup
                        value={interviewStatus}
                        onValueChange={(value) => setInterviewStatus(value as any)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hired" id="hired" />
                          <Label htmlFor="hired">Hired - Move to final stage</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="interview_completed" id="potential" />
                          <Label htmlFor="potential">Potential Candidate - Keep for consideration</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rejected" id="rejected" />
                          <Label htmlFor="rejected">Not a Fit - Remove from pipeline</Label>
                        </div>
                      </RadioGroup>
                    </div>
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
    </div>
  );
};
