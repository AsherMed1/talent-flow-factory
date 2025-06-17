
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { useGmailConnection } from '@/hooks/useGmailConnection';
import { GmailSetupInstructions } from '@/components/gmail/GmailSetupInstructions';
import { GmailConnectionForm } from '@/components/gmail/GmailConnectionForm';
import { GmailConnectedStatus } from '@/components/gmail/GmailConnectedStatus';
import { EmailSendingStatus } from '@/components/gmail/EmailSendingStatus';

export const EmailIntegration = () => {
  const {
    gmailConnection,
    isConnecting,
    clientId,
    clientSecret,
    setClientId,
    setClientSecret,
    initiateGmailAuth,
    disconnectGmail,
    testConnection,
  } = useGmailConnection();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Gmail Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!gmailConnection?.isConnected ? (
            <div className="space-y-4">
              <GmailSetupInstructions />
              <GmailConnectionForm
                clientId={clientId}
                clientSecret={clientSecret}
                isConnecting={isConnecting}
                onClientIdChange={setClientId}
                onClientSecretChange={setClientSecret}
                onConnect={initiateGmailAuth}
              />
            </div>
          ) : (
            <GmailConnectedStatus
              gmailConnection={gmailConnection}
              onTestConnection={testConnection}
              onDisconnect={disconnectGmail}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Sending Status</CardTitle>
        </CardHeader>
        <CardContent>
          <EmailSendingStatus gmailConnection={gmailConnection} />
        </CardContent>
      </Card>
    </div>
  );
};
