export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          applied_date: string | null
          candidate_id: string | null
          created_at: string | null
          form_data: Json | null
          ghl_appointment_data: Json | null
          has_resume: boolean | null
          has_video: boolean | null
          has_voice_recording: boolean | null
          id: string
          interview_date: string | null
          interview_recording_link: string | null
          job_role_id: string | null
          notes: string | null
          offer_sent_date: string | null
          rating: number | null
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
          video_analysis_completed_at: string | null
          video_analysis_error: string | null
          video_analysis_results: string | null
          video_analysis_retry_count: number | null
          video_analysis_started_at: string | null
          video_analysis_status: string | null
          video_analysis_timestamp: string | null
          voice_analysis_completed_at: string | null
          voice_analysis_feedback: string | null
          voice_analysis_score: number | null
          voice_clarity_score: number | null
          voice_confidence_score: number | null
          voice_energy_score: number | null
          voice_pacing_score: number | null
          voice_tone_score: number | null
          voice_transcription: string | null
          zoom_recording_files: Json | null
          zoom_recording_url: string | null
        }
        Insert: {
          applied_date?: string | null
          candidate_id?: string | null
          created_at?: string | null
          form_data?: Json | null
          ghl_appointment_data?: Json | null
          has_resume?: boolean | null
          has_video?: boolean | null
          has_voice_recording?: boolean | null
          id?: string
          interview_date?: string | null
          interview_recording_link?: string | null
          job_role_id?: string | null
          notes?: string | null
          offer_sent_date?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          video_analysis_completed_at?: string | null
          video_analysis_error?: string | null
          video_analysis_results?: string | null
          video_analysis_retry_count?: number | null
          video_analysis_started_at?: string | null
          video_analysis_status?: string | null
          video_analysis_timestamp?: string | null
          voice_analysis_completed_at?: string | null
          voice_analysis_feedback?: string | null
          voice_analysis_score?: number | null
          voice_clarity_score?: number | null
          voice_confidence_score?: number | null
          voice_energy_score?: number | null
          voice_pacing_score?: number | null
          voice_tone_score?: number | null
          voice_transcription?: string | null
          zoom_recording_files?: Json | null
          zoom_recording_url?: string | null
        }
        Update: {
          applied_date?: string | null
          candidate_id?: string | null
          created_at?: string | null
          form_data?: Json | null
          ghl_appointment_data?: Json | null
          has_resume?: boolean | null
          has_video?: boolean | null
          has_voice_recording?: boolean | null
          id?: string
          interview_date?: string | null
          interview_recording_link?: string | null
          job_role_id?: string | null
          notes?: string | null
          offer_sent_date?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          video_analysis_completed_at?: string | null
          video_analysis_error?: string | null
          video_analysis_results?: string | null
          video_analysis_retry_count?: number | null
          video_analysis_started_at?: string | null
          video_analysis_status?: string | null
          video_analysis_timestamp?: string | null
          voice_analysis_completed_at?: string | null
          voice_analysis_feedback?: string | null
          voice_analysis_score?: number | null
          voice_clarity_score?: number | null
          voice_confidence_score?: number | null
          voice_energy_score?: number | null
          voice_pacing_score?: number | null
          voice_tone_score?: number | null
          voice_transcription?: string | null
          zoom_recording_files?: Json | null
          zoom_recording_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_role_id_fkey"
            columns: ["job_role_id"]
            isOneToOne: false
            referencedRelation: "job_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_applications_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_applications_job_role"
            columns: ["job_role_id"]
            isOneToOne: false
            referencedRelation: "job_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_tags: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          id: string
          tag: string
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          tag: string
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_tags_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_candidate_tags_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      job_roles: {
        Row: {
          ai_tone_prompt: string | null
          booking_link: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          form_fields: Json | null
          hiring_process: string | null
          id: string
          job_description: string | null
          name: string
          pipeline_stages: Json | null
          screening_questions: string | null
          status: Database["public"]["Enums"]["role_status"] | null
          updated_at: string | null
        }
        Insert: {
          ai_tone_prompt?: string | null
          booking_link?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          form_fields?: Json | null
          hiring_process?: string | null
          id?: string
          job_description?: string | null
          name: string
          pipeline_stages?: Json | null
          screening_questions?: string | null
          status?: Database["public"]["Enums"]["role_status"] | null
          updated_at?: string | null
        }
        Update: {
          ai_tone_prompt?: string | null
          booking_link?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          form_fields?: Json | null
          hiring_process?: string | null
          id?: string
          job_description?: string | null
          name?: string
          pipeline_stages?: Json | null
          screening_questions?: string | null
          status?: Database["public"]["Enums"]["role_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_roles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_screening_responses: {
        Row: {
          application_id: string | null
          availability_response: string | null
          availability_score: number | null
          communication_score: number | null
          created_at: string
          experience_response: string | null
          experience_score: number | null
          id: string
          motivation_response: string | null
          motivation_score: number | null
          overall_prescreening_score: number | null
          scored_at: string | null
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          availability_response?: string | null
          availability_score?: number | null
          communication_score?: number | null
          created_at?: string
          experience_response?: string | null
          experience_score?: number | null
          id?: string
          motivation_response?: string | null
          motivation_score?: number | null
          overall_prescreening_score?: number | null
          scored_at?: string | null
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          availability_response?: string | null
          availability_score?: number | null
          communication_score?: number | null
          created_at?: string
          experience_response?: string | null
          experience_score?: number | null
          id?: string
          motivation_response?: string | null
          motivation_score?: number | null
          overall_prescreening_score?: number | null
          scored_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_pre_screening_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pre_screening_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "mv_application_summary"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "pre_screening_responses_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pre_screening_responses_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "mv_application_summary"
            referencedColumns: ["application_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      video_analysis_details: {
        Row: {
          ai_model_used: string | null
          analysis_version: number | null
          application_id: string | null
          candidate_speaking_time: number | null
          clarity_score: number | null
          confidence_level: number | null
          confidence_score: number | null
          created_at: string | null
          filler_words_count: number | null
          filler_words_rate: number | null
          id: string
          interview_highlights: Json | null
          interviewer_speaking_time: number | null
          key_moments: Json | null
          pace_score: number | null
          processing_duration: number | null
          sentiment_timeline: Json | null
          sentiment_trends: Json | null
          speaker_segments: Json | null
          tone_score: number | null
          updated_at: string | null
        }
        Insert: {
          ai_model_used?: string | null
          analysis_version?: number | null
          application_id?: string | null
          candidate_speaking_time?: number | null
          clarity_score?: number | null
          confidence_level?: number | null
          confidence_score?: number | null
          created_at?: string | null
          filler_words_count?: number | null
          filler_words_rate?: number | null
          id?: string
          interview_highlights?: Json | null
          interviewer_speaking_time?: number | null
          key_moments?: Json | null
          pace_score?: number | null
          processing_duration?: number | null
          sentiment_timeline?: Json | null
          sentiment_trends?: Json | null
          speaker_segments?: Json | null
          tone_score?: number | null
          updated_at?: string | null
        }
        Update: {
          ai_model_used?: string | null
          analysis_version?: number | null
          application_id?: string | null
          candidate_speaking_time?: number | null
          clarity_score?: number | null
          confidence_level?: number | null
          confidence_score?: number | null
          created_at?: string | null
          filler_words_count?: number | null
          filler_words_rate?: number | null
          id?: string
          interview_highlights?: Json | null
          interviewer_speaking_time?: number | null
          key_moments?: Json | null
          pace_score?: number | null
          processing_duration?: number | null
          sentiment_timeline?: Json | null
          sentiment_trends?: Json | null
          speaker_segments?: Json | null
          tone_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_video_analysis_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_video_analysis_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "mv_application_summary"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "video_analysis_details_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_analysis_details_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "mv_application_summary"
            referencedColumns: ["application_id"]
          },
        ]
      }
      video_analysis_logs: {
        Row: {
          ai_model_used: string | null
          application_id: string | null
          attempt_number: number | null
          created_at: string | null
          error_details: Json | null
          error_message: string | null
          error_type: string | null
          id: string
          processing_time: number | null
          status: string
        }
        Insert: {
          ai_model_used?: string | null
          application_id?: string | null
          attempt_number?: number | null
          created_at?: string | null
          error_details?: Json | null
          error_message?: string | null
          error_type?: string | null
          id?: string
          processing_time?: number | null
          status: string
        }
        Update: {
          ai_model_used?: string | null
          application_id?: string | null
          attempt_number?: number | null
          created_at?: string | null
          error_details?: Json | null
          error_message?: string | null
          error_type?: string | null
          id?: string
          processing_time?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_video_logs_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_video_logs_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "mv_application_summary"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "video_analysis_logs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_analysis_logs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "mv_application_summary"
            referencedColumns: ["application_id"]
          },
        ]
      }
      webhook_configs: {
        Row: {
          created_at: string
          event_type: string
          id: string
          is_active: boolean
          name: string
          url: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          is_active?: boolean
          name: string
          url: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          is_active?: boolean
          name?: string
          url?: string
        }
        Relationships: []
      }
      zoom_recordings_log: {
        Row: {
          created_at: string
          id: string
          meeting_id: string
          meeting_uuid: string
          processed: boolean | null
          recording_files: Json | null
          share_url: string
          start_time: string
          topic: string
        }
        Insert: {
          created_at?: string
          id?: string
          meeting_id: string
          meeting_uuid: string
          processed?: boolean | null
          recording_files?: Json | null
          share_url: string
          start_time: string
          topic: string
        }
        Update: {
          created_at?: string
          id?: string
          meeting_id?: string
          meeting_uuid?: string
          processed?: boolean | null
          recording_files?: Json | null
          share_url?: string
          start_time?: string
          topic?: string
        }
        Relationships: []
      }
    }
    Views: {
      mv_application_summary: {
        Row: {
          application_id: string | null
          applied_date: string | null
          candidate_email: string | null
          candidate_name: string | null
          has_video: string | null
          has_voice: string | null
          interview_date: string | null
          job_role_name: string | null
          overall_prescreening_score: number | null
          rating: number | null
          status: Database["public"]["Enums"]["application_status"] | null
          voice_analysis_score: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_application_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_applications_paginated: {
        Args: {
          p_offset?: number
          p_limit?: number
          p_status?: string
          p_job_role_id?: string
        }
        Returns: {
          id: string
          candidate_id: string
          job_role_id: string
          status: Database["public"]["Enums"]["application_status"]
          rating: number
          applied_date: string
          total_count: number
        }[]
      }
      get_applications_paginated_v2: {
        Args: {
          p_offset?: number
          p_limit?: number
          p_status?: string
          p_job_role_id?: string
          p_search_term?: string
        }
        Returns: {
          id: string
          candidate_id: string
          job_role_id: string
          status: Database["public"]["Enums"]["application_status"]
          rating: number
          applied_date: string
          candidate_name: string
          candidate_email: string
          job_role_name: string
          voice_analysis_score: number
          total_count: number
        }[]
      }
      get_pipeline_stages_for_role: {
        Args: { role_id: string }
        Returns: Json
      }
      refresh_application_summary: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      application_status:
        | "applied"
        | "reviewed"
        | "interview_scheduled"
        | "interview_completed"
        | "offer_sent"
        | "hired"
        | "rejected"
      role_status: "active" | "draft" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "applied",
        "reviewed",
        "interview_scheduled",
        "interview_completed",
        "offer_sent",
        "hired",
        "rejected",
      ],
      role_status: ["active", "draft", "closed"],
    },
  },
} as const
