export const DOCUMENT_TYPES = [
  'birth_cert',
  'learner_photo',
  'motivation_letter',
  'school_report',
  'proof_residence',
  'id_copy',
  'income_proof',
  'medical_aid_card',
  'immunisation_record',
  'fee_payer_id_copy',
  'residency_permit',
  'custody_order',
  'other',
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const REQUIRED_DOCUMENT_TYPES: DocumentType[] = [
  'birth_cert',
  'learner_photo',
  'motivation_letter',
  'school_report',
  'proof_residence',
  'id_copy',
  'income_proof',
  'medical_aid_card',
  'immunisation_record',
  'fee_payer_id_copy',
];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  birth_cert: 'Birth certificate',
  learner_photo: 'Learner photograph',
  motivation_letter: 'Motivation letter to the principal',
  school_report: 'Previous school report',
  proof_residence: 'Proof of residence',
  id_copy: 'Parent or guardian ID copy',
  income_proof: 'Proof of employment or income',
  medical_aid_card: 'Medical aid card',
  immunisation_record: 'Immunisation or health record',
  fee_payer_id_copy: 'Fee-payer or debtor ID copy',
  residency_permit: 'Passport, study permit, or permanent residence document',
  custody_order: 'Divorce, custody, or court order',
  other: 'Other supporting document',
};

export const ACCEPTED_DOCUMENT_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'] as const;

export const ACCEPTED_DOCUMENT_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'] as const;

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

export const DOCUMENT_SUCCESS_STATES: DocumentValidationState[] = ['accepted', 'verified'];
export const DOCUMENT_BLOCKING_STATES: DocumentValidationState[] = [
  'wrong_format',
  'too_large',
  'corrupted',
  'needs_reupload',
  'missing',
];
export const DOCUMENT_REVIEW_STATES: DocumentValidationState[] = ['blurry', 'low_confidence_ocr', 'manual_review'];

export function getDocumentValidationGuidance(state: DocumentValidationState) {
  switch (state) {
    case 'accepted':
      return 'Uploaded successfully. Admissions will review this after you submit.';
    case 'verified':
      return 'Admissions have already confirmed this document is usable.';
    case 'wrong_format':
      return 'This file cannot be used yet. Please upload a PDF, JPG, or PNG version before you submit.';
    case 'too_large':
      return 'This file is too large to use. Please upload a smaller version before you submit.';
    case 'corrupted':
      return 'We could not read this file. Please upload a fresh copy before you submit.';
    case 'blurry':
      return 'This upload may be hard to read. You can continue, but the school may ask for a clearer copy.';
    case 'low_confidence_ocr':
      return 'This upload may need a manual check. You can continue and the school will review it later.';
    case 'needs_reupload':
      return 'Please replace this document before you submit so the school can review your application properly.';
    case 'manual_review':
      return 'You can continue. The school will double-check this document during review.';
    case 'missing':
      return 'This document is still required before you can submit.';
    default:
      return 'The school will review this document after submission.';
  }
}

export type DocumentProcessingStatus = 'queued' | 'running' | 'passed' | 'failed' | 'manual_review';

export const DOCUMENT_PROCESSING_STATUS_LABELS: Record<DocumentProcessingStatus, string> = {
  queued: 'Queued for checks',
  running: 'Checking now',
  passed: 'Ready',
  failed: 'Needs another upload',
  manual_review: 'Manual review',
};

export type DocumentIntakeSignal = 'blurry' | 'low_confidence_ocr' | 'possible_duplicate';

export type DocumentIntakeMetadata = {
  processingStatus: DocumentProcessingStatus;
  qualitySignals: DocumentIntakeSignal[];
  ocrText: string | null;
  confidenceScore: number | null;
};

export type DocumentContract = {
  type: DocumentType;
  required: boolean;
  acceptedMimeTypes: readonly AcceptedDocumentMimeType[];
  acceptedExtensions: readonly string[];
  maxFileSizeBytes: number;
};

export const DOCUMENT_CONTRACTS: Record<DocumentType, DocumentContract> = {
  birth_cert: {
    type: 'birth_cert',
    required: true,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    acceptedExtensions: ACCEPTED_DOCUMENT_EXTENSIONS,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  learner_photo: {
    type: 'learner_photo',
    required: true,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    acceptedExtensions: ACCEPTED_DOCUMENT_EXTENSIONS,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  motivation_letter: {
    type: 'motivation_letter',
    required: true,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    acceptedExtensions: ACCEPTED_DOCUMENT_EXTENSIONS,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  school_report: {
    type: 'school_report',
    required: true,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    acceptedExtensions: ACCEPTED_DOCUMENT_EXTENSIONS,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  proof_residence: {
    type: 'proof_residence',
    required: true,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    acceptedExtensions: ACCEPTED_DOCUMENT_EXTENSIONS,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  id_copy: {
    type: 'id_copy',
    required: true,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    acceptedExtensions: ACCEPTED_DOCUMENT_EXTENSIONS,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  income_proof: {
    type: 'income_proof',
    required: true,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    acceptedExtensions: ACCEPTED_DOCUMENT_EXTENSIONS,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  medical_aid_card: {
    type: 'medical_aid_card',
    required: true,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    acceptedExtensions: ACCEPTED_DOCUMENT_EXTENSIONS,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  immunisation_record: {
    type: 'immunisation_record',
    required: true,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    acceptedExtensions: ACCEPTED_DOCUMENT_EXTENSIONS,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  fee_payer_id_copy: {
    type: 'fee_payer_id_copy',
    required: true,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    acceptedExtensions: ACCEPTED_DOCUMENT_EXTENSIONS,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  residency_permit: {
    type: 'residency_permit',
    required: false,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    acceptedExtensions: ACCEPTED_DOCUMENT_EXTENSIONS,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  custody_order: {
    type: 'custody_order',
    required: false,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    acceptedExtensions: ACCEPTED_DOCUMENT_EXTENSIONS,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
  other: {
    type: 'other',
    required: false,
    acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
    acceptedExtensions: ACCEPTED_DOCUMENT_EXTENSIONS,
    maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
  },
};

export function isDocumentStateSubmissionReady(state: DocumentValidationState) {
  return DOCUMENT_SUCCESS_STATES.includes(state) || isDocumentStateReviewOnly(state);
}

export function isDocumentStateBlocking(state: DocumentValidationState) {
  return DOCUMENT_BLOCKING_STATES.includes(state);
}

export function isDocumentStateReviewOnly(state: DocumentValidationState) {
  return DOCUMENT_REVIEW_STATES.includes(state);
}
