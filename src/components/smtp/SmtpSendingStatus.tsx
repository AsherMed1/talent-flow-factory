
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useSmtpSender } from '@/hooks/useSmtpSender';

export const SmtpSendingStatus = () => {
  const { isConnected, config } = useSmtpSender();

  if (isConnected && config) {
    return (
      <div className="space-y-4">
        <div className="text-center py-4">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">SMTP Configured</h3>
          <p className="text-gray-600">
            Emails will be sent from {config.fromEmail}
          </p>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">Backend Service Required</h4>
              <p className="text-sm text-amber-700">
                SMTP email sending requires a backend service to handle the actual email delivery. 
                The current implementation logs email details to the console for development purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">SMTP Not Configured</h3>
      <p className="text-gray-600">
        Configure your SMTP settings to start sending emails
      </p>
    </div>
  );
};
