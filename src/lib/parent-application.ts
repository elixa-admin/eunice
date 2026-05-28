import {
  createDefaultIntakeRoleState,
  type IntakeRoleState,
} from '@/lib/domain/intake-roles';
import {
  DOCUMENT_PROCESSING_STATUS_LABELS,
  getDocumentValidationGuidance,
  isDocumentStateBlocking,
  isDocumentStateReviewOnly,
  isDocumentStateSubmissionReady,
  type DocumentIntakeMetadata,
  type DocumentType,
  type DocumentValidationState,
} from '@/lib/documents/contracts';
import type { ApplicationStatus } from '@/lib/domain/applications';

export type DocumentRecord = {
  file_name: string;
  upload_status: DocumentValidationState;
  review_notes: string | null;
  file_path: string;
  uploaded_at: string;
  document_type: DocumentType;
};

export const STEP_KEYS = ['checklist', 'learner', 'household', 'medical', 'fees_docs', 'review'] as const;
export type StepKey = (typeof STEP_KEYS)[number];

export type DocumentDraft = {
  fileName: string;
  validationState: DocumentValidationState;
  message: string;
  intake?: DocumentIntakeMetadata;
  storagePath: string | null;
  uploadedAt: string | null;
  uploadStatus: 'idle' | 'saved' | 'error';
};

export type ApplicationDraft = {
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  learnerFirstName: string;
  learnerLastName: string;
  learnerGrade: string;
  previousSchool: string;
  intakeYear: string;
  siblingAtSchool: string;
  coParentContext: string;
  citizenshipStatus: string;
  boardingStatus: string;
  financialStatus: string;
  feePayerSameAsParent: boolean;
  legalGuardianApplicable: boolean;
  notes: string;
  status: ApplicationStatus;
  submittedAt: string | null;
  documents: Record<DocumentType, DocumentDraft>;
  roles: IntakeRoleState;
};

export type StoredApplicationDraftSnapshot = {
  version: 1;
  savedAt: string;
  activeStep: StepKey;
  readinessConfirmed: boolean;
  draft: ApplicationDraft;
};

export type StepMeta = {
  title: string;
  eyebrow: string;
  description: string;
};

export const STEP_META: Record<StepKey, StepMeta> = {
  checklist: {
    eyebrow: 'Step 0',
    title: 'Before you begin',
    description: 'See the essentials, confirm the important documents, and start when you feel ready.',
  },
  learner: {
    eyebrow: 'Step 1',
    title: 'About your child',
    description: 'Add the learner details so the application follows the right grade path.',
  },
  household: {
    eyebrow: 'Step 2',
    title: 'Parent and contact details',
    description: 'Tell us who is responsible and how Eunice should contact your family.',
  },
  medical: {
    eyebrow: 'Step 3',
    title: 'Care and support',
    description: 'Share only the health or support details that help Eunice care well for your child.',
  },
  fees_docs: {
    eyebrow: 'Step 4',
    title: 'Fees and documents',
    description: 'Confirm fee responsibility and upload the documents that let admissions move forward.',
  },
  review: {
    eyebrow: 'Step 5',
    title: 'Review and submit',
    description: 'Check the full application once more before sending it to the admissions team.',
  },
};

export const STORAGE_KEY = 'eunice-parent-application-draft-v1';
export const READINESS_KEY = 'eunice-parent-readiness-confirmed-v1';
export const STORAGE_VERSION = 1;
export const PROCESS_ESTIMATE = '25-35 minutes';

export const QUALITY_TIPS = [
  'Use PDF, JPG, or PNG files only.',
  'Each file must be under 5 MB.',
  'Capture full pages, not cropped edges.',
  'Retake blurry or dark photos before upload.',
] as const;

export const WORKFLOW_HIGHLIGHTS = [
  {
    title: 'Save and return',
    body: 'Your progress stays with you, so this never has to be finished in one sitting.',
  },
  {
    title: 'Know what matters first',
    body: 'Required and conditional documents are separated so families can focus on the essentials.',
  },
  {
    title: 'Stay clear on progress',
    body: 'The portal shows what is complete, what still needs action, and what is already under review.',
  },
] as const;

export const GUIDANCE_SECTIONS = [
  {
    key: 'expect',
    title: 'What to expect',
    body: 'A short guided journey with one step at a time and a clear end point.',
  },
  {
    key: 'prepare',
    title: 'What to prepare',
    body: 'The required checklist is shown first so families can get ready before starting.',
  },
  {
    key: 'finish',
    title: 'How to finish',
    body: 'Every required upload gets a clear saved state before you move on.',
  },
] as const;

export const DOCUMENT_UPLOAD_GUIDANCE: Record<DocumentType, string> = {
  birth_cert: 'Upload a clear scan or photo of the birth certificate.',
  learner_photo: 'Use a recent head-and-shoulders photo.',
  motivation_letter: 'Upload the letter as a PDF or image.',
  school_report: 'Add the latest report or results page.',
  proof_residence: 'Use a recent utility bill or address proof.',
  id_copy: 'Upload the parent or guardian ID copy.',
  income_proof: 'Add proof of income or employment.',
  medical_aid_card: 'Upload the medical aid card or membership proof.',
  immunisation_record: 'Upload the health or immunisation record.',
  fee_payer_id_copy: 'Upload the fee payer ID copy.',
  residency_permit: 'Upload the permit or residency document if applicable.',
  custody_order: 'Upload the custody or legal order if applicable.',
  other: 'Upload any extra supporting document requested by admissions.',
};

export function getDocumentCounts(
  documents: Record<DocumentType, DocumentDraft>,
  requiredTypes: DocumentType[],
) {
  const required = requiredTypes.length;
  const complete = requiredTypes.filter((documentType) =>
    isDocumentStateSubmissionReady(documents[documentType].validationState),
  ).length;
  const reviewOnly = requiredTypes.filter((documentType) =>
    isDocumentStateReviewOnly(documents[documentType].validationState),
  ).length;
  const blocking = requiredTypes.filter((documentType) =>
    isDocumentStateBlocking(documents[documentType].validationState),
  ).length;

  return { required, complete, reviewOnly, blocking };
}

export function getUploadActionLabel(document: DocumentDraft) {
  if (document.uploadStatus === 'saved') return 'Replace file';
  if (document.uploadStatus === 'error') return 'Try again';
  return 'Upload file';
}

export function createInitialDocumentDrafts(): Record<DocumentType, DocumentDraft> {
  return {
    birth_cert: {
      fileName: '',
      validationState: 'missing',
      message: 'Birth certificate is still required.',
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'idle',
    },
    learner_photo: {
      fileName: '',
      validationState: 'missing',
      message: 'Learner photograph is still required.',
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'idle',
    },
    motivation_letter: {
      fileName: '',
      validationState: 'missing',
      message: 'Motivation letter is still required.',
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'idle',
    },
    school_report: {
      fileName: '',
      validationState: 'missing',
      message: 'Previous school report is still required.',
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'idle',
    },
    proof_residence: {
      fileName: '',
      validationState: 'missing',
      message: 'Proof of residence is still required.',
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'idle',
    },
    id_copy: {
      fileName: '',
      validationState: 'missing',
      message: 'Parent ID or passport copy is still required.',
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'idle',
    },
    income_proof: {
      fileName: '',
      validationState: 'missing',
      message: 'Proof of employment or income is still required.',
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'idle',
    },
    medical_aid_card: {
      fileName: '',
      validationState: 'missing',
      message: 'Medical aid card is still required.',
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'idle',
    },
    immunisation_record: {
      fileName: '',
      validationState: 'missing',
      message: 'Immunisation or health record is still required.',
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'idle',
    },
    fee_payer_id_copy: {
      fileName: '',
      validationState: 'missing',
      message: 'Fee-payer or debtor ID copy is still required.',
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'idle',
    },
    residency_permit: {
      fileName: '',
      validationState: 'missing',
      message: 'Residency or permit document will be required if applicable.',
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'idle',
    },
    custody_order: {
      fileName: '',
      validationState: 'missing',
      message: 'Custody or court order will be required if applicable.',
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'idle',
    },
    other: {
      fileName: '',
      validationState: 'missing',
      message: 'Optional supporting document can be added later.',
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'idle',
    },
  };
}

export function mergeDocumentDrafts(
  baseDocuments: Record<DocumentType, DocumentDraft>,
  storedDocuments: Partial<Record<DocumentType, DocumentDraft>> | undefined,
) {
  if (!storedDocuments) return baseDocuments;

  const merged = { ...baseDocuments };
  for (const [documentType, storedDocument] of Object.entries(storedDocuments) as Array<
    [DocumentType, DocumentDraft]
  >) {
    merged[documentType] = {
      ...merged[documentType],
      ...storedDocument,
    };
  }
  return merged;
}

export function mergeRoleDrafts(baseRoles: IntakeRoleState, storedRoles: Partial<IntakeRoleState> | undefined) {
  if (!storedRoles) return baseRoles;

  return {
    ...baseRoles,
    ...storedRoles,
    submitter: {
      ...baseRoles.submitter,
      ...storedRoles.submitter,
    },
    parent: {
      ...baseRoles.parent,
      ...storedRoles.parent,
    },
    legalGuardian: {
      ...baseRoles.legalGuardian,
      ...storedRoles.legalGuardian,
    },
    feePayer: {
      ...baseRoles.feePayer,
      ...storedRoles.feePayer,
    },
  };
}

export function mergeDraftState(baseDraft: ApplicationDraft, storedDraft: Partial<ApplicationDraft> | undefined) {
  if (!storedDraft) return baseDraft;

  return {
    ...baseDraft,
    ...storedDraft,
    documents: mergeDocumentDrafts(baseDraft.documents, storedDraft.documents),
    roles: mergeRoleDrafts(baseDraft.roles, storedDraft.roles),
  };
}

export function readStoredDraftSnapshot(): StoredApplicationDraftSnapshot | null {
  if (typeof window === 'undefined') return null;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);

    if (parsed?.version === STORAGE_VERSION && parsed?.draft) {
      return parsed as StoredApplicationDraftSnapshot;
    }

    return {
      version: STORAGE_VERSION,
      savedAt: new Date().toISOString(),
      activeStep: parsed?.activeStep && STEP_KEYS.includes(parsed.activeStep) ? parsed.activeStep : 'checklist',
      readinessConfirmed: Boolean(parsed?.readinessConfirmed),
      draft: mergeDraftState(createInitialDraft(), parsed as Partial<ApplicationDraft>),
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function createReferenceNumber() {
  return `EUN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function createInitialDraft(): ApplicationDraft {
  return {
    parentFirstName: '',
    parentLastName: '',
    parentEmail: '',
    parentPhone: '',
    learnerFirstName: '',
    learnerLastName: '',
    learnerGrade: '',
    previousSchool: '',
    intakeYear: '2026',
    siblingAtSchool: 'No',
    coParentContext: 'No',
    citizenshipStatus: 'South African',
    boardingStatus: 'Daygirl',
    financialStatus: 'Employed',
    feePayerSameAsParent: true,
    legalGuardianApplicable: false,
    notes: '',
    status: 'draft',
    submittedAt: null,
    documents: createInitialDocumentDrafts(),
    roles: createDefaultIntakeRoleState(),
  };
}

export function getStepIndex(step: StepKey) {
  return STEP_KEYS.indexOf(step);
}

export function getValidationTone(state: DocumentValidationState) {
  switch (state) {
    case 'accepted':
    case 'verified':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    case 'wrong_format':
    case 'too_large':
    case 'corrupted':
      return 'border-rose-200 bg-rose-50 text-rose-700';
    case 'blurry':
    case 'low_confidence_ocr':
    case 'needs_reupload':
    case 'manual_review':
      return 'border-amber-200 bg-amber-50 text-amber-800';
    case 'missing':
    default:
      return 'border-slate-200 bg-slate-50 text-slate-600';
  }
}

export function getDocumentStateGuidance(state: DocumentValidationState) {
  return getDocumentValidationGuidance(state);
}

export function getDocumentQualityCue(state: DocumentValidationState) {
  switch (state) {
    case 'wrong_format':
      return 'Use a PDF, JPG, or PNG so the school can open it quickly.';
    case 'too_large':
      return 'A smaller file is easier to save and usually easier to review on mobile.';
    case 'corrupted':
      return 'Try exporting or re-saving the file before uploading it again.';
    case 'blurry':
      return 'Retake the photo in brighter light and keep the full page in frame.';
    case 'low_confidence_ocr':
      return 'The text is hard to read, so a sharper scan or photo will help the school review it faster.';
    case 'needs_reupload':
      return 'Replace this with a clearer version so the file can move forward.';
    case 'manual_review':
      return 'This is readable, but a staff member will check it by hand.';
    case 'verified':
    case 'accepted':
      return 'This upload is clear enough for the current review.';
    case 'missing':
    default:
      return 'When you upload this item, we will help you check that it is clear enough.';
  }
}

export function getDocumentIntakeCue(document: DocumentDraft) {
  if (!document.intake) return null;

  const processingLabel = DOCUMENT_PROCESSING_STATUS_LABELS[document.intake.processingStatus];

  if (document.intake.processingStatus === 'queued') {
    return `${processingLabel}. We can keep this ready for later OCR checks.`;
  }

  if (document.intake.processingStatus === 'running') {
    return `${processingLabel}. The file is being checked now.`;
  }

  if (document.intake.processingStatus === 'manual_review') {
    return `${processingLabel}. A staff member will confirm it by hand.`;
  }

  if (document.intake.processingStatus === 'passed') {
    return `${processingLabel}. It is ready for the next step.`;
  }

  return `${processingLabel}. Please replace this file before continuing.`;
}

export function getDocumentActionChecklist(document: DocumentDraft) {
  if (document.validationState === 'blurry') {
    return [
      'Retake in brighter light.',
      'Keep the full page inside the camera frame.',
      'Hold your phone steady before capturing.',
    ];
  }

  if (document.validationState === 'low_confidence_ocr') {
    return [
      'Keep the page upright (not rotated).',
      'Avoid shadows over important text.',
      'Use a clearer scan or a sharper photo.',
    ];
  }

  if (document.validationState === 'manual_review') {
    return [
      'This file can stay for now.',
      'If you have a clearer copy, replace it now.',
      'Otherwise the school will verify it manually.',
    ];
  }

  if (document.validationState === 'wrong_format' || document.validationState === 'too_large') {
    return [
      'Use PDF, JPG, or PNG.',
      'Keep files small enough for mobile upload.',
      'Try exporting again before uploading.',
    ];
  }

  return [];
}
