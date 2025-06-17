
import { useToast } from '@/hooks/use-toast';

interface GmailConnection {
  email: string;
  isConnected: boolean;
  accessToken: string;
}

interface SendEmailParams {
  to: string;
  subject: string;
  htmlContent: string;
}

export const useGmailSender = () => {
  const { toast } = useToast();

  const getGmailConnection = (): GmailConnection | null => {
    const saved = localStorage.getItem('gmailConnection');
    if (saved) {
      const connection = JSON.parse(saved);
      return connection.isConnected ? connection : null;
    }
    return null;
  };

  const sendEmail = async ({ to, subject, htmlContent }: SendEmailParams): Promise<boolean> => {
    const connection = getGmailConnection();
    
    if (!connection) {
      toast({
        title: "Gmail Not Connected",
        description: "Please connect your Gmail account in Settings > Email Integration",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Create the email message in RFC2822 format
      const email = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        htmlContent
      ].join('\n');

      // Encode the email in base64url format
      const encodedEmail = btoa(email)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Send via Gmail API
      const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: encodedEmail
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to send email');
      }

      return true;
    } catch (error: any) {
      console.error('Gmail send error:', error);
      toast({
        title: "Email Send Failed",
        description: error.message || "Failed to send email via Gmail",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    sendEmail,
    isConnected: !!getGmailConnection(),
    connection: getGmailConnection()
  };
};
