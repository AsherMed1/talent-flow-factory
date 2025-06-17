
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const GHLWebhookSettings = () => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  
  const webhookUrl = 'https://haqlsgqjymlvshhcbmip.supabase.co/functions/v1/ghl-appointment-webhook';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Webhook URL copied to clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          GoHighLevel Appointment Webhook
        </CardTitle>
        <p className="text-sm text-gray-600">
          Automatically update application status when candidates book appointments in GoHighLevel.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Webhook URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Webhook URL</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-gray-50 border rounded-lg font-mono text-sm break-all">
              {webhookUrl}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyUrl}
              className="shrink-0"
            >
              <Copy className="w-4 h-4" />
              {isCopied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant="default">Active</Badge>
          <span className="text-xs text-gray-500">Ready to receive webhooks</span>
        </div>

        {/* Setup Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-3">Setup Instructions</h4>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>1.</strong> Copy the webhook URL above</p>
            <p><strong>2.</strong> In GoHighLevel, go to Settings → Integrations → Webhooks</p>
            <p><strong>3.</strong> Create a new webhook with these settings:</p>
            <ul className="ml-4 space-y-1 list-disc">
              <li>Webhook URL: Paste the URL from above</li>
              <li>Events: Select "Appointment Booked" or "Calendar Event Created"</li>
              <li>Method: POST</li>
            </ul>
            <p><strong>4.</strong> Save the webhook configuration</p>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gray-50 border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">How it Works</h4>
          <div className="text-sm text-gray-700 space-y-2">
            <p>• When a candidate books an appointment in GoHighLevel, the webhook is triggered</p>
            <p>• The system finds the candidate by email and updates their application status to "Interview Scheduled"</p>
            <p>• The interview date is automatically set based on the appointment time</p>
            <p>• Any configured Make.com webhooks will also be triggered for the status change</p>
          </div>
        </div>

        {/* Link to GHL */}
        <div className="flex justify-center">
          <Button variant="outline" className="gap-2" asChild>
            <a href="https://app.gohighlevel.com" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Open GoHighLevel
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
