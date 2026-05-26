import {
  isSupabaseConfigured,
} from '@eunice-shared/integrations/supabase';
import type { StorageAdapter } from '@/lib/integrations/types';

const DOCUMENT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_DOCUMENT_BUCKET || 'application-documents';

export function createPreviewStorageAdapter(): StorageAdapter {
  return {
    async upload(path) {
      return { path };
    },
  };
}

export function createSupabaseStorageAdapter(): StorageAdapter {
  return {
    async upload(path, file) {
      const { default: supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase.storage.from(DOCUMENT_BUCKET).upload(path, file, {
        upsert: true,
        contentType: file.type || undefined,
      });

      if (error) {
        throw error;
      }

      return { path: data.path };
    },
  };
}

export function getDocumentStorageAdapter() {
  return process.env.NEXT_PUBLIC_ENABLE_SUPABASE_UPLOADS === 'true' && isSupabaseConfigured()
    ? createSupabaseStorageAdapter()
    : createPreviewStorageAdapter();
}

export function getDocumentStorageBucket() {
  return DOCUMENT_BUCKET;
}
