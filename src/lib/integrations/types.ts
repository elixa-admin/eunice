export type IntegrationType =
  | 'supabase_storage'
  | 'resend_email'
  | 'future_messaging'
  | 'future_school_system'
  | 'future_analytics_sink';

export type IntegrationStatus = 'active' | 'inactive' | 'error';

export type IntegrationConnection = {
  id: string;
  schoolId: string;
  integrationType: IntegrationType;
  status: IntegrationStatus;
  config: Record<string, string | number | boolean | null>;
  lastSyncAt: string | null;
};

export interface StorageAdapter {
  upload(path: string, file: File): Promise<{ path: string }>;
}

export interface EmailAdapter {
  send(args: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<{ id: string }>;
}
