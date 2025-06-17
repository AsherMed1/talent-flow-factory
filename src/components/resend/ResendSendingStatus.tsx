
import { CheckCircle, XCircle } from 'lucide-react';
import { useResendSender } from '@/hooks/useResendSender';

export const ResendSendingStatus = () => {
  const { isConnected, config } = useResendSender();

  if (isConnected && config) {
    return (
      <div className="text-center py-4">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Email Ready</h3>
        <p className="text-gray-600">
          Emails will be sent from {config.fromEmail} using Resend
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">Email Not Configured</h3>
      <p className="text-gray-600">
        Configure your email settings to start sending emails
      </p>
    </div>
  );
};
