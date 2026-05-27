import {
  ACCEPTED_DOCUMENT_MIME_TYPES,
  DOCUMENT_CONTRACTS,
  MAX_DOCUMENT_FILE_SIZE_BYTES,
  getDocumentValidationGuidance,
  type DocumentType,
  type DocumentValidationState,
} from '@/lib/documents/contracts';

export type DocumentValidationResult = {
  ok: boolean;
  state: DocumentValidationState;
  message: string;
  qualitySignals: DocumentQualitySignal[];
};

export type DocumentQualitySignal = 'blurry' | 'low_confidence_ocr' | 'possible_duplicate';

type ValidateDocumentInput = {
  documentType: DocumentType;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
};

function inferQualitySignals(fileName: string) {
  const normalized = fileName.toLowerCase();
  const signals: DocumentQualitySignal[] = [];

  if (/(blur|blurry|dark|dim|fuzzy|camera)/.test(normalized)) {
    signals.push('blurry');
  }

  if (/(ocr|scan|unclear|faint|lowres|text)/.test(normalized)) {
    signals.push('low_confidence_ocr');
  }

  if (/(duplicate|dup|copy|repeat|again|resubmit)/.test(normalized)) {
    signals.push('possible_duplicate');
  }

  return signals;
}

function buildQualityMessage(signals: DocumentQualitySignal[]) {
  if (signals.includes('possible_duplicate')) {
    return 'This may be a repeat upload. Admissions can still review it, but please make sure it is the latest version.';
  }

  if (signals.includes('blurry') && signals.includes('low_confidence_ocr')) {
    return 'This file may be hard to read. A sharper scan or brighter photo will help the school review it faster.';
  }

  if (signals.includes('blurry')) {
    return 'This upload may be hard to read. A brighter, steadier photo will help admissions review it faster.';
  }

  if (signals.includes('low_confidence_ocr')) {
    return 'This file may need a manual check. A clearer scan will help the school read it faster.';
  }

  return 'Uploaded successfully. The school will review this document after you submit.';
}

export function validateDocumentUpload({
  documentType,
  fileName,
  mimeType,
  fileSizeBytes,
}: ValidateDocumentInput): DocumentValidationResult {
  const contract = DOCUMENT_CONTRACTS[documentType];
  const extension = fileName.includes('.') ? `.${fileName.split('.').pop()?.toLowerCase()}` : '';
  const qualitySignals = inferQualitySignals(fileName);

  if (!contract.acceptedExtensions.includes(extension)) {
    return {
      ok: false,
      state: 'wrong_format',
      message: getDocumentValidationGuidance('wrong_format'),
      qualitySignals: [],
    };
  }

  if (!contract.acceptedMimeTypes.includes(mimeType as (typeof ACCEPTED_DOCUMENT_MIME_TYPES)[number])) {
    return {
      ok: false,
      state: 'wrong_format',
      message: getDocumentValidationGuidance('wrong_format'),
      qualitySignals: [],
    };
  }

  if (fileSizeBytes > Math.min(contract.maxFileSizeBytes, MAX_DOCUMENT_FILE_SIZE_BYTES)) {
    return {
      ok: false,
      state: 'too_large',
      message: getDocumentValidationGuidance('too_large'),
      qualitySignals: [],
    };
  }

  if (qualitySignals.includes('possible_duplicate')) {
    return {
      ok: true,
      state: 'manual_review',
      message: buildQualityMessage(qualitySignals),
      qualitySignals,
    };
  }

  if (qualitySignals.includes('blurry')) {
    return {
      ok: true,
      state: 'blurry',
      message: buildQualityMessage(qualitySignals),
      qualitySignals,
    };
  }

  if (qualitySignals.includes('low_confidence_ocr')) {
    return {
      ok: true,
      state: 'low_confidence_ocr',
      message: buildQualityMessage(qualitySignals),
      qualitySignals,
    };
  }

  return {
    ok: true,
    state: 'accepted',
    message: buildQualityMessage(qualitySignals),
    qualitySignals,
  };
}
