import {
  ACCEPTED_DOCUMENT_EXTENSIONS,
  ACCEPTED_DOCUMENT_MIME_TYPES,
  DOCUMENT_CONTRACTS,
  MAX_DOCUMENT_FILE_SIZE_BYTES,
  type DocumentType,
  type DocumentValidationState,
} from '@/lib/documents/contracts';

export type DocumentValidationResult = {
  ok: boolean;
  state: DocumentValidationState;
  message: string;
};

type ValidateDocumentInput = {
  documentType: DocumentType;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
};

export function validateDocumentUpload({
  documentType,
  fileName,
  mimeType,
  fileSizeBytes,
}: ValidateDocumentInput): DocumentValidationResult {
  const contract = DOCUMENT_CONTRACTS[documentType];
  const extension = fileName.includes('.') ? `.${fileName.split('.').pop()?.toLowerCase()}` : '';

  if (!contract.acceptedExtensions.includes(extension)) {
    return {
      ok: false,
      state: 'wrong_format',
      message: 'Please upload this document as a PDF, JPG, or PNG file.',
    };
  }

  if (!contract.acceptedMimeTypes.includes(mimeType as (typeof ACCEPTED_DOCUMENT_MIME_TYPES)[number])) {
    return {
      ok: false,
      state: 'wrong_format',
      message: 'This file does not match a supported document format. Please try a PDF, JPG, or PNG version instead.',
    };
  }

  if (fileSizeBytes > Math.min(contract.maxFileSizeBytes, MAX_DOCUMENT_FILE_SIZE_BYTES)) {
    return {
      ok: false,
      state: 'too_large',
      message: 'This file is too large. Please upload a version smaller than 5 MB.',
    };
  }

  return {
    ok: true,
    state: 'accepted',
    message: 'Uploaded successfully. The school will review this document after you submit.',
  };
}
