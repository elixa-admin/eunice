'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from '@/lib/domain/applications';
import {
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_VALIDATION_LABELS,
  isDocumentStateBlocking,
  isDocumentStateReviewOnly,
  type DocumentType,
  type DocumentValidationState,
} from '@/lib/documents/contracts';
import {
  getApplicationDocumentRequirements,
  getRequiredDocumentTypes,
  type ApplicationDocumentRequirement,
} from '@/lib/domain/application-requirements';
import { getTenantConfig } from '@/lib/domain/tenant-config';


interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  school_id: string | null;
}

interface Application {
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

type DocumentRecord = {
  application_id: string;
  document_type: DocumentType;
  upload_status: DocumentValidationState;
};

type DocumentSummary = {
  totalRequired: number;
  missingRequired: number;
  blocking: number;
  reviewOnly: number;
  verified: number;
};

type TriageLane = 'blocked' | 'review_ready' | 'in_review' | 'decision_pending' | 'closed' | 'incomplete';
type QueueFilter = 'all' | `triage:${TriageLane}` | 'missing_docs' | 'recent_submitted' | 'awaiting_parent' | ApplicationStatus;

const ADMIN_REQUIRED_DOCUMENT_TYPES = getRequiredDocumentTypes();
const ADMIN_DOCUMENT_REQUIREMENTS = getApplicationDocumentRequirements();
const ADMIN_DOCUMENT_CATEGORY_ORDER: ApplicationDocumentRequirement['category'][] = [
  'identity',
  'school',
  'family',
  'medical',
  'financial',
  'legal',
  'supporting',
];
const ADMIN_DOCUMENT_CATEGORY_LABELS: Record<ApplicationDocumentRequirement['category'], string> = {
  identity: 'Identity',
  school: 'School',
  family: 'Family',
  medical: 'Medical',
  financial: 'Financial',
  legal: 'Legal',
  supporting: 'Supporting',
};

const TRIAGE_LANE_LABELS: Record<TriageLane, string> = {
  blocked: 'Blocked',
  review_ready: 'Review ready',
  in_review: 'In review',
  decision_pending: 'Decision pending',
  closed: 'Closed',
  incomplete: 'Incomplete',
};

const TRIAGE_LANE_PRIORITY: Record<TriageLane, number> = {
  blocked: 0,
  review_ready: 1,
  in_review: 2,
  decision_pending: 3,
  incomplete: 4,
  closed: 5,
};

const TRIAGE_FILTERS: TriageLane[] = ['blocked', 'review_ready', 'in_review', 'decision_pending'];

function MiniSparkline({ values }: { values: number[] }) {
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

function summarizeDocumentsForApp(applicationId: string, docs: DocumentRecord[]): DocumentSummary {
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

function getTriageLane(app: Application): TriageLane {
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

function getAdminQueueTone(status: ApplicationStatus) {
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

function getNextActionLabel(app: Application) {
  const lane = getTriageLane(app);
  if (lane === 'blocked') return 'Parent follow-up';
  if (lane === 'review_ready') return 'Review documents';
  if (lane === 'in_review') return 'Continue review';
  if (lane === 'decision_pending') return 'Resolve decision';
  if (lane === 'closed') return 'Archive / notify';
  return 'Needs intake completion';
}

function getDocumentStatusTone(status: DocumentValidationState) {
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

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const tenantConfig = getTenantConfig(profile?.school_id);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  // Master-Detail Triage States
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [flaggingDocId, setFlaggingDocId] = useState<string | null>(null);
  const [reuploadReason, setReuploadReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<QueueFilter>('all');
  const [notesLoading, setNotesLoading] = useState(false);
  const [docsLoading, setDocsLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Operational Analytics calculations
  const totalUploaded = applications.reduce((acc, app) => acc + app.documentSummary.verified, 0);
  const totalRequiredDocs = applications.reduce((acc, app) => acc + app.documentSummary.totalRequired, 0);
  const dossierAccuracy = totalRequiredDocs > 0 ? Math.round((totalUploaded / totalRequiredDocs) * 100) : 0;

  useEffect(() => {
    async function loadAdminData() {
      try {
        // 1. Get authenticated user
        const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
        if (userError || !authUser) {
          router.push('/auth/signin');
          return;
        }
        setUser(authUser);

        // 2. Load profile to verify admin role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role, school_id')
          .eq('id', authUser.id)
          .single();

        if (profileError) throw profileError;
        if (profileData.role !== 'admin' && profileData.role !== 'superadmin') {
          console.warn('Unauthorized access to admin dashboard, redirecting to parent portal');
          router.push('/parent');
          return;
        }
        setProfile(profileData);

        // 3. Load all applications for the admin's school
        const defaultSchoolId = profileData.school_id || '00000000-0000-0000-0000-000000000000';

        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select(`
            id,
            reference_number,
            learner_first_name,
            learner_last_name,
            grade_applying_for,
            previous_school_name,
            status,
            created_at,
            parent_id
          `)
          .eq('school_id', defaultSchoolId)
          .order('created_at', { ascending: false });

        if (appsError) throw appsError;

        if (appsData && appsData.length > 0) {
          // Fetch parent profiles for these applications in a single query
          const parentIds = Array.from(new Set(appsData.map(app => app.parent_id)));
          const { data: parentsData, error: parentsError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, phone_number')
            .in('id', parentIds);

          if (parentsError) throw parentsError;

          const appIds = appsData.map((app) => app.id);
          const { data: documentsData, error: documentsError } = await supabase
            .from('documents')
            .select('application_id, document_type, upload_status')
            .in('application_id', appIds);

          if (documentsError) throw documentsError;

          const parentsMap = new Map(parentsData?.map(p => [p.id, p]));
          const documentRecords = (documentsData ?? []) as DocumentRecord[];

          const enrichedApps: Application[] = appsData.map(app => {
            const parentProfile = parentsMap.get(app.parent_id);
            return {
              id: app.id,
              reference_number: app.reference_number,
              learner_first_name: app.learner_first_name,
              learner_last_name: app.learner_last_name,
              grade_applying_for: app.grade_applying_for,
              previous_school_name: app.previous_school_name,
              status: app.status as ApplicationStatus,
              created_at: app.created_at,
              parent: parentProfile ? {
                first_name: parentProfile.first_name,
                last_name: parentProfile.last_name,
                phone_number: parentProfile.phone_number
              } : null,
              documentSummary: summarizeDocumentsForApp(app.id, documentRecords),
            };
          });

          setApplications(enrichedApps);
        } else {
          setApplications([]);
        }
      } catch (error: unknown) {
        console.error('Error loading admin dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, [router]);

  // Load documents and notes for selected application
  const handleSelectApplication = async (app: Application) => {
    setSelectedAppId(app.id);
    setSelectedApp(app);
    setNotes([]);
    setDocuments([]);
    setNotesLoading(true);
    setDocsLoading(true);
    setFlaggingDocId(null);
    setReuploadReason('');

    try {
      // 1. Fetch associated documents
      const { data: docsData, error: docsErr } = await supabase
        .from('documents')
        .select('*')
        .eq('application_id', app.id);
      
      if (docsErr) throw docsErr;
      setDocuments(docsData || []);

      // 2. Fetch admin notes
      const { data: notesData, error: notesErr } = await supabase
        .from('admin_notes')
        .select(`
          id,
          note_text,
          created_at,
          admin_id,
          profiles (
            first_name,
            last_name
          )
        `)
        .eq('application_id', app.id)
        .order('created_at', { ascending: false });

      if (notesErr) throw notesErr;
      setNotes(notesData || []);
    } catch (err) {
      console.error('Error loading application details:', err);
    } finally {
      setNotesLoading(false);
      setDocsLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: string, newStatus: ApplicationStatus) => {
    setActioningId(appId);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', appId);

      if (error) throw error;

      // Update state locally
      setApplications(prev =>
        prev.map(app => (app.id === appId ? { ...app, status: newStatus } : app))
      );
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch {
      alert('Failed to update application status.');
    } finally {
      setActioningId(null);
    }
  };

  const syncSelectedDocumentSummary = (nextDocuments: any[]) => {
    if (!selectedAppId) return null;

    const documentRecords = nextDocuments.map((doc) => ({
      application_id: doc.application_id || selectedAppId,
      document_type: doc.document_type as DocumentType,
      upload_status: doc.upload_status as DocumentValidationState,
    }));
    const documentSummary = summarizeDocumentsForApp(selectedAppId, documentRecords);

    setApplications(prev =>
      prev.map(app => (app.id === selectedAppId ? { ...app, documentSummary } : app))
    );
    if (selectedApp) {
      setSelectedApp({ ...selectedApp, documentSummary });
    }

    return documentSummary;
  };

  // Add internal admin note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedAppId || !user) return;

    try {
      const { data, error } = await supabase
        .from('admin_notes')
        .insert({
          application_id: selectedAppId,
          admin_id: user.id,
          note_text: newNote.trim(),
        })
        .select(`
          id,
          note_text,
          created_at,
          admin_id,
          profiles (
            first_name,
            last_name
          )
        `)
        .single();

      if (error) throw error;

      if (data) {
        setNotes(prev => [data, ...prev]);
        setNewNote('');
      }
    } catch (err) {
      console.error('Error adding admin note:', err);
      alert('Failed to add note.');
    }
  };

  // Document verification actions
  const handleVerifyDoc = async (docId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          upload_status: 'verified',
          review_notes: 'Document verified by admissions.',
          verified_at: new Date().toISOString()
        })
        .eq('id', docId);

      if (error) throw error;

      // Update state locally
      const nextDocuments = documents.map(doc =>
        doc.id === docId
          ? {
              ...doc,
              upload_status: 'verified',
              review_notes: 'Document verified by admissions.',
              verified_at: new Date().toISOString()
            }
          : doc
      );
      setDocuments(nextDocuments);
      syncSelectedDocumentSummary(nextDocuments);
    } catch (err) {
      console.error('Error verifying document:', err);
      alert('Failed to verify document.');
    }
  };

  const handleFlagDoc = async (docId: string) => {
    if (!reuploadReason.trim()) {
      alert('Please provide a reason for requesting a re-upload.');
      return;
    }

    try {
      // 1. Update the document status to needs_reupload
      const { error: docErr } = await supabase
        .from('documents')
        .update({
          upload_status: 'needs_reupload',
          review_notes: reuploadReason.trim(),
        })
        .eq('id', docId);

      if (docErr) throw docErr;

      // 2. Automatically change the overall application status to awaiting_documents
      const { error: appErr } = await supabase
        .from('applications')
        .update({
          status: 'awaiting_documents',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedAppId);

      if (appErr) throw appErr;

      // Update local documents list
      const nextDocuments = documents.map(doc =>
        doc.id === docId
          ? {
              ...doc,
              upload_status: 'needs_reupload',
              review_notes: reuploadReason.trim()
            }
          : doc
      );
      setDocuments(nextDocuments);
      const documentSummary = syncSelectedDocumentSummary(nextDocuments);

      // Update local applications state
      setApplications(prev =>
        prev.map(app =>
          app.id === selectedAppId ? { ...app, status: 'awaiting_documents' } : app
        )
      );
      if (selectedApp) {
        setSelectedApp({
          ...selectedApp,
          status: 'awaiting_documents',
          documentSummary: documentSummary ?? selectedApp.documentSummary,
        });
      }

      setFlaggingDocId(null);
      setReuploadReason('');
    } catch (err) {
      console.error('Error flagging document:', err);
      alert('Failed to flag document.');
    }
  };

  const handlePreviewFile = (doc: any) => {
    setPreviewDoc(doc);
    if (doc.file_path.startsWith('preview/')) {
      if (doc.document_type === 'birth_cert') {
        // Mock a PDF document preview for birth certificate
        setPreviewUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
      } else {
        setPreviewUrl('https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1000');
      }
    } else {
      const { data } = supabase.storage.from('documents').getPublicUrl(doc.file_path);
      if (data?.publicUrl) {
        setPreviewUrl(data.publicUrl);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Filter application list
  const filteredApplications = applications
    .filter((app) => {
      const matchesSearch =
        `${app.learner_first_name} ${app.learner_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.parent && `${app.parent.first_name} ${app.parent.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        app.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.previous_school_name && app.previous_school_name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter.startsWith('triage:') && (getTriageLane(app) === statusFilter.replace('triage:', '') as TriageLane)) ||
        (statusFilter === 'missing_docs' && (app.documentSummary.missingRequired > 0 || app.documentSummary.blocking > 0)) ||
        (statusFilter === 'recent_submitted' && Date.now() - new Date(app.created_at).getTime() <= 1000 * 60 * 60 * 24 * 2) ||
        (statusFilter === 'awaiting_parent' && app.status === 'awaiting_documents') ||
        app.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const laneDelta = TRIAGE_LANE_PRIORITY[getTriageLane(a)] - TRIAGE_LANE_PRIORITY[getTriageLane(b)];
      if (laneDelta !== 0) return laneDelta;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // Calculate statistics
  const total = applications.length;
  const activeQueue = applications.filter(app => app.status !== 'accepted' && app.status !== 'rejected').length;
  const missingDocuments = applications.filter(app => getTriageLane(app) === 'blocked').length;
  const readyForReview = applications.filter(app => getTriageLane(app) === 'review_ready').length;
  const accepted = applications.filter(app => app.status === 'accepted').length;
  const reviewedOrClosed = applications.filter(app => app.status === 'accepted' || app.status === 'rejected').length;
  const reviewReadyRate = total > 0 ? Math.round((readyForReview / total) * 100) : 0;
  const blockedRate = total > 0 ? Math.round((missingDocuments / total) * 100) : 0;
  const completedRate = total > 0 ? Math.round((reviewedOrClosed / total) * 100) : 0;
  const activeApplications = applications.filter((app) => app.status !== 'accepted' && app.status !== 'rejected');
  const averageAgeDays = activeApplications.length > 0
    ? (activeApplications.reduce((sum, app) => sum + ((Date.now() - new Date(app.created_at).getTime()) / (1000 * 60 * 60 * 24)), 0) / activeApplications.length).toFixed(1)
    : '0.0';
  const workloadSpark = [
    applications.filter((app) => getTriageLane(app) === 'blocked').length,
    applications.filter((app) => getTriageLane(app) === 'review_ready').length,
    applications.filter((app) => getTriageLane(app) === 'in_review').length,
    applications.filter((app) => getTriageLane(app) === 'decision_pending').length,
    applications.filter((app) => getTriageLane(app) === 'closed').length,
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <span className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02130B] text-slate-100 selection:bg-amber-500 selection:text-emerald-950 font-sans antialiased px-4 py-10 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_top_left,rgba(5,46,22,0.32),transparent_45%),radial-gradient(circle_at_top_right,rgba(212,175,55,0.08),transparent_40%)]">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="overflow-hidden rounded-[2.5rem] border border-emerald-500/10 bg-emerald-950/20 shadow-[0_24px_72px_-16px_rgba(6,46,28,0.3)] backdrop-blur-md">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border-b border-emerald-500/10 bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-emerald-950/80 px-6 py-6 text-white lg:border-b-0 lg:border-r lg:border-emerald-500/10 sm:px-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
                Admissions Command Center
              </div>
              <h1 className="display-serif mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
                Admissions triage with fewer clicks and clearer next steps
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-100/70">
                Logged in as <span className="font-semibold text-amber-300">{profile?.first_name} {profile?.last_name}</span> · {tenantConfig.name}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleSignOut}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-emerald-950 transition hover:bg-amber-400 shadow-[0_0_15px_rgba(202,138,4,0.35)]"
                >
                  Sign Out
                </button>
                <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-950/50 px-4 py-2 text-xs font-semibold text-emerald-300">
                  School tenant
                </div>
              </div>
            </div>

            <div className="grid gap-0">
              <div className="grid grid-cols-2 gap-0 border-b border-emerald-500/10">
                <div className="border-r border-emerald-500/10 bg-emerald-950/20 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">Active Queue</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{activeQueue}</p>
                  <p className="mt-1 text-[11px] leading-5 text-emerald-500/60">Open applications only</p>
                </div>
                <div className="bg-emerald-900/20 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">Review Ready</p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-400">{readyForReview}</p>
                  <p className="mt-1 text-[11px] leading-5 text-emerald-500/60">Ready to triage now</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-0">
                <div className="border-r border-emerald-500/10 bg-rose-950/20 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Missing Docs</p>
                  <p className="mt-2 text-3xl font-semibold text-rose-400">{missingDocuments}</p>
                  <p className="mt-1 text-[11px] leading-5 text-rose-500/60">Needs parent action</p>
                </div>
                <div className="bg-emerald-900/20 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">Accepted</p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-400">{accepted}</p>
                  <p className="mt-1 text-[11px] leading-5 text-emerald-500/60">Finalized outcomes</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-amber-500/20 bg-emerald-950/20 p-5 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-amber-500/10 p-3 text-amber-300">
                  <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">Triage speed</p>
                  <p className="text-xl font-bold text-white mt-0.5 font-sans">{averageAgeDays} days avg.</p>
                  <p className="text-[10px] text-emerald-500/60 mt-0.5">Average age of active cases</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-300">
                  <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">Ready to review</p>
                  <p className="text-xl font-bold text-emerald-400 mt-0.5 font-sans">{reviewReadyRate}%</p>
                  <p className="text-[10px] text-emerald-500/60 mt-0.5">{readyForReview} applications</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-rose-500/20 bg-emerald-950/20 p-5 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-rose-500/10 p-3 text-rose-400">
                  <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Blocked</p>
                  <p className="text-xl font-bold text-rose-300 mt-0.5 font-sans">{blockedRate}%</p>
                  <p className="text-[10px] text-rose-500/60 mt-0.5">{missingDocuments} need action</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-300">
                  <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">Completed</p>
                  <p className="text-xl font-bold text-white mt-0.5 font-sans">{completedRate}%</p>
                  <p className="text-[10px] text-emerald-500/60 mt-0.5">{accepted} accepted</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/10 bg-emerald-950/20 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70">Quick views</p>
                <h3 className="mt-1 text-base font-semibold text-white">What needs attention now</h3>
              </div>
              <div className="rounded-full border border-emerald-500/20 bg-emerald-950/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                Live queue
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Fast lane</p>
                <div className="mt-2 text-lg font-semibold text-white">{readyForReview} ready</div>
                <p className="mt-1 text-sm leading-6 text-slate-300">Review these first to keep turnaround short.</p>
                <p className="mt-2 text-[11px] font-medium text-emerald-300/80">Document accuracy {dossierAccuracy}%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Parent action</p>
                <div className="mt-2 text-lg font-semibold text-white">{missingDocuments} blocked</div>
                <p className="mt-1 text-sm leading-6 text-slate-300">These need a re-upload or missing document.</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Workload trend</p>
                  <p className="mt-1 text-sm font-semibold text-white">Current queue shape</p>
                </div>
                <div className="text-xs text-slate-300">Snapshot</div>
              </div>
              <div className="mt-3">
                <MiniSparkline values={workloadSpark} />
              </div>
            </div>
          </div>
        </section>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-[340px_1fr]">
          
          {/* Left Panel - Queue list */}
          <aside className="flex max-h-[820px] flex-col gap-4 rounded-[2rem] border border-emerald-500/10 bg-emerald-950/20 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
            <div>
              <h2 className="text-lg font-semibold text-white">Admissions Queue</h2>
              <p className="mt-0.5 text-xs text-emerald-400/60">Search, filter, then jump straight to the next action</p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search name, grade, ref..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-emerald-500/20 bg-emerald-950/40 px-4 py-3 text-sm text-white placeholder:text-emerald-600/60 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Filter pills */}
            <div className="flex max-h-[140px] flex-wrap gap-1.5 overflow-y-auto pr-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-amber-500 border-amber-500 text-emerald-950 font-bold shadow-[0_0_12px_rgba(202,138,4,0.3)]'
                    : 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300 hover:bg-emerald-900/40 hover:text-white'
                }`}
              >
                All
              </button>
              {TRIAGE_FILTERS.map((lane) => (
                <button
                  key={lane}
                  onClick={() => setStatusFilter(`triage:${lane}`)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    statusFilter === `triage:${lane}`
                    ? 'bg-amber-500 border-amber-500 text-emerald-950 font-bold shadow-[0_0_12px_rgba(202,138,4,0.3)]'
                    : 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300 hover:bg-emerald-900/40 hover:text-white'
                  }`}
                >
                  {TRIAGE_LANE_LABELS[lane]}
                </button>
              ))}
              <button
                onClick={() => setStatusFilter('missing_docs')}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  statusFilter === 'missing_docs'
                    ? 'bg-amber-500 border-amber-500 text-emerald-950 font-bold shadow-[0_0_12px_rgba(202,138,4,0.3)]'
                    : 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300 hover:bg-emerald-900/40 hover:text-white'
                }`}
              >
                Missing documents
              </button>
              <button
                onClick={() => setStatusFilter('recent_submitted')}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  statusFilter === 'recent_submitted'
                    ? 'bg-amber-500 border-amber-500 text-emerald-950 font-bold shadow-[0_0_12px_rgba(202,138,4,0.3)]'
                    : 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300 hover:bg-emerald-900/40 hover:text-white'
                }`}
              >
                Recent submissions
              </button>
              <button
                onClick={() => setStatusFilter('awaiting_parent')}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  statusFilter === 'awaiting_parent'
                    ? 'bg-amber-500 border-amber-500 text-emerald-950 font-bold shadow-[0_0_12px_rgba(202,138,4,0.3)]'
                    : 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300 hover:bg-emerald-900/40 hover:text-white'
                }`}
              >
                Awaiting parent action
              </button>
              {(['submitted', 'under_review', 'awaiting_documents', 'decision_pending', 'accepted', 'rejected'] as ApplicationStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    statusFilter === status
                    ? 'bg-amber-500 border-amber-500 text-emerald-950 font-bold shadow-[0_0_12px_rgba(202,138,4,0.3)]'
                    : 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300 hover:bg-emerald-900/40 hover:text-white'
                  }`}
                >
                  {APPLICATION_STATUS_LABELS[status]}
                </button>
              ))}
            </div>

            {/* Applicants List cards */}
            <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[520px] pr-1">
              {filteredApplications.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">
                  No applicants matching criteria.
                </div>
              ) : (
                filteredApplications.map((app) => {
                  const isSelected = app.id === selectedAppId;
                  return (
                    <button
                      key={app.id}
                      onClick={() => handleSelectApplication(app)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                        ? 'bg-gradient-to-r from-emerald-900/50 to-emerald-950/50 border-amber-500 shadow-[0_0_20px_rgba(202,138,4,0.15)] text-white'
                        : 'bg-emerald-950/10 border-emerald-500/10 hover:border-emerald-500/30 hover:bg-emerald-950/30 text-slate-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-mono tracking-wider text-emerald-500/70 uppercase">
                          {app.reference_number}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                          getAdminQueueTone(app.status)
                        }`}>
                          {APPLICATION_STATUS_LABELS[app.status]}
                        </span>
                      </div>
                      <h3 className="mt-1 text-sm font-semibold text-white">
                        {app.learner_first_name} {app.learner_last_name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-300">{app.grade_applying_for} · {getNextActionLabel(app)}</p>

                      {/* Operational Progress Heatmap Track */}
                      <div className="mt-2.5 flex items-center gap-1">
                        {Array.from({ length: app.documentSummary.totalRequired }).map((_, idx) => {
                          let barColor = 'bg-white/5';
                          let glowStyle = '';
                          if (idx < app.documentSummary.verified) {
                            barColor = 'bg-emerald-400';
                            glowStyle = 'shadow-[0_0_6px_rgba(52,211,153,0.6)]';
                          } else if (idx < app.documentSummary.verified + app.documentSummary.reviewOnly) {
                            barColor = 'bg-amber-400 animate-pulse';
                            glowStyle = 'shadow-[0_0_6px_rgba(251,191,36,0.6)]';
                          } else if (app.documentSummary.blocking > 0 && idx === app.documentSummary.verified + app.documentSummary.reviewOnly) {
                            barColor = 'bg-rose-500';
                            glowStyle = 'shadow-[0_0_6px_rgba(244,63,94,0.6)]';
                          }
                          return (
                            <div
                              key={idx}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${barColor} ${glowStyle}`}
                            />
                          );
                        })}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full border border-emerald-500/10 bg-emerald-950/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                          {TRIAGE_LANE_LABELS[getTriageLane(app)]}
                        </span>
                        <span className="rounded-full border border-emerald-500/10 bg-emerald-950/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                          Docs {app.documentSummary.verified}/{app.documentSummary.totalRequired}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-3 border-t border-white/5 pt-2">
                        <span className="text-[10px] text-slate-400">
                          Parent: {app.parent ? `${app.parent.first_name} ${app.parent.last_name}` : 'Unknown'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Right Panel - Detail Triage Workspace */}
          <main className="flex min-h-[600px] flex-col gap-6">
            {!selectedApp ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center rounded-[2rem] border border-emerald-500/10 bg-emerald-950/20 p-12 text-center text-slate-400 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-950/30 text-amber-300">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Admissions Workspace</h3>
                <p className="mt-2 text-sm max-w-sm text-emerald-500/60">
                  Select an applicant card from the queue on the left to review documentation, verify uploads, write notes, and decide outcomes.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Header card with status changer */}
                <div className="space-y-4 rounded-[2rem] border border-emerald-500/10 bg-emerald-950/20 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-300">
                        {selectedApp.reference_number}
                      </span>
                      <h2 className="mt-2 text-2xl font-bold text-white">
                        {selectedApp.learner_first_name} {selectedApp.learner_last_name}
                      </h2>
                      <p className="mt-1 text-xs text-emerald-400/70">
                        Next action: <span className="font-semibold text-amber-300">{getNextActionLabel(selectedApp)}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-500/60">Current:</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                        getAdminQueueTone(selectedApp.status)
                      }`}>
                        {APPLICATION_STATUS_LABELS[selectedApp.status]}
                      </span>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="mt-2 flex flex-col justify-between gap-3 border-t border-emerald-500/10 pt-4 md:flex-row md:items-center">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-emerald-500/70">
                        Transition Status:
                      </span>
                      {actioningId === selectedApp.id ? (
                        <span className="inline-block w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={actioningId === selectedApp.id}
                            onClick={() => handleUpdateStatus(selectedApp.id, 'under_review')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
                              selectedApp.status === 'under_review'
                                ? 'bg-amber-500 border-amber-500 text-emerald-950 font-bold shadow-[0_0_12px_rgba(202,138,4,0.3)]'
                                : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20 hover:bg-emerald-900/40 hover:text-white'
                            }`}
                          >
                            Under Review
                          </button>
                          <button
                            type="button"
                            disabled={actioningId === selectedApp.id}
                            onClick={() => handleUpdateStatus(selectedApp.id, 'decision_pending')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
                              selectedApp.status === 'decision_pending'
                                ? 'bg-fuchsia-500 border-fuchsia-500 text-white font-bold shadow-[0_0_12px_rgba(217,70,239,0.3)]'
                                : 'bg-emerald-950/40 text-fuchsia-300 border-emerald-500/20 hover:bg-emerald-900/40 hover:text-white'
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            type="button"
                            disabled={actioningId === selectedApp.id}
                            onClick={() => handleUpdateStatus(selectedApp.id, 'accepted')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
                              selectedApp.status === 'accepted'
                                ? 'bg-emerald-500 border-emerald-500 text-emerald-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                                : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20 hover:bg-emerald-900/40 hover:text-white'
                            }`}
                          >
                            Accept Applicant
                          </button>
                          <button
                            type="button"
                            disabled={actioningId === selectedApp.id}
                            onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
                              selectedApp.status === 'rejected'
                                ? 'bg-rose-500 border-rose-500 text-white font-bold shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                                : 'bg-emerald-950/40 text-rose-300 border-emerald-500/20 hover:bg-emerald-900/40 hover:text-white'
                            }`}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Learner Info Grid */}
                <div className="glass p-6 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 bg-emerald-950/10">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 border-b border-emerald-500/10 pb-2 mb-3">
                      Learner & School Context
                    </h3>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/40">Full Name</span>
                        <span className="font-medium text-white">{selectedApp.learner_first_name} {selectedApp.learner_last_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Grade Applying For</span>
                        <span className="font-medium text-white">{selectedApp.grade_applying_for}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Previous School</span>
                        <span className="font-medium text-white">{selectedApp.previous_school_name || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Intake Year</span>
                        <span className="font-medium text-white font-mono">2026</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 border-b border-emerald-500/10 pb-2 mb-3">
                      Parent / Guardian Info
                    </h3>
                    {selectedApp.parent ? (
                      <div className="space-y-2.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/40">First Name</span>
                          <span className="font-medium text-white">{selectedApp.parent.first_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Last Name</span>
                          <span className="font-medium text-white">{selectedApp.parent.last_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Phone Number</span>
                          <a
                            href={`tel:${selectedApp.parent.phone_number}`}
                            className="font-medium text-amber-300 hover:underline transition-all"
                          >
                            {selectedApp.parent.phone_number || 'Not provided'}
                          </a>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Email Link</span>
                          <a
                            href={`mailto:${selectedApp.parent.first_name.toLowerCase()}.${selectedApp.parent.last_name.toLowerCase()}@example.com`}
                            className="font-medium text-amber-300 hover:underline transition-all"
                          >
                            {selectedApp.parent.first_name.toLowerCase()}.{selectedApp.parent.last_name.toLowerCase()}@example.com
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-white/50 py-4 text-center">
                        Parent profile details not loaded correctly.
                      </div>
                    )}
                  </div>
                </div>

                {/* Authoritative Document Triage */}
                <div className="glass p-6 rounded-3xl border border-white/10 space-y-4 bg-emerald-950/10">
                  <div>
                    <h3 className="text-lg font-bold text-white">Authoritative Document Queue</h3>
                    <p className="text-xs text-emerald-400/60 mt-0.5">
                      Verify each uploaded file or flag them to request parents re-upload.
                    </p>
                  </div>

                  {docsLoading ? (
                    <div className="text-center py-6">
                      <span className="inline-block w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {ADMIN_DOCUMENT_CATEGORY_ORDER.map((category) => {
                        const categoryRequirements = ADMIN_DOCUMENT_REQUIREMENTS.filter((requirement) => requirement.category === category);

                        if (categoryRequirements.length === 0) return null;

                        return (
                          <div key={category} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                                {ADMIN_DOCUMENT_CATEGORY_LABELS[category]}
                              </h4>
                              <span className="text-[10px] rounded-full border border-emerald-500/10 bg-emerald-950/50 px-2 py-0.5 text-emerald-300">
                                {categoryRequirements.length} items
                              </span>
                            </div>

                            <div className="space-y-3.5">
                              {categoryRequirements.map((requirement) => {
                                const doc = documents.find((d) => d.document_type === requirement.documentType);

                                return (
                                  <div key={requirement.id} className="bg-emerald-950/30 border border-emerald-500/10 rounded-2xl p-4 space-y-3.5">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                      <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <h5 className="text-sm font-semibold text-white">
                                            {DOCUMENT_TYPE_LABELS[requirement.documentType]}
                                          </h5>
                                          <span className="text-[10px] bg-emerald-950/50 text-emerald-300 border border-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            {ADMIN_DOCUMENT_CATEGORY_LABELS[requirement.category]}
                                          </span>
                                          <span className="text-[10px] bg-emerald-950/50 text-emerald-300 border border-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            {requirement.required ? 'Required' : 'Conditional'}
                                          </span>
                                        </div>
                                        <p className="mt-1 text-xs text-slate-300 max-w-2xl">{requirement.reason}</p>

                                        {doc ? (
                                          <div className="mt-2 text-xs text-slate-300 space-y-1">
                                            <p className="truncate font-medium text-amber-300/80">File: {doc.file_name}</p>
                                            <p className="text-[10px] text-slate-400">
                                              Uploaded: {new Date(doc.uploaded_at).toLocaleString()} · Size: {Math.round(doc.file_size / 1024)} KB
                                            </p>
                                            {doc.review_notes && (
                                              <p className="bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px] p-2 rounded-xl mt-2 max-w-xl">
                                                <span className="font-semibold">Review note:</span> {doc.review_notes}
                                              </p>
                                            )}
                                          </div>
                                        ) : (
                                          <p className="text-xs text-slate-400 mt-2">This document has not been uploaded by the parent yet.</p>
                                        )}
                                      </div>

                                      <div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                          getDocumentStatusTone(doc ? doc.upload_status : 'missing')
                                        }`}>
                                          {doc ? DOCUMENT_VALIDATION_LABELS[doc.upload_status as DocumentValidationState] : 'Missing'}
                                        </span>
                                      </div>
                                    </div>

                                    {doc && (
                                      <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-500/10">
                                        <button
                                          onClick={() => handlePreviewFile(doc)}
                                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white border border-white/5 transition-all cursor-pointer"
                                        >
                                          Preview File
                                        </button>

                                        {doc.upload_status !== 'verified' && (
                                          <button
                                            onClick={() => handleVerifyDoc(doc.id)}
                                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs border border-emerald-500/20 transition-all cursor-pointer font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                                          >
                                            Verify Document
                                          </button>
                                        )}

                                        {doc.upload_status !== 'needs_reupload' && flaggingDocId !== doc.id && (
                                          <button
                                            onClick={() => {
                                              setFlaggingDocId(doc.id);
                                              setReuploadReason('');
                                            }}
                                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs border border-amber-500/20 transition-all cursor-pointer"
                                          >
                                            Request Re-upload
                                          </button>
                                        )}
                                      </div>
                                    )}

                                    {flaggingDocId === (doc ? doc.id : null) && (
                                      <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl space-y-3 mt-3">
                                        <div>
                                          <label className="block text-xs font-semibold text-amber-200 uppercase tracking-wider mb-1">
                                            Why does this document need to be re-uploaded?
                                          </label>
                                          <textarea
                                            value={reuploadReason}
                                            onChange={(e) => setReuploadReason(e.target.value)}
                                            placeholder="Explain clearly to the parent (e.g. 'The image of your birth certificate is blurry and the text cannot be read.')"
                                            className="w-full bg-slate-950 border border-amber-500/30 rounded-xl p-3 text-xs text-white placeholder-white/35 focus:outline-none focus:border-amber-400 min-h-[70px]"
                                          />
                                        </div>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => handleFlagDoc(doc.id)}
                                            className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                                          >
                                            Send Request
                                          </button>
                                          <button
                                            onClick={() => {
                                              setFlaggingDocId(null);
                                              setReuploadReason('');
                                            }}
                                            className="bg-white/10 hover:bg-white/15 text-white px-3 py-1.5 rounded-lg text-xs border border-white/5 transition-all cursor-pointer"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Internal Admin Notes Timeline */}
                <div className="glass p-6 rounded-3xl border border-white/10 space-y-5 bg-emerald-950/10">
                  <div>
                    <h3 className="text-lg font-bold text-white">Internal Admin Timeline</h3>
                    <p className="text-xs text-emerald-400/60 mt-0.5">
                      Internal collaboration and triage tracking (not visible to parents).
                    </p>
                  </div>

                  {/* Add note form */}
                  <form onSubmit={handleAddNote} className="space-y-3">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add an internal log or review note (e.g., 'Checked sibling links, confirmed space available.')"
                      className="w-full bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-4 text-sm text-white placeholder-emerald-600/40 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all min-h-[90px]"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newNote.trim()}
                        className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_12px_rgba(202,138,4,0.3)]"
                      >
                        Add Timeline Note
                      </button>
                    </div>
                  </form>

                  {/* Timeline notes list */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {notesLoading ? (
                      <div className="text-center py-4">
                        <span className="inline-block w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
                      </div>
                    ) : notes.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        No internal logs or review notes written yet.
                      </div>
                    ) : (
                      notes.map((note) => (
                        <div key={note.id} className="bg-emerald-950/30 border border-emerald-500/10 rounded-2xl p-4 space-y-2">
                          <p className="text-sm text-white leading-relaxed font-medium">
                            {note.note_text}
                          </p>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-emerald-500/10 pt-2 mt-1">
                            <span>
                              By: <span className="text-emerald-300 font-semibold">
                                {note.profiles ? `${note.profiles.first_name} ${note.profiles.last_name}` : 'Staff Reviewer'}
                              </span>
                            </span>
                            <span>
                              {new Date(note.created_at).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </main>

        </div>
      </div>

      {/* Premium Fullscreen Glassmorphism Lightbox Overlay */}
      {previewDoc && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-xl animate-fade-in">
          <div className="relative flex h-[90vh] w-[95vw] max-w-5xl flex-col rounded-[2.5rem] border border-white/10 bg-emerald-950/30 shadow-2xl backdrop-blur-2xl md:h-[85vh]">
            
            {/* Header info bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-amber-500 font-bold">
                  Document Preview Triage
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {DOCUMENT_TYPE_LABELS[previewDoc.document_type as DocumentType] || previewDoc.document_type}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold text-white border border-white/5 hover:bg-white/10 transition-all"
                >
                  Open in New Tab
                </a>
                <button
                  onClick={() => {
                    setPreviewDoc(null);
                    setPreviewUrl(null);
                  }}
                  className="rounded-xl bg-rose-500/20 p-2 text-rose-300 hover:bg-rose-500/30 transition-all border border-rose-500/20 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content previewer */}
            <div className="flex-1 bg-neutral-950/40 p-6 flex items-center justify-center overflow-hidden rounded-b-[2.5rem]">
              {previewUrl.endsWith('.pdf') || previewDoc.file_name?.toLowerCase().endsWith('.pdf') || previewDoc.document_type === 'birth_cert' ? (
                <iframe
                  src={`${previewUrl}#toolbar=0`}
                  className="h-full w-full rounded-2xl border border-white/5"
                  title="PDF Document Preview"
                />
              ) : (
                <div className="relative h-full w-full flex items-center justify-center overflow-auto max-h-[70vh]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Document preview"
                    className="max-h-full max-w-full rounded-xl object-contain shadow-lg border border-white/10"
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
