export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          clinic: string | null
          created_at: string
          doctor_id: string | null
          doctor_name: string
          doctor_specialty: string | null
          fee: number
          id: string
          mode: string
          patient_id: string
          patient_name: string | null
          patient_phone: string | null
          reason: string | null
          slot_date: string
          slot_time: string
          status: string
          updated_at: string
        }
        Insert: {
          clinic?: string | null
          created_at?: string
          doctor_id?: string | null
          doctor_name: string
          doctor_specialty?: string | null
          fee?: number
          id?: string
          mode?: string
          patient_id: string
          patient_name?: string | null
          patient_phone?: string | null
          reason?: string | null
          slot_date: string
          slot_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          clinic?: string | null
          created_at?: string
          doctor_id?: string | null
          doctor_name?: string
          doctor_specialty?: string | null
          fee?: number
          id?: string
          mode?: string
          patient_id?: string
          patient_name?: string | null
          patient_phone?: string | null
          reason?: string | null
          slot_date?: string
          slot_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "catalog_doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_doctors: {
        Row: {
          active: boolean
          city: string | null
          clinic: string | null
          created_at: string
          experience_years: number | null
          fee: number | null
          id: string
          languages: string | null
          name: string
          specialty: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          city?: string | null
          clinic?: string | null
          created_at?: string
          experience_years?: number | null
          fee?: number | null
          id?: string
          languages?: string | null
          name: string
          specialty: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          city?: string | null
          clinic?: string | null
          created_at?: string
          experience_years?: number | null
          fee?: number | null
          id?: string
          languages?: string | null
          name?: string
          specialty?: string
          updated_at?: string
        }
        Relationships: []
      }
      catalog_hospitals: {
        Row: {
          active: boolean
          address: string | null
          city: string | null
          created_at: string
          emergency: boolean
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          city?: string | null
          created_at?: string
          emergency?: boolean
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string | null
          city?: string | null
          created_at?: string
          emergency?: boolean
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      catalog_labs: {
        Row: {
          active: boolean
          address: string | null
          city: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      catalog_medicines: {
        Row: {
          active: boolean
          brand: string | null
          category: string | null
          created_at: string
          id: string
          name: string
          price: number | null
          requires_prescription: boolean
          updated_at: string
        }
        Insert: {
          active?: boolean
          brand?: string | null
          category?: string | null
          created_at?: string
          id?: string
          name: string
          price?: number | null
          requires_prescription?: boolean
          updated_at?: string
        }
        Update: {
          active?: boolean
          brand?: string | null
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          price?: number | null
          requires_prescription?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      catalog_pharmacies: {
        Row: {
          active: boolean
          address: string | null
          city: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      catalog_tests: {
        Row: {
          active: boolean
          category: string | null
          created_at: string
          home_collection: boolean
          id: string
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string | null
          created_at?: string
          home_collection?: boolean
          id?: string
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string | null
          created_at?: string
          home_collection?: boolean
          id?: string
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      health_events: {
        Row: {
          created_at: string
          description: string | null
          event_type: string
          id: string
          occurred_at: string
          ref_id: string | null
          ref_table: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_type: string
          id?: string
          occurred_at?: string
          ref_id?: string | null
          ref_table?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_type?: string
          id?: string
          occurred_at?: string
          ref_id?: string | null
          ref_table?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      lab_reports: {
        Row: {
          analysis: Json | null
          created_at: string
          file_name: string | null
          file_path: string
          id: string
          lab_name: string | null
          mime_type: string | null
          report_type: string | null
          status: string
          user_id: string
        }
        Insert: {
          analysis?: Json | null
          created_at?: string
          file_name?: string | null
          file_path: string
          id?: string
          lab_name?: string | null
          mime_type?: string | null
          report_type?: string | null
          status?: string
          user_id: string
        }
        Update: {
          analysis?: Json | null
          created_at?: string
          file_name?: string | null
          file_path?: string
          id?: string
          lab_name?: string | null
          mime_type?: string | null
          report_type?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      medicine_reminders: {
        Row: {
          active: boolean
          created_at: string
          dosage: string | null
          end_date: string | null
          food_timing: string | null
          frequency: string | null
          id: string
          medicine_name: string
          notes: string | null
          start_date: string
          times: string[]
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          dosage?: string | null
          end_date?: string | null
          food_timing?: string | null
          frequency?: string | null
          id?: string
          medicine_name: string
          notes?: string | null
          start_date?: string
          times?: string[]
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          dosage?: string | null
          end_date?: string | null
          food_timing?: string | null
          frequency?: string | null
          id?: string
          medicine_name?: string
          notes?: string | null
          start_date?: string
          times?: string[]
          user_id?: string
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          analysis: Json | null
          clinic_name: string | null
          created_at: string
          doctor_name: string | null
          file_name: string | null
          file_path: string
          id: string
          mime_type: string | null
          notes: string | null
          status: string
          user_id: string
        }
        Insert: {
          analysis?: Json | null
          clinic_name?: string | null
          created_at?: string
          doctor_name?: string | null
          file_name?: string | null
          file_path: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          status?: string
          user_id: string
        }
        Update: {
          analysis?: Json | null
          clinic_name?: string | null
          created_at?: string
          doctor_name?: string | null
          file_name?: string | null
          file_path?: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          allergies: string | null
          blood_group: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string | null
          id: string
          phone: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          allergies?: string | null
          blood_group?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          allergies?: string | null
          blood_group?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      role_requests: {
        Row: {
          created_at: string
          id: string
          requested_role: Database["public"]["Enums"]["app_role"]
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          requested_role: Database["public"]["Enums"]["app_role"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          requested_role?: Database["public"]["Enums"]["app_role"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bootstrap_current_user: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "patient" | "pharmacy" | "admin" | "doctor" | "lab" | "hospital"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["patient", "pharmacy", "admin", "doctor", "lab", "hospital"],
    },
  },
} as const
