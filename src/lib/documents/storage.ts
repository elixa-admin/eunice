import type { DocumentType } from '@/lib/documents/contracts';

type DocumentStoragePathInput = {
  schoolId: string;
  applicationId: string;
  documentType: DocumentType;
  timestamp: string;
  extension: string;
};

export function buildDocumentStoragePath({
  schoolId,
  applicationId,
  documentType,
  timestamp,
  extension,
}: DocumentStoragePathInput) {
  const safeExtension = extension.startsWith('.') ? extension.slice(1) : extension;
  return `school/${schoolId}/applications/${applicationId}/${documentType}/${documentType}_${timestamp}.${safeExtension}`;
}
