import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Users, Mail, CheckCircle, XCircle, Send, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BulkCandidateProcessorProps {
  candidates: any[];
  selectedJobRole?: any;
  onProcessComplete: () => void;
}

interface ProcessedCandidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobRole: string;
  selected: boolean;
  emailSent: boolean;
  created: boolean;
  error?: string;
}

export const BulkCandidateProcessor = ({ candidates, selectedJobRole, onProcessComplete }: BulkCandidateProcessorProps) => {
  const [processedCandidates, setProcessedCandidates] = useState<ProcessedCandidate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Convert imported candidates to processed format
    const processed = candidates.map((candidate, index) => ({
      id: `temp-${index}`,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone || '',
      jobRole: selectedJobRole?.name || candidate.jobRole || '',
      selected: true,
      emailSent: false,
      created: false
    }));
    setProcessedCandidates(processed);

    // Load email templates
    const saved = localStorage.getItem('emailTemplates');
    if (saved) {
      setEmailTemplates(JSON.parse(saved));
    }
  }, [candidates, selectedJobRole]);

  const toggleSelection = (id: string) => {
    setProcessedCandidates(prev =>
      prev.map(candidate =>
        candidate.id === id
          ? { ...candidate, selected: !candidate.selected }
          : candidate
      )
    );
  };

  const toggleAllSelection = () => {
    const allSelected = processedCandidates.every(c => c.selected);
    setProcessedCandidates(prev =>
      prev.map(candidate => ({ ...candidate, selected: !allSelected }))
    );
  };

  const createCandidatesInDatabase = async (selectedCandidates: ProcessedCandidate[]) => {
    const results = [];
    
    for (const candidate of selectedCandidates) {
      try {
        // First, check if candidate already exists
        const { data: existingCandidate } = await supabase
          .from('candidates')
          .select('id')
          .eq('email', candidate.email)
          .single();

        if (existingCandidate) {
          results.push({ ...candidate, created: true, error: 'Already exists' });
          continue;
        }

        // Create new candidate
        const { data: newCandidate, error } = await supabase
          .from('candidates')
          .insert({
            name: `${candidate.firstName} ${candidate.lastName}`,
            email: candidate.email,
            phone: candidate.phone || null
          })
          .select()
          .single();

        if (error) {
          results.push({ ...candidate, created: false, error: error.message });
        } else {
          results.push({ ...candidate, id: newCandidate.id, created: true });
        }
      } catch (error: any) {
        results.push({ ...candidate, created: false, error: error.message });
      }
    }

    return results;
  };

  const sendInvitationEmails = async (candidates: ProcessedCandidate[]) => {
    if (!selectedTemplate) {
      toast({
        title: "No Template Selected",
        description: "Please select an email template before sending invitations.",
        variant: "destructive",
      });
      return candidates;
    }

    const template = emailTemplates.find(t => t.id === selectedTemplate);
    if (!template) {
      toast({
        title: "Template Not Found",
        description: "Selected email template could not be found.",
        variant: "destructive",
      });
      return candidates;
    }

    // For demo purposes, we'll simulate email sending
    // In production, this would call your email service
    const results = candidates.map(candidate => {
      // Use the selected job role for the application link
      const jobRoleParam = selectedJobRole?.id ? `&jobRole=${encodeURIComponent(selectedJobRole.id)}` : '';
      const applicationLink = `${window.location.origin}/apply?email=${encodeURIComponent(candidate.email)}${jobRoleParam}`;
      
      const currentJobRole = selectedJobRole?.name || candidate.jobRole || 'Position';
      
      const personalizedSubject = template.subject
        .replace(/\{\{firstName\}\}/g, candidate.firstName)
        .replace(/\{\{lastName\}\}/g, candidate.lastName)
        .replace(/\{\{jobRole\}\}/g, currentJobRole);

      const personalizedContent = template.content
        .replace(/\{\{firstName\}\}/g, candidate.firstName)
        .replace(/\{\{lastName\}\}/g, candidate.lastName)
        .replace(/\{\{email\}\}/g, candidate.email)
        .replace(/\{\{jobRole\}\}/g, currentJobRole)
        .replace(/\{\{applicationLink\}\}/g, applicationLink);

      // Simulate email sending (replace with actual email service)
      console.log('Sending email to:', candidate.email);
      console.log('Subject:', personalizedSubject);
      console.log('Content:', personalizedContent);
      console.log('Job Role:', currentJobRole);
      console.log('Application Link:', applicationLink);

      return { ...candidate, emailSent: true };
    });

    return results;
  };

  const processCandidates = async () => {
    const selectedCandidates = processedCandidates.filter(c => c.selected);
    
    if (selectedCandidates.length === 0) {
      toast({
        title: "No Candidates Selected",
        description: "Please select at least one candidate to process.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create candidates in database
      const candidatesWithIds = await createCandidatesInDatabase(selectedCandidates);
      setProcessedCandidates(prev =>
        prev.map(candidate => {
          const updated = candidatesWithIds.find(c => c.email === candidate.email);
          return updated || candidate;
        })
      );

      // Step 2: Send invitation emails
      const candidatesWithEmails = await sendInvitationEmails(
        candidatesWithIds.filter(c => c.created && !c.error)
      );
      
      setProcessedCandidates(prev =>
        prev.map(candidate => {
          const updated = candidatesWithEmails.find(c => c.email === candidate.email);
          return updated || candidate;
        })
      );

      const successCount = candidatesWithEmails.filter(c => c.emailSent).length;
      toast({
        title: "Processing Complete",
        description: `Successfully processed ${successCount} candidates. Invitation emails sent!`,
      });

    } catch (error) {
      toast({
        title: "Processing Error",
        description: "An error occurred while processing candidates.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedCount = processedCandidates.filter(c => c.selected).length;
  const createdCount = processedCandidates.filter(c => c.created).length;
  const emailsSentCount = processedCandidates.filter(c => c.emailSent).length;

  return (
    <div className="space-y-6">
      {selectedJobRole && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold text-lg">{selectedJobRole.name}</h3>
                <p className="text-sm text-gray-600">{selectedJobRole.description}</p>
                <Badge variant="outline" className="mt-1">
                  {selectedJobRole.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold">{processedCandidates.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Created in DB</p>
                <p className="text-2xl font-bold">{createdCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emails Sent</p>
                <p className="text-2xl font-bold">{emailsSentCount}</p>
              </div>
              <Mail className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email-template">Email Template</Label>
              <select
                id="email-template"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select template...</option>
                {emailTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.jobRole || 'General'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="job-role-override">Job Role Override (Optional)</Label>
              <Input
                id="job-role-override"
                value={jobRoleOverride}
                onChange={(e) => setJobRoleOverride(e.target.value)}
                placeholder="Override job role for all candidates"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Candidates ({selectedCount} selected)</CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={processedCandidates.every(c => c.selected)}
                onCheckedChange={toggleAllSelection}
              />
              <span className="text-sm">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {processedCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  candidate.selected ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={candidate.selected}
                    onCheckedChange={() => toggleSelection(candidate.id)}
                  />
                  <div>
                    <p className="font-medium">
                      {candidate.firstName} {candidate.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{candidate.email}</p>
                    {candidate.jobRole && (
                      <p className="text-xs text-gray-500">{candidate.jobRole}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {candidate.created && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Created
                    </Badge>
                  )}
                  {candidate.emailSent && (
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      Email Sent
                    </Badge>
                  )}
                  {candidate.error && (
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      Error
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <Button variant="outline" onClick={onProcessComplete}>
              Clear Import
            </Button>
            
            <Button
              onClick={processCandidates}
              disabled={selectedCount === 0 || isProcessing}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Send className="w-4 h-4 mr-2" />
              {isProcessing 
                ? 'Processing...' 
                : `Process ${selectedCount} Candidate${selectedCount !== 1 ? 's' : ''}`
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
