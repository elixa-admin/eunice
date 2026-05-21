export type PreviewStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'incomplete'
  | 'accepted'
  | 'rejected';

export type PreviewDocument = {
  type: 'birth_cert' | 'school_report' | 'proof_residence' | 'id_copy';
  label: string;
  status: 'verified' | 'pending' | 'missing';
  uploadedAt?: string;
  note?: string;
};

export type PreviewTimelineEntry = {
  title: string;
  detail: string;
  at: string;
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
  completion: number;
  missingItems: string[];
  documents: PreviewDocument[];
  note: string;
  timeline: PreviewTimelineEntry[];
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
    completion: 92,
    missingItems: ['Proof of residence verification'],
    documents: [
      { type: 'birth_cert', label: 'Birth Certificate', status: 'verified', uploadedAt: '2026-05-14', note: 'Certified copy received.' },
      { type: 'school_report', label: 'School Report', status: 'verified', uploadedAt: '2026-05-14', note: 'Term 1 report accepted.' },
      { type: 'proof_residence', label: 'Proof of Residence', status: 'pending', uploadedAt: '2026-05-15', note: 'Utility bill visible but address needs confirmation.' },
      { type: 'id_copy', label: 'Parent ID', status: 'verified', uploadedAt: '2026-05-14', note: 'ID number captured.' },
    ],
    note: 'Proof of residence uploaded, waiting for final verification.',
    timeline: [
      { title: 'Submitted by parent', detail: 'Application completed in one session.', at: '2026-05-14' },
      { title: 'Admissions review started', detail: 'Queue assigned to admissions officer.', at: '2026-05-16' },
      { title: 'Residence proof flagged', detail: 'Reviewer requested one final address check.', at: '2026-05-19' },
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
    completion: 74,
    missingItems: ['Previous school report'],
    documents: [
      { type: 'birth_cert', label: 'Birth Certificate', status: 'verified', uploadedAt: '2026-05-12', note: 'Accepted.' },
      { type: 'school_report', label: 'School Report', status: 'missing', note: 'Parent said report will follow after term close.' },
      { type: 'proof_residence', label: 'Proof of Residence', status: 'verified', uploadedAt: '2026-05-12', note: 'Municipal statement accepted.' },
      { type: 'id_copy', label: 'Parent ID', status: 'verified', uploadedAt: '2026-05-12', note: 'Readable copy received.' },
    ],
    note: 'Reminder sent for missing previous school report.',
    timeline: [
      { title: 'Submitted by parent', detail: 'Draft converted to submitted application.', at: '2026-05-12' },
      { title: 'Missing report flagged', detail: 'School report required before review can start.', at: '2026-05-15' },
      { title: 'Reminder prepared', detail: 'Parent communication ready to send.', at: '2026-05-18' },
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
    completion: 100,
    missingItems: [],
    documents: [
      { type: 'birth_cert', label: 'Birth Certificate', status: 'verified', uploadedAt: '2026-05-08', note: 'Accepted.' },
      { type: 'school_report', label: 'School Report', status: 'verified', uploadedAt: '2026-05-08', note: 'Strong academic record captured.' },
      { type: 'proof_residence', label: 'Proof of Residence', status: 'verified', uploadedAt: '2026-05-08', note: 'Address matches catchment rules.' },
      { type: 'id_copy', label: 'Parent ID', status: 'verified', uploadedAt: '2026-05-08', note: 'Verified against form details.' },
    ],
    note: 'All checks complete. Offer ready for parent collection.',
    timeline: [
      { title: 'Submitted by parent', detail: 'All required information received.', at: '2026-05-08' },
      { title: 'Admissions review complete', detail: 'Documents and learner profile fully verified.', at: '2026-05-14' },
      { title: 'Principal approved acceptance', detail: 'Offer letter queued for release.', at: '2026-05-17' },
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
    completion: 86,
    missingItems: ['Queue assignment', 'Document review'],
    documents: [
      { type: 'birth_cert', label: 'Birth Certificate', status: 'pending', uploadedAt: '2026-05-20', note: 'Awaiting reviewer check.' },
      { type: 'school_report', label: 'School Report', status: 'pending', uploadedAt: '2026-05-20', note: 'Awaiting reviewer check.' },
      { type: 'proof_residence', label: 'Proof of Residence', status: 'pending', uploadedAt: '2026-05-20', note: 'Awaiting reviewer check.' },
      { type: 'id_copy', label: 'Parent ID', status: 'pending', uploadedAt: '2026-05-20', note: 'Awaiting reviewer check.' },
    ],
    note: 'Fresh submission awaiting queue assignment.',
    timeline: [
      { title: 'Submitted by parent', detail: 'Initial application entered the admissions queue.', at: '2026-05-20' },
    ],
  },
];

export const previewStatusClasses: Record<PreviewStatus, string> = {
  draft: 'border border-slate-200 bg-slate-100 text-slate-700',
  submitted: 'border border-sky-200 bg-sky-50 text-sky-700',
  under_review: 'border border-amber-200 bg-amber-50 text-amber-700',
  incomplete: 'border border-rose-200 bg-rose-50 text-rose-700',
  accepted: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  rejected: 'border border-neutral-200 bg-neutral-100 text-neutral-700',
};

export const previewDocumentClasses = {
  verified: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  pending: 'border border-amber-200 bg-amber-50 text-amber-700',
  missing: 'border border-rose-200 bg-rose-50 text-rose-700',
};
