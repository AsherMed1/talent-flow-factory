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
          has_resume: boolean | null
          has_video: boolean | null
          has_voice_recording: boolean | null
          id: string
          interview_date: string | null
          job_role_id: string | null
          notes: string | null
          offer_sent_date: string | null
          rating: number | null
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
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
          has_resume?: boolean | null
          has_video?: boolean | null
          has_voice_recording?: boolean | null
          id?: string
          interview_date?: string | null
          job_role_id?: string | null
          notes?: string | null
          offer_sent_date?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
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
          has_resume?: boolean | null
          has_video?: boolean | null
          has_voice_recording?: boolean | null
          id?: string
          interview_date?: string | null
          job_role_id?: string | null
          notes?: string | null
          offer_sent_date?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
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
          booking_link: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          form_fields: Json | null
          id: string
          name: string
          status: Database["public"]["Enums"]["role_status"] | null
          updated_at: string | null
        }
        Insert: {
          booking_link?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          form_fields?: Json | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["role_status"] | null
          updated_at?: string | null
        }
        Update: {
          booking_link?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          form_fields?: Json | null
          id?: string
          name?: string
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
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
