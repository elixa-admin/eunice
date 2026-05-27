import type { ApplicationStatus } from '../domain/applications';
import type { DocumentType, DocumentValidationState } from '../documents/contracts';

export type SupabaseRole = 'parent' | 'admin' | 'superadmin';

export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          domain: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          domain?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['schools']['Insert']>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          school_id: string | null;
          role: SupabaseRole;
          first_name: string | null;
          last_name: string | null;
          phone_number: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          school_id?: string | null;
          role?: SupabaseRole;
          first_name?: string | null;
          last_name?: string | null;
          phone_number?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          school_id: string | null;
          parent_id: string;
          reference_number: string | null;
          learner_first_name: string;
          learner_last_name: string;
          grade_applying_for: string;
          previous_school_name: string | null;
          status: ApplicationStatus;
          created_at: string;
          updated_at: string | null;
          submitted_at: string | null;
        };
        Insert: {
          id?: string;
          school_id?: string | null;
          parent_id: string;
          reference_number?: string | null;
          learner_first_name: string;
          learner_last_name: string;
          grade_applying_for: string;
          previous_school_name?: string | null;
          status?: ApplicationStatus;
          created_at?: string;
          updated_at?: string | null;
          submitted_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['applications']['Insert']>;
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          application_id: string;
          document_type: DocumentType;
          upload_status: DocumentValidationState;
          review_notes: string | null;
          file_path: string | null;
          file_name: string | null;
          mime_type: string | null;
          verified_at: string | null;
          uploaded_at: string | null;
          file_size: number | null;
        };
        Insert: {
          id?: string;
          application_id: string;
          document_type: DocumentType;
          upload_status?: DocumentValidationState;
          review_notes?: string | null;
          file_path?: string | null;
          file_name?: string | null;
          mime_type?: string | null;
          verified_at?: string | null;
          uploaded_at?: string | null;
          file_size?: number | null;
        };
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
        Relationships: [];
      };
      admin_notes: {
        Row: {
          id: string;
          application_id: string;
          admin_id: string;
          note_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          admin_id: string;
          note_text: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['admin_notes']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const SUPABASE_URL_KEY = 'NEXT_PUBLIC_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'NEXT_PUBLIC_SUPABASE_ANON_KEY';
const PREVIEW_SUPABASE_URL = 'https://pjtmdiencpoguxasnyqx.supabase.co';
const PREVIEW_SUPABASE_ANON_KEY = 'sb_publishable__UDHmTFy5BMGYrfX5UafsA_3FhueacP';

export type SupabaseIntegrationStatus = {
  configured: boolean;
  missingKeys: string[];
  url: string | null;
};

export function getSupabaseIntegrationStatus(
  env: Record<string, string | undefined> = process.env,
): SupabaseIntegrationStatus {
  // The /dev preview is allowed to fall back to the known public Supabase values
  // so the deployment keeps working even if preview env propagation is delayed.
  const url = env[SUPABASE_URL_KEY] ?? PREVIEW_SUPABASE_URL;
  const anonKey = env[SUPABASE_ANON_KEY] ?? PREVIEW_SUPABASE_ANON_KEY;
  const missingKeys = [!url ? SUPABASE_URL_KEY : null, !anonKey ? SUPABASE_ANON_KEY : null].filter(
    (key): key is string => Boolean(key),
  );

  return {
    configured: missingKeys.length === 0,
    missingKeys,
    url,
  };
}

export function isSupabaseConfigured(env: Record<string, string | undefined> = process.env) {
  return getSupabaseIntegrationStatus(env).configured;
}

export function getSupabaseIntegrationErrorMessage(appName: string) {
  const { missingKeys } = getSupabaseIntegrationStatus();
  return `Supabase is not configured for ${appName}. Missing environment variables: ${missingKeys.join(', ')}`;
}
