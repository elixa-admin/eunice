'use client';

import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  APPLICATION_STATUS_DESCRIPTIONS,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from '@/lib/domain/applications';
import {
  DOCUMENT_CONTRACTS,
  DOCUMENT_TYPE_LABELS,
  REQUIRED_DOCUMENT_TYPES,
  type DocumentType,
  type DocumentValidationState,
} from '@/lib/documents/contracts';
import { validateDocumentUpload } from '@/lib/documents/validation';

const STEP_KEYS = ['parent', 'learner', 'school', 'documents'] as const;
type StepKey = (typeof STEP_KEYS)[number];

type DocumentDraft = {
  fileName: string;
  validationState: DocumentValidationState;
  message: string;
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
  notes: string;
  status: ApplicationStatus;
  submittedAt: string | null;
  documents: Record<DocumentType, DocumentDraft>;
};

type StepMeta = {
  title: string;
  eyebrow: string;
  description: string;
};

const STEP_META: Record<StepKey, StepMeta> = {
  parent: {
    eyebrow: 'Step 1',
    title: 'Parent details',
    description: 'Start with the person responsible for the application.',
  },
  learner: {
    eyebrow: 'Step 2',
    title: 'Learner details',
    description: 'Capture the learner identity and current school context.',
  },
  school: {
    eyebrow: 'Step 3',
    title: 'School context',
    description: 'Add the grade, intake year, and family context Eunice needs.',
  },
  documents: {
    eyebrow: 'Step 4',
    title: 'Documents and review',
    description: 'Check the required documents before you submit the draft.',
  },
};

const STORAGE_KEY = 'eunice-parent-application-draft-v1';

function createInitialDocumentDrafts(): Record<DocumentType, DocumentDraft> {
  return {
    birth_cert: {
      fileName: '',
      validationState: 'missing',
      message: 'Birth certificate is still required.',
    },
    school_report: {
      fileName: '',
      validationState: 'missing',
      message: 'Previous school report is still required.',
    },
    proof_residence: {
      fileName: '',
      validationState: 'missing',
      message: 'Proof of residence is still required.',
    },
    id_copy: {
      fileName: '',
      validationState: 'missing',
      message: 'Parent ID or passport copy is still required.',
    },
    other: {
      fileName: '',
      validationState: 'missing',
      message: 'Optional supporting document can be added later.',
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
    notes: '',
    status: 'draft',
    submittedAt: null,
    documents: createInitialDocumentDrafts(),
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

export default function ParentApplicationWorkflow() {
  const [activeStep, setActiveStep] = useState<StepKey>('parent');
  const [draft, setDraft] = useState<ApplicationDraft>(createInitialDraft);
  const [lastSavedAt, setLastSavedAt] = useState('Not saved yet');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setMounted(true);
        return;
      }

      const parsed = JSON.parse(stored) as Partial<ApplicationDraft> & { activeStep?: StepKey };
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
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...draft,
        activeStep,
      }),
    );
    setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [activeStep, draft, mounted]);

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
  const requiredDocsAccepted = REQUIRED_DOCUMENT_TYPES.every((documentType) =>
    ['accepted', 'verified'].includes(draft.documents[documentType].validationState),
  );

  const stepStates: Record<StepKey, boolean> = {
    parent: parentComplete,
    learner: learnerComplete,
    school: schoolComplete,
    documents: requiredDocsAccepted,
  };

  const completion = useMemo(() => {
    const completedSections = Object.values(stepStates).filter(Boolean).length;
    return Math.round((completedSections / STEP_KEYS.length) * 100);
  }, [stepStates]);

  const isReadyToSubmit = parentComplete && learnerComplete && schoolComplete && requiredDocsAccepted;

  function updateField<K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) {
    setDraft((current) => ({
      ...current,
      [key]: value,
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

  function handleFileSelect(documentType: DocumentType, file: File | null) {
    if (!file) return;

    const validation = validateDocumentUpload({
      documentType,
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      fileSizeBytes: file.size,
    });

    updateDocument(documentType, {
      fileName: file.name,
      validationState: validation.state,
      message: validation.message,
    });
  }

  function loadSampleDocument(documentType: DocumentType) {
    updateDocument(documentType, {
      fileName: `sample-${documentType}.pdf`,
      validationState: 'accepted',
      message: 'Sample document attached for the preview flow.',
    });
  }

  function clearDocument(documentType: DocumentType) {
    updateDocument(documentType, {
      fileName: '',
      validationState: 'missing',
      message: 'Document removed from the draft.',
    });
  }

  function goToNextStep() {
    const currentIndex = getStepIndex(activeStep);
    const nextStep = STEP_KEYS[currentIndex + 1];
    if (nextStep) setActiveStep(nextStep);
  }

  function goToPreviousStep() {
    const currentIndex = getStepIndex(activeStep);
    const previousStep = STEP_KEYS[currentIndex - 1];
    if (previousStep) setActiveStep(previousStep);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isReadyToSubmit) return;

    setDraft((current) => ({
      ...current,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    }));
    setActiveStep('documents');
  }

  return (
    <section className="rounded-[2rem] border border-primary-100 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
      <div className="border-b border-primary-100 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Application workspace</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Draft your Eunice application step by step
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              This preview keeps the parent journey, status language, and document rules aligned while we build the
              real intake flow.
            </p>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-slate-700">
            <div className="font-semibold text-slate-950">{APPLICATION_STATUS_LABELS[draft.status]}</div>
            <div className="mt-1 max-w-md text-slate-600">{APPLICATION_STATUS_DESCRIPTIONS[draft.status]}</div>
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

          <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
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

            {activeStep === 'parent' && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
              </div>
            )}

            {activeStep === 'learner' && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
                  label="Current/previous school"
                  value={draft.previousSchool}
                  onChange={(value) => updateField('previousSchool', value)}
                  placeholder="Current school or nursery"
                />
              </div>
            )}

            {activeStep === 'school' && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Intake year"
                  value={draft.intakeYear}
                  onChange={(value) => updateField('intakeYear', value)}
                  placeholder="2026"
                />
                <Field
                  label="Sibling at Eunice?"
                  value={draft.siblingAtSchool}
                  onChange={(value) => updateField('siblingAtSchool', value)}
                  placeholder="Yes or no"
                />
                <Field
                  label="Co-parent context"
                  value={draft.coParentContext}
                  onChange={(value) => updateField('coParentContext', value)}
                  placeholder="Yes or no"
                />
                <div className="rounded-2xl border border-dashed border-primary-200 bg-primary-50 p-4 text-sm leading-6 text-slate-700">
                  <div className="font-semibold text-slate-950">Helpful note</div>
                  <p className="mt-1">
                    We will add richer household context, sibling links, and admissions flags in later slices once the
                    workflow is confirmed.
                  </p>
                </div>
              </div>
            )}

            {activeStep === 'documents' && (
              <div className="mt-6 space-y-4">
                <div className="grid gap-4">
                  {REQUIRED_DOCUMENT_TYPES.map((documentType) => {
                    const document = draft.documents[documentType];

                    return (
                      <div key={documentType} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-slate-950">{DOCUMENT_TYPE_LABELS[documentType]}</h4>
                              <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-700">
                                Required
                              </span>
                            </div>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              Accepted formats: {DOCUMENT_CONTRACTS[documentType].acceptedMimeTypes.join(', ')}.
                              Maximum size: 5 MB.
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">{document.message}</p>
                            {document.fileName ? (
                              <p className="mt-1 text-xs font-medium text-slate-500">Selected file: {document.fileName}</p>
                            ) : null}
                          </div>
                          <div className={`rounded-2xl border px-3 py-2 text-sm font-medium ${getValidationTone(document.validationState)}`}>
                            {document.validationState.replaceAll('_', ' ')}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <label className="inline-flex cursor-pointer items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:bg-primary-50">
                            Choose file
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

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-950">Optional supporting document</div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Add a sibling letter, custody document, or any extra supporting file if needed.
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
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                {isReadyToSubmit
                  ? 'The draft is ready to submit.'
                  : 'Complete the highlighted sections and required documents to unlock submission.'}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  disabled={activeStep === 'parent'}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Back
                </button>
                {activeStep !== 'documents' ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
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
            <div className="mt-4 space-y-3">
              {REQUIRED_DOCUMENT_TYPES.map((documentType) => {
                const document = draft.documents[documentType];
                return (
                  <div key={documentType} className="flex items-start justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">{DOCUMENT_TYPE_LABELS[documentType]}</div>
                      <div className="mt-1 text-xs leading-5 text-slate-500">{document.message}</div>
                    </div>
                    <div className="text-right">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getValidationTone(document.validationState)}`}>
                        {document.validationState.replaceAll('_', ' ')}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
      />
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
