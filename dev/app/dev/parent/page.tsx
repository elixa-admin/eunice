'use client';

import type React from 'react';
import { useState } from 'react';
import { PreviewShell } from '@/components/preview-shell';
import { SurfaceCard } from '@/components/surface-card';
import { StatusBadge } from '@/components/status-badge';
import { getParentWorkflowSnapshot, previewApplications, type ParentWorkflowStepKey } from '@/lib/dev-preview-data';

const stepOrder: ParentWorkflowStepKey[] = ['checklist', 'learner', 'household', 'medical', 'fees_docs', 'review'];

const stepMeta: Record<ParentWorkflowStepKey, { title: string; subtitle: string; label: string }> = {
  checklist: { title: 'Before You Begin', subtitle: 'Prepare documents and understand the journey', label: '1' },
  learner: { title: 'Learner Details', subtitle: 'About your child', label: '2' },
  household: { title: 'Parent & Guardian', subtitle: 'Your contact details', label: '3' },
  medical: { title: 'Medical & Support', subtitle: 'Health and wellbeing', label: '4' },
  fees_docs: { title: 'Documents & Fees', subtitle: 'Uploads and payment', label: '5' },
  review: { title: 'Review & Submit', subtitle: 'Check and confirm', label: '6' },
};

const guidanceItems = [
  { title: 'Who should complete this?', body: 'The parent or legal guardian who will manage the application should start here.' },
  { title: 'Admissions criteria', body: 'Gather documents now so the flow stays smooth and nothing gets held up later.' },
  { title: 'What happens next?', body: 'Once submitted, the admissions team reviews your file and may request clarifications or re-uploads.' },
] as const;

const stepExpectations: Record<ParentWorkflowStepKey, { purpose: string; prepare: string; next: string; timing: string }> = {
  checklist: {
    purpose: 'Get ready before you begin.',
    prepare: 'Have your ID, learner documents, and contact details nearby.',
    next: 'Once you start, we’ll guide you step by step.',
    timing: 'This first screen takes only a minute or two.',
  },
  learner: {
    purpose: 'Tell us who the child is and what they are applying for.',
    prepare: 'Keep the learner’s details and school history close by.',
    next: 'After this, we’ll move to parent and household details.',
    timing: 'Usually a short section if the details are ready.',
  },
  household: {
    purpose: 'Capture the responsible adult and household contact information.',
    prepare: 'Have the parent or guardian contact details ready.',
    next: 'Then we’ll ask about support, health, and readiness.',
    timing: 'This stays short unless extra context is needed.',
  },
  medical: {
    purpose: 'Share any care or support information we need to know.',
    prepare: 'Only share what is relevant to Eunice supporting the learner well.',
    next: 'Next we’ll handle fees and document uploads.',
    timing: 'We only ask follow-up questions if they matter.',
  },
  fees_docs: {
    purpose: 'Confirm fee responsibility and collect the required documents.',
    prepare: 'Keep your documents ready and make sure images are clear.',
    next: 'Once complete, you’ll review everything before submission.',
    timing: 'This is usually the heaviest section, but we keep it guided.',
  },
  review: {
    purpose: 'Check everything, confirm consent, and submit with confidence.',
    prepare: 'Take a moment to review anything that still needs attention.',
    next: 'After submission, the admissions team will review your application.',
    timing: 'This is the final step before the file enters the queue.',
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
] as const;

const stepHighlights: Record<ParentWorkflowStepKey, { title: string; detail: string }> = {
  checklist: { title: 'Start with the checklist', detail: 'Understand the journey and prepare before the form begins.' },
  learner: { title: 'Learner details', detail: 'Capture the learner’s identity and grade context clearly.' },
  household: { title: 'Household details', detail: 'Tell us who is responsible and how we should contact you.' },
  medical: { title: 'Care and support', detail: 'Share only the information Eunice needs to support the learner well.' },
  fees_docs: { title: 'Fees and documents', detail: 'Group uploads by purpose and keep the important files ready.' },
  review: { title: 'Review and submit', detail: 'Check for missing items before you send the application in.' },
};

export default function DevParentPage() {
  const featuredApplication = previewApplications[0];
  const workflow = getParentWorkflowSnapshot(featuredApplication);
  const [activeTab, setActiveTab] = useState<ParentWorkflowStepKey>('checklist');

  const activeIndex = stepOrder.indexOf(activeTab);
  const progress = Math.round(((activeIndex + 1) / stepOrder.length) * 100);

  return (
    <PreviewShell
      eyebrow="Dev Preview"
      title="Parent Application Process"
      description="A calm, guided admissions journey that makes the next step obvious and keeps documents in view."
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
                    index === 0
                      ? 'border border-accent-200 bg-[rgba(255,248,231,0.96)] text-primary-950 shadow-[0_10px_24px_rgba(202,138,4,0.10)]'
                      : 'text-slate-600 hover:bg-[#f8f4e8] hover:text-slate-900'
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
          <SurfaceCard className="overflow-hidden border border-[#0f3c28]/35 bg-[#073820] p-0 text-white shadow-[0_22px_58px_rgba(11,20,12,0.16)]">
            <div className="h-1 w-full bg-[#b88907]" />
            <div className="border-b border-white/12 px-5 py-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/70">Step {stepMeta[activeTab].label}</div>
                  <h2 className="mt-2 text-3xl font-semibold text-white">{stepMeta[activeTab].title}</h2>
                  <p className="mt-1 text-sm text-white/80">{stepMeta[activeTab].subtitle}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white">Estimated time: 25-35 minutes</div>
                  <button className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                    Save & exit
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-3 px-5 py-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)] 2xl:grid-cols-[minmax(0,1.56fr)_minmax(360px,0.44fr)]">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {stepOrder.map((step, index) => {
                    const isActive = activeTab === step;
                    const isDone = index < activeIndex;
                    return (
                      <button
                        key={step}
                        onClick={() => setActiveTab(step)}
                        className={`min-w-[128px] rounded-2xl border p-3 text-left transition ${
                          isActive
                            ? 'border-accent-200 bg-[rgba(255,248,231,0.98)] text-primary-950 shadow-[0_12px_24px_rgba(202,138,4,0.10)]'
                            : isDone
                              ? 'border-white/20 bg-white/12 text-white'
                              : 'border-white/15 bg-white/6 text-white/78 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                            isActive ? 'border-primary-900 bg-primary-900 text-white' : 'border-current/20 bg-white/10 text-current'
                          }`}>
                            {stepMeta[step].label}
                          </div>
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{stepMeta[step].title}</div>
                            <div className="mt-1 text-[11px] opacity-75">{stepMeta[step].subtitle}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-[28px] border border-white/12 bg-white/95 p-4 text-slate-950 shadow-[0_18px_50px_rgba(11,20,12,0.10)]">
                  <div className="mb-4 grid gap-3 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
                    <div className="rounded-[24px] border border-primary-100 bg-white p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-primary-800/70">Current step</div>
                      <div className="mt-2 text-lg font-semibold text-slate-950">{stepHighlights[activeTab].title}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-600">{stepHighlights[activeTab].detail}</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {stepOrder.map((step, index) => (
                          <span
                            key={step}
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                              step === activeTab
                                ? 'bg-primary-900 text-white'
                                : index < activeIndex
                                  ? 'bg-primary-50 text-primary-800'
                                  : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {stepMeta[step].label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-primary-100 bg-[#f8f4e8] p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-primary-800/70">Progress</div>
                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary-200 bg-white text-lg font-semibold text-slate-950">{progress}%</div>
                        <div className="space-y-1 text-sm leading-6 text-slate-600">
                          <p>{workflow.canSubmit ? 'Ready to review and submit.' : 'Work through the current step before moving on.'}</p>
                          <p>
                            {workflow.readyRequiredDocuments} of {workflow.totalRequiredDocuments} required documents are ready.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 grid gap-3 xl:grid-cols-[minmax(0,1.18fr)_minmax(280px,0.82fr)]">
                    <div className="rounded-[24px] border border-primary-100 bg-[#f8f4e8] p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-primary-800/70">What this step is for</div>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{stepExpectations[activeTab].purpose}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-primary-100 bg-white px-3 py-1 text-xs font-medium text-slate-700">{stepExpectations[activeTab].timing}</span>
                        {activeTab === 'checklist' ? (
                          <button
                            type="button"
                            onClick={() => setActiveTab('learner')}
                            className="rounded-full bg-primary-900 px-3 py-1 text-xs font-semibold text-white"
                          >
                            Start application
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-[#faf7ef] p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">What happens next</div>
                      <div className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                        <p>{stepExpectations[activeTab].prepare}</p>
                        <p>{stepExpectations[activeTab].next}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 grid gap-4 xl:grid-cols-[minmax(0,1.28fr)_minmax(300px,0.72fr)] 2xl:grid-cols-[minmax(0,1.34fr)_minmax(340px,0.66fr)]">
                    <div className="space-y-2.5">
                      <div className="text-xs uppercase tracking-[0.18em] text-primary-800/70">Before you begin</div>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {[
                          ['Prepare documents', 'Keep the learner’s details and key documents nearby.'],
                          ['Save and return', 'You can pause and continue later without losing your place.'],
                          ['Review clearly', 'We will show you what is required and what can be reviewed later.'],
                          ['Stay informed', 'We will explain what happens after each step.'],
                        ].map(([title, body]) => (
                          <div key={title} className="rounded-2xl border border-primary-100 bg-primary-50/45 p-3.5">
                            <div className="text-sm font-semibold text-slate-950">{title}</div>
                            <div className="mt-1 text-sm leading-6 text-slate-600">{body}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-[#faf7ef] p-4">
                      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Document readiness</div>
                      <div className="mt-2 text-sm leading-6 text-slate-600">
                        We group documents by purpose so you can see what matters most without scanning a long list.
                      </div>
                      <div className="mt-3.5 space-y-3">
                        {documentGroups.map((group) => (
                          <div key={group.title} className="rounded-2xl border border-slate-200 bg-white p-3.5">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold text-slate-950">{group.title}</div>
                                <div className="mt-1 text-xs leading-5 text-slate-500">{group.why}</div>
                              </div>
                              <span className="rounded-full border border-primary-100 bg-primary-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-800">
                                {group.items.length} items
                              </span>
                            </div>
                            <div className="mt-3 space-y-2">
                              {group.items.map((item) => (
                                <div key={item} className="flex items-center justify-between rounded-xl border border-slate-200 bg-[#fcfaf5] px-3 py-2">
                                  <div>
                                    <div className="text-sm font-medium text-slate-950">{item}</div>
                                    <div className="text-xs text-slate-500">Keep this ready or upload it when prompted</div>
                                  </div>
                                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">Pending</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{stepMeta[activeTab].title}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">
                      {activeTab === 'checklist' && 'This first screen is your guide to what comes next. We will keep the flow short, clear, and easy to return to.'}
                      {activeTab === 'learner' && 'Capture the learner’s details exactly as they appear on official records.'}
                      {activeTab === 'household' && 'Add the parent and guardian details that admissions staff will use to contact you.'}
                      {activeTab === 'medical' && 'Share only the care, medical, and support context we need to support your child well.'}
                      {activeTab === 'fees_docs' && 'Confirm fee responsibility and upload the required documents with clear images.'}
                      {activeTab === 'review' && 'Review everything once more before you submit it to the admissions queue.'}
                    </div>
                    <div className="mt-4 rounded-2xl border border-primary-100 bg-primary-50/45 p-3.5">
                      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Helpful reminder</div>
                      <div className="mt-1 text-sm leading-6 text-slate-600">
                        {activeTab === 'fees_docs'
                          ? 'Documents are grouped by purpose so you can focus on the important files without feeling overwhelmed.'
                          : activeTab === 'review'
                            ? 'If something is missing, we’ll show it clearly before you submit.'
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
                      <button type="button" className="rounded-xl bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(11,20,12,0.16)]">Continue</button>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/12 bg-white/95 p-4 text-slate-950 shadow-[0_18px_50px_rgba(11,20,12,0.10)]">
                  <div className="text-xs uppercase tracking-[0.16em] text-primary-800/70">What this means for you</div>
                  <div className="mt-2 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-primary-100 bg-primary-50/45 p-3">
                      <div className="text-sm font-semibold text-slate-950">No surprises</div>
                      <div className="mt-1 text-sm leading-6 text-slate-600">We tell you what to expect before each step and before submit.</div>
                    </div>
                    <div className="rounded-2xl border border-primary-100 bg-primary-50/45 p-3">
                      <div className="text-sm font-semibold text-slate-950">Easy to recover</div>
                      <div className="mt-1 text-sm leading-6 text-slate-600">You can save, return, and correct without losing your place.</div>
                    </div>
                    <div className="rounded-2xl border border-primary-100 bg-primary-50/45 p-3">
                      <div className="text-sm font-semibold text-slate-950">Better submissions</div>
                      <div className="mt-1 text-sm leading-6 text-slate-600">Clear expectations help the school receive cleaner, more complete data.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <SurfaceCard className="border border-white/12 bg-white/92 p-4 text-slate-950 xl:min-h-[280px]">
                  <div className="text-xs uppercase tracking-[0.16em] text-primary-800/70">Guidance & Tips</div>
                  <div className="mt-2 rounded-2xl border border-primary-100 bg-primary-50/45 p-3">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Expectation panel</div>
                    <div className="mt-2 space-y-1.5 text-sm leading-6 text-slate-600">
                      <p>{stepExpectations[activeTab].purpose}</p>
                      <p>{stepExpectations[activeTab].next}</p>
                    </div>
                  </div>
                  <div className="mt-3.5 space-y-2.5">
                    {guidanceItems.map((item) => (
                      <details key={item.title} className="group rounded-2xl border border-slate-200 bg-[#fbf8f0] p-4 transition group-open:border-accent-200">
                        <summary className="cursor-pointer list-none text-sm font-semibold text-slate-950">{item.title}</summary>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                      </details>
                    ))}
                  </div>
                </SurfaceCard>

                <SurfaceCard className="border border-white/12 bg-white/92 p-4 text-slate-950 xl:min-h-[236px]">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Application Summary</div>
                  <div className="mt-3.5 grid gap-2.5 text-sm">
                    <SummaryRow label="Application ID" value={featuredApplication.ref} />
                    <SummaryRow label="Started" value="22 May 2026" />
                    <SummaryRow label="Last saved" value={`22 May 2026, ${workflow.blockers.length > 0 ? '14:35' : '14:10'}`} />
                    <SummaryRow label="Status" value={<StatusBadge status={featuredApplication.status} />} />
                  </div>
                  <button className="mt-4 w-full rounded-2xl bg-primary-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(11,20,12,0.16)]">
                    Save & continue
                  </button>
                </SurfaceCard>

                <SurfaceCard className="border border-amber-200 bg-amber-50/80 p-4 text-slate-950 xl:min-h-[160px]">
                  <div className="text-xs uppercase tracking-[0.16em] text-amber-800">Progress</div>
                  <div className="mt-3.5 flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-amber-200 bg-white text-2xl font-semibold text-slate-900">{progress}%</div>
                    <div className="text-sm leading-6 text-slate-600">
                      Your application is moving forward. Keep documents ready so the admissions team can review it faster.
                    </div>
                  </div>
                </SurfaceCard>
              </div>
            </div>
          </SurfaceCard>
        </main>
      </div>
    </PreviewShell>
  );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-[#fcfaf5] px-4 py-3">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}
