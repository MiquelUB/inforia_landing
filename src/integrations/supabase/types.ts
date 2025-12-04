
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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string | null
          id: string
          notes: string | null
          patient_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          amount_off: number | null
          created_at: string | null
          duration: string | null
          duration_in_months: number | null
          id: string
          name: string | null
          percent_off: number | null
          valid: boolean | null
        }
        Insert: {
          amount_off?: number | null
          created_at?: string | null
          duration?: string | null
          duration_in_months?: number | null
          id: string
          name?: string | null
          percent_off?: number | null
          valid?: boolean | null
        }
        Update: {
          amount_off?: number | null
          created_at?: string | null
          duration?: string | null
          duration_in_months?: number | null
          id?: string
          name?: string | null
          percent_off?: number | null
          valid?: boolean | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          challenge: string | null
          coupon_code: string | null
          created_at: string | null
          email: string
          id: string
          metadata: Json | null
          name: string | null
          status: string | null
          type: string
          website: string | null
        }
        Insert: {
          challenge?: string | null
          coupon_code?: string | null
          created_at?: string | null
          email: string
          id?: string
          metadata?: Json | null
          name?: string | null
          status?: string | null
          type: string
          website?: string | null
        }
        Update: {
          challenge?: string | null
          coupon_code?: string | null
          created_at?: string | null
          email?: string
          id?: string
          metadata?: Json | null
          name?: string | null
          status?: string | null
          type?: string
          website?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          birth_date: string | null
          Cita1: string | null
          Cita2: string | null
          Cita3: string | null
          Cita4: string | null
          Cita5: string | null
          created_at: string | null
          direccion_fisica: string | null
          email: string | null
          google_sheet_id: string | null
          google_sheet_url: string | null
          id: string
          name: string
          notes: string | null
          persona_rescate_email: string | null
          persona_rescate_nombre: string | null
          persona_rescate_telefono: string | null
          phone: string | null
          sexo: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          birth_date?: string | null
          Cita1?: string | null
          Cita2?: string | null
          Cita3?: string | null
          Cita4?: string | null
          Cita5?: string | null
          created_at?: string | null
          direccion_fisica?: string | null
          email?: string | null
          google_sheet_id?: string | null
          google_sheet_url?: string | null
          id?: string
          name: string
          notes?: string | null
          persona_rescate_email?: string | null
          persona_rescate_nombre?: string | null
          persona_rescate_telefono?: string | null
          phone?: string | null
          sexo?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          birth_date?: string | null
          Cita1?: string | null
          Cita2?: string | null
          Cita3?: string | null
          Cita4?: string | null
          Cita5?: string | null
          created_at?: string | null
          direccion_fisica?: string | null
          email?: string | null
          google_sheet_id?: string | null
          google_sheet_url?: string | null
          id?: string
          name?: string
          notes?: string | null
          persona_rescate_email?: string | null
          persona_rescate_nombre?: string | null
          persona_rescate_telefono?: string | null
          phone?: string | null
          sexo?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plan_assignments: {
        Row: {
          allocated_credits: number | null
          created_at: string
          email: string
          id: string
          owner_id: string
          status: string | null
        }
        Insert: {
          allocated_credits?: number | null
          created_at?: string
          email: string
          id?: string
          owner_id: string
          status?: string | null
        }
        Update: {
          allocated_credits?: number | null
          created_at?: string
          email?: string
          id?: string
          owner_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_assignments_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          description: string | null
          id: string
          name: string
          price_id: string
          slug: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          price_id: string
          slug: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          price_id?: string
          slug?: string
        }
        Relationships: []
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          billing_address: string | null
          billing_city: string | null
          billing_country: string | null
          billing_email: string | null
          billing_name: string | null
          billing_owner_id: string | null
          billing_postal_code: string | null
          clinic_name: string | null
          collegiate_number: string | null
          created_at: string | null
          credits: number
          credits_limit: number | null
          credits_used: number | null
          crm_sheet_id: string | null
          email: string | null
          full_name: string | null
          id: string
          marketing_consent: boolean | null
          nif_dni: string | null
          onboarding_completed: boolean | null
          phone: string | null
          physical_address: string | null
          plan_type: string | null
          professional_license: string | null
          seats_allowed: number | null
          signup_coupon_code: string | null
          specialties: string | null
          stripe_customer_id: string | null
          subscription_status: string | null
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_email?: string | null
          billing_name?: string | null
          billing_owner_id?: string | null
          billing_postal_code?: string | null
          clinic_name?: string | null
          collegiate_number?: string | null
          created_at?: string | null
          credits?: number
          credits_limit?: number | null
          credits_used?: number | null
          crm_sheet_id?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          marketing_consent?: boolean | null
          nif_dni?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          physical_address?: string | null
          plan_type?: string | null
          professional_license?: string | null
          seats_allowed?: number | null
          signup_coupon_code?: string | null
          specialties?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_email?: string | null
          billing_name?: string | null
          billing_owner_id?: string | null
          billing_postal_code?: string | null
          clinic_name?: string | null
          collegiate_number?: string | null
          created_at?: string | null
          credits?: number
          credits_limit?: number | null
          credits_used?: number | null
          crm_sheet_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          marketing_consent?: boolean | null
          nif_dni?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          physical_address?: string | null
          plan_type?: string | null
          professional_license?: string | null
          seats_allowed?: number | null
          signup_coupon_code?: string | null
          specialties?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      purchase_intents: {
        Row: {
          created_at: string
          customer_email: string
          error_message: string | null
          id: string
          plan_id: string
          status: string
          stripe_checkout_id: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          error_message?: string | null
          id?: string
          plan_id: string
          status?: string
          stripe_checkout_id: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          error_message?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_checkout_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          audio_file_id: string | null
          audio_transcription: string | null
          content: string | null
          created_at: string | null
          google_drive_file_id: string | null
          id: string
          input_type: string
          patient_id: string
          report_type: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audio_file_id?: string | null
          audio_transcription?: string | null
          content?: string | null
          created_at?: string | null
          google_drive_file_id?: string | null
          id?: string
          input_type: string
          patient_id: string
          report_type: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audio_file_id?: string | null
          audio_transcription?: string | null
          content?: string | null
          created_at?: string | null
          google_drive_file_id?: string | null
          id?: string
          input_type?: string
          patient_id?: string
          report_type?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          coupon_id: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          coupon_id?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          coupon_id?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_credits_used: { Args: { user_id: string }; Returns: undefined }
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
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
      pricing_plan_interval: ["day", "week", "month", "year"],
      pricing_type: ["one_time", "recurring"],
      subscription_status: [
        "trialing",
        "active",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "past_due",
        "unpaid",
        "paused",
      ],
    },
  },
} as const
