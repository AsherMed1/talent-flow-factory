
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResendConfiguration } from '@/components/resend/ResendConfiguration';
import { ResendSendingStatus } from '@/components/resend/ResendSendingStatus';
import { SmtpConfiguration } from '@/components/smtp/SmtpConfiguration';
import { SmtpSendingStatus } from '@/components/smtp/SmtpSendingStatus';
import { GoHighLevelConfiguration } from '@/components/gohighlevel/GoHighLevelConfiguration';

export const EmailIntegration = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="resend" className="space-y-6">
        <TabsList>
          <TabsTrigger value="resend">Resend (Recommended)</TabsTrigger>
          <TabsTrigger value="smtp">SMTP</TabsTrigger>
          <TabsTrigger value="calendar">Calendar Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="resend" className="space-y-6">
          <ResendConfiguration />

          <Card>
            <CardHeader>
              <CardTitle>Email Sending Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResendSendingStatus />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smtp" className="space-y-6">
          <SmtpConfiguration />

          <Card>
            <CardHeader>
              <CardTitle>Email Sending Status</CardTitle>
            </CardHeader>
            <CardContent>
              <SmtpSendingStatus />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <GoHighLevelConfiguration />
        </TabsContent>
      </Tabs>
    </div>
  );
};
