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
          category: string | null
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
          category?: string | null
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
          category?: string | null
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
          description: string | null
          district: string | null
          home_collection: boolean
          home_collection_areas: string | null
          home_collection_charge: number | null
          id: string
          lab_type: string | null
          maps_url: string | null
          name: string
          phone: string | null
          pincode: string | null
          services: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          district?: string | null
          home_collection?: boolean
          home_collection_areas?: string | null
          home_collection_charge?: number | null
          id?: string
          lab_type?: string | null
          maps_url?: string | null
          name: string
          phone?: string | null
          pincode?: string | null
          services?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          district?: string | null
          home_collection?: boolean
          home_collection_areas?: string | null
          home_collection_charge?: number | null
          id?: string
          lab_type?: string | null
          maps_url?: string | null
          name?: string
          phone?: string | null
          pincode?: string | null
          services?: string | null
          state?: string | null
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
      hospital_booked_slots: {
        Row: {
          created_at: string
          doctor_name: string | null
          hospital_owner_id: string
          id: string
          notes: string | null
          patient_name: string
          slot_date: string
          slot_time: string
          slot_type: string
          status: string
        }
        Insert: {
          created_at?: string
          doctor_name?: string | null
          hospital_owner_id: string
          id?: string
          notes?: string | null
          patient_name: string
          slot_date: string
          slot_time: string
          slot_type?: string
          status?: string
        }
        Update: {
          created_at?: string
          doctor_name?: string | null
          hospital_owner_id?: string
          id?: string
          notes?: string | null
          patient_name?: string
          slot_date?: string
          slot_time?: string
          slot_type?: string
          status?: string
        }
        Relationships: []
      }
      hospital_profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          established_year: number | null
          facilities: Json
          hospital_name: string
          id: string
          logo_path: string | null
          owner_user_id: string
          phone: string | null
          registration_number: string | null
          specializations: string[]
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          established_year?: number | null
          facilities?: Json
          hospital_name?: string
          id?: string
          logo_path?: string | null
          owner_user_id: string
          phone?: string | null
          registration_number?: string | null
          specializations?: string[]
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          established_year?: number | null
          facilities?: Json
          hospital_name?: string
          id?: string
          logo_path?: string | null
          owner_user_id?: string
          phone?: string | null
          registration_number?: string | null
          specializations?: string[]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      hospital_staff: {
        Row: {
          active: boolean
          created_at: string
          department: string | null
          fee: number | null
          hospital_owner_id: string
          id: string
          name: string
          role: string
          schedule: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          department?: string | null
          fee?: number | null
          hospital_owner_id: string
          id?: string
          name: string
          role?: string
          schedule?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          department?: string | null
          fee?: number | null
          hospital_owner_id?: string
          id?: string
          name?: string
          role?: string
          schedule?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      lab_booking_slots: {
        Row: {
          available: boolean
          created_at: string
          id: string
          lab_id: string
          slot_date: string
          slot_time: string
        }
        Insert: {
          available?: boolean
          created_at?: string
          id?: string
          lab_id: string
          slot_date: string
          slot_time: string
        }
        Update: {
          available?: boolean
          created_at?: string
          id?: string
          lab_id?: string
          slot_date?: string
          slot_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_booking_slots_lab_id_fkey"
            columns: ["lab_id"]
            isOneToOne: false
            referencedRelation: "catalog_labs"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_bookings: {
        Row: {
          collection_address: string
          created_at: string
          id: string
          lab_id: string
          lab_name: string
          price: number
          slot_date: string
          slot_time: string
          status: string
          test_code: string | null
          test_name: string
          user_id: string
        }
        Insert: {
          collection_address: string
          created_at?: string
          id?: string
          lab_id: string
          lab_name: string
          price?: number
          slot_date: string
          slot_time: string
          status?: string
          test_code?: string | null
          test_name: string
          user_id: string
        }
        Update: {
          collection_address?: string
          created_at?: string
          id?: string
          lab_id?: string
          lab_name?: string
          price?: number
          slot_date?: string
          slot_time?: string
          status?: string
          test_code?: string | null
          test_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_bookings_lab_id_fkey"
            columns: ["lab_id"]
            isOneToOne: false
            referencedRelation: "catalog_labs"
            referencedColumns: ["id"]
          },
        ]
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
      notification_log: {
        Row: {
          appointment_id: string | null
          channel: string
          created_at: string
          destination: string | null
          error: string | null
          id: string
          status: string
          user_id: string
        }
        Insert: {
          appointment_id?: string | null
          channel: string
          created_at?: string
          destination?: string | null
          error?: string | null
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          appointment_id?: string | null
          channel?: string
          created_at?: string
          destination?: string | null
          error?: string | null
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_log_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
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
          address: string | null
          allergies: string | null
          blood_group: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string | null
          id: string
          latitude: number | null
          longitude: number | null
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          allergies?: string | null
          blood_group?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          id: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          allergies?: string | null
          blood_group?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      provider_doctor_profiles: {
        Row: {
          additional_certificates: Json
          available_days: string | null
          biography: string | null
          certificate_path: string | null
          city: string | null
          clinic_name: string | null
          created_at: string
          designation: string | null
          district: string | null
          experience_years: number
          expertise: string | null
          followup_fee: number | null
          full_name: string
          id: string
          in_person_available: boolean
          in_person_fee: number | null
          issuing_authority: string | null
          languages: string | null
          maps_url: string | null
          medical_category: string | null
          online_available: boolean
          online_fee: number | null
          owner_user_id: string
          phone: string | null
          pincode: string | null
          practice_address: string | null
          preferred_contact: string | null
          profile_photo_path: string | null
          qualifications: string | null
          registered_email: string | null
          registration_number: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          specialty: string | null
          state: string | null
          status: string
          submitted_at: string | null
          updated_at: string
          working_hours: string | null
        }
        Insert: {
          additional_certificates?: Json
          available_days?: string | null
          biography?: string | null
          certificate_path?: string | null
          city?: string | null
          clinic_name?: string | null
          created_at?: string
          designation?: string | null
          district?: string | null
          experience_years?: number
          expertise?: string | null
          followup_fee?: number | null
          full_name?: string
          id?: string
          in_person_available?: boolean
          in_person_fee?: number | null
          issuing_authority?: string | null
          languages?: string | null
          maps_url?: string | null
          medical_category?: string | null
          online_available?: boolean
          online_fee?: number | null
          owner_user_id: string
          phone?: string | null
          pincode?: string | null
          practice_address?: string | null
          preferred_contact?: string | null
          profile_photo_path?: string | null
          qualifications?: string | null
          registered_email?: string | null
          registration_number?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialty?: string | null
          state?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          working_hours?: string | null
        }
        Update: {
          additional_certificates?: Json
          available_days?: string | null
          biography?: string | null
          certificate_path?: string | null
          city?: string | null
          clinic_name?: string | null
          created_at?: string
          designation?: string | null
          district?: string | null
          experience_years?: number
          expertise?: string | null
          followup_fee?: number | null
          full_name?: string
          id?: string
          in_person_available?: boolean
          in_person_fee?: number | null
          issuing_authority?: string | null
          languages?: string | null
          maps_url?: string | null
          medical_category?: string | null
          online_available?: boolean
          online_fee?: number | null
          owner_user_id?: string
          phone?: string | null
          pincode?: string | null
          practice_address?: string | null
          preferred_contact?: string | null
          profile_photo_path?: string | null
          qualifications?: string | null
          registered_email?: string | null
          registration_number?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialty?: string | null
          state?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          working_hours?: string | null
        }
        Relationships: []
      }
      provider_lab_profiles: {
        Row: {
          accreditation_certificate_path: string | null
          accreditation_details: string | null
          address: string | null
          business_email: string | null
          business_phone: string | null
          certificate_path: string | null
          city: string | null
          contact_person: string | null
          cover_path: string | null
          created_at: string
          description: string | null
          district: string | null
          home_collection: boolean
          home_collection_areas: string | null
          home_collection_charge: number | null
          id: string
          issuing_authority: string | null
          lab_name: string
          lab_type: string | null
          logo_path: string | null
          maps_url: string | null
          opening_hours: string | null
          owner_user_id: string
          pincode: string | null
          registration_number: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          services: string | null
          state: string | null
          status: string
          submitted_at: string | null
          updated_at: string
          weekly_schedule: string | null
        }
        Insert: {
          accreditation_certificate_path?: string | null
          accreditation_details?: string | null
          address?: string | null
          business_email?: string | null
          business_phone?: string | null
          certificate_path?: string | null
          city?: string | null
          contact_person?: string | null
          cover_path?: string | null
          created_at?: string
          description?: string | null
          district?: string | null
          home_collection?: boolean
          home_collection_areas?: string | null
          home_collection_charge?: number | null
          id?: string
          issuing_authority?: string | null
          lab_name?: string
          lab_type?: string | null
          logo_path?: string | null
          maps_url?: string | null
          opening_hours?: string | null
          owner_user_id: string
          pincode?: string | null
          registration_number?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          services?: string | null
          state?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          weekly_schedule?: string | null
        }
        Update: {
          accreditation_certificate_path?: string | null
          accreditation_details?: string | null
          address?: string | null
          business_email?: string | null
          business_phone?: string | null
          certificate_path?: string | null
          city?: string | null
          contact_person?: string | null
          cover_path?: string | null
          created_at?: string
          description?: string | null
          district?: string | null
          home_collection?: boolean
          home_collection_areas?: string | null
          home_collection_charge?: number | null
          id?: string
          issuing_authority?: string | null
          lab_name?: string
          lab_type?: string | null
          logo_path?: string | null
          maps_url?: string | null
          opening_hours?: string | null
          owner_user_id?: string
          pincode?: string | null
          registration_number?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          services?: string | null
          state?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          weekly_schedule?: string | null
        }
        Relationships: []
      }
      provider_lab_tests: {
        Row: {
          active: boolean
          category: string | null
          created_at: string
          description: string | null
          discounted_price: number | null
          fasting_instructions: string | null
          home_collection: boolean
          home_collection_charge: number | null
          id: string
          lab_id: string
          name: string
          prescription_required: boolean
          price: number
          sample_type: string | null
          turnaround_time: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string | null
          created_at?: string
          description?: string | null
          discounted_price?: number | null
          fasting_instructions?: string | null
          home_collection?: boolean
          home_collection_charge?: number | null
          id?: string
          lab_id: string
          name: string
          prescription_required?: boolean
          price: number
          sample_type?: string | null
          turnaround_time?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string | null
          created_at?: string
          description?: string | null
          discounted_price?: number | null
          fasting_instructions?: string | null
          home_collection?: boolean
          home_collection_charge?: number | null
          id?: string
          lab_id?: string
          name?: string
          prescription_required?: boolean
          price?: number
          sample_type?: string | null
          turnaround_time?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_lab_tests_lab_id_fkey"
            columns: ["lab_id"]
            isOneToOne: false
            referencedRelation: "provider_lab_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      book_lab_test: {
        Args: {
          p_collection_address: string
          p_lab_id: string
          p_lab_name: string
          p_price: number
          p_slot_date: string
          p_slot_time: string
          p_test_code: string
          p_test_name: string
        }
        Returns: string
      }
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
      is_provider_doctor_published: {
        Args: { p_doctor_id: string }
        Returns: boolean
      }
      is_provider_lab_published: {
        Args: { p_lab_id: string }
        Returns: boolean
      }
      review_doctor_application: {
        Args: { p_decision: string; p_profile_id: string; p_reason?: string }
        Returns: undefined
      }
      review_lab_application: {
        Args: { p_decision: string; p_profile_id: string; p_reason?: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role:
        | "patient"
        | "pharmacy"
        | "admin"
        | "doctor"
        | "lab"
        | "hospital"
        | "superadmin"
        | "nurse"
        | "staff"
        | "receptionist"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: [
        "patient",
        "pharmacy",
        "admin",
        "doctor",
        "lab",
        "hospital",
        "superadmin",
        "nurse",
        "staff",
        "receptionist",
      ],
    },
  },
} as const
