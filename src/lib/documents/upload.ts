import {
  type DocumentType,
  type DocumentValidationState,
} from '@/lib/documents/contracts';
import { validateDocumentUpload } from '@/lib/documents/validation';
import { buildDocumentStoragePath } from '@/lib/documents/storage';
import { getDocumentStorageAdapter, getDocumentStorageBucket } from '@/lib/integrations/storage';

export type UploadedDocumentDraft = {
  fileName: string;
  validationState: DocumentValidationState;
  message: string;
  storagePath: string | null;
  uploadedAt: string | null;
  uploadStatus: 'saved' | 'error';
  storageBucket: string | null;
};

type UploadDocumentDraftInput = {
  schoolId: string;
  applicationId: string;
  documentType: DocumentType;
  file: File;
};

export async function uploadDocumentDraft({
  schoolId,
  applicationId,
  documentType,
  file,
}: UploadDocumentDraftInput): Promise<UploadedDocumentDraft> {
  const validation = validateDocumentUpload({
    documentType,
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    fileSizeBytes: file.size,
  });

  if (!validation.ok) {
    return {
      fileName: file.name,
      validationState: validation.state,
      message: validation.message,
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'error',
      storageBucket: null,
    };
  }

  const extension = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() || 'bin' : 'bin';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const path = buildDocumentStoragePath({
    schoolId,
    applicationId,
    documentType,
    timestamp,
    extension,
  });

  try {
    const adapter = getDocumentStorageAdapter();
    const result = await adapter.upload(path, file);

    return {
      fileName: file.name,
      validationState: validation.state,
      message: validation.message,
      storagePath: result.path,
      uploadedAt: new Date().toISOString(),
      uploadStatus: 'saved',
      storageBucket: getDocumentStorageBucket(),
    };
  } catch {
    return {
      fileName: file.name,
      validationState: 'manual_review',
      message:
        'The file looks valid, but we could not save it properly just now. Please try again later or continue and let admissions know if this repeats.',
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'error',
      storageBucket: getDocumentStorageBucket(),
    };
  }
}
