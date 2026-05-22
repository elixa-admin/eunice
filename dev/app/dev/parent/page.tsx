import Link from 'next/link';
import { PreviewShell } from '@/components/preview-shell';
import { SurfaceCard } from '@/components/surface-card';
import { SectionHeading } from '@/components/section-heading';
import { StatusBadge } from '@/components/status-badge';
import { getParentWorkflowSnapshot, previewApplications, type ParentWorkflowStepKey } from '@/lib/dev-preview-data';
import { isDocumentStateSubmissionReady } from '@eunice-shared/documents/contracts';

export default function DevParentPage() {
  const featuredApplication = previewApplications[0];
  const workflow = getParentWorkflowSnapshot(featuredApplication);
  const stepOrder: ParentWorkflowStepKey[] = ['profile', 'family', 'documents', 'review', 'submit'];
  const stepLabels: Record<ParentWorkflowStepKey, string> = {
    profile: 'Profile',
    family: 'Family',
    documents: 'Documents',
    review: 'Review',
    submit: 'Submit',
  };

  return (
    <PreviewShell
      eyebrow="Dev Preview"
      title="Parent admissions dashboard"
      description="A polished admissions form and status experience that makes the next step obvious without feeling busy."
      surface="parent"
      backLabel="Back to preview hub"
    >
      <div className="mb-6 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(31,109,58,0.10),rgba(184,137,7,0.10))] p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-primary-700/70">Welcome back</p>
              <h2 className="display-serif mt-3 text-4xl font-semibold text-slate-950">Lerato Khumalo</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Parents should never have to wonder what happens next. This dashboard should read like a polished
                admissions form with clear progress, steady guidance, and an unmistakable next action.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {stepOrder.map((step, index) => (
                  <div
                    key={step}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                      workflow.stepStates[step] === 'done'
                        ? 'border-primary-200 bg-primary-900 text-white'
                        : workflow.stepStates[step] === 'active'
                          ? 'border-accent-200 bg-accent-50 text-accent-800'
                          : workflow.stepStates[step] === 'blocked'
                            ? 'border-rose-200 bg-rose-50 text-rose-700'
                            : 'border-primary-100 bg-white/85 text-slate-600'
                    }`}
                  >
                    {index + 1}. {stepLabels[step]}
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-primary-100 bg-white/90 px-4 py-3 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Current stage</div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">{workflow.activeStep}</div>
                </div>
                <div className="rounded-2xl border border-primary-100 bg-white/90 px-4 py-3 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Next update</div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">{workflow.canSubmit ? 'Ready for submission' : 'After document checks'}</div>
                </div>
                <div className="rounded-2xl border border-accent-100 bg-white/90 px-4 py-3 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Open items</div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">{workflow.blockers.length} blocker{workflow.blockers.length === 1 ? '' : 's'}</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-accent-100 bg-white/92 p-4 shadow-[0_18px_45px_rgba(184,137,7,0.10)]">
              <div className="text-xs uppercase tracking-[0.18em] text-accent-700">Next expected action</div>
              <div className="mt-2 text-lg font-semibold text-slate-950">{workflow.canSubmit ? 'Submit application for school review' : 'Resolve document blockers'}</div>
              <div className="mt-2 text-sm leading-6 text-slate-600">
                {workflow.canSubmit
                  ? 'All required items are satisfied. Parent can submit and hand over to admissions.'
                  : 'The next update appears after the required document issues are resolved.'}
              </div>
              <div className="mt-4 rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-800">
                Latest update: {featuredApplication.updatedAt}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-primary-100 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-sm">
              {previewApplications.length} active applications in this preview
            </div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-800 shadow-sm">
              Current status: {featuredApplication.status.replace('_', ' ')}
            </div>
            <div className="rounded-2xl border border-accent-100 bg-accent-50 px-4 py-3 text-sm text-accent-700 shadow-sm">
              {workflow.readyRequiredDocuments} of {workflow.totalRequiredDocuments} required documents ready
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <SectionHeading
            title="What happens next"
            description="Workflow guidance is now computed from current document and submission state."
          />
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-primary-100 bg-primary-50/55 px-4 py-3 shadow-sm">
              {workflow.canSubmit
                ? 'Application is submission-ready and can enter the admissions queue.'
                : 'Application is still in parent workflow and requires document resolution.'}
            </div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50/55 px-4 py-3 shadow-sm">
              {workflow.blockers.length > 0
                ? `${workflow.blockers.length} blocking requirement${workflow.blockers.length === 1 ? '' : 's'} must be fixed before submit.`
                : `${workflow.reviewOnlyWarnings.length} document${workflow.reviewOnlyWarnings.length === 1 ? '' : 's'} can continue under manual review.`}
            </div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50/55 px-4 py-3 shadow-sm">
              Submission gate: {workflow.canSubmit ? 'open' : 'locked'}.
            </div>
          </div>
        </SurfaceCard>
      </div>

      <SectionHeading
        title="Applications"
        description="Each card should feel trustworthy, readable, and like a real form summary instead of a placeholder tile."
      />

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {previewApplications.slice(0, 3).map((app) => (
          <SurfaceCard key={app.id} className="overflow-hidden p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-slate-500">{app.ref}</div>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">{app.learnerName}</h3>
                <p className="text-sm text-slate-600">{app.grade}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <div className="mt-5 space-y-2 text-sm text-slate-600">
              <div>Submitted: {app.submittedAt}</div>
              <div>Last updated: {app.updatedAt}</div>
              <div>Parent contact: {app.parentEmail}</div>
              <div>
                {app.documents.filter((item) => isDocumentStateSubmissionReady(item.status)).length} of {app.documents.length} documents checked
              </div>
            </div>
            <div className="mt-5">
              <Link
                href={`/dev/application/${app.id}`}
                className="inline-flex rounded-xl bg-primary-900 px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_rgba(22,163,74,0.18)] transition hover:bg-primary-800"
              >
                View application
              </Link>
            </div>
          </SurfaceCard>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard className="p-6">
          <SectionHeading
            title="Recent school updates"
            description="A parent-facing activity stream keeps the tone calm and factual."
          />
          <div className="mt-5 space-y-3">
            {featuredApplication.timeline.map((entry) => (
              <div key={`${entry.at}-${entry.title}`} className="rounded-2xl border border-primary-100 bg-white/80 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-950">{entry.title}</div>
                  <div className="text-xs text-slate-500">{entry.at}</div>
                </div>
                <div className="mt-1 text-sm text-slate-600">{entry.detail}</div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <SectionHeading
            title="Needed next"
            description="This panel can become the parent’s single action area."
          />
          <div className="mt-5 rounded-2xl border border-accent-200 bg-accent-50 p-4 text-sm leading-6 text-accent-900">
            {workflow.blockers.length > 0
              ? `Still blocked: ${workflow.blockers.join('; ')}.`
              : workflow.reviewOnlyWarnings.length > 0
                ? `Submission is allowed. Manual review items: ${workflow.reviewOnlyWarnings.join('; ')}.`
                : 'Everything needed has been received. The parent can submit now.'}
          </div>
        </SurfaceCard>
      </div>
    </PreviewShell>
  );
}
