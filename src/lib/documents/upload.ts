import {
  type DocumentIntakeMetadata,
  type DocumentType,
  type DocumentValidationState,
} from '@/lib/documents/contracts';
import { validateDocumentUpload } from '@/lib/documents/validation';
import type { DocumentValidationResult } from '@/lib/documents/validation';
import { buildDocumentStoragePath } from '@/lib/documents/storage';
import { getDocumentStorageAdapter, getDocumentStorageBucket } from '@/lib/integrations/storage';

export type UploadedDocumentDraft = {
  fileName: string;
  validationState: DocumentValidationState;
  message: string;
  intake: DocumentIntakeMetadata;
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

const MAX_WEBP_SIZE_BYTES = 220 * 1024;
const MAX_WEBP_DIMENSION = 1800;

function hasImageMimeType(file: File) {
  return file.type.startsWith('image/');
}

function getBaseFileName(fileName: string) {
  return fileName.includes('.') ? fileName.replace(/\.[^.]+$/, '') : fileName;
}

async function loadImageSource(file: File) {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(file);
    return {
      width: bitmap.width,
      height: bitmap.height,
      drawToCanvas(context: CanvasRenderingContext2D, width: number, height: number) {
        context.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();
      },
    };
  }

  return new Promise<{
    width: number;
    height: number;
    drawToCanvas(context: CanvasRenderingContext2D, width: number, height: number): void;
  }>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
        drawToCanvas(context, width, height) {
          context.drawImage(image, 0, 0, width, height);
        },
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to load image for compression.'));
    };
    image.src = objectUrl;
  });
}

async function canvasToWebpBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      'image/webp',
      quality,
    );
  });
}

async function maybeCompressImageToWebp(file: File) {
  if (typeof window === 'undefined' || !hasImageMimeType(file) || file.type === 'image/webp') {
    return file;
  }

  try {
    const source = await loadImageSource(file);
    const scale = Math.min(1, MAX_WEBP_DIMENSION / Math.max(source.width, source.height));
    const width = Math.max(1, Math.round(source.width * scale));
    const height = Math.max(1, Math.round(source.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return file;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    source.drawToCanvas(context, width, height);

    let quality = 0.84;
    let blob = await canvasToWebpBlob(canvas, quality);

    while (blob && blob.size > MAX_WEBP_SIZE_BYTES && quality > 0.66) {
      quality = Math.max(0.66, quality - 0.08);
      blob = await canvasToWebpBlob(canvas, quality);
    }

    if (!blob) return file;

    return new File([blob], `${getBaseFileName(file.name) || 'document'}.webp`, {
      type: 'image/webp',
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
}

function estimateConfidenceScore(validation: DocumentValidationResult) {
  if (!validation.ok) return 0.18;
  if (validation.qualitySignals.includes('possible_duplicate')) return 0.56;
  if (validation.qualitySignals.includes('blurry') && validation.qualitySignals.includes('low_confidence_ocr')) return 0.42;
  if (validation.qualitySignals.includes('blurry')) return 0.67;
  if (validation.qualitySignals.includes('low_confidence_ocr')) return 0.64;
  return 0.92;
}

function getProcessingStatus(validation: DocumentValidationResult): DocumentIntakeMetadata['processingStatus'] {
  if (!validation.ok) return 'failed';
  if (validation.qualitySignals.includes('possible_duplicate')) return 'manual_review';
  if (validation.qualitySignals.length > 0) return 'running';
  return 'queued';
}

export async function uploadDocumentDraft({
  schoolId,
  applicationId,
  documentType,
  file,
}: UploadDocumentDraftInput): Promise<UploadedDocumentDraft> {
  const uploadFile = await maybeCompressImageToWebp(file);
  const validation = validateDocumentUpload({
    documentType,
    fileName: uploadFile.name,
    mimeType: uploadFile.type || 'application/octet-stream',
    fileSizeBytes: uploadFile.size,
  });
  const intake: DocumentIntakeMetadata = {
    processingStatus: getProcessingStatus(validation),
    qualitySignals: validation.qualitySignals,
    ocrText: null,
    confidenceScore: estimateConfidenceScore(validation),
  };

  if (!validation.ok) {
    return {
      fileName: uploadFile.name,
      validationState: validation.state,
      message: validation.message,
      intake,
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'error',
      storageBucket: null,
    };
  }

  const extension = uploadFile.name.includes('.') ? uploadFile.name.split('.').pop()?.toLowerCase() || 'bin' : 'bin';
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
    const result = await adapter.upload(path, uploadFile);

    return {
      fileName: uploadFile.name,
      validationState: validation.state,
      message: validation.message,
      intake,
      storagePath: result.path,
      uploadedAt: new Date().toISOString(),
      uploadStatus: 'saved',
      storageBucket: getDocumentStorageBucket(),
    };
  } catch {
    return {
      fileName: uploadFile.name,
      validationState: 'manual_review',
      message:
        'The file looks valid, but we could not save it properly just now. Please try again later or continue and let admissions know if this repeats.',
      intake: {
        processingStatus: 'failed',
        qualitySignals: validation.qualitySignals,
        ocrText: null,
        confidenceScore: estimateConfidenceScore(validation),
      },
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'error',
      storageBucket: getDocumentStorageBucket(),
    };
  }
}
