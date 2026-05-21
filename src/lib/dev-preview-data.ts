export type PreviewStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'incomplete'
  | 'accepted'
  | 'rejected';

export type PreviewDocument = {
  label: string;
  status: 'verified' | 'pending' | 'missing';
};

export type PreviewApplication = {
  id: string;
  ref: string;
  learnerName: string;
  parentName: string;
  grade: string;
  status: PreviewStatus;
  submittedAt: string;
  updatedAt: string;
  documents: PreviewDocument[];
  note: string;
  timeline: string[];
};

export const previewApplications: PreviewApplication[] = [
  {
    id: 'app-001',
    ref: 'EUN-2026-001',
    learnerName: 'Naledi Mokoena',
    parentName: 'Thabo Mokoena',
    grade: 'Grade 8',
    status: 'under_review',
    submittedAt: '2026-05-14',
    updatedAt: '2026-05-19',
    documents: [
      { label: 'Birth Certificate', status: 'verified' },
      { label: 'School Report', status: 'verified' },
      { label: 'Proof of Residence', status: 'pending' },
      { label: 'Parent ID', status: 'verified' },
    ],
    note: 'Proof of residence uploaded, waiting for final verification.',
    timeline: ['Submitted by parent', 'Admissions review started', 'Residence proof flagged for verification'],
  },
  {
    id: 'app-002',
    ref: 'EUN-2026-002',
    learnerName: 'Ayanda Khumalo',
    parentName: 'Lerato Khumalo',
    grade: 'Grade 9',
    status: 'incomplete',
    submittedAt: '2026-05-12',
    updatedAt: '2026-05-18',
    documents: [
      { label: 'Birth Certificate', status: 'verified' },
      { label: 'School Report', status: 'missing' },
      { label: 'Proof of Residence', status: 'verified' },
      { label: 'Parent ID', status: 'verified' },
    ],
    note: 'Reminder sent for missing previous school report.',
    timeline: ['Submitted by parent', 'Missing school report flagged', 'Reminder email prepared'],
  },
  {
    id: 'app-003',
    ref: 'EUN-2026-003',
    learnerName: 'Rethabile Botha',
    parentName: 'Marelize Botha',
    grade: 'Grade 8',
    status: 'accepted',
    submittedAt: '2026-05-08',
    updatedAt: '2026-05-17',
    documents: [
      { label: 'Birth Certificate', status: 'verified' },
      { label: 'School Report', status: 'verified' },
      { label: 'Proof of Residence', status: 'verified' },
      { label: 'Parent ID', status: 'verified' },
    ],
    note: 'All checks complete. Offer ready for parent collection.',
    timeline: ['Submitted by parent', 'Admissions review complete', 'Principal approved acceptance'],
  },
  {
    id: 'app-004',
    ref: 'EUN-2026-004',
    learnerName: 'Tumelo Dlamini',
    parentName: 'Busisiwe Dlamini',
    grade: 'Grade 10',
    status: 'submitted',
    submittedAt: '2026-05-20',
    updatedAt: '2026-05-20',
    documents: [
      { label: 'Birth Certificate', status: 'pending' },
      { label: 'School Report', status: 'pending' },
      { label: 'Proof of Residence', status: 'pending' },
      { label: 'Parent ID', status: 'pending' },
    ],
    note: 'Fresh submission awaiting queue assignment.',
    timeline: ['Submitted by parent'],
  },
];

export const previewStatusClasses: Record<PreviewStatus, string> = {
  draft: 'bg-white/10 text-white/80',
  submitted: 'bg-blue-500/20 text-blue-200',
  under_review: 'bg-amber-500/20 text-amber-200',
  incomplete: 'bg-rose-500/20 text-rose-200',
  accepted: 'bg-emerald-500/20 text-emerald-200',
  rejected: 'bg-neutral-500/20 text-neutral-200',
};

export const previewDocumentClasses = {
  verified: 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/20',
  pending: 'bg-amber-500/15 text-amber-100 border border-amber-400/20',
  missing: 'bg-rose-500/15 text-rose-200 border border-rose-400/20',
};
