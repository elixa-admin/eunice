'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import {
  APPLICATION_STATUS_DESCRIPTIONS,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from '@/lib/domain/applications';
import {
  getApplicationDocumentRequirements,
  getRequiredDocumentTypes,
} from '@/lib/domain/application-requirements';
import {
  createDefaultIntakeRoleState,
  type IntakeRoleProfileField,
  type IntakeRoleState,
} from '@/lib/domain/intake-roles';
import { getDefaultTenantId } from '@/lib/domain/tenant-config';
import {
  DOCUMENT_CONTRACTS,
  DOCUMENT_VALIDATION_LABELS,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_PROCESSING_STATUS_LABELS,
  isDocumentStateBlocking,
  isDocumentStateReviewOnly,
  isDocumentStateSubmissionReady,
  type DocumentIntakeSignal,
  type DocumentType,
} from '@/lib/documents/contracts';
import { uploadDocumentDraft } from '@/lib/documents/upload';
import {
  DOCUMENT_UPLOAD_GUIDANCE,
  PROCESS_ESTIMATE,
  QUALITY_TIPS,
  READINESS_KEY,
  STEP_KEYS,
  STEP_META,
  STORAGE_KEY,
  STORAGE_VERSION,
  WORKFLOW_HIGHLIGHTS,
  createInitialDocumentDrafts,
  createInitialDraft,
  createReferenceNumber,
  getDocumentCounts,
  getDocumentStateGuidance,
  getDocumentQualityCue,
  getDocumentIntakeCue,
  getDocumentActionChecklist,
  getStepIndex,
  getUploadActionLabel,
  getValidationTone,
  mergeDraftState,
  readStoredDraftSnapshot,
  type ApplicationDraft,
  type DocumentDraft,
  type DocumentRecord,
  type StepKey,
  type StoredApplicationDraftSnapshot,
} from '@/lib/parent-application';

type AuthUser = {
  id: string;
  email?: string | null;
};

const POPIA_CONSENT_KEY = 'eunice-popia-consent-v1';

export default function ParentApplicationWorkflow() {
  const [activeStep, setActiveStep] = useState<StepKey>('checklist');
  const [draft, setDraft] = useState<ApplicationDraft>(createInitialDraft);
  const [lastSavedAt, setLastSavedAt] = useState('Not saved yet');
  const [mounted, setMounted] = useState(false);
  const [readinessConfirmed, setReadinessConfirmed] = useState(false);
  const [popiaConsentAccepted, setPopiaConsentAccepted] = useState(false);
  const [popiaConsentChecked, setPopiaConsentChecked] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState<DocumentType | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [appId, setAppId] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<'idle' | 'saving' | 'submitted' | 'error'>('idle');
  const [draftState, setDraftState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [draftNotice, setDraftNotice] = useState<string | null>(null);
  useEffect(() => {
    async function checkAuthAndLoadData() {
      try {
        const storedSnapshot = readStoredDraftSnapshot();
        const storedReadiness = storedSnapshot?.readinessConfirmed ?? false;
        const storedConsent = typeof window !== 'undefined' ? window.localStorage.getItem(POPIA_CONSENT_KEY) : null;
        if (storedReadiness) {
          setReadinessConfirmed(true);
        }
        if (storedConsent === 'true') {
          setPopiaConsentAccepted(true);
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
          const defaultSchoolId = profileData.school_id || getDefaultTenantId();
          setSchoolId(defaultSchoolId);
          
          // Load active application draft
          const { data: appData, error: appErr } = await supabase
            .from('applications')
            .select('*')
            .eq('parent_id', authUser.id)
            .maybeSingle();
            
          if (appErr) throw appErr;

          if (appData) {
            setAppId(appData.id);
            
            // Load associated documents
            const { data: docsData } = await supabase
              .from('documents')
              .select('*')
              .eq('application_id', appData.id);
              
            const documentsDraft = createInitialDocumentDrafts();
            if (docsData) {
              (docsData as DocumentRecord[]).forEach((doc) => {
                const type = doc.document_type as DocumentType;
                if (documentsDraft[type]) {
                  const qualitySignals: DocumentIntakeSignal[] =
                    doc.upload_status === 'blurry'
                      ? ['blurry']
                      : doc.upload_status === 'low_confidence_ocr'
                        ? ['low_confidence_ocr']
                        : doc.review_notes?.toLowerCase().includes('duplicate') || doc.review_notes?.toLowerCase().includes('repeat')
                          ? ['possible_duplicate']
                          : [];
                  documentsDraft[type] = {
                    fileName: doc.file_name,
                    validationState: doc.upload_status,
                    message: doc.review_notes || getDocumentStateGuidance(doc.upload_status),
                    intake: {
                      processingStatus:
                        doc.upload_status === 'manual_review'
                          ? 'manual_review'
                          : doc.upload_status === 'blurry' || doc.upload_status === 'low_confidence_ocr'
                            ? 'running'
                            : isDocumentStateBlocking(doc.upload_status)
                              ? 'failed'
                              : 'queued',
                      qualitySignals,
                      ocrText: null,
                      confidenceScore:
                        doc.upload_status === 'blurry'
                          ? 0.67
                          : doc.upload_status === 'low_confidence_ocr'
                            ? 0.64
                            : doc.upload_status === 'manual_review'
                              ? 0.56
                              : 0.92,
                    },
                    storagePath: doc.file_path,
                    uploadedAt: doc.uploaded_at,
                    uploadStatus: 'saved',
                  };
                }
              });
            }

            const serverDraft: ApplicationDraft = {
              parentFirstName: profileData.first_name ?? '',
              parentLastName: profileData.last_name ?? '',
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
                : new Date(appData.updated_at || appData.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            );
          } else {
            const baseDraft = mergeDraftState(createInitialDraft(), storedSnapshot?.draft);
            setDraft({
              ...baseDraft,
              parentFirstName: profileData.first_name ?? '',
              parentLastName: profileData.last_name ?? '',
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
  }, [activeStep, draft, mounted, readinessConfirmed, user]);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    window.localStorage.setItem(READINESS_KEY, readinessConfirmed ? 'true' : 'false');
  }, [mounted, readinessConfirmed]);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined' || !popiaConsentAccepted) return;
    window.localStorage.setItem(POPIA_CONSENT_KEY, 'true');
  }, [mounted, popiaConsentAccepted]);

  async function saveApplicationState(updatedDraft = draft) {
    if (!user || !schoolId) {
      setDraftState('saved');
      setDraftNotice('Draft saved locally in this browser.');
      return;
    }

    try {
      setDraftState('saving');
      setDraftNotice('Saving draft changes...');
      const isInsert = !appId;
      const refNum = isInsert ? createReferenceNumber() : undefined;

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
      setDraftState('saved');
      setDraftNotice('Draft saved and ready to continue.');
    } catch (err) {
      console.error('Error auto-saving parent application draft:', err);
      setDraftState('error');
      setDraftNotice('We could not save right now. Your local draft is still kept in this browser.');
    }
  }

  async function ensureApplicationExists(): Promise<string> {
    if (appId) return appId;
    if (!user || !schoolId) throw new Error('Auth session required to save draft data.');

    const refNum = createReferenceNumber();
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
    schoolId,
    citizenshipStatus: draft.citizenshipStatus,
    boardingStatus: draft.boardingStatus,
    coParentContext: draft.coParentContext,
    financialStatus: draft.financialStatus,
  };
  const documentRequirements = getApplicationDocumentRequirements(requirementInput);
  const requiredDocumentTypes = getRequiredDocumentTypes(requirementInput);
  const documentCategoryLabels: Record<
    'identity' | 'school' | 'family' | 'medical' | 'financial' | 'legal' | 'supporting',
    string
  > = {
    identity: 'Identity',
    school: 'School',
    family: 'Family',
    medical: 'Medical',
    financial: 'Financial',
    legal: 'Legal',
    supporting: 'Supporting',
  };
  const requiredDocumentRequirements = documentRequirements.filter((requirement) => requirement.required);
  const conditionalDocumentRequirements = documentRequirements.filter((requirement) => !requirement.required);
  const supportingDocumentRequirements = conditionalDocumentRequirements.filter((requirement) => requirement.category === 'supporting');
  const contextDocumentRequirements = conditionalDocumentRequirements.filter((requirement) => requirement.category !== 'supporting');
  const requiredDocsAccepted = requiredDocumentTypes.every((documentType) =>
    isDocumentStateSubmissionReady(draft.documents[documentType].validationState),
  );
  const blockingRequiredDocuments = requiredDocumentTypes.filter((documentType) =>
    isDocumentStateBlocking(draft.documents[documentType].validationState),
  );
  const reviewOnlyRequiredDocuments = requiredDocumentTypes.filter((documentType) =>
    isDocumentStateReviewOnly(draft.documents[documentType].validationState),
  );
  const documentCounts = getDocumentCounts(draft.documents, requiredDocumentTypes);

  const profileComplete = parentComplete && learnerComplete && schoolComplete && roleComplete;

  const isReadyToSubmit = readinessConfirmed && profileComplete && requiredDocsAccepted;
  const visibleRequiredDocs = requiredDocumentRequirements.slice(0, 4);
  const hiddenRequiredDocs = requiredDocumentRequirements.slice(4);

  const stepStates: Record<StepKey, boolean> = {
    checklist: readinessConfirmed,
    learner: learnerComplete && schoolComplete,
    household: parentComplete && roleComplete,
    medical: true,
    fees_docs: requiredDocsAccepted,
    review: isReadyToSubmit,
  };

  const completedSections = Object.values(stepStates).filter(Boolean).length;
  const completion = Math.round((completedSections / STEP_KEYS.length) * 100);

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

    const existingDocument = draft.documents[documentType];
    if (
      existingDocument.fileName &&
      existingDocument.fileName.toLowerCase() === file.name.toLowerCase() &&
      existingDocument.uploadStatus === 'saved'
    ) {
      updateDocument(documentType, {
        ...existingDocument,
        validationState: 'manual_review',
        message:
          'This looks like the same file you already uploaded. If you meant to replace it, choose a newer scan or photo.',
        intake: {
          processingStatus: 'manual_review',
          qualitySignals: ['possible_duplicate'],
          ocrText: null,
          confidenceScore: 0.56,
        },
      });
      return;
    }

    setUploadingDocument(documentType);

    try {
      const activeAppId = user ? await ensureApplicationExists() : 'parent-portal-draft';

      const uploadedDocument = await uploadDocumentDraft({
        schoolId: schoolId || getDefaultTenantId(),
        applicationId: activeAppId,
        documentType,
        file,
      });

      const nextDoc: DocumentDraft = {
        fileName: uploadedDocument.fileName,
        validationState: uploadedDocument.validationState,
        message: uploadedDocument.message,
        intake: uploadedDocument.intake,
        storagePath: uploadedDocument.storagePath,
        uploadedAt: uploadedDocument.uploadedAt,
        uploadStatus: uploadedDocument.uploadStatus,
      };

      updateDocument(documentType, nextDoc);
      setDraftNotice(
        uploadedDocument.uploadStatus === 'saved'
          ? `${DOCUMENT_TYPE_LABELS[documentType]} saved successfully.`
          : uploadedDocument.message,
      );

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
      setDraftNotice('Upload failed. Please retry with the same document or a clearer replacement.');
    updateDocument(documentType, {
      ...draft.documents[documentType],
      validationState: 'needs_reupload',
      uploadStatus: 'error',
      message: 'Upload failed. Check your connection, then choose this file again to retry.',
      intake: {
        processingStatus: 'failed',
        qualitySignals: [],
        ocrText: null,
        confidenceScore: null,
      },
      });
    } finally {
      setUploadingDocument(null);
    }
  }

  async function clearDocument(documentType: DocumentType) {
    updateDocument(documentType, {
      fileName: '',
      validationState: 'missing',
      message: 'Document removed from the draft.',
      intake: undefined,
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
    if (submitState === 'saving') return;

    const submittedDate = new Date().toISOString();
    const updatedDraft = {
      ...draft,
      status: 'submitted' as ApplicationStatus,
      submittedAt: submittedDate,
    };

    setDraft(updatedDraft);
    setSubmitState('saving');
    setDraftNotice('Submitting application...');

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
        setSubmitState('submitted');
        setDraftNotice('Application submitted successfully. The school will now review your file.');
      } catch (err) {
        console.error('Error updating application submission state:', err);
        setSubmitState('error');
        setDraftNotice('Submission could not be completed just now. Please try again after a short wait.');
      }
    } else {
      setSubmitState('submitted');
      setDraftNotice('Application marked as submitted in this browser draft.');
    }

    setActiveStep('review');
  }

  return (
    <>
      {!popiaConsentAccepted ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_100px_rgba(15,23,42,0.22)] sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">POPIA consent</p>
            <h3 className="display-serif mt-3 text-3xl font-semibold tracking-tight text-slate-950">Before you continue</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Eunice needs to collect and store the information you enter so the admissions team can review your child’s application. Please confirm you understand and consent to this use before you continue.
            </p>
            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={popiaConsentChecked}
                onChange={(event) => setPopiaConsentChecked(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-900 focus:ring-emerald-900"
              />
              <span>I understand and consent to the school using my details for the admissions process.</span>
            </label>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setPopiaConsentAccepted(true)}
                disabled={!popiaConsentChecked}
                className="rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Confirm and continue
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="surface-card rounded-[2.5rem] overflow-hidden">
      <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-900/5 via-white to-amber-500/5 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Application journey</p>
            <h2 className="display-serif mt-2 text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-950 via-amber-800 to-emerald-900 sm:text-4xl">
              Start your application with confidence
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              We will show the essentials first, then guide you through the form and uploads one clear step at a time.
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
            <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">{documentCounts.complete}/{documentCounts.required} docs</div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">{documentCounts.reviewOnly} review</div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">{documentCounts.blocking} fix</div>
            </div>
          </div>
        </div>

        {draftNotice && (
          <div
            className={`mt-5 rounded-2xl border px-4 py-3 text-sm shadow-sm ${
              submitState === 'error' || draftState === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-800'
                : submitState === 'submitted'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-amber-200 bg-amber-50 text-amber-800'
            }`}
            role="status"
            aria-live="polite"
          >
            {draftNotice}
          </div>
        )}

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

        <div className="mt-6 grid gap-4 md:grid-cols-2">
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
          <div className="relative mb-8 mt-2 w-full overflow-x-auto rounded-3xl border border-amber-500/10 bg-slate-50/60 px-4 py-5 shadow-inner sm:px-6">
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

          <div className="surface-card rounded-3xl p-6 sm:p-8">
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
                <div className="mt-1 text-[11px] font-medium text-slate-500">
                  {draftState === 'saving' ? 'Saving now' : draftState === 'saved' ? 'Saved locally' : draftState === 'error' ? 'Save needs attention' : 'Draft active'}
                </div>
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
                    You can save and return later, but the smoothest path is to have the main details and documents nearby before you begin.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-slate-950">The journey in three parts</div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">1. Add details</div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">Tell us about the learner and the adult responsible for the application.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">2. Upload documents</div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">Start with the required documents, then add anything conditional only if it applies.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">3. Review and send</div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">Check the final summary once, then send the file into the admissions queue.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">Required documents to have ready</div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        These are the first items to prepare so the process stays short and clear.
                      </p>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {requiredDocumentRequirements.length} total
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {visibleRequiredDocs.map((requirement) => (
                      <div key={requirement.id} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-emerald-300 bg-white text-[10px] font-bold text-emerald-800">
                          ✓
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-slate-950">{requirement.label}</div>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{requirement.reason}</p>
                        </div>
                      </div>
                    ))}
                    {hiddenRequiredDocs.length > 0 && (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-3 text-sm text-slate-500">
                        {hiddenRequiredDocs.length} more required item{hiddenRequiredDocs.length === 1 ? '' : 's'} will appear later in the guided upload step.
                      </div>
                    )}
                  </div>
                </div>

                {conditionalDocumentRequirements.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="text-sm font-semibold text-slate-950">Only if this applies to your family</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      These documents only appear when your answers make them relevant.
                    </p>
                    <div className="mt-3 space-y-2">
                      {conditionalDocumentRequirements.map((requirement) => (
                        <div key={requirement.id} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-300 bg-white text-[10px] font-bold text-slate-500">
                            +
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-sm font-semibold text-slate-950">{requirement.label}</div>
                              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">
                                Conditional
                              </span>
                            </div>
                            <p className="mt-1 text-sm leading-6 text-slate-600">{requirement.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-slate-950">For the clearest uploads</div>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                    {QUALITY_TIPS.map((tip) => (
                      <li key={tip}>• {tip}</li>
                    ))}
                  </ul>
                </div>

                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={readinessConfirmed}
                    onChange={(event) => setReadinessConfirmed(event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-700 focus:ring-primary-300"
                  />
                  <span>
                    I understand the full checklist and I am ready to continue with the application stages.
                  </span>
                </label>
              </div>
            )}

            {activeStep === 'learner' && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 shadow-sm">
                  <div className="text-sm font-semibold text-slate-950">Learner & Admission Details</div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Provide basic details of the child applying for admission to Eunice Primary School.
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
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800">Ready now</div>
                    <div className="mt-2 text-xl font-semibold text-slate-950">{documentCounts.complete}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-700">Required documents already safe for review.</p>
                  </div>
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-800">Needs attention</div>
                    <div className="mt-2 text-xl font-semibold text-slate-950">{documentCounts.blocking}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-700">Files that still need a clearer or missing upload.</p>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-800">School will check</div>
                    <div className="mt-2 text-xl font-semibold text-slate-950">{documentCounts.reviewOnly}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-700">Files that can still move forward while staff review them.</p>
                  </div>
                </div>

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
                    <div className="text-sm font-semibold text-slate-950">Upload plan</div>
                    <div className="mt-2 grid gap-2 text-sm leading-6 text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
                      <p>1. Upload the next required document only.</p>
                      <p>2. Check the saved state before moving on.</p>
                      <p>3. Add conditional items only if they apply.</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="text-sm font-semibold text-slate-950">How the document groups work</div>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800">Always required</div>
                        <p className="mt-2 text-sm leading-6 text-slate-700">These are the core documents Eunice needs for every application.</p>
                      </div>
                      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-800">Only if relevant</div>
                        <p className="mt-2 text-sm leading-6 text-slate-700">These appear when your family situation makes them necessary.</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">Supporting</div>
                        <p className="mt-2 text-sm leading-6 text-slate-700">Extra supporting files can be added later if admissions asks for them.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" open>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-950">Required documents</h4>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            Upload these first. They are the core items the school expects for every application.
                          </p>
                        </div>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {requiredDocumentRequirements.length} items
                        </span>
                      </summary>
                      <div className="mt-4 grid gap-4">
                        {requiredDocumentRequirements.map((requirement) => {
                          const documentType = requirement.documentType;
                          const document = draft.documents[documentType];
                          const isPrimary = visibleRequiredDocs.some((doc) => doc.id === requirement.id);
                          const actionChecklist = getDocumentActionChecklist(document);

                          return (
                            <div
                              key={requirement.id}
                              className={`rounded-2xl border p-4 shadow-sm ${
                                isPrimary ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-slate-50'
                              }`}
                            >
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h5 className="text-sm font-semibold text-slate-950">{requirement.label}</h5>
                                    {isPrimary && (
                                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                                        Required now
                                      </span>
                                    )}
                                    <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                      {documentCategoryLabels[requirement.category]}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm leading-6 text-slate-600">{requirement.reason}</p>
                                  <p className="mt-1 text-sm leading-6 text-slate-600">{DOCUMENT_UPLOAD_GUIDANCE[documentType]}</p>
                                  <p className="mt-1 text-xs leading-5 text-slate-500">
                                    {getDocumentStateGuidance(document.validationState)}
                                  </p>
                                  <p className="mt-1 text-xs leading-5 text-slate-500">
                                    {getDocumentQualityCue(document.validationState)}
                                  </p>
                                  {actionChecklist.length > 0 ? (
                                    <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2">
                                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-900">Quick fix</div>
                                      <div className="mt-1 text-xs leading-5 text-amber-900/85">
                                        {actionChecklist.join(' ')}
                                      </div>
                                    </div>
                                  ) : null}
                                  {document.uploadStatus !== 'idle' ? (
                                    <p className="mt-1 text-xs leading-5 text-slate-500">{document.message}</p>
                                  ) : null}
                                  {document.intake ? (
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                      {getDocumentIntakeCue(document)}
                                    </p>
                                  ) : null}
                                  {document.fileName ? (
                                    <p className="mt-2 text-xs font-medium text-slate-600">Saved: {document.fileName}</p>
                                  ) : null}
                                  {document.uploadedAt ? (
                                    <p className="mt-1 text-xs text-slate-500">
                                      Updated {new Date(document.uploadedAt).toLocaleDateString()}.
                                    </p>
                                  ) : null}
                                </div>
                              <div className={`rounded-2xl border px-3 py-2 text-sm font-medium ${getValidationTone(document.validationState)}`}>
                                {DOCUMENT_VALIDATION_LABELS[document.validationState]}
                              </div>
                            </div>

                              <div className="mt-3 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-3 sm:hidden">
                                <div className="flex items-start gap-3">
                                  <svg viewBox="0 0 64 40" className="mt-0.5 h-10 w-16 shrink-0 text-emerald-900" fill="none" aria-hidden="true">
                                    <rect x="6" y="6" width="52" height="28" rx="4" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 3" />
                                    <path d="M12 12h8M12 12v8M52 12h-8M52 12v8M12 28h8M12 28v-8M52 28h-8M52 28v-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                  </svg>
                                  <div>
                                    <div className="text-sm font-semibold text-emerald-950">Keep the page inside the frame</div>
                                    <p className="mt-1 text-xs leading-5 text-emerald-900/80">
                                      A steadier, brighter photo helps us review the file faster and reduces the chance of a re-upload.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-3">
                                <label className="inline-flex cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:bg-primary-50">
                                  {uploadingDocument === documentType ? 'Saving...' : getUploadActionLabel(document)}
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept={DOCUMENT_CONTRACTS[documentType].acceptedMimeTypes.join(',')}
                                    onChange={(event) => handleFileSelect(documentType, event.target.files?.[0] ?? null)}
                                  />
                                </label>
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
                    </details>

                    {hiddenRequiredDocs.length > 0 && (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 shadow-sm">
                        <div className="text-sm font-semibold text-slate-950">More required items</div>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          These stay tucked away until you reach the next part of the upload sequence.
                        </p>
                      </div>
                    )}

                    {contextDocumentRequirements.length > 0 && (
                      <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-semibold text-slate-950">Conditional documents</h4>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              Only upload these when your family situation makes them relevant.
                            </p>
                          </div>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                              {contextDocumentRequirements.length} items
                            </span>
                        </summary>
                        <div className="mt-4 grid gap-4">
                          {contextDocumentRequirements.map((requirement) => {
                            const documentType = requirement.documentType;
                            const document = draft.documents[documentType];
                            const actionChecklist = getDocumentActionChecklist(document);

                            return (
                              <div key={requirement.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h5 className="text-sm font-semibold text-slate-950">{requirement.label}</h5>
                                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">
                                        Conditional
                                      </span>
                                      <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                        {documentCategoryLabels[requirement.category]}
                                      </span>
                                    </div>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">{requirement.reason}</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">{DOCUMENT_UPLOAD_GUIDANCE[documentType]}</p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                      {getDocumentStateGuidance(document.validationState)}
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                      {getDocumentQualityCue(document.validationState)}
                                    </p>
                                    {actionChecklist.length > 0 ? (
                                      <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2">
                                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-900">Quick fix</div>
                                        <div className="mt-1 text-xs leading-5 text-amber-900/85">
                                          {actionChecklist.join(' ')}
                                        </div>
                                      </div>
                                    ) : null}
                                    {document.uploadStatus !== 'idle' ? (
                                      <p className="mt-1 text-xs leading-5 text-slate-500">{document.message}</p>
                                    ) : null}
                                    {document.intake ? (
                                      <p className="mt-1 text-xs leading-5 text-slate-500">
                                        {getDocumentIntakeCue(document)}
                                      </p>
                                    ) : null}
                                    {document.fileName ? (
                                      <p className="mt-2 text-xs font-medium text-slate-600">Saved: {document.fileName}</p>
                                    ) : null}
                                    {document.uploadedAt ? (
                                      <p className="mt-1 text-xs text-slate-500">
                                        Updated {new Date(document.uploadedAt).toLocaleDateString()}.
                                      </p>
                                    ) : null}
                                  </div>
                                  <div className={`rounded-2xl border px-3 py-2 text-sm font-medium ${getValidationTone(document.validationState)}`}>
                                    {DOCUMENT_VALIDATION_LABELS[document.validationState]}
                                  </div>
                                </div>

                                <div className="mt-3 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-3 sm:hidden">
                                  <div className="flex items-start gap-3">
                                    <svg viewBox="0 0 64 40" className="mt-0.5 h-10 w-16 shrink-0 text-emerald-900" fill="none" aria-hidden="true">
                                      <rect x="6" y="6" width="52" height="28" rx="4" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 3" />
                                      <path d="M12 12h8M12 12v8M52 12h-8M52 12v8M12 28h8M12 28v-8M52 28h-8M52 28v-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                    <div>
                                      <div className="text-sm font-semibold text-emerald-950">Keep the page inside the frame</div>
                                      <p className="mt-1 text-xs leading-5 text-emerald-900/80">
                                        A steadier, brighter photo helps us review the file faster and reduces the chance of a re-upload.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-3">
                                  <label className="inline-flex cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:bg-primary-50">
                                    {uploadingDocument === documentType ? 'Saving...' : getUploadActionLabel(document)}
                                    <input
                                      type="file"
                                      className="sr-only"
                                      accept={DOCUMENT_CONTRACTS[documentType].acceptedMimeTypes.join(',')}
                                      onChange={(event) => handleFileSelect(documentType, event.target.files?.[0] ?? null)}
                                    />
                                  </label>
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
                      </details>
                    )}

                    <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-950">Supporting documents</h4>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            Keep these for later or upload them only if admissions asks for extra context.
                          </p>
                        </div>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {supportingDocumentRequirements.length > 0 ? `${supportingDocumentRequirements.length} item${supportingDocumentRequirements.length === 1 ? '' : 's'}` : 'Optional'}
                        </span>
                      </summary>
                      <div className="mt-4 space-y-3">
                        {supportingDocumentRequirements.length > 0 ? (
                          supportingDocumentRequirements.map((requirement) => (
                            <div key={requirement.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                              <div className="text-sm font-semibold text-slate-950">{requirement.label}</div>
                              <p className="mt-1 text-sm leading-6 text-slate-600">{requirement.reason}</p>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                            No extra supporting documents are needed right now. If the school needs more context later, it will ask clearly.
                          </div>
                        )}
                      </div>
                    </details>
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
                  If a file is blurry or wrong, replace it now.
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  After you submit, the school will review your file and contact you if anything still needs attention.
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 sm:hidden">
                  Keep file names simple and replace only flagged items.
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                {blockingRequiredDocuments.length > 0
                  ? `Fix ${blockingRequiredDocuments.length} document${blockingRequiredDocuments.length === 1 ? '' : 's'} to continue.`
                  : reviewOnlyRequiredDocuments.length > 0
                    ? `You can submit now. ${reviewOnlyRequiredDocuments.length} file${reviewOnlyRequiredDocuments.length === 1 ? '' : 's'} will be checked by the school.`
                    : isReadyToSubmit
                      ? 'Ready to submit.'
                      : 'Complete the highlighted sections to continue.'}
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
                    disabled={!isReadyToSubmit || submitState === 'saving'}
                    className="rounded-xl bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-primary-300"
                  >
                    {submitState === 'saving' ? 'Submitting...' : 'Submit application'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        <aside className="border-t border-emerald-950/10 bg-emerald-950/[0.02] p-6 sm:p-8 lg:sticky lg:top-24 lg:self-start lg:border-l lg:border-t-0">
          <div className="surface-card flex flex-col items-center rounded-3xl p-6 text-center">
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
                      {document.intake ? (
                        <div className="mt-1 text-xs leading-5 text-slate-500">
                          {DOCUMENT_PROCESSING_STATUS_LABELS[document.intake.processingStatus]}
                        </div>
                      ) : null}
                      {document.fileName ? <div className="mt-1 text-xs font-medium text-slate-600">Saved: {document.fileName}</div> : null}
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
    </>
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
