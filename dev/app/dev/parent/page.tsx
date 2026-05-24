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
      <div className="grid gap-6 xl:grid-cols-[250px_minmax(0,1.25fr)_360px]">
        <aside className="space-y-4">
          <SurfaceCard className="border border-primary-100/80 bg-white/85 p-4 shadow-[0_18px_42px_rgba(11,20,12,0.06)]">
            <div className="text-xs uppercase tracking-[0.18em] text-primary-800/70">My Application</div>
            <div className="mt-2 text-lg font-semibold text-slate-950">{featuredApplication.ref}</div>
            <div className="mt-1 text-sm text-slate-600">{featuredApplication.learnerName}</div>
            <div className="mt-3 flex items-center gap-2">
              <StatusBadge status={featuredApplication.status} />
            </div>
          </SurfaceCard>

          <SurfaceCard className="border border-slate-100 bg-white/90 p-4">
            <div className="space-y-2 text-sm">
              {['Dashboard', 'Messages', 'Documents', 'Payments', 'Calendar', 'FAQs'].map((label, index) => (
                <div
                  key={label}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 ${index === 0 ? 'bg-primary-50 text-primary-900' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>{label}</span>
                  {label === 'Messages' ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">1</span> : null}
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="border border-slate-100 bg-white/90 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Need help?</div>
            <div className="mt-2 text-sm font-semibold text-slate-950">Admissions Office</div>
            <div className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
              <div>011 674 4150</div>
              <div>admissions@eunice.co.za</div>
              <div>Mon-Fri 07:30-15:30</div>
            </div>
          </SurfaceCard>
        </aside>

        <main className="space-y-6">
          <SurfaceCard className="overflow-hidden border border-primary-200/70 bg-[linear-gradient(135deg,rgba(8,41,27,0.98),rgba(17,57,37,0.96)_48%,rgba(174,127,6,0.92)_100%)] p-0 text-white shadow-[0_26px_70px_rgba(11,20,12,0.18)]">
            <div className="border-b border-white/12 px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/70">Step {stepMeta[activeTab].label}</div>
                  <h2 className="mt-2 text-3xl font-semibold text-white">{stepMeta[activeTab].title}</h2>
                  <p className="mt-1 text-sm text-white/80">{stepMeta[activeTab].subtitle}</p>
                </div>
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white">Estimated time: 25-35 minutes</div>
              </div>
            </div>

            <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-5">
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {stepOrder.map((step, index) => {
                    const isActive = activeTab === step;
                    const isDone = index < activeIndex;
                    return (
                      <button
                        key={step}
                        onClick={() => setActiveTab(step)}
                        className={`min-w-[132px] rounded-2xl border p-3 text-left transition ${
                          isActive
                            ? 'border-white/35 bg-white text-primary-900 shadow-[0_12px_24px_rgba(11,20,12,0.18)]'
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

                <div className="rounded-[28px] border border-white/12 bg-white/95 p-6 text-slate-950 shadow-[0_18px_50px_rgba(11,20,12,0.10)]">
                  <div className="mb-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-primary-800/70">Before you begin</div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          ['Prepare documents', 'Have the required documents ready for upload.'],
                          ['Estimated time', 'This application takes about 25-30 minutes.'],
                          ['Save and return', 'You can save your progress and return anytime.'],
                          ['Next response', 'We typically respond within 5-7 school days.'],
                        ].map(([title, body]) => (
                          <div key={title} className="rounded-2xl border border-primary-100 bg-primary-50/45 p-4">
                            <div className="text-sm font-semibold text-slate-950">{title}</div>
                            <div className="mt-1 text-sm leading-6 text-slate-600">{body}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                      <div className="rounded-[24px] border border-slate-200 bg-[#faf7ef] p-5">
                        <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Required documents</div>
                      <div className="mt-4 space-y-3">
                        {['Birth certificate', 'Latest school report', 'Proof of residence', 'Immunisation record'].map((item) => (
                          <div key={item} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                            <div>
                              <div className="text-sm font-medium text-slate-950">{item}</div>
                              <div className="text-xs text-slate-500">Required</div>
                            </div>
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">Pending</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{stepMeta[activeTab].title}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">
                      {activeTab === 'checklist' && 'Gather documents and confirm you are ready before you begin the form.'}
                      {activeTab === 'learner' && 'Capture the learner’s details exactly as they appear on official records.'}
                      {activeTab === 'household' && 'Add the parent and guardian details that admissions staff will use to contact you.'}
                      {activeTab === 'medical' && 'Share the care, medical, and support context we need to support your child well.'}
                      {activeTab === 'fees_docs' && 'Confirm fee responsibility and upload the required documents with clear images.'}
                      {activeTab === 'review' && 'Review everything once more before you submit it to the admissions queue.'}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button type="button" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700">Back</button>
                      <button type="button" className="rounded-xl bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white">Continue</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <SurfaceCard className="border border-white/12 bg-white/92 p-5 text-slate-950">
                  <div className="text-xs uppercase tracking-[0.16em] text-primary-800/70">Guidance & Tips</div>
                  <div className="mt-4 space-y-3">
                    {guidanceItems.map((item) => (
                      <details key={item.title} className="group rounded-2xl border border-slate-200 bg-[#fbf8f0] p-4">
                        <summary className="cursor-pointer list-none text-sm font-semibold text-slate-950">{item.title}</summary>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                      </details>
                    ))}
                  </div>
                </SurfaceCard>

                <SurfaceCard className="border border-white/12 bg-white/92 p-5 text-slate-950">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Application Summary</div>
                  <div className="mt-4 grid gap-3 text-sm">
                    <SummaryRow label="Application ID" value={featuredApplication.ref} />
                    <SummaryRow label="Started" value="22 May 2026" />
                    <SummaryRow label="Last saved" value={`22 May 2026, ${workflow.blockers.length > 0 ? '14:35' : '14:10'}`} />
                    <SummaryRow label="Status" value={<StatusBadge status={featuredApplication.status} />} />
                  </div>
                  <button className="mt-5 w-full rounded-2xl bg-primary-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(11,20,12,0.16)]">
                    Save & continue
                  </button>
                </SurfaceCard>

                <SurfaceCard className="border border-amber-200 bg-amber-50/80 p-5 text-slate-950">
                  <div className="text-xs uppercase tracking-[0.16em] text-amber-800">Progress</div>
                  <div className="mt-4 flex items-center gap-4">
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
