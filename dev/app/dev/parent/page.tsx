'use client';

import { useState } from 'react';
import { PreviewShell } from '@/components/preview-shell';
import { SurfaceCard } from '@/components/surface-card';
import { UploadConfidenceChip } from '@/components/upload-confidence-chip';
import { StatusBadge } from '@/components/status-badge';
import { ParentWorkflowSidebar } from '@/components/parent-workflow-sidebar';
import {
  getParentWorkflowSnapshot,
  getPreviewUploadConfidence,
  previewApplications,
  type ParentWorkflowStepKey,
} from '@/lib/dev-preview-data';

const stepOrder: ParentWorkflowStepKey[] = ['checklist', 'learner', 'household', 'medical', 'fees_docs', 'review'];

const stepMeta: Record<ParentWorkflowStepKey, { title: string; subtitle: string; label: string }> = {
  checklist: { title: 'Welcome & checklist', subtitle: 'Start here', label: '1' },
  learner: { title: 'Your child', subtitle: 'Tell us who is applying', label: '2' },
  household: { title: 'You and your contact details', subtitle: 'Who we should reach', label: '3' },
  medical: { title: 'Care and support', subtitle: 'Anything we should know', label: '4' },
  fees_docs: { title: 'Fees & documents', subtitle: 'What to upload', label: '5' },
  review: { title: 'Review & send', subtitle: 'Check before submission', label: '6' },
};

const guidanceItems = [
  { title: 'Start with the right adult', body: 'The parent or guardian who will manage the file should begin so follow-up stays simple.' },
  { title: 'Keep the essentials close', body: 'Having the main documents nearby turns this into a short guided task instead of a stop-start search.' },
  { title: 'You can pause safely', body: 'Progress is saved, so families can step away and return later without losing their place.' },
] as const;

const stepExpectations: Record<ParentWorkflowStepKey, { purpose: string; prepare: string; next: string; timing: string }> = {
  checklist: {
    purpose: 'Start here. We will keep the journey short and clear.',
    prepare: 'Have your ID, the learner’s basic details, and a few key documents nearby.',
    next: 'Once you begin, we will guide you one step at a time.',
    timing: 'This first screen only takes a minute or two.',
  },
  learner: {
    purpose: 'We ask for the learner’s details first so the application follows the right school and grade path.',
    prepare: 'Keep the learner’s name, date of birth, and current school information close by.',
    next: 'After this, we will ask for the parent or guardian details.',
    timing: 'Usually a quick section if the details are ready.',
  },
  household: {
    purpose: 'We use this to know who to contact and who is responsible for the application.',
    prepare: 'Have the parent or guardian contact details ready, including a phone number and email address.',
    next: 'Then we will move into any care, support, or health information that matters.',
    timing: 'This section stays short unless extra context is needed.',
  },
  medical: {
    purpose: 'Only share the care, health, or support details that would help Eunice support your child well.',
    prepare: 'Share what is relevant and leave out anything that does not apply.',
    next: 'After this, we will handle the uploads and any fee-related details that apply.',
    timing: 'We only ask follow-up questions when they are needed.',
  },
  fees_docs: {
    purpose: 'This is where we collect the documents and any fee details needed for the application to move forward.',
    prepare: 'Keep your documents ready and make sure every upload is clear and readable.',
    next: 'Once this is done, you will see a final review before you send the application.',
    timing: 'This is usually the busiest section, so we keep it guided and clear.',
  },
  review: {
    purpose: 'This is your final check before you send it to Eunice.',
    prepare: 'Pause here and review anything that still needs attention.',
    next: 'After submission, the admissions team reviews the application and contacts you if anything else is needed.',
    timing: 'This is the last step before your file enters the queue.',
  },
};

const documentGroups = [
  {
    title: 'Always needed',
    why: 'These are the core records Eunice needs to process the application.',
    items: ['Birth certificate', 'Latest school report'],
  },
  {
    title: 'Usually needed',
    why: 'These help confirm where the learner lives and who is responsible.',
    items: ['Proof of residence', 'Parent / guardian contact details'],
  },
  {
    title: 'Only if relevant',
    why: 'These appear only when the parent’s answers make them necessary.',
    items: ['Immunisation record', 'Special support or custody-related documents'],
  },
  {
    title: 'Supporting later',
    why: 'These can be added later if admissions asks for extra context.',
    items: ['Fee-payer proof', 'Additional supporting documents'],
  },
] as const;

const stepHighlights: Record<ParentWorkflowStepKey, { title: string; detail: string }> = {
  checklist: { title: 'Start here', detail: 'See what to prepare before you begin.' },
  learner: { title: 'About your child', detail: 'Capture the learner’s basic details and grade context.' },
  household: { title: 'Who to contact', detail: 'Tell us who is responsible and how we should reach you.' },
  medical: { title: 'Support information', detail: 'Share only the details Eunice needs to support your child well.' },
  fees_docs: { title: 'Uploads and fees', detail: 'Keep the important documents together and upload them when prompted.' },
  review: { title: 'Check and send', detail: 'Review the full application before you submit it.' },
};

const stepActionMeta: Record<ParentWorkflowStepKey, { title: string; summary: string; actions: string[]; ctaLabel: string }> = {
  checklist: {
    title: 'Get ready to start',
    summary: 'Spend one minute getting the essentials close by so the application feels easy instead of stop-start.',
    actions: [
      'Keep the learner details and your contact information beside you.',
      'Check that the main documents are clear and easy to upload later.',
      'Start the form once you know who will complete the application.',
    ],
    ctaLabel: 'Start learner details',
  },
  learner: {
    title: 'Complete the learner section',
    summary: 'Capture the learner details exactly once so the rest of the journey follows the right school and grade path.',
    actions: [
      'Use official spellings and dates from school records.',
      'Confirm the grade and previous school before moving on.',
      'Finish this step so we can move to parent or guardian details.',
    ],
    ctaLabel: 'Continue to household details',
  },
  household: {
    title: 'Add the responsible adult',
    summary: 'Make sure admissions can contact the right parent or guardian without needing a follow-up call.',
    actions: [
      'Use the email address and phone number checked most often.',
      'Confirm who is financially and administratively responsible.',
      'Complete this step before any support or document questions.',
    ],
    ctaLabel: 'Continue to care and support',
  },
  medical: {
    title: 'Share only what helps',
    summary: 'Give Eunice the context needed to support the learner well, without turning this into a long medical form.',
    actions: [
      'Add only care or support details that genuinely matter.',
      'Skip anything that does not apply to your child.',
      'Move on once the important support information is clear.',
    ],
    ctaLabel: 'Continue to fees and documents',
  },
  fees_docs: {
    title: 'Get the file ready for review',
    summary: 'This is the step that most directly affects whether admissions can move quickly, so keep it practical and complete.',
    actions: [
      'Upload the required files first before optional extras.',
      'Replace any unclear or flagged document now.',
      'Finish this step so the final review feels simple.',
    ],
    ctaLabel: 'Continue to review',
  },
  review: {
    title: 'Prepare to submit',
    summary: 'Use this final pass to catch anything missing before the admissions team sees the file.',
    actions: [
      'Scan each section once for missing answers.',
      'Check that every required document is ready or acknowledged.',
      'Submit only when the application feels complete and accurate.',
    ],
    ctaLabel: 'Review before submission',
  },
};

export default function DevParentPage() {
  const featuredApplication = previewApplications[0];
  const workflow = getParentWorkflowSnapshot(featuredApplication);
  const uploadConfidence = getPreviewUploadConfidence(featuredApplication);
  const [activeTab, setActiveTab] = useState<ParentWorkflowStepKey>('checklist');

  const activeIndex = stepOrder.indexOf(activeTab);
  const progress = Math.round(((activeIndex + 1) / stepOrder.length) * 100);
  const readinessTone = workflow.blockers.length > 0 ? 'rose' : workflow.reviewOnlyWarnings.length > 0 ? 'amber' : 'emerald';
  const stepAction = stepActionMeta[activeTab];
  const advanceStep = () => {
    const nextStep = stepOrder[Math.min(stepOrder.length - 1, activeIndex + 1)];
    setActiveTab(nextStep);
  };

  return (
    <PreviewShell
      eyebrow="Dev Preview"
      title="Apply for your child"
      description="A calm, guided admissions journey for first-time parents so you always know what comes next."
      surface="parent"
      backLabel="Back to preview hub"
    >
      <div className="grid gap-3 xl:grid-cols-[260px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-3">
          <SurfaceCard className="border border-primary-100/80 bg-white/85 p-3.5 shadow-[0_18px_42px_rgba(11,20,12,0.06)]">
            <div className="text-xs uppercase tracking-[0.18em] text-primary-800/70">My Application</div>
            <div className="mt-2 text-lg font-semibold text-slate-950">{featuredApplication.ref}</div>
            <div className="mt-1 text-sm text-slate-600">{featuredApplication.learnerName}</div>
            <div className="mt-3 flex items-center gap-2">
              <StatusBadge status={featuredApplication.status} />
            </div>
          </SurfaceCard>

          <SurfaceCard className="border border-slate-100 bg-white/90 p-3.5">
            <div className="space-y-1.5 text-sm">
              {['Dashboard', 'Messages', 'Documents', 'Payments', 'Calendar', 'FAQs'].map((label, index) => (
                <div
                  key={label}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 transition ${
                    index === 0 ? 'border border-accent-200 bg-[rgba(255,248,231,0.96)] text-primary-950 shadow-[0_10px_24px_rgba(202,138,4,0.10)]' : 'text-slate-600 hover:bg-[#f8f4e8] hover:text-slate-900'
                  }`}
                >
                  <span>{label}</span>
                  {label === 'Messages' ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">1</span> : null}
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="border border-slate-100 bg-white/90 p-3.5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Need help?</div>
            <div className="mt-2 text-sm font-semibold text-slate-950">Admissions Office</div>
            <div className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
              <div>011 674 4150</div>
              <div>admissions@eunice.co.za</div>
              <div>Mon-Fri 07:30-15:30</div>
            </div>
          </SurfaceCard>
        </aside>

        <main className="min-w-0 space-y-3">
          <SurfaceCard className="overflow-hidden border border-primary-100 bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(250,247,240,0.98)_100%)] p-0 text-slate-950 shadow-[0_22px_58px_rgba(11,20,12,0.10)]">
            <div className="h-1 w-full bg-[#b88907]" />
            <div className="border-b border-slate-200 px-5 py-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Step {stepMeta[activeTab].label}</div>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-950">{stepMeta[activeTab].title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{stepMeta[activeTab].subtitle}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="rounded-full border border-primary-100 bg-white px-4 py-2 text-sm text-slate-700">Estimated time: 25-35 minutes</div>
                  <button className="inline-flex items-center rounded-full border border-primary-100 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                    Save & exit
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 px-5 py-4 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
              <div className="rounded-[24px] border border-primary-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,248,231,0.95)_100%)] p-4 shadow-[0_10px_26px_rgba(11,20,12,0.05)]">
                <div className="text-xs uppercase tracking-[0.18em] text-primary-800/70">Current step</div>
                <div className="mt-2 text-lg font-semibold text-slate-950">{stepHighlights[activeTab].title}</div>
                <div className="mt-1 text-sm leading-6 text-slate-600">{stepHighlights[activeTab].detail}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {stepOrder.map((step, index) => (
                    <span
                      key={step}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        step === activeTab ? 'bg-primary-900 text-white' : index < activeIndex ? 'bg-primary-50 text-primary-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {stepMeta[step].label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-primary-200 bg-[linear-gradient(180deg,rgba(255,248,231,0.98)_0%,rgba(255,243,216,0.98)_100%)] p-4 shadow-[0_12px_30px_rgba(11,20,12,0.06)]">
                <div className="text-xs uppercase tracking-[0.18em] text-primary-900/70">Do this now</div>
                <div className="mt-2 text-lg font-semibold text-slate-950">{stepAction.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{stepAction.summary}</p>
                <div className="mt-4 grid gap-2">
                  {stepAction.actions.map((action) => (
                    <div key={action} className="flex items-start gap-3 rounded-2xl border border-primary-200 bg-white/85 px-3 py-3">
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-900 text-[11px] font-semibold text-white">+</span>
                      <span className="text-sm leading-6 text-slate-800">{action}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">{stepExpectations[activeTab].timing}</span>
                  <button
                    type="button"
                    onClick={advanceStep}
                    className="rounded-full bg-primary-900 px-3 py-1 text-xs font-semibold text-white"
                  >
                    {stepAction.ctaLabel}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 px-5 pb-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)] 2xl:grid-cols-[minmax(0,1.48fr)_minmax(320px,0.52fr)]">
              <div className="space-y-4">
                <div className="rounded-[28px] border border-primary-100 bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(250,247,240,0.98)_100%)] p-4 shadow-[0_10px_26px_rgba(11,20,12,0.04)]">
                  <div className="text-xs uppercase tracking-[0.18em] text-primary-800/70">Before you begin</div>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    {[
                      ['Learner details', 'Name, date of birth, grade, and school background.'],
                      ['Parent contact', 'Phone number, email address, and the adult responsible.'],
                      ['Key documents', 'Birth certificate, latest report, and anything else shown later.'],
                    ].map(([title, body]) => (
                      <div key={title} className="rounded-2xl border border-primary-100 bg-white p-3 shadow-[0_8px_18px_rgba(11,20,12,0.03)]">
                        <div className="text-sm font-semibold text-slate-950">{title}</div>
                        <div className="mt-1 text-sm leading-6 text-slate-700">{body}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-2xl border border-dashed border-primary-200 bg-primary-50/35 px-3 py-2 text-sm leading-6 text-slate-700">
                    You can save and come back at any point, so this never has to be finished in one sitting.
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(249,247,240,0.98)_100%)] p-4 shadow-[0_10px_26px_rgba(11,20,12,0.04)]">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-700">Document readiness</div>
                  <div className="mt-2 text-sm leading-6 text-slate-700">
                    We group documents by purpose so you can see what to prepare first without a long list in the way.
                  </div>
                  <div className="mt-3 rounded-2xl border border-primary-100 bg-white px-4 py-3 shadow-[0_8px_18px_rgba(11,20,12,0.03)]">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-primary-800/70">Upload confidence</div>
                    <div className="mt-1 text-sm font-semibold text-slate-950">{uploadConfidence.label}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-700">{uploadConfidence.summary}</div>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
                      <UploadConfidenceChip tone="ready" label={`${uploadConfidence.readyCount} clear`} />
                      <UploadConfidenceChip tone="mixed" label={`${uploadConfidence.reviewCount} review`} />
                      <UploadConfidenceChip tone="needs_attention" label={`${uploadConfidence.blockingCount} blocked`} />
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800">Ready now</div>
                      <div className="mt-2 text-lg font-semibold text-slate-950">{workflow.readyRequiredDocuments}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-700">Required documents already safe for review.</div>
                    </div>
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-800">Needs attention</div>
                      <div className="mt-2 text-lg font-semibold text-slate-950">{workflow.blockers.length}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-700">Uploads that still need a clearer or missing file.</div>
                    </div>
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-800">School will check</div>
                      <div className="mt-2 text-lg font-semibold text-slate-950">{workflow.reviewOnlyWarnings.length}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-700">Items that can still move forward while staff review them.</div>
                    </div>
                  </div>
                  <div className="mt-3.5 space-y-3">
                    {documentGroups.map((group) => (
                      <details key={group.title} className="rounded-2xl border border-slate-200 bg-white p-3.5" open={group.title === 'Always needed'}>
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-slate-950">{group.title}</div>
                            <div className="mt-1 text-xs leading-5 text-slate-600">{group.why}</div>
                          </div>
                          <span className="rounded-full border border-slate-200 bg-[#fbf8f0] px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                            {group.items.length} items
                          </span>
                        </summary>
                        <div className="mt-3 space-y-2">
                          {group.items.slice(0, 2).map((item) => (
                            <div key={item} className="flex items-center justify-between rounded-xl border border-slate-200 bg-[#fbf8f0] px-3 py-2">
                              <div>
                                <div className="text-sm font-semibold text-slate-950">{item}</div>
                                <div className="text-xs text-slate-600">Keep this ready or upload it when prompted</div>
                              </div>
                              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800">Pending</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>

                <details className="rounded-[24px] border border-slate-200 bg-[#fffdf8] p-4 shadow-[0_10px_26px_rgba(11,20,12,0.04)]">
                  <summary className="cursor-pointer list-none text-xs uppercase tracking-[0.16em] text-slate-700">Stay on track</summary>
                  <div className="mt-3 text-sm leading-6 text-slate-700">
                    {activeTab === 'checklist' && 'This first screen helps you understand the journey before you begin. We keep it short, clear, and easy to return to.'}
                    {activeTab === 'learner' && 'Capture the learner’s details exactly as they appear on official records.'}
                    {activeTab === 'household' && 'Add the parent or guardian details that admissions staff will use to contact you.'}
                    {activeTab === 'medical' && 'Share only the care, medical, and support details that help Eunice support your child well.'}
                    {activeTab === 'fees_docs' && 'Confirm fee responsibility and upload the required documents with clear images.'}
                    {activeTab === 'review' && 'Review everything once more before you send it to the admissions queue.'}
                  </div>
                  <div className="mt-4 rounded-2xl border border-primary-100 bg-[#fff8e7] p-3.5">
                    <div className="text-xs uppercase tracking-[0.16em] text-[#3a2b07]">Helpful reminder</div>
                    <div className="mt-1 text-sm leading-6 text-[#3a2b07]">
                      {activeTab === 'fees_docs'
                        ? 'Documents are grouped by purpose so you can focus on the important files without feeling overwhelmed.'
                        : activeTab === 'review'
                          ? 'If something is missing, we’ll show it clearly before you send the application.'
                          : 'You can save and return at any time if you need a break.'}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const currentIndex = stepOrder.indexOf(activeTab);
                        const prevStep = stepOrder[Math.max(0, currentIndex - 1)];
                        setActiveTab(prevStep);
                      }}
                      className="rounded-xl border border-slate-200 bg-[#fcfaf5] px-4 py-2.5 text-sm font-semibold text-slate-700"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={advanceStep}
                      className="rounded-xl bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(11,20,12,0.16)]"
                    >
                      {stepAction.ctaLabel}
                    </button>
                  </div>
                </details>
              </div>

              <ParentWorkflowSidebar
                featuredApplication={featuredApplication}
                guidanceItems={guidanceItems}
                primaryActionLabel={stepAction.ctaLabel}
                progress={progress}
                readinessTone={readinessTone}
                stepActionSummary={stepAction.summary}
                stepNext={stepExpectations[activeTab].next}
                workflow={workflow}
              />
            </div>
          </SurfaceCard>
        </main>
      </div>
    </PreviewShell>
  );
}
