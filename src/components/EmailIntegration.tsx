
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { SmtpConfiguration } from '@/components/smtp/SmtpConfiguration';
import { SmtpSendingStatus } from '@/components/smtp/SmtpSendingStatus';

export const EmailIntegration = () => {
  return (
    <div className="space-y-6">
      <SmtpConfiguration />

      <Card>
        <CardHeader>
          <CardTitle>Email Sending Status</CardTitle>
        </CardHeader>
        <CardContent>
          <SmtpSendingStatus />
        </CardContent>
      </Card>
    </div>
  );
};
