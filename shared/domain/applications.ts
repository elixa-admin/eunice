export const APPLICATION_STATUSES = [
  'draft',
  'submitted',
  'awaiting_documents',
  'ready_for_review',
  'under_review',
  'decision_pending',
  'accepted',
  'rejected',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  awaiting_documents: 'Awaiting documents',
  ready_for_review: 'Ready for review',
  under_review: 'Under review',
  decision_pending: 'Decision pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export const APPLICATION_STATUS_DESCRIPTIONS: Record<ApplicationStatus, string> = {
  draft: 'The parent has started an application but has not submitted it yet.',
  submitted: 'The parent has submitted the application and it has entered the admissions queue.',
  awaiting_documents: 'The application cannot proceed until required documents are uploaded or replaced.',
  ready_for_review: 'The application has the minimum required information and can be reviewed by admissions staff.',
  under_review: 'Admissions staff are actively reviewing the application.',
  decision_pending: 'Review is complete and a final school decision is still pending.',
  accepted: 'The learner has been accepted.',
  rejected: 'The learner has not been accepted.',
};

export const APPLICATION_STATUS_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  draft: ['submitted'],
  submitted: ['awaiting_documents', 'ready_for_review', 'under_review'],
  awaiting_documents: ['ready_for_review', 'under_review'],
  ready_for_review: ['awaiting_documents', 'under_review'],
  under_review: ['awaiting_documents', 'decision_pending', 'accepted', 'rejected'],
  decision_pending: ['accepted', 'rejected'],
  accepted: [],
  rejected: [],
};

export function canTransitionApplicationStatus(
  currentStatus: ApplicationStatus,
  nextStatus: ApplicationStatus,
) {
  return APPLICATION_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
}
