
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ResendConfig {
  fromEmail: string;
  fromName: string;
}

interface SendEmailParams {
  to: string;
  subject: string;
  htmlContent: string;
}

export const useResendSender = () => {
  const { toast } = useToast();

  const getResendConfig = (): ResendConfig | null => {
    const saved = localStorage.getItem('resendConfig');
    const isConnected = localStorage.getItem('resendConnected') === 'true';
    
    if (saved && isConnected) {
      return JSON.parse(saved);
    }
    return null;
  };

  const sendEmail = async ({ to, subject, htmlContent }: SendEmailParams): Promise<boolean> => {
    const config = getResendConfig();
    
    if (!config) {
      toast({
        title: "Email Not Configured",
        description: "Please configure your email settings in Settings > Email Integration",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to,
          subject,
          htmlContent,
          fromEmail: config.fromEmail,
          fromName: config.fromName
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email Sent",
        description: `Email successfully sent to ${to}`,
      });

      return true;
    } catch (error: any) {
      console.error('Email send error:', error);
      toast({
        title: "Email Send Failed",
        description: error.message || "Failed to send email",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    sendEmail,
    isConnected: !!getResendConfig(),
    config: getResendConfig()
  };
};
