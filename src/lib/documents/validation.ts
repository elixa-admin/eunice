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

  if (!ACCEPTED_DOCUMENT_EXTENSIONS.includes(extension as (typeof ACCEPTED_DOCUMENT_EXTENSIONS)[number])) {
    return {
      ok: false,
      state: 'wrong_format',
      message: 'Only PDF, JPG, JPEG, and PNG files are supported.',
    };
  }

  if (!ACCEPTED_DOCUMENT_MIME_TYPES.includes(mimeType as (typeof ACCEPTED_DOCUMENT_MIME_TYPES)[number])) {
    return {
      ok: false,
      state: 'wrong_format',
      message: 'The uploaded file type does not match a supported document format.',
    };
  }

  if (fileSizeBytes > Math.min(contract.maxFileSizeBytes, MAX_DOCUMENT_FILE_SIZE_BYTES)) {
    return {
      ok: false,
      state: 'too_large',
      message: 'This file is larger than the 5 MB upload limit.',
    };
  }

  return {
    ok: true,
    state: 'accepted',
    message: 'Document passed initial upload validation.',
  };
}
