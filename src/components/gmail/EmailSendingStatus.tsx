
import { CheckCircle, XCircle } from 'lucide-react';

interface GmailConnection {
  email: string;
  isConnected: boolean;
  lastSync: string;
  accessToken?: string;
}

interface EmailSendingStatusProps {
  gmailConnection: GmailConnection | null;
}

export const EmailSendingStatus = ({ gmailConnection }: EmailSendingStatusProps) => {
  if (gmailConnection?.isConnected) {
    return (
      <div className="text-center py-4">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Ready to Send</h3>
        <p className="text-gray-600">
          Emails will be sent from {gmailConnection.email}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">Gmail Not Connected</h3>
      <p className="text-gray-600">
        Connect your Gmail account to start sending emails
      </p>
    </div>
  );
};
