
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Application } from '@/hooks/useApplications';
import { useEmailTemplates } from '@/hooks/useEmailTemplates';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface InterviewDispositionProps {
  application: Application;
  onDispositionComplete?: () => void;
}

export const InterviewDisposition = ({ application, onDispositionComplete }: InterviewDispositionProps) => {
  const [disposition, setDisposition] = useState<'hired' | 'hold_for_future' | 'not_selected' | ''>('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { sendTemplateEmail } = useEmailTemplates();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmitDisposition = async () => {
    if (!disposition) {
      toast({
        title: "Please select a disposition",
        description: "You must choose an outcome before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Prepare candidate info
      const candidateName = application.candidates.name;
      const candidateEmail = application.candidates.email;
      const jobRole = application.job_roles?.name || 'General';
      const firstName = application.form_data?.basicInfo?.firstName || candidateName.split(' ')[0];
      const lastName = application.form_data?.basicInfo?.lastName || candidateName.split(' ').slice(1).join(' ');

      // Update application status and notes
      let newStatus: 'hired' | 'rejected' = 'rejected';
      if (disposition === 'hired') {
        newStatus = 'hired';
      }

      const dispositionNotes = `Interview Disposition: ${disposition}\nNotes: ${notes}`;
      const existingNotes = application.notes || '';
      const updatedNotes = existingNotes ? `${existingNotes}\n\n${dispositionNotes}` : dispositionNotes;

      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: newStatus,
          notes: updatedNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id);

      if (updateError) throw updateError;

      // Send appropriate email based on disposition
      let emailSent = false;
      
      if (disposition === 'hired') {
        emailSent = await sendTemplateEmail({
          templateType: 'welcome',
          candidateName,
          candidateEmail,
          firstName,
          lastName,
          jobRole
        });
      } else if (disposition === 'hold_for_future') {
        emailSent = await sendTemplateEmail({
          templateType: 'hold_for_future',
          candidateName,
          candidateEmail,
          firstName,
          lastName,
          jobRole
        });
      } else if (disposition === 'not_selected') {
        emailSent = await sendTemplateEmail({
          templateType: 'thank_you',
          candidateName,
          candidateEmail,
          firstName,
          lastName,
          jobRole
        });
      }

      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ['applications'] });

      toast({
        title: "Disposition Complete",
        description: `${candidateName} has been processed and ${emailSent ? 'notified via email' : 'updated (email not sent)'}.`,
      });

      if (onDispositionComplete) {
        onDispositionComplete();
      }

    } catch (error) {
      console.error('Error processing disposition:', error);
      toast({
        title: "Error",
        description: "Failed to process the interview disposition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getDispositionIcon = (type: string) => {
    switch (type) {
      case 'hired':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'hold_for_future':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'not_selected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Disposition</CardTitle>
        <p className="text-sm text-gray-600">
          Complete the hiring process for {application.candidates.name}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-4 block">What's your decision?</Label>
          <RadioGroup value={disposition} onValueChange={(value) => setDisposition(value as any)}>
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="hired" id="hired" />
              <Label htmlFor="hired" className="flex items-center gap-2 cursor-pointer flex-1">
                {getDispositionIcon('hired')}
                <div>
                  <div className="font-medium text-green-700">Hire this candidate</div>
                  <div className="text-sm text-gray-500">Send welcome email and move to hired status</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="hold_for_future" id="hold_for_future" />
              <Label htmlFor="hold_for_future" className="flex items-center gap-2 cursor-pointer flex-1">
                {getDispositionIcon('hold_for_future')}
                <div>
                  <div className="font-medium text-yellow-700">Hold for future opportunities</div>
                  <div className="text-sm text-gray-500">Good candidate, but not right for this role</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="not_selected" id="not_selected" />
              <Label htmlFor="not_selected" className="flex items-center gap-2 cursor-pointer flex-1">
                {getDispositionIcon('not_selected')}
                <div>
                  <div className="font-medium text-red-700">Not selected</div>
                  <div className="text-sm text-gray-500">Send polite thank you email</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="disposition-notes" className="text-base font-medium">
            Additional Notes (Optional)
          </Label>
          <Textarea
            id="disposition-notes"
            placeholder="Add any additional notes about this decision..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            onClick={handleSubmitDisposition}
            disabled={isProcessing || !disposition}
            className="px-6"
          >
            {isProcessing ? 'Processing...' : 'Complete Disposition'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
