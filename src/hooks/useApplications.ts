
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Application {
  id: string;
  candidate_id: string;
  job_role_id: string;
  status: 'applied' | 'reviewed' | 'interview_scheduled' | 'interview_completed' | 'offer_sent' | 'hired' | 'rejected';
  rating: number | null;
  notes: string | null;
  has_resume: boolean;
  has_voice_recording: boolean;
  has_video: boolean;
  interview_date: string | null;
  offer_sent_date: string | null;
  applied_date: string;
  updated_at: string | null;
  voice_analysis_score: number | null;
  voice_analysis_feedback: string | null;
  voice_transcription: string | null;
  voice_analysis_completed_at: string | null;
  voice_clarity_score: number | null;
  voice_pacing_score: number | null;
  voice_tone_score: number | null;
  voice_energy_score: number | null;
  voice_confidence_score: number | null;
  form_data: any | null;
  candidates: {
    name: string;
    email: string;
    phone: string | null;
    candidate_tags: {
      tag: string;
    }[];
  };
  job_roles: {
    name: string;
  };
}

export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          candidates (
            name, 
            email, 
            phone,
            candidate_tags (tag)
          ),
          job_roles (name)
        `)
        .not('form_data', 'is', null)
        .neq('form_data', '{}')
        .order('applied_date', { ascending: false });
      
      if (error) throw error;
      
      // Additional filtering to ensure applications have proper form data structure
      const filteredData = data?.filter(app => {
        if (!app.form_data) return false;
        
        // Check if form_data has the expected structure from your application form
        const formData = app.form_data as any;
        return (
          formData.basicInfo || 
          formData.availability || 
          formData.voiceRecordings || 
          formData.listeningComprehension || 
          formData.uploads
        );
      }) || [];
      
      return filteredData as Application[];
    }
  });
};

export const useApplicationStats = () => {
  return useQuery({
    queryKey: ['application-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('status, applied_date, interview_date, form_data')
        .not('form_data', 'is', null)
        .neq('form_data', '{}');
      
      if (error) throw error;
      
      // Filter to only include applications with proper form structure
      const filteredData = data.filter(app => {
        if (!app.form_data) return false;
        const formData = app.form_data as any;
        return (
          formData.basicInfo || 
          formData.availability || 
          formData.voiceRecordings || 
          formData.listeningComprehension || 
          formData.uploads
        );
      });
      
      const stats = {
        activeApplications: filteredData.filter(app => !['hired', 'rejected'].includes(app.status)).length,
        interviewsThisWeek: filteredData.filter(app => {
          if (!app.interview_date) return false;
          const interviewDate = new Date(app.interview_date);
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return interviewDate >= oneWeekAgo;
        }).length,
        hiredThisMonth: filteredData.filter(app => {
          if (app.status !== 'hired') return false;
          const appliedDate = new Date(app.applied_date);
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          return appliedDate >= oneMonthAgo;
        }).length,
        conversionRate: filteredData.length > 0 ? ((filteredData.filter(app => app.status === 'hired').length / filteredData.length) * 100).toFixed(1) : '0'
      };
      
      return stats;
    }
  });
};
