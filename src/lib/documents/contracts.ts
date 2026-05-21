export const DOCUMENT_TYPES = [
  'birth_cert',
  'school_report',
  'proof_residence',
  'id_copy',
  'other',
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const REQUIRED_DOCUMENT_TYPES: DocumentType[] = [
  'birth_cert',
  'school_report',
  'proof_residence',
  'id_copy',
];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  birth_cert: 'Birth certificate',
  school_report: 'Previous school report',
  proof_residence: 'Proof of residence',
  id_copy: 'Parent ID or passport copy',
  other: 'Other supporting document',
};

export const ACCEPTED_DOCUMENT_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'] as const;

export const ACCEPTED_DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const;

export type AcceptedDocumentMimeType = (typeof ACCEPTED_DOCUMENT_MIME_TYPES)[number];

export const MAX_DOCUMENT_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const DOCUMENT_VALIDATION_STATES = [
  'accepted',
  'wrong_format',
  'too_large',
  'corrupted',
  'blurry',
  'low_confidence_ocr',
  'needs_reupload',
  'manual_review',
  'verified',
  'missing',
] as const;

export type DocumentValidationState = (typeof DOCUMENT_VALIDATION_STATES)[number];

export const DOCUMENT_VALIDATION_LABELS: Record<DocumentValidationState, string> = {
  accepted: 'Accepted',
  wrong_format: 'Wrong format',
  too_large: 'Too large',
  corrupted: 'Corrupted',
  blurry: 'Blurry',
  low_confidence_ocr: 'Low OCR confidence',
  needs_reupload: 'Needs re-upload',
  manual_review: 'Manual review',
  verified: 'Verified',
  missing: 'Missing',
};

export type DocumentProcessingStatus = 'queued' | 'running' | 'passed' | 'failed' | 'manual_review';

export type DocumentContract = {
  type: DocumentType;
  required: boolean;
  acceptedMimeTypes: readonly AcceptedDocumentMimeType[];
  maxFileSizeBytes: number;
};

export const DOCUMENT_CONTRACTS: Record<DocumentType, DocumentContract> = {
  birth_cert: {
    type: 'birth_cert',
    required: true,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  school_report: {
    type: 'school_report',
    required: true,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  proof_residence: {
    type: 'proof_residence',
    required: true,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  id_copy: {
    type: 'id_copy',
    required: true,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  other: {
    type: 'other',
    required: false,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
};
