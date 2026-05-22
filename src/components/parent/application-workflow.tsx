'use client';

import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import supabase from '@/lib/supabase';
import {
  APPLICATION_STATUS_DESCRIPTIONS,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from '@/lib/domain/applications';
import {
  getApplicationDocumentRequirements,
  getReadinessChecklist,
  getRequiredDocumentTypes,
} from '@/lib/domain/application-requirements';
import {
  INTAKE_ROLE_LABELS,
  createDefaultIntakeRoleState,
  type IntakeRoleProfileField,
  type IntakeRoleState,
} from '@/lib/domain/intake-roles';
import {
  DOCUMENT_CONTRACTS,
  DOCUMENT_VALIDATION_LABELS,
  DOCUMENT_TYPE_LABELS,
  isDocumentStateBlocking,
  isDocumentStateReviewOnly,
  isDocumentStateSubmissionReady,
  type DocumentType,
  type DocumentValidationState,
} from '@/lib/documents/contracts';
import { uploadDocumentDraft } from '@/lib/documents/upload';

const STEP_KEYS = ['readiness', 'profile', 'documents', 'review'] as const;
type StepKey = (typeof STEP_KEYS)[number];

type DocumentDraft = {
  fileName: string;
  validationState: DocumentValidationState;
  message: string;
  storagePath: string | null;
  uploadedAt: string | null;
  uploadStatus: 'idle' | 'saved' | 'error';
};

type ApplicationDraft = {
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

type StepMeta = {
  title: string;
  eyebrow: string;
  description: string;
};

const STEP_META: Record<StepKey, StepMeta> = {
  readiness: {
    eyebrow: 'Step 1',
    title: 'Readiness and eligibility',
    description: 'Confirm you have the required documents and know what the full process needs.',
  },
  profile: {
    eyebrow: 'Step 2',
    title: 'Parent and learner profile',
    description: 'Capture parent contact, learner identity, and school context in one focused stage.',
  },
  documents: {
    eyebrow: 'Step 3',
    title: 'Document uploads',
    description: 'Upload required files with format checks and clear quality guidance.',
  },
  review: {
    eyebrow: 'Step 4',
    title: 'Review and submit',
    description: 'Confirm everything is complete before final submission.',
  },
};

const STORAGE_KEY = 'eunice-parent-application-draft-v1';
const READINESS_KEY = 'eunice-parent-readiness-confirmed-v1';
const PROCESS_ESTIMATE = '25-35 minutes';

const QUALITY_TIPS = [
  'Use PDF, JPG, or PNG files only.',
  'Each file must be under 5 MB.',
  'Capture full pages, not cropped edges.',
  'Retake blurry or dark photos before upload.',
] as const;

const WORKFLOW_HIGHLIGHTS = [
  {
    title: 'Keep moving',
    body: 'Save progress as you go and return any time without losing context.',
  },
  {
    title: 'Know what matters',
    body: 'Required, conditional, and optional documents are separated clearly.',
  },
  {
    title: 'See the status',
    body: 'Parents can quickly see what is complete, what still needs action, and what is under review.',
  },
] as const;

function createInitialDocumentDrafts(): Record<DocumentType, DocumentDraft> {
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

function createInitialDraft(): ApplicationDraft {
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

function getStepIndex(step: StepKey) {
  return STEP_KEYS.indexOf(step);
}

function getValidationTone(state: DocumentValidationState) {
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

function getDocumentStateGuidance(state: DocumentValidationState) {
  switch (state) {
    case 'accepted':
      return 'Uploaded successfully. Admissions will review this after you submit.';
    case 'verified':
      return 'Admissions have already confirmed this document is usable.';
    case 'wrong_format':
      return 'This file cannot be used yet. Please upload a PDF, JPG, or PNG version before you submit.';
    case 'too_large':
      return 'This file is too large to use. Please upload a smaller version before you submit.';
    case 'corrupted':
      return 'We could not read this file. Please upload a fresh copy before you submit.';
    case 'blurry':
      return 'This upload may be hard to read. You can continue, but the school may ask for a clearer copy.';
    case 'low_confidence_ocr':
      return 'This upload may need a manual check. You can continue and the school will review it later.';
    case 'needs_reupload':
      return 'Please replace this document before you submit so the school can review your application properly.';
    case 'manual_review':
      return 'You can continue. The school will double-check this document during review.';
    case 'missing':
      return 'This document is still required before you can submit.';
    default:
      return 'The school will review this document after submission.';
  }
}

export default function ParentApplicationWorkflow() {
  const [activeStep, setActiveStep] = useState<StepKey>('readiness');
  const [draft, setDraft] = useState<ApplicationDraft>(createInitialDraft);
  const [lastSavedAt, setLastSavedAt] = useState('Not saved yet');
  const [mounted, setMounted] = useState(false);
  const [readinessConfirmed, setReadinessConfirmed] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState<DocumentType | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [appId, setAppId] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuthAndLoadData() {
      try {
        if (typeof window !== 'undefined' && window.localStorage.getItem(READINESS_KEY) === 'true') {
          setReadinessConfirmed(true);
        }

        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setUser(authUser);
          
          // Load profile details
          const { data: profileData, error: profileErr } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
            
          if (profileErr) throw profileErr;
          setProfile(profileData);
          
          const defaultSchoolId = profileData.school_id || '00000000-0000-0000-0000-000000000000';
          setSchoolId(defaultSchoolId);
          
          // Load active application draft
          const { data: appData, error: appErr } = await supabase
            .from('applications')
            .select('*')
            .eq('parent_id', authUser.id)
            .maybeSingle();
            
          if (appData) {
            setAppId(appData.id);
            
            // Load associated documents
            const { data: docsData } = await supabase
              .from('documents')
              .select('*')
              .eq('application_id', appData.id);
              
            const documentsDraft = createInitialDocumentDrafts();
            if (docsData) {
              docsData.forEach((doc: any) => {
                const type = doc.document_type as DocumentType;
                if (documentsDraft[type]) {
                  documentsDraft[type] = {
                    fileName: doc.file_name,
                    validationState: doc.upload_status as DocumentValidationState,
                    message: doc.review_notes || getDocumentStateGuidance(doc.upload_status as DocumentValidationState),
                    storagePath: doc.file_path,
                    uploadedAt: doc.uploaded_at,
                    uploadStatus: 'saved',
                  };
                }
              });
            }
            
            setDraft({
              parentFirstName: profileData.first_name,
              parentLastName: profileData.last_name,
              parentEmail: authUser.email || '',
              parentPhone: profileData.phone_number || '',
              learnerFirstName: appData.learner_first_name,
              learnerLastName: appData.learner_last_name,
              learnerGrade: appData.grade_applying_for,
              previousSchool: appData.previous_school_name || '',
              intakeYear: '2026',
              siblingAtSchool: 'No',
              coParentContext: 'No',
              citizenshipStatus: 'South African',
              boardingStatus: 'Daygirl',
              financialStatus: 'Employed',
              feePayerSameAsParent: true,
              legalGuardianApplicable: false,
              notes: '',
              status: appData.status as ApplicationStatus,
              submittedAt: appData.submitted_at,
              documents: documentsDraft,
              roles: createDefaultIntakeRoleState(),
            });
            
            setLastSavedAt(new Date(appData.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          } else {
            // Setup fresh draft using parent profile info
            setDraft((current) => ({
              ...current,
              parentFirstName: profileData.first_name,
              parentLastName: profileData.last_name,
              parentEmail: authUser.email || '',
              parentPhone: profileData.phone_number || '',
            }));
          }
        } else {
          loadGuestDraft();
        }
      } catch (err) {
        console.warn('Error loading parent database application:', err);
        loadGuestDraft();
      } finally {
        setMounted(true);
      }
    }

    function loadGuestDraft() {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (!stored) return;

        const parsed = JSON.parse(stored);
        setDraft((current) => ({
          ...current,
          ...parsed,
          documents: {
            ...current.documents,
            ...(parsed.documents ?? {}),
          },
        }));

        if (parsed.activeStep && STEP_KEYS.includes(parsed.activeStep)) {
          setActiveStep(parsed.activeStep);
        }
        const savedReadiness = window.localStorage.getItem(READINESS_KEY);
        if (savedReadiness === 'true') {
          setReadinessConfirmed(true);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    checkAuthAndLoadData();
  }, []);

  // Write to localStorage for guest backups or offline states
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...draft,
        activeStep,
      }),
    );
    if (!user) {
      setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [activeStep, draft, mounted, user]);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    window.localStorage.setItem(READINESS_KEY, readinessConfirmed ? 'true' : 'false');
  }, [mounted, readinessConfirmed]);

  async function saveApplicationState(updatedDraft = draft) {
    if (!user || !schoolId) return;

    try {
      const isInsert = !appId;
      const refNum = isInsert
        ? `EUN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
        : undefined;

      const payload = {
        school_id: schoolId,
        parent_id: user.id,
        learner_first_name: updatedDraft.learnerFirstName,
        learner_last_name: updatedDraft.learnerLastName,
        grade_applying_for: updatedDraft.learnerGrade || 'Grade 1',
        previous_school_name: updatedDraft.previousSchool,
        status: updatedDraft.status,
        updated_at: new Date().toISOString(),
      };

      if (isInsert) {
        const { data, error } = await supabase
          .from('applications')
          .insert({
            ...payload,
            reference_number: refNum,
          })
          .select('id')
          .single();

        if (error) throw error;
        if (data) {
          setAppId(data.id);
        }
      } else {
        const { error } = await supabase
          .from('applications')
          .update(payload)
          .eq('id', appId);

        if (error) throw error;
      }

      setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Error auto-saving parent application draft:', err);
    }
  }

  async function ensureApplicationExists(): Promise<string> {
    if (appId) return appId;
    if (!user || !schoolId) throw new Error('Auth session required to save draft data.');

    const refNum = `EUN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const { data, error } = await supabase
      .from('applications')
      .insert({
        school_id: schoolId,
        parent_id: user.id,
        reference_number: refNum,
        learner_first_name: draft.learnerFirstName || 'Draft',
        learner_last_name: draft.learnerLastName || 'Draft',
        grade_applying_for: draft.learnerGrade || 'Grade 1',
        previous_school_name: draft.previousSchool || '',
        status: 'draft',
      })
      .select('id')
      .single();

    if (error) throw error;
    setAppId(data.id);
    return data.id;
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }

  const parentComplete = Boolean(
    draft.parentFirstName.trim() &&
      draft.parentLastName.trim() &&
      draft.parentEmail.trim() &&
      draft.parentPhone.trim(),
  );
  const learnerComplete = Boolean(
    draft.learnerFirstName.trim() && draft.learnerLastName.trim() && draft.learnerGrade.trim(),
  );
  const schoolComplete = Boolean(draft.previousSchool.trim() && draft.intakeYear.trim());
  const roleComplete = Boolean(
    draft.roles.submitter.fullName.trim() &&
      draft.roles.parent.fullName.trim() &&
      (draft.feePayerSameAsParent || draft.roles.feePayer.fullName.trim()),
  );
  const requirementInput = {
    citizenshipStatus: draft.citizenshipStatus,
    boardingStatus: draft.boardingStatus,
    coParentContext: draft.coParentContext,
    financialStatus: draft.financialStatus,
  };
  const documentRequirements = getApplicationDocumentRequirements(requirementInput);
  const readinessChecklist = getReadinessChecklist(requirementInput);
  const requiredDocumentTypes = getRequiredDocumentTypes(requirementInput);
  const documentCategoryOrder: Array<'identity' | 'school' | 'family' | 'medical' | 'financial' | 'legal' | 'supporting'> = [
    'identity',
    'school',
    'family',
    'medical',
    'financial',
    'legal',
    'supporting',
  ];
  const documentCategoryLabels: Record<(typeof documentCategoryOrder)[number], string> = {
    identity: 'Identity',
    school: 'School',
    family: 'Family',
    medical: 'Medical',
    financial: 'Financial',
    legal: 'Legal',
    supporting: 'Supporting',
  };
  const requiredDocsAccepted = requiredDocumentTypes.every((documentType) =>
    isDocumentStateSubmissionReady(draft.documents[documentType].validationState),
  );
  const blockingRequiredDocuments = requiredDocumentTypes.filter((documentType) =>
    isDocumentStateBlocking(draft.documents[documentType].validationState),
  );
  const reviewOnlyRequiredDocuments = requiredDocumentTypes.filter((documentType) =>
    isDocumentStateReviewOnly(draft.documents[documentType].validationState),
  );

  const profileComplete = parentComplete && learnerComplete && schoolComplete && roleComplete;

  const isReadyToSubmit = readinessConfirmed && profileComplete && requiredDocsAccepted;

  const stepStates: Record<StepKey, boolean> = {
    readiness: readinessConfirmed,
    profile: profileComplete,
    documents: requiredDocsAccepted,
    review: isReadyToSubmit,
  };

  const completion = useMemo(() => {
    const completedSections = Object.values(stepStates).filter(Boolean).length;
    return Math.round((completedSections / STEP_KEYS.length) * 100);
  }, [stepStates]);

  function updateField<K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) {
    const updated = {
      ...draft,
      [key]: value,
    };
    setDraft(updated);
  }

  function updateRoleField(
    roleKey: keyof IntakeRoleState,
    field: IntakeRoleProfileField,
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      roles: {
        ...current.roles,
        [roleKey]: {
          ...current.roles[roleKey],
          [field]: value,
        },
      },
    }));
  }

  function syncFeePayerFromParent(nextValue: boolean) {
    setDraft((current) => {
      if (!nextValue) {
        return {
          ...current,
          feePayerSameAsParent: false,
        };
      }

      return {
        ...current,
        feePayerSameAsParent: true,
        roles: {
          ...current.roles,
          feePayer: {
            ...current.roles.feePayer,
            fullName: `${current.parentFirstName} ${current.parentLastName}`.trim(),
            emailAddress: current.parentEmail,
            phoneNumber: current.parentPhone,
          },
        },
      };
    });
  }

  function syncLegalGuardianToggle(nextValue: boolean) {
    setDraft((current) => ({
      ...current,
      legalGuardianApplicable: nextValue,
      roles: nextValue
        ? current.roles
        : {
            ...current.roles,
            legalGuardian: {
              ...current.roles.legalGuardian,
              fullName: '',
              identityNumber: '',
              phoneNumber: '',
              emailAddress: '',
              address: '',
              notes: 'Optional unless a legal guardian is involved',
            },
          },
    }));
  }

  function updateDocument(documentType: DocumentType, nextDocument: DocumentDraft) {
    setDraft((current) => ({
      ...current,
      documents: {
        ...current.documents,
        [documentType]: nextDocument,
      },
    }));
  }

  async function handleFileSelect(documentType: DocumentType, file: File | null) {
    if (!file) return;

    setUploadingDocument(documentType);

    try {
      const activeAppId = user ? await ensureApplicationExists() : 'parent-portal-draft';

      const uploadedDocument = await uploadDocumentDraft({
        schoolId: schoolId || 'eunice',
        applicationId: activeAppId,
        documentType,
        file,
      });

      const nextDoc: DocumentDraft = {
        fileName: uploadedDocument.fileName,
        validationState: uploadedDocument.validationState,
        message: uploadedDocument.message,
        storagePath: uploadedDocument.storagePath,
        uploadedAt: uploadedDocument.uploadedAt,
        uploadStatus: uploadedDocument.uploadStatus,
      };

      updateDocument(documentType, nextDoc);

      if (user && activeAppId && uploadedDocument.uploadStatus === 'saved' && uploadedDocument.storagePath) {
        const { error } = await supabase.from('documents').upsert({
          application_id: activeAppId,
          document_type: documentType,
          file_path: uploadedDocument.storagePath,
          file_name: uploadedDocument.fileName,
          mime_type: file.type || 'application/octet-stream',
          file_size: file.size,
          upload_status: uploadedDocument.validationState,
          uploaded_at: new Date().toISOString(),
        }, {
          onConflict: 'application_id,document_type'
        });

        if (error) throw error;
      }
    } catch (err) {
      console.error('Error uploading or saving document meta:', err);
    } finally {
      setUploadingDocument(null);
    }
  }

  function loadSampleDocument(documentType: DocumentType) {
    updateDocument(documentType, {
      fileName: `sample-${documentType}.pdf`,
      validationState: 'accepted',
      message: 'Sample document attached for the preview flow.',
      storagePath: `preview/${documentType}/sample-${documentType}.pdf`,
      uploadedAt: new Date().toISOString(),
      uploadStatus: 'saved',
    });
  }

  async function clearDocument(documentType: DocumentType) {
    updateDocument(documentType, {
      fileName: '',
      validationState: 'missing',
      message: 'Document removed from the draft.',
      storagePath: null,
      uploadedAt: null,
      uploadStatus: 'idle',
    });

    if (user && appId) {
      try {
        const { error } = await supabase
          .from('documents')
          .delete()
          .eq('application_id', appId)
          .eq('document_type', documentType);

        if (error) throw error;
      } catch (err) {
        console.error('Error removing database document metadata:', err);
      }
    }
  }

  function goToNextStep() {
    const currentIndex = getStepIndex(activeStep);
    const nextStep = STEP_KEYS[currentIndex + 1];
    if (nextStep) {
      setActiveStep(nextStep);
      saveApplicationState();
    }
  }

  function goToPreviousStep() {
    const currentIndex = getStepIndex(activeStep);
    const previousStep = STEP_KEYS[currentIndex - 1];
    if (previousStep) {
      setActiveStep(previousStep);
      saveApplicationState();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isReadyToSubmit) return;

    const submittedDate = new Date().toISOString();
    const updatedDraft = {
      ...draft,
      status: 'submitted' as ApplicationStatus,
      submittedAt: submittedDate,
    };

    setDraft(updatedDraft);

    if (user && appId) {
      try {
        const { error } = await supabase
          .from('applications')
          .update({
            status: 'submitted',
            submitted_at: submittedDate,
            updated_at: submittedDate,
          })
          .eq('id', appId);

        if (error) throw error;
      } catch (err) {
        console.error('Error updating application submission state:', err);
      }
    }

    setActiveStep('review');
  }

  return (
    <section className="rounded-[2rem] border border-emerald-100 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-amber-50 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Application workspace</p>
            <h2 className="display-serif mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Complete your application in 4 clear stages</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              We guide families upfront on everything required to avoid mid-form surprises and unnecessary backtracking.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800">Application status</div>
                <div className="mt-1 font-semibold text-slate-950">{APPLICATION_STATUS_LABELS[draft.status]}</div>
              </div>
              <div className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-900">
                {completion}% complete
              </div>
            </div>
            <div className="mt-2 max-w-md text-slate-600">{APPLICATION_STATUS_DESCRIPTIONS[draft.status]}</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <span>Draft progress</span>
            <span>{completion}% complete</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-primary-700 via-primary-600 to-accent-500 transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
          {WORKFLOW_HIGHLIGHTS.map((item) => (
            <div key={item.title} className="rounded-2xl border border-emerald-100 bg-white px-4 py-4 shadow-sm">
              <div className="text-sm font-semibold text-slate-950">{item.title}</div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <form className="p-6 sm:p-8" onSubmit={handleSubmit}>
          <div className="mb-6 grid gap-3 sm:grid-cols-4">
            {STEP_KEYS.map((step) => {
              const meta = STEP_META[step];
              const isActive = step === activeStep;
              const isComplete = stepStates[step];

              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => setActiveStep(step)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? 'border-primary-200 bg-primary-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-primary-200 hover:bg-primary-50/60'
                  }`}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {meta.eyebrow}
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-950">{meta.title}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                        isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isComplete ? 'Done' : 'Open'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">
                  {STEP_META[activeStep].eyebrow}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">{STEP_META[activeStep].title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{STEP_META[activeStep].description}</p>
              </div>
              <div className="rounded-2xl border border-white bg-white px-3 py-2 text-right shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Last saved</div>
                <div className="mt-1 text-sm font-semibold text-slate-950">{lastSavedAt}</div>
              </div>
            </div>

            {activeStep === 'readiness' && (
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 shadow-sm">
                  <div className="text-sm font-semibold text-slate-950">Before you start</div>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    Estimated completion time: <span className="font-semibold">{PROCESS_ESTIMATE}</span>
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    You can save and return later, but having these documents ready will make the process much faster.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="text-sm font-semibold text-slate-950">Required documents checklist</div>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                      {readinessChecklist.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="text-sm font-semibold text-slate-950">Upload quality rules</div>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                      {QUALITY_TIPS.map((tip) => (
                        <li key={tip}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={readinessConfirmed}
                    onChange={(event) => setReadinessConfirmed(event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-700 focus:ring-primary-300"
                  />
                  <span>
                    I understand the full requirements and I am ready to continue with the application stages.
                  </span>
                </label>
              </div>
            )}

            {activeStep === 'profile' && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 shadow-sm">
                  <div className="text-sm font-semibold text-slate-950">Who is involved</div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    We capture the people behind the application separately so the school can track contact, legal responsibility, and fee responsibility without confusion.
                  </p>
                </div>
                <Field
                  label="First name"
                  value={draft.parentFirstName}
                  onChange={(value) => updateField('parentFirstName', value)}
                  placeholder="Nicolette"
                />
                <Field
                  label="Last name"
                  value={draft.parentLastName}
                  onChange={(value) => updateField('parentLastName', value)}
                  placeholder="Dienar"
                />
                <Field
                  label="Email address"
                  value={draft.parentEmail}
                  onChange={(value) => updateField('parentEmail', value)}
                  placeholder="parent@example.com"
                  type="email"
                />
                <Field
                  label="Phone number"
                  value={draft.parentPhone}
                  onChange={(value) => updateField('parentPhone', value)}
                  placeholder="+27 82 123 4567"
                />
                <Field
                  label="Learner first name"
                  value={draft.learnerFirstName}
                  onChange={(value) => updateField('learnerFirstName', value)}
                  placeholder="Learner first name"
                />
                <Field
                  label="Learner last name"
                  value={draft.learnerLastName}
                  onChange={(value) => updateField('learnerLastName', value)}
                  placeholder="Learner last name"
                />
                <Field
                  label="Grade applying for"
                  value={draft.learnerGrade}
                  onChange={(value) => updateField('learnerGrade', value)}
                  placeholder="Grade 1"
                />
                <Field
                  label="Current or previous school"
                  value={draft.previousSchool}
                  onChange={(value) => updateField('previousSchool', value)}
                  placeholder="Current school or nursery"
                />
                <Field
                  label="Intake year"
                  value={draft.intakeYear}
                  onChange={(value) => updateField('intakeYear', value)}
                  placeholder="2026"
                />
                <SelectField
                  label="Sibling at Eunice?"
                  value={draft.siblingAtSchool}
                  onChange={(value) => updateField('siblingAtSchool', value)}
                  options={['No', 'Yes']}
                />
                <SelectField
                  label="Co-parent context"
                  value={draft.coParentContext}
                  onChange={(value) => updateField('coParentContext', value)}
                  options={['No', 'Yes']}
                />
                <SelectField
                  label="Citizenship status"
                  value={draft.citizenshipStatus}
                  onChange={(value) => updateField('citizenshipStatus', value)}
                  options={['South African', 'Non-South African']}
                />
                <SelectField
                  label="Application type"
                  value={draft.boardingStatus}
                  onChange={(value) => updateField('boardingStatus', value)}
                  options={['Daygirl', 'Boarder']}
                />
                <SelectField
                  label="Financial context"
                  value={draft.financialStatus}
                  onChange={(value) => updateField('financialStatus', value)}
                  options={['Employed', 'Self-employed', 'Other']}
                />
                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={draft.feePayerSameAsParent}
                    onChange={(event) => syncFeePayerFromParent(event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-700 focus:ring-primary-300"
                  />
                  <span>School fees will be paid by the submitting parent</span>
                </label>
                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={draft.legalGuardianApplicable}
                    onChange={(event) => syncLegalGuardianToggle(event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-700 focus:ring-primary-300"
                  />
                  <span>A separate legal guardian needs to be captured</span>
                </label>
                <Field
                  label="Submitting parent full name"
                  value={draft.roles.submitter.fullName}
                  onChange={(value) => updateRoleField('submitter', 'fullName', value)}
                  placeholder="Nicolette Dienar"
                />
                <Field
                  label="Submitting parent email"
                  value={draft.roles.submitter.emailAddress}
                  onChange={(value) => updateRoleField('submitter', 'emailAddress', value)}
                  placeholder="parent@example.com"
                  type="email"
                />
                <Field
                  label="Submitting parent phone"
                  value={draft.roles.submitter.phoneNumber}
                  onChange={(value) => updateRoleField('submitter', 'phoneNumber', value)}
                  placeholder="+27 82 123 4567"
                />
                <Field
                  label="Submitting parent address"
                  value={draft.roles.submitter.address}
                  onChange={(value) => updateRoleField('submitter', 'address', value)}
                  placeholder="Home address"
                />
                <Field
                  label="Fee-payer full name"
                  value={draft.roles.feePayer.fullName}
                  onChange={(value) => updateRoleField('feePayer', 'fullName', value)}
                  placeholder="Account holder or debtor"
                  disabled={draft.feePayerSameAsParent}
                />
                <Field
                  label="Fee-payer email"
                  value={draft.roles.feePayer.emailAddress}
                  onChange={(value) => updateRoleField('feePayer', 'emailAddress', value)}
                  placeholder="finance@example.com"
                  disabled={draft.feePayerSameAsParent}
                />
                <Field
                  label="Fee-payer phone"
                  value={draft.roles.feePayer.phoneNumber}
                  onChange={(value) => updateRoleField('feePayer', 'phoneNumber', value)}
                  placeholder="+27 82 123 4567"
                  disabled={draft.feePayerSameAsParent}
                />
                <Field
                  label="Legal guardian name"
                  value={draft.roles.legalGuardian.fullName}
                  onChange={(value) => updateRoleField('legalGuardian', 'fullName', value)}
                  placeholder="Optional"
                  disabled={!draft.legalGuardianApplicable}
                />
                <Field
                  label="Legal guardian notes"
                  value={draft.roles.legalGuardian.notes}
                  onChange={(value) => updateRoleField('legalGuardian', 'notes', value)}
                  placeholder="Only if applicable"
                  disabled={!draft.legalGuardianApplicable}
                />
                <div className="rounded-2xl border border-dashed border-primary-200 bg-primary-50 p-4 text-sm leading-6 text-slate-700 sm:col-span-2">
                  <div className="font-semibold text-slate-950">Role summary</div>
                  <div className="mt-2 grid gap-3 md:grid-cols-2">
                    <SummaryRow label={INTAKE_ROLE_LABELS.submitter} value={draft.roles.submitter.fullName || 'Not captured yet'} />
                    <SummaryRow label={INTAKE_ROLE_LABELS.parent} value={draft.roles.parent.fullName || 'Not captured yet'} />
                    <SummaryRow label={INTAKE_ROLE_LABELS.legal_guardian} value={draft.legalGuardianApplicable ? (draft.roles.legalGuardian.fullName || 'Not captured yet') : 'Not applicable'} />
                    <SummaryRow label={INTAKE_ROLE_LABELS.fee_payer} value={draft.feePayerSameAsParent ? 'Same as submitting parent' : (draft.roles.feePayer.fullName || 'Not captured yet')} />
                  </div>
                </div>
              </div>
            )}

            {activeStep === 'documents' && (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-primary-100 bg-primary-50/70 p-4 shadow-sm">
                  <div className="text-sm font-semibold text-slate-950">How document checks work</div>
                  <div className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                    <p>Some document issues must be fixed before you submit, like the wrong file type or a file that is too large.</p>
                    <p>Other documents can still go forward and be checked by the school later if a manual review is needed.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {documentCategoryOrder.map((category) => {
                    const categoryRequirements = documentRequirements.filter((requirement) => requirement.category === category);
                    if (categoryRequirements.length === 0) return null;

                    return (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {documentCategoryLabels[category]}
                          </h4>
                          <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            {categoryRequirements.length} items
                          </span>
                        </div>
                        <div className="grid gap-4">
                          {categoryRequirements.map((requirement) => {
                            const documentType = requirement.documentType;
                            const document = draft.documents[documentType];

                            return (
                              <div key={requirement.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h5 className="text-sm font-semibold text-slate-950">{requirement.label}</h5>
                                      <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-700">
                                        {requirement.required ? 'Required' : 'Conditional'}
                                      </span>
                                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                        {documentCategoryLabels[category]}
                                      </span>
                                    </div>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">{requirement.reason}</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                      Accepted formats: {DOCUMENT_CONTRACTS[documentType].acceptedMimeTypes.join(', ')}.
                                      Maximum size: {Math.round(DOCUMENT_CONTRACTS[documentType].maxFileSizeBytes / (1024 * 1024))} MB.
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">{getDocumentStateGuidance(document.validationState)}</p>
                                    {document.message !== getDocumentStateGuidance(document.validationState) ? (
                                      <p className="mt-1 text-xs leading-5 text-slate-500">{document.message}</p>
                                    ) : null}
                                    {document.fileName ? (
                                      <p className="mt-1 text-xs font-medium text-slate-500">Selected file: {document.fileName}</p>
                                    ) : null}
                                    {document.uploadedAt ? (
                                      <p className="mt-1 text-xs text-slate-500">
                                        Saved to draft on {new Date(document.uploadedAt).toLocaleDateString()}.
                                      </p>
                                    ) : null}
                                    {document.storagePath ? (
                                      <p className="mt-1 truncate text-[11px] leading-5 text-slate-400">Storage path: {document.storagePath}</p>
                                    ) : null}
                                  </div>
                                  <div className={`rounded-2xl border px-3 py-2 text-sm font-medium ${getValidationTone(document.validationState)}`}>
                                    {DOCUMENT_VALIDATION_LABELS[document.validationState]}
                                  </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-3">
                                  <label className="inline-flex cursor-pointer items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:bg-primary-50">
                                    {uploadingDocument === documentType ? 'Saving...' : 'Choose file'}
                                    <input
                                      type="file"
                                      className="sr-only"
                                      accept={DOCUMENT_CONTRACTS[documentType].acceptedMimeTypes.join(',')}
                                      onChange={(event) => handleFileSelect(documentType, event.target.files?.[0] ?? null)}
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => loadSampleDocument(documentType)}
                                    className="rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-900 transition hover:bg-primary-100"
                                  >
                                    Load sample
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => clearDocument(documentType)}
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                  >
                                    Clear
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!requiredDocumentTypes.includes('other') ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-950">Optional supporting document</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Add a sibling letter or any extra supporting file if admissions asks for it.
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => loadSampleDocument('other')}
                        className="rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm font-semibold text-primary-900 transition hover:bg-primary-50"
                      >
                        Add sample supporting file
                      </button>
                      <span className="text-xs text-slate-500">
                        Optional documents can be reviewed later by admissions staff.
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {activeStep === 'review' && (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-950">Pre-submit checklist</div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-700">
                    <ChecklistRow label="Readiness confirmed" passed={readinessConfirmed} />
                    <ChecklistRow label="Profile stage complete" passed={profileComplete} />
                    <ChecklistRow label="Required documents uploaded" passed={requiredDocsAccepted} />
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-950">Submission requirements</div>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    {documentRequirements.map((requirement) => {
                      const document = draft.documents[requirement.documentType];
                      return (
                        <ChecklistRow
                          key={requirement.id}
                          label={`${documentCategoryLabels[requirement.category]} · ${requirement.label}: ${DOCUMENT_VALIDATION_LABELS[document.validationState]}`}
                          passed={isDocumentStateSubmissionReady(document.validationState)}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-2xl border border-primary-100 bg-primary-50 p-4 text-sm leading-6 text-slate-700">
                  Final tip: if any uploaded document is unclear, replace it now to prevent admissions follow-up delays.
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                {blockingRequiredDocuments.length > 0
                  ? `Please fix ${blockingRequiredDocuments.length} required document${blockingRequiredDocuments.length === 1 ? '' : 's'} before you submit.`
                  : reviewOnlyRequiredDocuments.length > 0
                    ? `You can submit now. The school will manually review ${reviewOnlyRequiredDocuments.length} document${reviewOnlyRequiredDocuments.length === 1 ? '' : 's'} later.`
                    : isReadyToSubmit
                      ? 'The draft is ready to submit.'
                      : 'Complete the highlighted sections and required documents to unlock submission.'}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  disabled={activeStep === 'readiness'}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Back
                </button>
                {activeStep !== 'review' ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    disabled={activeStep === 'readiness' && !readinessConfirmed}
                    className="rounded-xl bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isReadyToSubmit}
                    className="rounded-xl bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-primary-300"
                  >
                    Submit application
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        <aside className="border-t border-primary-100 bg-primary-50/50 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <div className="rounded-3xl border border-primary-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">Draft summary</p>
            <div className="mt-4 space-y-4 text-sm">
              <SummaryRow label="Parent" value={parentComplete ? `${draft.parentFirstName} ${draft.parentLastName}`.trim() : 'Incomplete'} />
              <SummaryRow label="Learner" value={learnerComplete ? `${draft.learnerFirstName} ${draft.learnerLastName}`.trim() : 'Incomplete'} />
              <SummaryRow label="Grade" value={draft.learnerGrade || 'Not chosen yet'} />
              <SummaryRow label="Current status" value={APPLICATION_STATUS_LABELS[draft.status]} />
              <SummaryRow label="Saved locally" value={mounted ? 'Yes' : 'Loading draft...'} />
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-primary-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">Required documents</p>
            {reviewOnlyRequiredDocuments.length > 0 ? (
              <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                {reviewOnlyRequiredDocuments.length === 1
                  ? 'One uploaded document can still be submitted and will be checked manually by the school later.'
                  : `${reviewOnlyRequiredDocuments.length} uploaded documents can still be submitted and will be checked manually by the school later.`}
              </div>
            ) : null}
            <div className="mt-4 space-y-3">
              {requiredDocumentTypes.map((documentType) => {
                const document = draft.documents[documentType];
                return (
                  <div key={documentType} className="flex items-start justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">{DOCUMENT_TYPE_LABELS[documentType]}</div>
                      <div className="mt-1 text-xs leading-5 text-slate-500">{getDocumentStateGuidance(document.validationState)}</div>
                      {document.storagePath ? (
                        <div className="mt-1 text-[11px] leading-5 text-slate-400">Draft saved</div>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getValidationTone(document.validationState)}`}>
                        {DOCUMENT_VALIDATION_LABELS[document.validationState]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="max-w-[65%] text-right font-medium text-slate-950">{value}</span>
    </div>
  );
}

function ChecklistRow({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <span>{label}</span>
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
          passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'
        }`}
      >
        {passed ? 'Ready' : 'Missing'}
      </span>
    </div>
  );
}
