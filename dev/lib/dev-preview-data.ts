import {
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_VALIDATION_LABELS,
  REQUIRED_DOCUMENT_TYPES,
  isDocumentStateBlocking,
  isDocumentStateReviewOnly,
  isDocumentStateSubmissionReady,
  type DocumentIntakeMetadata,
  type DocumentType,
  type DocumentValidationState,
} from '@eunice-shared/documents/contracts';
import type { ApplicationStatus } from '@eunice-shared/domain/applications';

export type PreviewStatus =
  | Extract<ApplicationStatus, 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected'>
  | 'incomplete';

export type PreviewDocument = {
  type: DocumentType;
  status: DocumentValidationState;
  uploadedAt?: string;
  note?: string;
  intake?: DocumentIntakeMetadata;
};

export type PreviewTimelineEntry = {
  title: string;
  detail: string;
  at: string;
};

export type PreviewCommunicationEntry = {
  channel: 'SMS' | 'Email';
  subject: string;
  status: 'sent' | 'queued' | 'draft';
  at: string;
  detail: string;
};

export type PreviewApplication = {
  id: string;
  ref: string;
  learnerName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  grade: string;
  schoolYear: string;
  previousSchool: string;
  status: PreviewStatus;
  submittedAt: string;
  updatedAt: string;
  assignedTo: string;
  zoneTag: string;
  completion: number;
  missingItems: string[];
  documents: PreviewDocument[];
  note: string;
  timeline: PreviewTimelineEntry[];
  communication: PreviewCommunicationEntry[];
};

export type PreviewReviewState = 'blocked' | 'review' | 'ready' | 'complete';
export type ParentWorkflowStepKey = 'checklist' | 'learner' | 'household' | 'medical' | 'fees_docs' | 'review';
export type ParentWorkflowStepState = 'todo' | 'active' | 'done' | 'blocked';

export type ParentWorkflowSnapshot = {
  activeStep: ParentWorkflowStepKey;
  canSubmit: boolean;
  blockers: string[];
  reviewOnlyWarnings: string[];
  readyRequiredDocuments: number;
  totalRequiredDocuments: number;
  stepStates: Record<ParentWorkflowStepKey, ParentWorkflowStepState>;
};

export const previewApplications: PreviewApplication[] = [
  {
    id: 'app-001',
    ref: 'EUN-2026-001',
    learnerName: 'Naledi Mokoena',
    parentName: 'Thabo Mokoena',
    parentEmail: 'thabo.mokoena@example.com',
    parentPhone: '+27 82 555 0141',
    grade: 'Grade 8',
    schoolYear: '2027 intake',
    previousSchool: 'Bayswater Primary',
    status: 'under_review',
    submittedAt: '2026-05-14',
    updatedAt: '2026-05-19',
    assignedTo: 'A. van Wyk',
    zoneTag: 'Zone 1 (Feeder Zone)',
    completion: 92,
    missingItems: ['Proof of residence flagged for manual review'],
    documents: [
      { type: 'birth_cert', status: 'verified', uploadedAt: '2026-05-14', note: 'Certified copy received.' },
      { type: 'school_report', status: 'verified', uploadedAt: '2026-05-14', note: 'Term 1 report accepted.' },
      {
        type: 'proof_residence',
        status: 'low_confidence_ocr',
        uploadedAt: '2026-05-15',
        note: 'Utility bill is readable, but the text needs a sharper capture.',
        intake: {
          processingStatus: 'queued',
          qualitySignals: ['low_confidence_ocr'],
          ocrText: null,
          confidenceScore: null,
        },
      },
      { type: 'id_copy', status: 'verified', uploadedAt: '2026-05-14', note: 'ID number captured.' },
    ],
    note: 'Proof of residence uploaded, waiting for final verification.',
    timeline: [
      { title: 'Submitted by parent', detail: 'Application completed in one session.', at: '2026-05-14' },
      { title: 'Admissions review started', detail: 'Queue assigned to admissions officer.', at: '2026-05-16' },
      { title: 'Residence proof flagged', detail: 'Reviewer requested one final address check.', at: '2026-05-19' },
    ],
    communication: [
      { channel: 'Email', subject: 'Application received', status: 'sent', at: '2026-05-14', detail: 'Confirmation sent after submission.' },
      { channel: 'SMS', subject: 'Review in progress', status: 'sent', at: '2026-05-16', detail: 'Parent was notified that the file entered review.' },
      { channel: 'Email', subject: 'Address check required', status: 'sent', at: '2026-05-19', detail: 'Requested a clearer proof of residence.' },
    ],
  },
  {
    id: 'app-002',
    ref: 'EUN-2026-002',
    learnerName: 'Ayanda Khumalo',
    parentName: 'Lerato Khumalo',
    parentEmail: 'lerato.khumalo@example.com',
    parentPhone: '+27 83 555 0102',
    grade: 'Grade 9',
    schoolYear: '2027 intake',
    previousSchool: 'Heatherdale Intermediate',
    status: 'incomplete',
    submittedAt: '2026-05-12',
    updatedAt: '2026-05-18',
    assignedTo: 'N. Jacobs',
    zoneTag: 'Zone 3 (Out of Zone)',
    completion: 74,
    missingItems: ['Previous school report needs re-upload'],
    documents: [
      { type: 'birth_cert', status: 'verified', uploadedAt: '2026-05-12', note: 'Accepted.' },
      {
        type: 'school_report',
        status: 'blurry',
        note: 'Camera photo is usable, but the file should be retaken more clearly.',
        intake: {
          processingStatus: 'running',
          qualitySignals: ['blurry'],
          ocrText: null,
          confidenceScore: null,
        },
      },
      { type: 'proof_residence', status: 'verified', uploadedAt: '2026-05-12', note: 'Municipal statement accepted.' },
      { type: 'id_copy', status: 'verified', uploadedAt: '2026-05-12', note: 'Readable copy received.' },
    ],
    note: 'Reminder sent for missing previous school report.',
    timeline: [
      { title: 'Submitted by parent', detail: 'Draft converted to submitted application.', at: '2026-05-12' },
      { title: 'Missing report flagged', detail: 'School report required before review can start.', at: '2026-05-15' },
      { title: 'Reminder prepared', detail: 'Parent communication ready to send.', at: '2026-05-18' },
    ],
    communication: [
      { channel: 'Email', subject: 'Application received', status: 'sent', at: '2026-05-12', detail: 'Confirmation sent after the draft was submitted.' },
      { channel: 'SMS', subject: 'Missing report reminder', status: 'sent', at: '2026-05-15', detail: 'Parent was asked to re-upload the school report.' },
      { channel: 'Email', subject: 'Reminder prepared', status: 'queued', at: '2026-05-18', detail: 'Follow-up message ready for release.' },
    ],
  },
  {
    id: 'app-003',
    ref: 'EUN-2026-003',
    learnerName: 'Rethabile Botha',
    parentName: 'Marelize Botha',
    parentEmail: 'marelize.botha@example.com',
    parentPhone: '+27 82 555 0109',
    grade: 'Grade 8',
    schoolYear: '2027 intake',
    previousSchool: 'Onze Rust Primary',
    status: 'accepted',
    submittedAt: '2026-05-08',
    updatedAt: '2026-05-17',
    assignedTo: 'Principal Review',
    zoneTag: 'Zone 1 (Feeder Zone)',
    completion: 100,
    missingItems: [],
    documents: [
      { type: 'birth_cert', status: 'verified', uploadedAt: '2026-05-08', note: 'Accepted.' },
      { type: 'school_report', status: 'verified', uploadedAt: '2026-05-08', note: 'Strong academic record captured.' },
      { type: 'proof_residence', status: 'verified', uploadedAt: '2026-05-08', note: 'Address matches catchment rules.' },
      { type: 'id_copy', status: 'verified', uploadedAt: '2026-05-08', note: 'Verified against form details.' },
    ],
    note: 'All checks complete. Offer ready for parent collection.',
    timeline: [
      { title: 'Submitted by parent', detail: 'All required information received.', at: '2026-05-08' },
      { title: 'Admissions review complete', detail: 'Documents and learner profile fully verified.', at: '2026-05-14' },
      { title: 'Principal approved acceptance', detail: 'Offer letter queued for release.', at: '2026-05-17' },
    ],
    communication: [
      { channel: 'Email', subject: 'Application received', status: 'sent', at: '2026-05-08', detail: 'Submission confirmation sent.' },
      { channel: 'Email', subject: 'Acceptance prepared', status: 'sent', at: '2026-05-17', detail: 'Offer letter queued for parent release.' },
      { channel: 'SMS', subject: 'Offer ready', status: 'sent', at: '2026-05-17', detail: 'Parent notified that the acceptance was ready.' },
    ],
  },
  {
    id: 'app-004',
    ref: 'EUN-2026-004',
    learnerName: 'Tumelo Dlamini',
    parentName: 'Busisiwe Dlamini',
    parentEmail: 'busisiwe.dlamini@example.com',
    parentPhone: '+27 76 555 0115',
    grade: 'Grade 10',
    schoolYear: '2027 intake',
    previousSchool: 'Kagisanong Secondary',
    status: 'submitted',
    submittedAt: '2026-05-20',
    updatedAt: '2026-05-20',
    assignedTo: 'Unassigned',
    zoneTag: 'Zone 3 (Out of Zone)',
    completion: 86,
    missingItems: ['Queue assignment', 'Document review'],
    documents: [
      {
        type: 'birth_cert',
        status: 'manual_review',
        uploadedAt: '2026-05-20',
        note: 'Possible repeat upload; staff should confirm the newest copy.',
        intake: {
          processingStatus: 'manual_review',
          qualitySignals: ['possible_duplicate'],
          ocrText: null,
          confidenceScore: null,
        },
      },
      { type: 'school_report', status: 'accepted', uploadedAt: '2026-05-20', note: 'Awaiting reviewer check.' },
      { type: 'proof_residence', status: 'accepted', uploadedAt: '2026-05-20', note: 'Awaiting reviewer check.' },
      { type: 'id_copy', status: 'accepted', uploadedAt: '2026-05-20', note: 'Awaiting reviewer check.' },
    ],
    note: 'Fresh submission awaiting queue assignment.',
    timeline: [
      { title: 'Submitted by parent', detail: 'Initial application entered the admissions queue.', at: '2026-05-20' },
    ],
    communication: [
      { channel: 'Email', subject: 'Application received', status: 'sent', at: '2026-05-20', detail: 'Confirmation sent as soon as the file arrived.' },
      { channel: 'SMS', subject: 'Queue assignment pending', status: 'queued', at: '2026-05-20', detail: 'Queued for release once the file is assigned.' },
    ],
  },
];

export const previewStatusClasses: Record<PreviewStatus, string> = {
  draft: 'border border-slate-200 bg-slate-100 text-slate-700',
  submitted: 'border border-primary-200 bg-primary-50 text-primary-800',
  under_review: 'border border-accent-200 bg-accent-50 text-accent-700',
  incomplete: 'border border-rose-200 bg-rose-50 text-rose-700',
  accepted: 'border border-primary-200 bg-primary-50 text-primary-800',
  rejected: 'border border-neutral-200 bg-neutral-100 text-neutral-700',
};

export const previewDocumentClasses = {
  accepted: 'border border-primary-200 bg-primary-50 text-primary-800',
  verified: 'border border-primary-200 bg-primary-50 text-primary-800',
  wrong_format: 'border border-rose-200 bg-rose-50 text-rose-700',
  too_large: 'border border-rose-200 bg-rose-50 text-rose-700',
  corrupted: 'border border-rose-200 bg-rose-50 text-rose-700',
  blurry: 'border border-accent-200 bg-accent-50 text-accent-700',
  low_confidence_ocr: 'border border-accent-200 bg-accent-50 text-accent-700',
  needs_reupload: 'border border-rose-200 bg-rose-50 text-rose-700',
  manual_review: 'border border-accent-200 bg-accent-50 text-accent-700',
  missing: 'border border-rose-200 bg-rose-50 text-rose-700',
} satisfies Record<DocumentValidationState, string>;

export function getPreviewDocumentLabel(type: DocumentType) {
  return DOCUMENT_TYPE_LABELS[type];
}

export function getPreviewDocumentStatusLabel(status: DocumentValidationState) {
  return DOCUMENT_VALIDATION_LABELS[status];
}

export function getPreviewDocumentCounts(application: PreviewApplication) {
  const requiredDocuments = application.documents.filter((document) =>
    REQUIRED_DOCUMENT_TYPES.includes(document.type),
  );

  return requiredDocuments.reduce(
    (counts, document) => {
      if (isDocumentStateBlocking(document.status)) counts.blocking += 1;
      else if (isDocumentStateReviewOnly(document.status)) counts.reviewOnly += 1;
      else if (isDocumentStateSubmissionReady(document.status)) counts.ready += 1;

      return counts;
    },
    {
      blocking: 0,
      reviewOnly: 0,
      ready: 0,
      total: requiredDocuments.length,
    },
  );
}

export function getPreviewReviewState(application: PreviewApplication): PreviewReviewState {
  const counts = getPreviewDocumentCounts(application);

  if (application.status === 'accepted' || application.status === 'rejected') {
    return 'complete';
  }

  if (counts.blocking > 0) {
    return 'blocked';
  }

  if (counts.reviewOnly > 0 || application.status === 'under_review') {
    return 'review';
  }

  return 'ready';
}

export const PREVIEW_REVIEW_STATE_LABELS: Record<PreviewReviewState, string> = {
  blocked: 'Blocked',
  review: 'Needs review',
  ready: 'Ready',
  complete: 'Complete',
};

export const PREVIEW_REVIEW_STATE_CLASSES: Record<PreviewReviewState, string> = {
  blocked: 'border border-rose-200 bg-rose-50 text-rose-700',
  review: 'border border-accent-200 bg-accent-50 text-accent-700',
  ready: 'border border-primary-200 bg-primary-50 text-primary-800',
  complete: 'border border-primary-200 bg-primary-50 text-primary-800',
};

export function getPreviewNextAction(application: PreviewApplication) {
  const counts = getPreviewDocumentCounts(application);

  if (application.status === 'accepted') {
    return 'Prepare the offer release and parent handoff.';
  }

  if (application.status === 'rejected') {
    return 'Finalize the outcome record and communication.';
  }

  if (counts.blocking > 0) {
    return 'Request replacement documents before the file can progress.';
  }

  if (counts.reviewOnly > 0) {
    return 'Review flagged documents and confirm whether a re-upload is needed.';
  }

  if (application.status === 'submitted') {
    return 'Assign a reviewer and start admissions review.';
  }

  return 'Continue the admissions review and prepare the next decision.';
}

export type PreviewUploadConfidenceLevel = 'ready' | 'mixed' | 'needs_attention';

export const PREVIEW_UPLOAD_CONFIDENCE_CHIP: Record<PreviewUploadConfidenceLevel, string> = {
  ready: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  mixed: 'border border-amber-200 bg-amber-50 text-amber-800',
  needs_attention: 'border border-rose-200 bg-rose-50 text-rose-700',
};

export function getPreviewUploadConfidence(application: PreviewApplication) {
  const counts = getPreviewDocumentCounts(application);

  if (counts.blocking > 0) {
    return {
      level: 'needs_attention' as const,
      label: 'Needs another look',
      summary: `${counts.blocking} required file${counts.blocking === 1 ? '' : 's'} still need a clearer capture or replacement.`,
      readyCount: counts.ready,
      reviewCount: counts.reviewOnly,
      blockingCount: counts.blocking,
    };
  }

  if (counts.reviewOnly > 0) {
    return {
      level: 'mixed' as const,
      label: 'Mostly ready',
      summary: `${counts.reviewOnly} item${counts.reviewOnly === 1 ? '' : 's'} still need staff review before final movement.`,
      readyCount: counts.ready,
      reviewCount: counts.reviewOnly,
      blockingCount: counts.blocking,
    };
  }

  return {
    level: 'ready' as const,
    label: 'Ready to move',
    summary: 'The required documents are clear enough to keep the application moving forward.',
    readyCount: counts.ready,
    reviewCount: counts.reviewOnly,
    blockingCount: counts.blocking,
  };
}

function buildStepStates(
  activeStep: ParentWorkflowStepKey,
  canSubmit: boolean,
  hasBlockers: boolean,
): Record<ParentWorkflowStepKey, ParentWorkflowStepState> {
  const sequence: ParentWorkflowStepKey[] = ['checklist', 'learner', 'household', 'medical', 'fees_docs', 'review'];
  const activeIndex = sequence.indexOf(activeStep);

  return sequence.reduce(
    (acc, step, index) => {
      if (step === 'review') {
        acc[step] = canSubmit ? 'done' : hasBlockers ? 'blocked' : 'todo';
        return acc;
      }

      if (index < activeIndex) {
        acc[step] = 'done';
      } else if (index === activeIndex) {
        acc[step] = hasBlockers && step === 'fees_docs' ? 'blocked' : 'active';
      } else {
        acc[step] = 'todo';
      }

      return acc;
    },
    {} as Record<ParentWorkflowStepKey, ParentWorkflowStepState>,
  );
}

export function getParentWorkflowSnapshot(application: PreviewApplication): ParentWorkflowSnapshot {
  const counts = getPreviewDocumentCounts(application);
  const blockers = application.documents
    .filter((document) => isDocumentStateBlocking(document.status))
    .map((document) => `${getPreviewDocumentLabel(document.type)}: ${getPreviewDocumentStatusLabel(document.status)}`);
  const reviewOnlyWarnings = application.documents
    .filter((document) => isDocumentStateReviewOnly(document.status))
    .map((document) => `${getPreviewDocumentLabel(document.type)}: ${getPreviewDocumentStatusLabel(document.status)}`);

  const canSubmit = blockers.length === 0 && counts.ready + counts.reviewOnly === counts.total;

  let activeStep: ParentWorkflowStepKey = 'checklist';
  if (application.status === 'accepted' || application.status === 'rejected' || application.status === 'submitted' || application.status === 'under_review') {
    activeStep = 'review';
  } else if (blockers.length > 0 || application.status === 'incomplete') {
    activeStep = 'fees_docs';
  } else if (canSubmit) {
    activeStep = 'review';
  } else {
    activeStep = 'learner';
  }

  return {
    activeStep,
    canSubmit,
    blockers,
    reviewOnlyWarnings,
    readyRequiredDocuments: counts.ready,
    totalRequiredDocuments: counts.total,
    stepStates: buildStepStates(activeStep, canSubmit, blockers.length > 0),
  };
}

export type AdminQueueLane = 'blocking' | 'review' | 'ready' | 'decision';

export function getAdminQueueLane(application: PreviewApplication): AdminQueueLane {
  if (application.status === 'accepted' || application.status === 'rejected') {
    return 'decision';
  }

  const reviewState = getPreviewReviewState(application);
  if (reviewState === 'blocked') return 'blocking';
  if (reviewState === 'review') return 'review';
  return 'ready';
}
