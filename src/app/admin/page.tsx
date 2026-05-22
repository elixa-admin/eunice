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

type TriageLane = 'missing_documents' | 'review_ready' | 'under_review' | 'decision_pending' | 'closed' | 'incomplete';

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
  missing_documents: 'Missing docs',
  review_ready: 'Review ready',
  under_review: 'Under review',
  decision_pending: 'Decision pending',
  closed: 'Closed',
  incomplete: 'Incomplete',
};

const TRIAGE_FILTERS: TriageLane[] = ['missing_documents', 'review_ready', 'under_review', 'decision_pending'];

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
    return 'missing_documents';
  }
  if (app.documentSummary.reviewOnly > 0) return 'review_ready';
  if (app.status === 'under_review') return 'under_review';
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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [notesLoading, setNotesLoading] = useState(false);
  const [docsLoading, setDocsLoading] = useState(false);

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
    if (doc.file_path.startsWith('preview/')) {
      // Mock file preview
      window.open('https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1000', '_blank');
    } else {
      const { data } = supabase.storage.from('documents').getPublicUrl(doc.file_path);
      if (data?.publicUrl) {
        window.open(data.publicUrl, '_blank');
      } else {
        alert('Could not resolve file preview link.');
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Filter application list
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      `${app.learner_first_name} ${app.learner_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.parent && `${app.parent.first_name} ${app.parent.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      app.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.previous_school_name && app.previous_school_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all'
      || (statusFilter.startsWith('triage:') && getTriageLane(app) === statusFilter.replace('triage:', ''))
      || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const total = applications.length;
  const activeQueue = applications.filter(app => app.status !== 'accepted' && app.status !== 'rejected').length;
  const missingDocuments = applications.filter(app => getTriageLane(app) === 'missing_documents').length;
  const readyForReview = applications.filter(app => getTriageLane(app) === 'review_ready').length;
  const accepted = applications.filter(app => app.status === 'accepted').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <span className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-primary-950 to-neutral-900 py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header strip */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass p-6 rounded-2xl border border-white/10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-primary-100 to-primary-300 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-primary-200 text-sm mt-1">
              Logged in as <span className="text-white font-semibold">{profile?.first_name} {profile?.last_name}</span> · Admissions Management Portal
            </p>
          </div>
          <div>
            <button
              onClick={handleSignOut}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm border border-white/10 w-full sm:w-auto cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="glass p-5 rounded-2xl border border-white/10 text-center">
            <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider">Total Apps</p>
            <p className="text-3xl font-bold mt-2 text-white">{total}</p>
          </div>
          <div className="glass p-5 rounded-2xl border border-white/10 text-center">
            <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider">Active Queue</p>
            <p className="text-3xl font-bold mt-2 text-amber-300">{activeQueue}</p>
          </div>
          <div className="glass p-5 rounded-2xl border border-white/10 text-center">
            <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider">Missing Docs</p>
            <p className="text-3xl font-bold mt-2 text-rose-300">{missingDocuments}</p>
          </div>
          <div className="glass p-5 rounded-2xl border border-white/10 text-center">
            <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider">Ready Review</p>
            <p className="text-3xl font-bold mt-2 text-sky-300">{readyForReview}</p>
          </div>
          <div className="glass p-5 rounded-2xl border border-white/10 text-center">
            <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider">Accepted</p>
            <p className="text-3xl font-bold mt-2 text-emerald-400">{accepted}</p>
          </div>
        </section>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          
          {/* Left Panel - Queue list */}
          <aside className="glass p-5 rounded-3xl border border-white/10 flex flex-col gap-4 max-h-[800px]">
            <div>
              <h2 className="text-lg font-semibold text-white">Admissions Queue</h2>
              <p className="text-xs text-primary-200 mt-0.5">Filter and select an applicant</p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search name, grade, ref..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary-500 transition-all"
              />
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white/20 border-white/30 text-white'
                    : 'bg-white/5 border-white/5 text-white/55 hover:bg-white/10 hover:border-white/10'
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
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/5 border-white/5 text-white/55 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  {TRIAGE_LANE_LABELS[lane]}
                </button>
              ))}
              {(['submitted', 'under_review', 'awaiting_documents', 'decision_pending', 'accepted', 'rejected'] as ApplicationStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/5 border-white/5 text-white/55 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  {APPLICATION_STATUS_LABELS[status]}
                </button>
              ))}
            </div>

            {/* Applicants List cards */}
            <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[500px] pr-1">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-10 text-primary-200 text-sm">
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
                          ? 'bg-primary-950/45 border-primary-500 shadow-md'
                          : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono tracking-wider text-primary-300 uppercase">
                          {app.reference_number}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                          getAdminQueueTone(app.status)
                        }`}>
                          {APPLICATION_STATUS_LABELS[app.status]}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white mt-1">
                        {app.learner_first_name} {app.learner_last_name}
                      </h3>
                      <p className="text-xs text-primary-200 mt-1">{app.grade_applying_for}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/55">
                          {TRIAGE_LANE_LABELS[getTriageLane(app)]}
                        </span>
                        <span className="rounded-full border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/55">
                          Docs {app.documentSummary.verified}/{app.documentSummary.totalRequired}
                        </span>
                        {app.documentSummary.blocking > 0 ? (
                          <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-200">
                            {app.documentSummary.blocking} blocking
                          </span>
                        ) : null}
                        {app.documentSummary.reviewOnly > 0 ? (
                          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
                            {app.documentSummary.reviewOnly} manual
                          </span>
                        ) : null}
                      </div>
                      <div className="flex justify-between items-center mt-3 border-t border-white/5 pt-2">
                        <span className="text-[10px] text-white/40">
                          Parent: {app.parent ? `${app.parent.first_name} ${app.parent.last_name}` : 'Unknown'}
                        </span>
                        <span className="text-[10px] text-white/30">
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
          <main className="min-h-[600px] flex flex-col gap-6">
            {!selectedApp ? (
              <div className="glass rounded-3xl border border-white/10 p-12 text-center text-primary-200 flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-16 h-16 rounded-full bg-primary-900/30 flex items-center justify-center text-primary-400 mb-4 border border-primary-500/20">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Admissions Workspace</h3>
                <p className="mt-2 text-sm max-w-sm">
                  Select an applicant card from the queue on the left to review documentation, verify uploads, write notes, and decide outcomes.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Header card with status changer */}
                <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono text-primary-300 bg-primary-950/60 border border-primary-800/30 px-3 py-1 rounded-full">
                        {selectedApp.reference_number}
                      </span>
                      <h2 className="text-2xl font-bold text-white mt-2">
                        {selectedApp.learner_first_name} {selectedApp.learner_last_name}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50">Current:</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                        getAdminQueueTone(selectedApp.status)
                      }`}>
                        {APPLICATION_STATUS_LABELS[selectedApp.status]}
                      </span>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between border-t border-white/10 pt-4 mt-2">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary-300 mr-2">
                        Transition Status:
                      </span>
                      {actioningId === selectedApp.id ? (
                        <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(selectedApp.id, 'under_review')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              selectedApp.status === 'under_review'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            Under Review
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(selectedApp.id, 'decision_pending')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              selectedApp.status === 'decision_pending'
                                ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30'
                                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(selectedApp.id, 'accepted')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              selectedApp.status === 'accepted'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold'
                                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            Accept Applicant
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              selectedApp.status === 'rejected'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
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
                <div className="glass p-6 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-300 border-b border-white/5 pb-2 mb-3">
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
                        <span className="font-medium text-white">2026</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-300 border-b border-white/5 pb-2 mb-3">
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
                            className="font-medium text-primary-300 hover:underline transition-all"
                          >
                            {selectedApp.parent.phone_number || 'Not provided'}
                          </a>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Email Link</span>
                          <a
                            href={`mailto:${selectedApp.parent.first_name.toLowerCase()}.${selectedApp.parent.last_name.toLowerCase()}@example.com`}
                            className="font-medium text-primary-300 hover:underline transition-all"
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
                <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Authoritative Document Queue</h3>
                    <p className="text-xs text-primary-200 mt-0.5">
                      Verify each uploaded file or flag them to request parents re-upload.
                    </p>
                  </div>

                  {docsLoading ? (
                    <div className="text-center py-6">
                      <span className="inline-block w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {ADMIN_DOCUMENT_CATEGORY_ORDER.map((category) => {
                        const categoryRequirements = ADMIN_DOCUMENT_REQUIREMENTS.filter((requirement) => requirement.category === category);

                        if (categoryRequirements.length === 0) return null;

                        return (
                          <div key={category} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-200">
                                {ADMIN_DOCUMENT_CATEGORY_LABELS[category]}
                              </h4>
                              <span className="text-[10px] rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-white/50">
                                {categoryRequirements.length} items
                              </span>
                            </div>

                            <div className="space-y-3.5">
                              {categoryRequirements.map((requirement) => {
                                const doc = documents.find((d) => d.document_type === requirement.documentType);

                                return (
                                  <div key={requirement.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3.5">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                      <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <h5 className="text-sm font-semibold text-white">
                                            {DOCUMENT_TYPE_LABELS[requirement.documentType]}
                                          </h5>
                                          <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            {ADMIN_DOCUMENT_CATEGORY_LABELS[requirement.category]}
                                          </span>
                                          <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            {requirement.required ? 'Required' : 'Conditional'}
                                          </span>
                                        </div>
                                        <p className="mt-1 text-xs text-white/50 max-w-2xl">{requirement.reason}</p>

                                        {doc ? (
                                          <div className="mt-2 text-xs text-white/60 space-y-1">
                                            <p className="truncate font-medium text-white/70">File: {doc.file_name}</p>
                                            <p className="text-[10px] text-white/40">
                                              Uploaded: {new Date(doc.uploaded_at).toLocaleString()} · Size: {Math.round(doc.file_size / 1024)} KB
                                            </p>
                                            {doc.review_notes && (
                                              <p className="bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px] p-2 rounded-xl mt-2 max-w-xl">
                                                <span className="font-semibold">Review note:</span> {doc.review_notes}
                                              </p>
                                            )}
                                          </div>
                                        ) : (
                                          <p className="text-xs text-white/40 mt-2">This document has not been uploaded by the parent yet.</p>
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
                                      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                                        <button
                                          onClick={() => handlePreviewFile(doc)}
                                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white border border-white/5 transition-all cursor-pointer"
                                        >
                                          Preview File
                                        </button>

                                        {doc.upload_status !== 'verified' && (
                                          <button
                                            onClick={() => handleVerifyDoc(doc.id)}
                                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs border border-emerald-500/20 transition-all cursor-pointer"
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
                                            className="w-full bg-neutral-900 border border-amber-500/30 rounded-xl p-3 text-xs text-white placeholder-white/35 focus:outline-none focus:border-amber-400 min-h-[70px]"
                                          />
                                        </div>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => handleFlagDoc(doc.id)}
                                            className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
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
                <div className="glass p-6 rounded-3xl border border-white/10 space-y-5">
                  <div>
                    <h3 className="text-lg font-bold text-white">Internal Admin Timeline</h3>
                    <p className="text-xs text-primary-200 mt-0.5">
                      Internal collaboration and triage tracking (not visible to parents).
                    </p>
                  </div>

                  {/* Add note form */}
                  <form onSubmit={handleAddNote} className="space-y-3">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add an internal log or review note (e.g., 'Checked sibling links, confirmed space available.')"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary-500 transition-all min-h-[90px]"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newNote.trim()}
                        className="bg-primary-900 hover:bg-primary-800 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Add Timeline Note
                      </button>
                    </div>
                  </form>

                  {/* Timeline notes list */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {notesLoading ? (
                      <div className="text-center py-4">
                        <span className="inline-block w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      </div>
                    ) : notes.length === 0 ? (
                      <div className="text-center py-6 text-white/30 text-xs">
                        No internal logs or review notes written yet.
                      </div>
                    ) : (
                      notes.map((note) => (
                        <div key={note.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2">
                          <p className="text-sm text-white/95 leading-relaxed font-medium">
                            {note.note_text}
                          </p>
                          <div className="flex justify-between items-center text-[10px] text-white/40 border-t border-white/5 pt-2 mt-1">
                            <span>
                              By: <span className="text-white/60 font-semibold">
                                {note.profiles ? `${note.profiles.first_name} ${note.profiles.last_name}` : 'Staff Reviewer'}
                              </span>
                            </span>
                            <span>
                              {new Date(note.created_at).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
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
    </div>
  );
}
