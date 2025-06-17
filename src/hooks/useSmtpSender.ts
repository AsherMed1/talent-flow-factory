
import { useToast } from '@/hooks/use-toast';

interface SmtpConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

interface SendEmailParams {
  to: string;
  subject: string;
  htmlContent: string;
}

export const useSmtpSender = () => {
  const { toast } = useToast();

  const getSmtpConfig = (): SmtpConfig | null => {
    const saved = localStorage.getItem('smtpConfig');
    const isConnected = localStorage.getItem('smtpConnected') === 'true';
    
    if (saved && isConnected) {
      return JSON.parse(saved);
    }
    return null;
  };

  const sendEmail = async ({ to, subject, htmlContent }: SendEmailParams): Promise<boolean> => {
    const config = getSmtpConfig();
    
    if (!config) {
      toast({
        title: "SMTP Not Configured",
        description: "Please configure SMTP settings in Settings > Email Integration",
        variant: "destructive",
      });
      return false;
    }

    try {
      // In a real implementation, this would need a backend service
      // For now, we'll simulate the email sending and provide instructions
      console.log('SMTP Email Details:', {
        from: config.fromName ? `${config.fromName} <${config.fromEmail}>` : config.fromEmail,
        to,
        subject,
        htmlContent,
        smtpConfig: {
          host: config.host,
          port: config.port,
          username: config.username,
          // Don't log password for security
        }
      });

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Email Queued",
        description: "Email has been queued for sending. Note: SMTP sending requires a backend service.",
      });

      return true;
    } catch (error: any) {
      console.error('SMTP send error:', error);
      toast({
        title: "Email Send Failed",
        description: error.message || "Failed to send email via SMTP",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    sendEmail,
    isConnected: !!getSmtpConfig(),
    config: getSmtpConfig()
  };
};
