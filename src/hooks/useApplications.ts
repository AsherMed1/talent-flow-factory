import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PreScreeningResponse {
  motivation_response: string;
  motivation_score: number;
  experience_response: string;
  experience_score: number;
  availability_response: string;
  availability_score: number;
  communication_score: number;
  overall_prescreening_score: number;
  scored_at?: string;
}

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
  interview_recording_link: string | null;
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
  zoom_recording_url: string | null;
  zoom_recording_files: any | null;
  ghl_appointment_data: any | null;
  video_analysis_results: string | null;
  video_analysis_timestamp: string | null;
  pre_screening_responses?: PreScreeningResponse[];
  candidates: {
    name: string;
    email: string;
    phone: string | null;
    candidate_tags: {
      tag: string;
    }[];
  } | null;
  job_roles: {
    name: string;
    booking_link: string | null;
  } | null;
}

export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          candidate_id,
          job_role_id,
          status,
          rating,
          notes,
          has_resume,
          has_voice_recording,
          has_video,
          interview_date,
          interview_recording_link,
          offer_sent_date,
          applied_date,
          updated_at,
          voice_analysis_score,
          voice_analysis_feedback,
          voice_transcription,
          voice_analysis_completed_at,
          voice_clarity_score,
          voice_pacing_score,
          voice_tone_score,
          voice_energy_score,
          voice_confidence_score,
          form_data,
          zoom_recording_url,
          zoom_recording_files,
          ghl_appointment_data,
          video_analysis_results,
          video_analysis_timestamp,
          pre_screening_responses (
            motivation_response,
            motivation_score,
            experience_response,
            experience_score,
            availability_response,
            availability_score,
            communication_score,
            overall_prescreening_score
          ),
          candidates (
            name, 
            email, 
            phone,
            candidate_tags (tag)
          ),
          job_roles (name, booking_link)
        `)
        .not('form_data', 'is', null)
        .neq('form_data', '{}')
        .not('candidate_id', 'is', null)
        .order('applied_date', { ascending: false });
      
      if (error) throw error;
      
      // Filter and transform data to handle potential foreign key errors
      const filteredData = data?.filter(app => {
        if (!app.form_data) return false;
        
        // Check if form_data has the expected structure from your application form
        const formData = app.form_data as any;
        return (
          formData.basicInfo || 
          formData.availability || 
          formData.preScreening ||
          formData.voiceRecordings || 
          formData.listeningComprehension || 
          formData.uploads
        );
      }).map(app => {
        // Handle candidates data
        const getCandidatesData = () => {
          const candidatesData = app.candidates;
          if (!candidatesData || typeof candidatesData !== 'object') return null;
          if (!('name' in candidatesData) || !candidatesData.name) return null;
          if (typeof candidatesData.name !== 'string') return null;
          
          return {
            name: candidatesData.name,
            email: candidatesData.email || '',
            phone: candidatesData.phone || null,
            candidate_tags: candidatesData.candidate_tags || []
          };
        };

        // Handle job_roles data
        const getJobRolesData = () => {
          const jobRolesData = app.job_roles;
          if (!jobRolesData || typeof jobRolesData !== 'object') return null;
          if (!('name' in jobRolesData) || !jobRolesData.name) return null;
          if (typeof jobRolesData.name !== 'string') return null;
          
          return {
            name: jobRolesData.name,
            booking_link: jobRolesData.booking_link || null
          };
        };

        return {
          ...app,
          candidates: getCandidatesData(),
          job_roles: getJobRolesData()
        };
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
        .neq('form_data', '{}')
        .not('candidate_id', 'is', null);
      
      if (error) throw error;
      
      // Filter to only include applications with proper form structure
      const filteredData = data.filter(app => {
        if (!app.form_data) return false;
        const formData = app.form_data as any;
        return (
          formData.basicInfo || 
          formData.availability || 
          formData.preScreening ||
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
