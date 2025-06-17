
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GoHighLevelConfig {
  locationId: string;
  calendarId?: string;
}

interface CreateContactParams {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface CreateAppointmentParams {
  contactId: string;
  calendarId: string;
  startTime: string;
  title: string;
  notes?: string;
}

export const useGoHighLevel = () => {
  const { toast } = useToast();

  const getConfig = (): GoHighLevelConfig | null => {
    const saved = localStorage.getItem('goHighLevelConfig');
    return saved ? JSON.parse(saved) : null;
  };

  const saveConfig = (config: GoHighLevelConfig) => {
    localStorage.setItem('goHighLevelConfig', JSON.stringify(config));
  };

  const createContact = async (params: CreateContactParams): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('gohighlevel-integration', {
        body: {
          action: 'createContact',
          ...params
        }
      });

      if (error) throw error;
      return data.contactId;
    } catch (error: any) {
      console.error('Error creating GoHighLevel contact:', error);
      toast({
        title: "Contact Creation Failed",
        description: error.message || "Failed to create contact in GoHighLevel",
        variant: "destructive",
      });
      return null;
    }
  };

  const createAppointment = async (params: CreateAppointmentParams): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('gohighlevel-integration', {
        body: {
          action: 'createAppointment',
          ...params
        }
      });

      if (error) throw error;
      return data.appointmentId;
    } catch (error: any) {
      console.error('Error creating GoHighLevel appointment:', error);
      toast({
        title: "Appointment Creation Failed",
        description: error.message || "Failed to create appointment in GoHighLevel",
        variant: "destructive",
      });
      return null;
    }
  };

  const getBookingLink = (calendarId?: string): string => {
    const config = getConfig();
    if (!config?.locationId) return '';
    
    const calendar = calendarId || config.calendarId || 'default';
    return `https://app.gohighlevel.com/widget/booking/${config.locationId}/${calendar}`;
  };

  return {
    getConfig,
    saveConfig,
    createContact,
    createAppointment,
    getBookingLink,
    isConfigured: !!getConfig()?.locationId
  };
};
