'use client';

import type React from 'react';
import { useState } from 'react';
import { PreviewShell } from '@/components/preview-shell';
import { SurfaceCard } from '@/components/surface-card';
import { StatusBadge } from '@/components/status-badge';
import { SummaryRow } from '@/components/summary-row';
import { getParentWorkflowSnapshot, previewApplications, type ParentWorkflowStepKey } from '@/lib/dev-preview-data';

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
  { title: 'Who should start this?', body: 'The parent or legal guardian who will manage the application should begin here. If someone is helping, keep them nearby for the final check.' },
  { title: 'Admissions criteria', body: 'Keep the key documents close by so we can explain each one before you upload it.' },
  { title: 'What happens next?', body: 'After you submit, Eunice reviews the application and lets you know if anything still needs attention.' },
] as const;

const stepExpectations: Record<ParentWorkflowStepKey, { purpose: string; prepare: string; next: string; timing: string }> = {
  checklist: {
    purpose: 'Start here. We will keep the journey short and clear.',
    prepare: 'Have your ID, the learner’s basic details, and a few key documents nearby.',
    next: 'Once you begin, we will guide you one step at a time.',
    timing: 'This first screen usually only takes a minute or two.',
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
] as const;

const stepHighlights: Record<ParentWorkflowStepKey, { title: string; detail: string }> = {
  checklist: { title: 'Start here', detail: 'See what to prepare before you begin.' },
  learner: { title: 'About your child', detail: 'Capture the learner’s basic details and grade context.' },
  household: { title: 'Who to contact', detail: 'Tell us who is responsible and how we should reach you.' },
  medical: { title: 'Support information', detail: 'Share only the details Eunice needs to support your child.' },
  fees_docs: { title: 'Uploads and fees', detail: 'Keep the important documents together and upload them when prompted.' },
  review: { title: 'Check and send', detail: 'Review the full application before you submit it.' },
};

export default function DevParentPage() {
  const featuredApplication = previewApplications[0];
  const workflow = getParentWorkflowSnapshot(featuredApplication);
  const [activeTab, setActiveTab] = useState<ParentWorkflowStepKey>('checklist');

  const activeIndex = stepOrder.indexOf(activeTab);
  const progress = Math.round(((activeIndex + 1) / stepOrder.length) * 100);
  const readinessTone =
    workflow.blockers.length > 0 ? 'rose' : workflow.reviewOnlyWarnings.length > 0 ? 'amber' : 'emerald';

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
                            ? 'border-amber-300 bg-[#fff8e7] text-[#081c12] shadow-[0_12px_24px_rgba(202,138,4,0.10)]'
                            : isDone
                              ? 'border-white/22 bg-white/14 text-white'
                              : 'border-white/15 bg-white/8 text-white/82 hover:bg-white/12'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                            isActive ? 'border-[#081c12] bg-[#081c12] text-white' : 'border-current/20 bg-white/12 text-current'
                          }`}>
                            {stepMeta[step].label}
                          </div>
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-85">{stepMeta[step].title}</div>
                            <div className="mt-1 text-[11px] opacity-80">{stepMeta[step].subtitle}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-[28px] border border-white/12 bg-white/95 p-4 text-slate-950 shadow-[0_18px_50px_rgba(11,20,12,0.10)]">
                <div className="mb-4 grid gap-3 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
                    <div className="rounded-[24px] border border-primary-100 bg-white p-4 shadow-[0_10px_26px_rgba(11,20,12,0.04)]">
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
                    <div className={`rounded-[24px] border p-4 shadow-[0_10px_26px_rgba(11,20,12,0.04)] ${
                      readinessTone === 'rose'
                        ? 'border-rose-200 bg-rose-50'
                        : readinessTone === 'amber'
                          ? 'border-amber-200 bg-amber-50'
                          : 'border-emerald-200 bg-emerald-50'
                    }`}>
                      <div className="text-xs uppercase tracking-[0.18em] text-primary-800/70">Progress</div>
                      <div className="mt-3 flex items-center gap-4">
                        <div className={`flex h-16 w-16 items-center justify-center rounded-full border bg-white text-lg font-semibold ${
                          readinessTone === 'rose'
                            ? 'border-rose-200 text-rose-800'
                            : readinessTone === 'amber'
                              ? 'border-amber-200 text-amber-900'
                              : 'border-emerald-200 text-emerald-800'
                        }`}>{progress}%</div>
                        <div className="space-y-1 text-sm leading-6 text-slate-600">
                          <p className="font-medium text-slate-800">{workflow.canSubmit ? 'Ready to review and send.' : 'Work through the current step before moving on.'}</p>
                          <p className="text-slate-700">
                            {workflow.readyRequiredDocuments} of {workflow.totalRequiredDocuments} required documents are ready.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 grid gap-3 xl:grid-cols-[minmax(0,1.18fr)_minmax(280px,0.82fr)]">
                    <div className="rounded-[24px] border border-primary-100 bg-[#fffdf8] p-4 shadow-[0_10px_26px_rgba(11,20,12,0.04)]">
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
                    <div className="rounded-[24px] border border-slate-200 bg-[#fffdf8] p-4 shadow-[0_10px_26px_rgba(11,20,12,0.04)]">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-700">Next up</div>
                      <div className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                        <p>{stepExpectations[activeTab].prepare}</p>
                        <p>{stepExpectations[activeTab].next}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] 2xl:grid-cols-[minmax(0,1.42fr)_minmax(320px,0.58fr)]">
                    <div className="space-y-2.5">
                      <div className="text-xs uppercase tracking-[0.18em] text-primary-800/70">Before you begin</div>
                      <div className="rounded-[28px] border border-primary-100 bg-[#fffdf8] p-4 shadow-[0_10px_26px_rgba(11,20,12,0.04)]">
                        <div className="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)]">
                          <div className="flex items-start gap-3 md:pt-1">
                            <div className="flex flex-col items-center gap-1">
                              {['1', '2', '3'].map((step, index) => (
                                <div key={step} className="flex flex-col items-center">
                                  <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold ${
                                      index === 0
                                        ? 'border-primary-900 bg-primary-900 text-white'
                                        : index === 1
                                          ? 'border-[#b88907] bg-[#fff8e7] text-[#3a2b07]'
                                          : 'border-slate-300 bg-white text-slate-600'
                                    }`}
                                  >
                                    {step}
                                  </div>
                                  {index < 2 ? <div className="h-8 w-px bg-slate-200" /> : null}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="min-w-0 space-y-3">
                            <div>
                              <div className="text-sm font-semibold text-slate-950">What to have ready</div>
                              <div className="mt-1 text-sm leading-6 text-slate-700">
                                Keep the learner’s details, your contact information, and the main documents nearby.
                              </div>
                            </div>
                            <div className="rounded-2xl border border-primary-100 bg-white p-3">
                              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Why we ask for it</div>
                              <div className="mt-1 text-sm leading-6 text-slate-700">
                                These details help Eunice match the application to the right learner, contact the right adult, and review the file without delays.
                              </div>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-3">
                              {[
                                ['Learner details', 'Name, date of birth, and school background.'],
                                ['Parent contact', 'Phone number and email address.'],
                                ['Key documents', 'Birth certificate and latest report.'],
                              ].map(([title, body]) => (
                                <div key={title} className="rounded-2xl border border-primary-100 bg-white p-3 shadow-[0_8px_18px_rgba(11,20,12,0.03)]">
                                  <div className="text-sm font-semibold text-slate-950">{title}</div>
                                  <div className="mt-1 text-sm leading-6 text-slate-700">{body}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 rounded-2xl border border-dashed border-primary-200 bg-primary-50/35 px-3 py-2 text-sm leading-6 text-slate-700">
                          You can save and come back at any point, so this never has to be finished in one sitting.
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-[#fffdf8] p-4 shadow-[0_10px_26px_rgba(11,20,12,0.04)]">
                      <div className="text-xs uppercase tracking-[0.16em] text-slate-700">Document readiness</div>
                      <div className="mt-2 text-sm leading-6 text-slate-700">
                        We group documents by purpose so you can see what to prepare first without a long list in the way.
                      </div>
                      <div className="mt-3.5 space-y-3">
                        {documentGroups.map((group) => (
                          <div key={group.title} className="rounded-2xl border border-slate-200 bg-white p-3.5">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold text-slate-950">{group.title}</div>
                                <div className="mt-1 text-xs leading-5 text-slate-600">{group.why}</div>
                              </div>
                            </div>
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
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-[#fffdf8] p-4 shadow-[0_10px_26px_rgba(11,20,12,0.04)]">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-700">{stepMeta[activeTab].title}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-700">
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
                      <button type="button" className="rounded-xl bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(11,20,12,0.16)]">Continue</button>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/12 bg-white/95 p-4 text-slate-950 shadow-[0_18px_50px_rgba(11,20,12,0.10)]">
                  <div className="text-xs uppercase tracking-[0.16em] text-primary-800/70">What this means for you</div>
                  <div className="mt-2 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-primary-100 bg-primary-50/45 p-3">
                      <div className="text-sm font-semibold text-slate-950">No surprises</div>
                      <div className="mt-1 text-sm leading-6 text-slate-600">You always see what comes next before you move on.</div>
                    </div>
                    <div className="rounded-2xl border border-primary-100 bg-primary-50/45 p-3">
                      <div className="text-sm font-semibold text-slate-950">Easy to recover</div>
                      <div className="mt-1 text-sm leading-6 text-slate-600">You can save, return, and fix things without starting over.</div>
                    </div>
                    <div className="rounded-2xl border border-primary-100 bg-primary-50/45 p-3">
                      <div className="text-sm font-semibold text-slate-950">Better submissions</div>
                      <div className="mt-1 text-sm leading-6 text-slate-600">Clear guidance helps the school receive cleaner, more complete information.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <SurfaceCard className="border border-white/12 bg-white/92 p-4 text-slate-950 xl:min-h-[280px]">
                  <div className="text-xs uppercase tracking-[0.16em] text-primary-800/70">Guidance & Tips</div>
                  <div className="mt-2 rounded-2xl border border-primary-100 bg-[#fffdf8] p-3 shadow-[0_8px_18px_rgba(11,20,12,0.03)]">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-700">Expectation panel</div>
                    <div className="mt-2 space-y-1.5 text-sm leading-6 text-slate-700">
                      <p>{stepExpectations[activeTab].purpose}</p>
                      <p>{stepExpectations[activeTab].next}</p>
                    </div>
                  </div>
                  <div className="mt-3.5 space-y-2.5">
                    {guidanceItems.map((item) => (
                      <details key={item.title} className="group rounded-2xl border border-slate-200 bg-white p-4 transition group-open:border-accent-200">
                        <summary className="cursor-pointer list-none text-sm font-semibold text-slate-950">{item.title}</summary>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{item.body}</p>
                      </details>
                    ))}
                  </div>
                </SurfaceCard>

                <SurfaceCard className="border border-white/12 bg-white/92 p-4 text-slate-950 xl:min-h-[236px]">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-700">Application Summary</div>
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

                <SurfaceCard className={`border p-4 text-slate-950 xl:min-h-[160px] ${
                  readinessTone === 'rose'
                    ? 'border-rose-200 bg-rose-50/80'
                    : readinessTone === 'amber'
                      ? 'border-amber-200 bg-amber-50/80'
                      : 'border-emerald-200 bg-emerald-50/80'
                }`}>
                  <div className={`text-xs uppercase tracking-[0.16em] ${
                    readinessTone === 'rose'
                      ? 'text-rose-800'
                      : readinessTone === 'amber'
                        ? 'text-amber-800'
                        : 'text-emerald-800'
                  }`}>Progress</div>
                  <div className="mt-3.5 flex items-center gap-4">
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full border bg-white text-2xl font-semibold ${
                      readinessTone === 'rose'
                        ? 'border-rose-200 text-rose-800'
                        : readinessTone === 'amber'
                          ? 'border-amber-200 text-amber-900'
                          : 'border-emerald-200 text-emerald-800'
                    }`}>{progress}%</div>
                    <div className="text-sm leading-6 text-slate-700">
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
