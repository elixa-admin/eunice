import type { ApplicationStatus } from '@/lib/domain/applications';
import {
  getApplicationDocumentRequirements,
  getRequiredDocumentTypes,
  type ApplicationDocumentRequirement,
} from '@/lib/domain/application-requirements';
import {
  isDocumentStateBlocking,
  isDocumentStateReviewOnly,
  type DocumentType,
  type DocumentValidationState,
} from '@/lib/documents/contracts';

export interface AdminApplication {
  id: string;
  reference_number: string;
  learner_first_name: string;
  learner_last_name: string;
  grade_applying_for: string;
  previous_school_name: string | null;
  status: ApplicationStatus;
  created_at: string;
  parent: {
    first_name: string;
    last_name: string;
    phone_number: string | null;
  } | null;
  documentSummary: DocumentSummary;
}

export type DocumentRecord = {
  application_id: string;
  document_type: DocumentType;
  upload_status: DocumentValidationState;
};

export type DocumentSummary = {
  totalRequired: number;
  missingRequired: number;
  blocking: number;
  reviewOnly: number;
  verified: number;
};

export type AdminDocument = {
  id: string;
  application_id: string;
  document_type: DocumentType;
  upload_status: DocumentValidationState;
  review_notes?: string | null;
  file_path?: string | null;
  file_name?: string | null;
  verified_at?: string | null;
  uploaded_at?: string | null;
  file_size?: number | null;
};

export type AdminNote = {
  id: string;
  note_text: string;
  created_at: string;
  admin_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
  } | null;
};

export type RawAdminNote = Omit<AdminNote, 'profiles'> & {
  profiles?: AdminNote['profiles'] | AdminNote['profiles'][];
};

export type TriageLane =
  | 'blocked'
  | 'review_ready'
  | 'in_review'
  | 'decision_pending'
  | 'closed'
  | 'incomplete';

export type QueueFilter =
  | 'all'
  | `triage:${TriageLane}`
  | 'missing_docs'
  | 'recent_submitted'
  | 'awaiting_parent'
  | ApplicationStatus;

export type InsightLevel = 'good' | 'warn' | 'risk';

export const ADMIN_REQUIRED_DOCUMENT_TYPES = getRequiredDocumentTypes();
export const ADMIN_DOCUMENT_REQUIREMENTS = getApplicationDocumentRequirements();
export const ADMIN_DOCUMENT_CATEGORY_ORDER: ApplicationDocumentRequirement['category'][] = [
  'identity',
  'school',
  'family',
  'medical',
  'financial',
  'legal',
  'supporting',
];

export const ADMIN_DOCUMENT_CATEGORY_LABELS: Record<ApplicationDocumentRequirement['category'], string> = {
  identity: 'Identity',
  school: 'School',
  family: 'Family',
  medical: 'Medical',
  financial: 'Financial',
  legal: 'Legal',
  supporting: 'Supporting',
};

export const TRIAGE_LANE_LABELS: Record<TriageLane, string> = {
  blocked: 'Blocked',
  review_ready: 'Review ready',
  in_review: 'In review',
  decision_pending: 'Decision pending',
  closed: 'Closed',
  incomplete: 'Incomplete',
};

export const TRIAGE_LANE_PRIORITY: Record<TriageLane, number> = {
  blocked: 0,
  review_ready: 1,
  in_review: 2,
  decision_pending: 3,
  incomplete: 4,
  closed: 5,
};

export const TRIAGE_FILTERS: TriageLane[] = ['blocked', 'review_ready', 'in_review', 'decision_pending'];

export function normalizeAdminNote(note: RawAdminNote): AdminNote {
  return {
    ...note,
    profiles: Array.isArray(note.profiles) ? note.profiles[0] ?? null : note.profiles ?? null,
  };
}

export function normalizeAdminNotes(notes: RawAdminNote[]): AdminNote[] {
  return notes.map(normalizeAdminNote);
}

export function MiniSparkline({ values }: { values: number[] }) {
  const width = 220;
  const height = 54;
  const maxValue = Math.max(...values, 1);
  const stepX = values.length > 1 ? width / (values.length - 1) : width;
  const points = values
    .map((value, index) => {
      const x = index * stepX;
      const y = height - (value / maxValue) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[54px] w-full" aria-hidden="true" role="img">
      <defs>
        <linearGradient id="workloadSparkline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#34d399" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#workloadSparkline)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {values.map((value, index) => {
        const x = values.length > 1 ? index * stepX : width / 2;
        const y = height - (value / maxValue) * (height - 8) - 4;

        return (
          <circle
            key={`${value}-${index}`}
            cx={x}
            cy={y}
            r="2.8"
            fill="#0f172a"
            stroke="#fbbf24"
            strokeWidth="1.4"
          />
        );
      })}
    </svg>
  );
}

export function summarizeDocumentsForApp(applicationId: string, docs: DocumentRecord[]): DocumentSummary {
  const documentByType = new Map(
    docs
      .filter((doc) => doc.application_id === applicationId)
      .map((doc) => [doc.document_type, doc]),
  );

  const missingRequired = ADMIN_REQUIRED_DOCUMENT_TYPES.filter((documentType) => !documentByType.has(documentType)).length;
  const blocking = ADMIN_REQUIRED_DOCUMENT_TYPES.filter((documentType) => {
    const state = documentByType.get(documentType)?.upload_status;
    return !state || isDocumentStateBlocking(state);
  }).length;
  const reviewOnly = ADMIN_REQUIRED_DOCUMENT_TYPES.filter((documentType) => {
    const state = documentByType.get(documentType)?.upload_status;
    return state ? isDocumentStateReviewOnly(state) : false;
  }).length;
  const verified = ADMIN_REQUIRED_DOCUMENT_TYPES.filter((documentType) => {
    const state = documentByType.get(documentType)?.upload_status;
    return state === 'accepted' || state === 'verified';
  }).length;

  return {
    totalRequired: ADMIN_REQUIRED_DOCUMENT_TYPES.length,
    missingRequired,
    blocking,
    reviewOnly,
    verified,
  };
}

export function getTriageLane(app: AdminApplication): TriageLane {
  if (app.status === 'accepted' || app.status === 'rejected') return 'closed';
  if (app.documentSummary.blocking > 0 || app.documentSummary.missingRequired > 0 || app.status === 'awaiting_documents') {
    return 'blocked';
  }
  if (app.documentSummary.reviewOnly > 0) return 'review_ready';
  if (app.status === 'under_review') return 'in_review';
  if (app.status === 'decision_pending') return 'decision_pending';
  if (app.status === 'submitted' || app.status === 'ready_for_review') return 'review_ready';
  return 'incomplete';
}

export function getAdminQueueTone(status: ApplicationStatus) {
  switch (status) {
    case 'accepted':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    case 'rejected':
      return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    case 'submitted':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'under_review':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    case 'awaiting_documents':
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'ready_for_review':
      return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
    case 'decision_pending':
      return 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-500/30';
    default:
      return 'bg-white/10 text-white/80 border-white/10';
  }
}

export function getNextActionLabel(app: AdminApplication) {
  const lane = getTriageLane(app);
  if (lane === 'blocked') return 'Parent follow-up';
  if (lane === 'review_ready') return 'Review documents';
  if (lane === 'in_review') return 'Continue review';
  if (lane === 'decision_pending') return 'Resolve decision';
  if (lane === 'closed') return 'Archive / notify';
  return 'Needs intake completion';
}

export function getDocumentStatusTone(status: DocumentValidationState) {
  switch (status) {
    case 'verified':
    case 'accepted':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    case 'wrong_format':
    case 'too_large':
    case 'corrupted':
      return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    case 'blurry':
    case 'needs_reupload':
    case 'low_confidence_ocr':
    case 'manual_review':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    case 'missing':
    default:
      return 'bg-white/10 text-white/50 border-white/10';
  }
}

export function getInsightTone(level: InsightLevel) {
  switch (level) {
    case 'good':
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200';
    case 'warn':
      return 'border-amber-500/20 bg-amber-500/10 text-amber-100';
    case 'risk':
    default:
      return 'border-rose-500/20 bg-rose-500/10 text-rose-100';
  }
}

export function getPercentChange(current: number, previous: number) {
  if (previous === 0) {
    if (current === 0) return 0;
    return 100;
  }

  return Math.round(((current - previous) / previous) * 100);
}
