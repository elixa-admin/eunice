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

const STEP_KEYS = ['checklist', 'learner', 'household', 'medical', 'fees_docs', 'review'] as const;
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

type StoredApplicationDraftSnapshot = {
  version: 1;
  savedAt: string;
  activeStep: StepKey;
  readinessConfirmed: boolean;
  draft: ApplicationDraft;
};

type StepMeta = {
  title: string;
  eyebrow: string;
  description: string;
};

const STEP_META: Record<StepKey, StepMeta> = {
  checklist: {
    eyebrow: 'Step 0',
    title: 'Preparation & Checklist',
    description: 'Confirm you have the required documents and understand the admissions journey before starting.',
  },
  learner: {
    eyebrow: 'Step 1',
    title: 'Learner & Admission Details',
    description: 'Capture basic learner legal names, grade applied, and previous school context.',
  },
  household: {
    eyebrow: 'Step 2',
    title: 'Parent & Household Info',
    description: 'Capture details of the submitting parent, legacy sibling status, and co-parent contexts.',
  },
  medical: {
    eyebrow: 'Step 3',
    title: 'Medical Care & Support',
    description: 'Disclose healthcare support plans, doctor contacts, and boarding house requests.',
  },
  fees_docs: {
    eyebrow: 'Step 4',
    title: 'Fee Payer & Uploads',
    description: 'Select fee-payer responsibility and upload all required checklist documents.',
  },
  review: {
    eyebrow: 'Step 5',
    title: 'Review & Submit',
    description: 'Audit your completed information and submit your file to the admissions queue.',
  },
};

const STORAGE_KEY = 'eunice-parent-application-draft-v1';
const READINESS_KEY = 'eunice-parent-readiness-confirmed-v1';
const STORAGE_VERSION = 1;
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

function mergeDocumentDrafts(
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

function mergeRoleDrafts(baseRoles: IntakeRoleState, storedRoles: Partial<IntakeRoleState> | undefined) {
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

function mergeDraftState(baseDraft: ApplicationDraft, storedDraft: Partial<ApplicationDraft> | undefined) {
  if (!storedDraft) return baseDraft;

  return {
    ...baseDraft,
    ...storedDraft,
    documents: mergeDocumentDrafts(baseDraft.documents, storedDraft.documents),
    roles: mergeRoleDrafts(baseDraft.roles, storedDraft.roles),
  };
}

function readStoredDraftSnapshot(): StoredApplicationDraftSnapshot | null {
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
  const [activeStep, setActiveStep] = useState<StepKey>('checklist');
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
        const storedSnapshot = readStoredDraftSnapshot();
        const storedReadiness = storedSnapshot?.readinessConfirmed ?? false;
        if (storedReadiness) {
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
            
            const serverDraft: ApplicationDraft = {
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
            };

            setDraft(mergeDraftState(serverDraft, storedSnapshot?.draft));
            
            setLastSavedAt(
              storedSnapshot?.savedAt
                ? new Date(storedSnapshot.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : new Date(appData.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            );
          } else {
            const baseDraft = mergeDraftState(createInitialDraft(), storedSnapshot?.draft);
            setDraft({
              ...baseDraft,
              parentFirstName: profileData.first_name,
              parentLastName: profileData.last_name,
              parentEmail: authUser.email || '',
              parentPhone: profileData.phone_number || '',
            });
          }
        } else {
          const guestDraft = storedSnapshot?.draft;
          if (guestDraft) {
            setDraft((current) => mergeDraftState(current, guestDraft));
            setActiveStep(storedSnapshot.activeStep);
            setLastSavedAt(new Date(storedSnapshot.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          }
        }
      } catch (err) {
        console.warn('Error loading parent database application:', err);
        const guestSnapshot = readStoredDraftSnapshot();
        if (guestSnapshot?.draft) {
          setDraft((current) => mergeDraftState(current, guestSnapshot.draft));
          setActiveStep(guestSnapshot.activeStep);
          setReadinessConfirmed(guestSnapshot.readinessConfirmed);
          setLastSavedAt(new Date(guestSnapshot.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } else if (typeof window !== 'undefined') {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } finally {
        setMounted(true);
      }
    }

    checkAuthAndLoadData();
  }, []);

  // Write to localStorage for guest backups or offline states
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const snapshot: StoredApplicationDraftSnapshot = {
      version: STORAGE_VERSION,
      savedAt: new Date().toISOString(),
      activeStep,
      readinessConfirmed,
      draft,
    };

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(snapshot),
    );
    if (!user) {
      setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [activeStep, draft, mounted, readinessConfirmed, user]);

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
    checklist: readinessConfirmed,
    learner: learnerComplete && schoolComplete,
    household: parentComplete && roleComplete,
    medical: true,
    fees_docs: requiredDocsAccepted,
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
    <section className="rounded-[2.5rem] border border-emerald-900/10 bg-white shadow-[0_32px_96px_-24px_rgba(6,46,28,0.12)] overflow-hidden">
      <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-900/5 via-white to-amber-500/5 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Admissions Workspace</p>
            <h2 className="display-serif mt-2 text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-950 via-amber-800 to-emerald-900 sm:text-4xl">Complete your application dossier</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              A refined admissions experience designed for families. Enter details and upload documents to lock in your child's placement.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-900/10 bg-white px-5 py-4 text-sm text-slate-700 shadow-sm max-w-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Dossier status</div>
                <div className="mt-1 font-semibold text-slate-950">{APPLICATION_STATUS_LABELS[draft.status]}</div>
              </div>
              <div className="rounded-full bg-emerald-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                {completion}% complete
              </div>
            </div>
            <div className="mt-2 text-xs leading-5 text-slate-600">{APPLICATION_STATUS_DESCRIPTIONS[draft.status]}</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Dossier progress</span>
            <span>{completion}% complete</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-emerald-900 via-emerald-700 to-amber-500 transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
          {WORKFLOW_HIGHLIGHTS.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
              <div className="text-sm font-semibold text-slate-950">{item.title}</div>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <form className="p-6 sm:p-8" onSubmit={handleSubmit}>
          <div className="relative mb-8 mt-2 px-4 py-5 rounded-3xl border border-amber-500/10 bg-slate-50/50 shadow-inner sm:px-6 w-full overflow-x-auto">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 hidden md:block" />
            <div className="relative flex justify-between items-center gap-6 min-w-[650px] md:min-w-0">
              {STEP_KEYS.map((step, index) => {
                const meta = STEP_META[step];
                const isActive = step === activeStep;
                const isComplete = stepStates[step];

                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setActiveStep(step)}
                    className="relative z-10 flex flex-col items-center gap-2 bg-transparent border-0 outline-none cursor-pointer group flex-1"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-semibold shadow-sm transition-all duration-300 ${
                        isActive
                          ? 'border-amber-600 bg-emerald-900 text-amber-100 ring-4 ring-emerald-900/10 scale-110 shadow-md shadow-emerald-950/20'
                          : isComplete
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700 hover:border-emerald-700'
                            : 'border-slate-300 bg-white text-slate-500 group-hover:border-amber-500 group-hover:text-amber-700'
                      }`}
                    >
                      {isComplete ? (
                        <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span>{index}</span>
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-emerald-900' : 'text-slate-400'}`}>
                        {meta.eyebrow}
                      </p>
                      <p className={`mt-0.5 text-[11px] font-semibold whitespace-nowrap ${isActive ? 'text-emerald-950 font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>
                        {meta.title.split(' ')[0]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(6,58,35,0.03)] sm:p-8">
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

            {activeStep === 'checklist' && (
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

            {activeStep === 'learner' && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 shadow-sm">
                  <div className="text-sm font-semibold text-slate-950">Learner & Admission Details</div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Provide basic details of the child applying for admission to Eunice High School.
                  </p>
                </div>
                <Field
                  label="Learner first name"
                  value={draft.learnerFirstName}
                  onChange={(value) => updateField('learnerFirstName', value)}
                  placeholder="Ayanda"
                />
                <Field
                  label="Learner last name"
                  value={draft.learnerLastName}
                  onChange={(value) => updateField('learnerLastName', value)}
                  placeholder="Khumalo"
                />
                <Field
                  label="Grade applying for"
                  value={draft.learnerGrade}
                  onChange={(value) => updateField('learnerGrade', value)}
                  placeholder="Grade 8"
                />
                <Field
                  label="Current or previous school"
                  value={draft.previousSchool}
                  onChange={(value) => updateField('previousSchool', value)}
                  placeholder="Heatherdale Intermediate"
                />
                <Field
                  label="Intake year"
                  value={draft.intakeYear}
                  onChange={(value) => updateField('intakeYear', value)}
                  placeholder="2027"
                />
              </div>
            )}

            {activeStep === 'household' && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 shadow-sm">
                  <div className="text-sm font-semibold text-slate-950">Parent & Household Info</div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Capture contact details of the submitting parent, sibling links, and family structures.
                  </p>
                </div>
                <Field
                  label="First name"
                  value={draft.parentFirstName}
                  onChange={(value) => updateField('parentFirstName', value)}
                  placeholder="Lerato"
                />
                <Field
                  label="Last name"
                  value={draft.parentLastName}
                  onChange={(value) => updateField('parentLastName', value)}
                  placeholder="Khumalo"
                />
                <Field
                  label="Email address"
                  value={draft.parentEmail}
                  onChange={(value) => updateField('parentEmail', value)}
                  placeholder="lerato.khumalo@example.com"
                  type="email"
                />
                <Field
                  label="Phone number"
                  value={draft.parentPhone}
                  onChange={(value) => updateField('parentPhone', value)}
                  placeholder="+27 83 555 0102"
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
              </div>
            )}

            {activeStep === 'medical' && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 shadow-sm">
                  <div className="text-sm font-semibold text-slate-950">Medical Care & Support</div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Help us ensure learner support and duty of care by providing medical aid and hostel boarding context.
                  </p>
                </div>
                <SelectField
                  label="Application Type"
                  value={draft.boardingStatus}
                  onChange={(value) => updateField('boardingStatus', value)}
                  options={['Daygirl', 'Boarder']}
                />
                <SelectField
                  label="Financial / Employment status"
                  value={draft.financialStatus}
                  onChange={(value) => updateField('financialStatus', value)}
                  options={['Employed', 'Self-employed', 'Other']}
                />
              </div>
            )}

            {activeStep === 'fees_docs' && (
              <div className="mt-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 shadow-sm">
                    <div className="text-sm font-semibold text-slate-950">Fee Payer Alignment & Legal Guardians</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Determine fee responsibility and capture guardian roles if different from the parent.
                    </p>
                  </div>
                  <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={draft.feePayerSameAsParent}
                      onChange={(event) => syncFeePayerFromParent(event.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-700 focus:ring-primary-300"
                    />
                    <span>School fees will be paid by the submitting parent</span>
                  </label>
                  {!draft.feePayerSameAsParent && (
                    <>
                      <Field
                        label="Fee-payer full name"
                        value={draft.roles.feePayer.fullName}
                        onChange={(value) => updateRoleField('feePayer', 'fullName', value)}
                        placeholder="Account holder or debtor"
                      />
                      <Field
                        label="Fee-payer email"
                        value={draft.roles.feePayer.emailAddress}
                        onChange={(value) => updateRoleField('feePayer', 'emailAddress', value)}
                        placeholder="finance@example.com"
                      />
                      <Field
                        label="Fee-payer phone"
                        value={draft.roles.feePayer.phoneNumber}
                        onChange={(value) => updateRoleField('feePayer', 'phoneNumber', value)}
                        placeholder="+27 82 123 4567"
                      />
                    </>
                  )}
                  <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={draft.legalGuardianApplicable}
                      onChange={(event) => syncLegalGuardianToggle(event.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-700 focus:ring-primary-300"
                    />
                    <span>A separate legal guardian needs to be captured</span>
                  </label>
                  {draft.legalGuardianApplicable && (
                    <>
                      <Field
                        label="Legal guardian name"
                        value={draft.roles.legalGuardian.fullName}
                        onChange={(value) => updateRoleField('legalGuardian', 'fullName', value)}
                        placeholder="Guardian full name"
                      />
                      <Field
                        label="Legal guardian notes"
                        value={draft.roles.legalGuardian.notes}
                        onChange={(value) => updateRoleField('legalGuardian', 'notes', value)}
                        placeholder="Only if applicable"
                      />
                    </>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-4">
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
                </div>
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
                  disabled={activeStep === 'checklist'}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Back
                </button>
                {activeStep !== 'review' ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    disabled={activeStep === 'checklist' && !readinessConfirmed}
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

        <aside className="border-t border-emerald-950/10 bg-emerald-950/[0.02] p-6 sm:p-8 lg:border-l lg:border-t-0">
          <div className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm flex flex-col items-center text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-4 self-start">Dossier Completion</p>
            
            <div className="relative flex items-center justify-center h-28 w-28">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-slate-100"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="38"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-amber-500 transition-all duration-500 ease-in-out"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - completion / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="38"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute text-xl font-extrabold text-slate-900">{completion}%</div>
            </div>
            
            <div className="mt-4 space-y-3 w-full text-left pt-4 border-t border-slate-100 text-sm">
              <SummaryRow label="Parent" value={parentComplete ? `${draft.parentFirstName} ${draft.parentLastName}`.trim() : 'Incomplete'} />
              <SummaryRow label="Learner" value={learnerComplete ? `${draft.learnerFirstName} ${draft.learnerLastName}`.trim() : 'Incomplete'} />
              <SummaryRow label="Grade" value={draft.learnerGrade || 'Not chosen yet'} />
              <SummaryRow label="Current status" value={APPLICATION_STATUS_LABELS[draft.status]} />
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">Required documents</p>
            {reviewOnlyRequiredDocuments.length > 0 ? (
              <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-900 leading-5">
                {reviewOnlyRequiredDocuments.length === 1
                  ? 'One uploaded document will be verified manually by the school staff.'
                  : `${reviewOnlyRequiredDocuments.length} uploaded documents will be verified manually by the school staff.`}
              </div>
            ) : null}
            <div className="mt-4 space-y-3">
              {requiredDocumentTypes.map((documentType) => {
                const document = draft.documents[documentType];
                return (
                  <div key={documentType} className="flex items-start justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 border border-slate-100">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">{DOCUMENT_TYPE_LABELS[documentType]}</div>
                      <div className="mt-1 text-xs leading-5 text-slate-500">{getDocumentStateGuidance(document.validationState)}</div>
                    </div>
                    <div className="text-right">
                      <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${getValidationTone(document.validationState)}`}>
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
    <label className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition duration-300 placeholder:text-slate-400 focus:border-amber-600 focus:ring-4 focus:ring-emerald-900/5 disabled:opacity-50"
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
    <label className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</span>
      <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition duration-300 focus:border-amber-600 focus:ring-4 focus:ring-emerald-900/5"
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
