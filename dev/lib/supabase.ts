import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Supabase environment variables are missing.');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          domain?: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          domain?: string | null;
        };
        Update: Partial<{
          name: string;
          domain?: string | null;
        }>;
      };
      profiles: {
        Row: {
          id: string; // matches auth.users.id
          school_id?: string | null;
          role: 'parent' | 'admin' | 'superadmin';
          first_name: string;
          last_name: string;
          phone_number?: string | null;
          created_at: string;
        };
        Insert: {
          school_id?: string | null;
          role?: 'parent' | 'admin' | 'superadmin';
          first_name: string;
          last_name: string;
          phone_number?: string | null;
        };
        Update: Partial<{
          school_id?: string | null;
          role?: 'parent' | 'admin' | 'superadmin';
          first_name?: string;
          last_name?: string;
          phone_number?: string;
        }>;
      };
      // Other tables (applications, documents, communications) can be added later.
    };
  };
};

export default supabase;
