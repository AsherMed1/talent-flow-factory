
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useJobRoles } from '@/hooks/useJobRoles';
import { Calendar, Users, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type ApplicationStatus = Database['public']['Enums']['application_status'];

interface ImportedCandidate {
  name: string;
  email: string;
  phone?: string;
  appointmentDate?: string;
  appointmentStatus?: string;
  meetingLink?: string;
  notes?: string;
  interviewCompleted?: boolean;
}

export const GoHighLevelImport = () => {
  const [candidates, setCandidates] = useState<ImportedCandidate[]>([]);
  const [selectedJobRoleId, setSelectedJobRoleId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importData, setImportData] = useState('');
  const { toast } = useToast();
  const { data: jobRoles } = useJobRoles();

  const parseCandidateData = () => {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(importData);
      if (Array.isArray(parsed)) {
        setCandidates(parsed);
        return;
      }
    } catch {
      // If JSON parsing fails, try CSV format
      const lines = importData.split('\n').filter(line => line.trim());
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const candidateData: ImportedCandidate[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const candidate: ImportedCandidate = {
          name: '',
          email: ''
        };

        headers.forEach((header, index) => {
          const value = values[index] || '';
          
          if (header.includes('name') || header.includes('full_name')) {
            candidate.name = value;
          } else if (header.includes('email')) {
            candidate.email = value;
          } else if (header.includes('phone')) {
            candidate.phone = value;
          } else if (header.includes('appointment') && header.includes('date')) {
            candidate.appointmentDate = value;
          } else if (header.includes('status')) {
            candidate.appointmentStatus = value;
          } else if (header.includes('meeting') || header.includes('link') || header.includes('zoom')) {
            candidate.meetingLink = value;
          } else if (header.includes('notes') || header.includes('comment')) {
            candidate.notes = value;
          } else if (header.includes('interview') && header.includes('completed')) {
            candidate.interviewCompleted = value.toLowerCase() === 'true' || value.toLowerCase() === 'yes';
          }
        });

        if (candidate.name && candidate.email) {
          candidateData.push(candidate);
        }
      }

      setCandidates(candidateData);
    }

    toast({
      title: "Data Parsed",
      description: `Found ${candidates.length} candidates in the import data`,
    });
  };

  const handleImport = async () => {
    if (!selectedJobRoleId || candidates.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a job role and add candidate data",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const selectedJobRole = jobRoles?.find(r => r.id === selectedJobRoleId);
      
      for (const candidate of candidates) {
        // First, create or find the candidate
        let candidateRecord;
        
        // Check if candidate already exists
        const { data: existingCandidate } = await supabase
          .from('candidates')
          .select('id')
          .eq('email', candidate.email)
          .single();

        if (existingCandidate) {
          candidateRecord = existingCandidate;
        } else {
          // Create new candidate
          const { data: newCandidate, error: candidateError } = await supabase
            .from('candidates')
            .insert({
              name: candidate.name,
              email: candidate.email,
              phone: candidate.phone || null
            })
            .select()
            .single();

          if (candidateError) throw candidateError;
          candidateRecord = newCandidate;
        }

        // Create application record with proper typing
        const applicationStatus: ApplicationStatus = candidate.interviewCompleted 
          ? 'interview_completed' 
          : candidate.appointmentDate 
            ? 'interview_scheduled' 
            : 'reviewed';

        const applicationData = {
          candidate_id: candidateRecord.id,
          job_role_id: selectedJobRoleId,
          status: applicationStatus,
          applied_date: new Date().toISOString(),
          interview_date: candidate.appointmentDate ? new Date(candidate.appointmentDate).toISOString() : null,
          notes: candidate.notes || `Imported from GoHighLevel. ${candidate.appointmentStatus ? `Appointment Status: ${candidate.appointmentStatus}` : ''}`,
          ghl_appointment_data: candidate.meetingLink ? {
            calendar: {
              address: candidate.meetingLink,
              status: candidate.appointmentStatus || 'booked'
            }
          } : null
        };

        const { error: applicationError } = await supabase
          .from('applications')
          .insert(applicationData);

        if (applicationError) throw applicationError;

        // Add import tag
        await supabase
          .from('candidate_tags')
          .insert({
            candidate_id: candidateRecord.id,
            tag: 'GoHighLevel Import'
          });
      }

      toast({
        title: "Import Successful",
        description: `Successfully imported ${candidates.length} candidates from GoHighLevel`,
      });

      // Reset form
      setCandidates([]);
      setImportData('');
      setSelectedJobRoleId('');

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: "There was an error importing the candidates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const addSampleData = () => {
    const sampleData = `[
  {
    "name": "John Smith",
    "email": "john.smith@example.com",
    "phone": "+1234567890",
    "appointmentDate": "2025-01-15T14:00:00Z",
    "appointmentStatus": "confirmed",
    "meetingLink": "https://us06web.zoom.us/j/123456789",
    "notes": "Experienced appointment setter, good communication skills",
    "interviewCompleted": false
  },
  {
    "name": "Sarah Johnson",
    "email": "sarah.johnson@example.com",
    "phone": "+1234567891",
    "appointmentDate": "2025-01-10T15:30:00Z",
    "appointmentStatus": "completed",
    "meetingLink": "https://us06web.zoom.us/j/987654321",
    "notes": "Great interview, strong sales background",
    "interviewCompleted": true
  }
]`;
    setImportData(sampleData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            GoHighLevel Import
          </CardTitle>
          <p className="text-sm text-gray-600">
            Import candidates from GoHighLevel with their appointment data and interview status
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="job-role-select">Select Job Role *</Label>
            <select
              id="job-role-select"
              value={selectedJobRoleId}
              onChange={(e) => setSelectedJobRoleId(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select job role...</option>
              {jobRoles?.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="import-data">Candidate Data</Label>
            <p className="text-xs text-gray-500 mb-2">
              Paste JSON array or CSV data. For CSV, include headers: name, email, phone, appointment_date, status, meeting_link, notes, interview_completed
            </p>
            <Textarea
              id="import-data"
              placeholder="Paste your GoHighLevel export data here..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="min-h-40 font-mono text-sm"
            />
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={addSampleData}
              >
                Load Sample Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={parseCandidateData}
                disabled={!importData.trim()}
              >
                Parse Data
              </Button>
            </div>
          </div>

          {candidates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Parsed Candidates ({candidates.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {candidates.slice(0, 5).map((candidate, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-sm text-gray-600">{candidate.email}</div>
                          {candidate.appointmentDate && (
                            <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(candidate.appointmentDate).toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          {candidate.appointmentStatus && (
                            <Badge variant="outline" className="text-xs">
                              {candidate.appointmentStatus}
                            </Badge>
                          )}
                          {candidate.interviewCompleted && (
                            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {candidates.length > 5 && (
                    <div className="text-sm text-gray-500 text-center py-2">
                      ... and {candidates.length - 5} more candidates
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-2">Import Notes:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Candidates will be created if they don't exist</li>
                  <li>• Applications will be automatically created with appropriate status</li>
                  <li>• Interview dates will be set from appointment data</li>
                  <li>• All imported candidates will be tagged as "GoHighLevel Import"</li>
                  <li>• Meeting links will be stored for easy access in Interview Notes</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            onClick={handleImport}
            disabled={isProcessing || candidates.length === 0 || !selectedJobRoleId}
            className="w-full"
          >
            {isProcessing ? 'Importing...' : `Import ${candidates.length} Candidates`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
