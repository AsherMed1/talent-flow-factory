
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, Users, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useEmailSender } from '@/hooks/emailTemplates/emailSender';

interface BulkCandidateProcessorProps {
  candidates: any[];
  selectedJobRole: any;
  onProcessComplete: () => void;
}

export const BulkCandidateProcessor = ({ 
  candidates, 
  selectedJobRole, 
  onProcessComplete 
}: BulkCandidateProcessorProps) => {
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { sendTemplateEmail, isConnected } = useEmailSender();

  const handleSelectAll = () => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(candidates.map((_, index) => index));
    }
  };

  const handleToggleCandidate = (index: number) => {
    setSelectedCandidates(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleProcessCandidates = async () => {
    if (!isConnected) {
      toast({
        title: "Email Not Configured",
        description: "Please configure your email settings in Settings > Email Integration before processing candidates.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    let successCount = 0;
    let failureCount = 0;

    const candidatesToProcess = selectedCandidates.map(index => candidates[index]);

    for (const candidate of candidatesToProcess) {
      try {
        const success = await sendTemplateEmail({
          templateType: 'application_update',
          candidateName: `${candidate.firstName} ${candidate.lastName}`,
          candidateEmail: candidate.email,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          jobRole: selectedJobRole?.name || 'General',
          bookingLink: selectedJobRole?.booking_link
        });

        if (success) {
          successCount++;
        } else {
          failureCount++;
        }

        // Small delay between emails
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to send email to ${candidate.email}:`, error);
        failureCount++;
      }
    }

    setIsProcessing(false);

    if (successCount > 0) {
      toast({
        title: "Emails Sent Successfully",
        description: `Successfully sent ${successCount} emails${failureCount > 0 ? `. ${failureCount} failed to send.` : '.'}`,
      });
    }

    if (failureCount > 0 && successCount === 0) {
      toast({
        title: "Email Send Failed",
        description: `Failed to send ${failureCount} emails. Please check your email configuration.`,
        variant: "destructive",
      });
    }

    onProcessComplete();
  };

  if (candidates.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Candidates to Process</h3>
          <p className="text-gray-600">Import candidates using the CSV Import tab to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Configuration Status */}
      {!isConnected ? (
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Mail className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-900">Email Configuration Required</h3>
                <p className="text-red-700">
                  Please configure your email settings to send application emails to candidates.
                </p>
                <p className="text-sm text-red-600 mt-1">
                  Go to Settings &gt; Email Integration to set up your email provider
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900">Email Ready</h3>
                <p className="text-green-700">
                  Your email provider is configured and ready to send application emails.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Role Info */}
      {selectedJobRole && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900">Processing for: {selectedJobRole.name}</h3>
                <p className="text-blue-700">
                  Candidates will receive application emails for this role
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidates List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Candidates ({selectedCandidates.length} selected)
            </CardTitle>
            <Button variant="outline" onClick={handleSelectAll}>
              {selectedCandidates.length === candidates.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {candidates.map((candidate, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCandidates.includes(index)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleToggleCandidate(index)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {candidate.firstName} {candidate.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{candidate.email}</p>
                    {candidate.phone && (
                      <p className="text-xs text-gray-500">{candidate.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {candidate.jobRole && (
                      <Badge variant="secondary">{candidate.jobRole}</Badge>
                    )}
                    <input
                      type="checkbox"
                      checked={selectedCandidates.includes(index)}
                      onChange={() => handleToggleCandidate(index)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button variant="outline" onClick={() => onProcessComplete()}>
              Clear Import
            </Button>
            
            <Button
              onClick={handleProcessCandidates}
              disabled={selectedCandidates.length === 0 || !isConnected || isProcessing}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Send className="w-4 h-4 mr-2" />
              {isProcessing ? 'Sending...' : `Process ${selectedCandidates.length} Candidates`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
