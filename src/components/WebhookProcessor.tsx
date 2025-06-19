
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { processFailedWebhookData } from '@/utils/webhookProcessor';
import { Calendar, Play, CheckCircle, XCircle } from 'lucide-react';

export const WebhookProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleProcessWebhooks = async () => {
    setIsProcessing(true);
    setResults([]);
    
    try {
      const processingResults = await processFailedWebhookData();
      setResults(processingResults);
      
      const successCount = processingResults.filter(r => r.success).length;
      const totalCount = processingResults.length;
      
      toast({
        title: "Processing Complete",
        description: `Successfully processed ${successCount}/${totalCount} candidates`,
        variant: successCount === totalCount ? "default" : "destructive"
      });
      
    } catch (error) {
      console.error('Error processing webhooks:', error);
      toast({
        title: "Processing Failed",
        description: "An error occurred while processing the webhook data",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Process Failed GHL Webhooks
        </CardTitle>
        <p className="text-sm text-gray-600">
          Manually process the failed webhook data for Estee and Cath to move them to interview scheduled status.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleProcessWebhooks}
          disabled={isProcessing}
          className="w-full"
        >
          <Play className="w-4 h-4 mr-2" />
          {isProcessing ? 'Processing...' : 'Process Failed Webhooks'}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Processing Results:</h4>
            {results.map((result, index) => (
              <div key={index} className={`p-3 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="font-medium">{result.email}</span>
                </div>
                {result.success ? (
                  <div className="text-sm text-green-700 mt-1">
                    <p>✅ {result.candidateName} moved to interview scheduled</p>
                    <p>📅 Interview: {new Date(result.interviewDate).toLocaleString()}</p>
                  </div>
                ) : (
                  <p className="text-sm text-red-700 mt-1">❌ {result.error}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded-lg text-sm">
          <p><strong>What this does:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Finds the most recent candidate record for each email</li>
            <li>Updates their application status to "interview_scheduled"</li>
            <li>Sets the interview date from the webhook data</li>
            <li>Stores the complete GHL appointment data</li>
            <li>Triggers internal webhooks for the status change</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
