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

export type ApplicationNotificationTemplate = {
  channel: 'Email' | 'SMS';
  subject: string;
  body: string;
};

export type ApplicationNotificationPlan = {
  trigger: ApplicationStatus;
  label: string;
  templates: ApplicationNotificationTemplate[];
};

export const APPLICATION_NOTIFICATION_PLAN: Record<ApplicationStatus, ApplicationNotificationPlan> = {
  draft: {
    trigger: 'draft',
    label: 'No automated message yet',
    templates: [],
  },
  submitted: {
    trigger: 'submitted',
    label: 'Submission confirmation',
    templates: [
      {
        channel: 'Email',
        subject: 'Application received',
        body: 'Thank you for submitting the application. We will review the file once the queue reaches it.',
      },
    ],
  },
  awaiting_documents: {
    trigger: 'awaiting_documents',
    label: 'Missing document follow-up',
    templates: [
      {
        channel: 'SMS',
        subject: 'Documents still needed',
        body: 'Your application needs one or more documents before it can move forward. Please re-upload the missing items.',
      },
      {
        channel: 'Email',
        subject: 'Please re-upload documents',
        body: 'We have flagged one or more documents for replacement. Please use the secure upload link to resend them.',
      },
    ],
  },
  ready_for_review: {
    trigger: 'ready_for_review',
    label: 'Ready for staff review',
    templates: [
      {
        channel: 'Email',
        subject: 'Your application is in review',
        body: 'Your application is ready and has entered the admissions review queue.',
      },
    ],
  },
  under_review: {
    trigger: 'under_review',
    label: 'Review progress update',
    templates: [
      {
        channel: 'Email',
        subject: 'Review in progress',
        body: 'The admissions team is reviewing your application and will contact you if anything else is needed.',
      },
    ],
  },
  decision_pending: {
    trigger: 'decision_pending',
    label: 'Decision pending',
    templates: [
      {
        channel: 'Email',
        subject: 'Final decision pending',
        body: 'The review is complete and the final decision is being prepared for release.',
      },
    ],
  },
  accepted: {
    trigger: 'accepted',
    label: 'Acceptance communication',
    templates: [
      {
        channel: 'Email',
        subject: 'Application accepted',
        body: 'Congratulations. Your application has been accepted and the offer details are ready.',
      },
      {
        channel: 'SMS',
        subject: 'Offer ready',
        body: 'Your admissions offer is ready to review.',
      },
    ],
  },
  rejected: {
    trigger: 'rejected',
    label: 'Outcome communication',
    templates: [
      {
        channel: 'Email',
        subject: 'Application outcome',
        body: 'The admissions team has completed its review and the outcome is available.',
      },
    ],
  },
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

export function canTransitionApplicationStatus(currentStatus: ApplicationStatus, nextStatus: ApplicationStatus) {
  return APPLICATION_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
}
