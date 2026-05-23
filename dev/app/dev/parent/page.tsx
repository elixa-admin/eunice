'use client';

import { useState } from 'react';
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
  
  const stepOrder: ParentWorkflowStepKey[] = ['checklist', 'learner', 'household', 'medical', 'fees_docs', 'review'];
  const stepLabels: Record<ParentWorkflowStepKey, string> = {
    checklist: '0. Preparation',
    learner: '1. Learner Info',
    household: '2. Family & Home',
    medical: '3. Care & Support',
    fees_docs: '4. Fees & Docs',
    review: '5. Submit & Track',
  };

  const [activeTab, setActiveTab] = useState<ParentWorkflowStepKey>('checklist');

  // Simple state for interactive form simulation
  const [learnerName, setLearnerName] = useState('Ayanda Khumalo');
  const [grade, setGrade] = useState('Grade 8');
  const [isBoarder, setIsBoarder] = useState(false);
  const [hasMedicalAid, setHasMedicalAid] = useState(true);
  const [feePayerSameAsParent, setFeePayerSameAsParent] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNext = () => {
    const currentIndex = stepOrder.indexOf(activeTab);
    if (currentIndex < stepOrder.length - 1) {
      setActiveTab(stepOrder[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const currentIndex = stepOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(stepOrder[currentIndex - 1]);
    }
  };

  return (
    <PreviewShell
      eyebrow="Dev Preview"
      title="Parent Admissions Dashboard"
      description="A compressed, guided admissions flow that minimizes friction and makes missing items obvious."
      surface="parent"
      backLabel="Back to preview hub"
    >
      {/* Dynamic Header Snapshot card */}
      <div className="mb-6 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <SurfaceCard className="overflow-hidden bg-gradient-to-br from-emerald-950/5 via-slate-50 to-amber-500/5 p-7 border border-emerald-950/10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-900/10">
                Eunice Intake Portal
              </span>
              <h2 className="font-serif mt-3 text-3xl font-semibold text-slate-900">
                Lerato Khumalo
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Eunice High School admissions are processed in a highly structured, guided sequence. 
                Use this interactive dashboard to review requirements, fill fields, and resolve document uploads.
              </p>
              
              {/* Timeline Horizontal Progress bar */}
              <div className="mt-8 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                <div className="relative flex justify-between z-10">
                  {stepOrder.map((step, index) => {
                    const isActive = activeTab === step;
                    const isDone = stepOrder.indexOf(activeTab) > index;
                    return (
                      <button
                        key={step}
                        onClick={() => setActiveTab(step)}
                        className={`flex flex-col items-center group focus:outline-none`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border ${
                            isActive
                              ? 'bg-amber-500 border-amber-600 text-slate-950 scale-110 shadow-lg shadow-amber-500/20'
                              : isDone
                                ? 'bg-emerald-850 border-emerald-900 text-white'
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
                          }`}
                        >
                          {index}
                        </div>
                        <span className="hidden md:block mt-2 text-[10px] uppercase font-bold tracking-wider text-slate-500 group-hover:text-slate-900 transition-colors">
                          {stepLabels[step].split('. ')[1]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-72 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 shadow-[0_12px_30px_rgba(184,137,7,0.05)]">
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-700">
                Admissions Status
              </div>
              <div className="mt-2 text-base font-semibold text-slate-900">
                {isSubmitted ? 'Application Submitted' : 'Draft in Progress'}
              </div>
              <p className="mt-1 text-xs text-slate-500 leading-normal">
                {isSubmitted 
                  ? 'Your files are currently in the admissions queue for review.' 
                  : 'Please complete all steps and resolve flagged documents to submit.'}
              </p>
              <div className="mt-4 rounded-xl border border-emerald-800/10 bg-emerald-50/50 px-3.5 py-2 text-xs text-emerald-900 flex justify-between items-center">
                <span>Latest Update:</span>
                <span className="font-semibold">{featuredApplication.updatedAt}</span>
              </div>
            </div>
          </div>
        </SurfaceCard>

        {/* Dynamic Context Card based on Active Tab */}
        <SurfaceCard className="p-6 border border-slate-100 flex flex-col justify-between">
          <div>
            <SectionHeading
              title="Step Guidance"
              description="Context-aware helpers adapt as you progress through sections."
            />
            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600">
              {activeTab === 'checklist' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong>POPIA Reassurance:</strong> Under South Africa's Protection of Personal Information Act, all learner and financial details are encrypted and accessed solely for admissions processing.
                </div>
              )}
              {activeTab === 'learner' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong>Grade Check:</strong> Eunice High School accepts applications for Grades 8 through 11. Grade 8 applications require the previous primary school final report card.
                </div>
              )}
              {activeTab === 'household' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong>Divorced/Custody Context:</strong> If parent responsibilities are split, Step 4 will request a copy of the official custody decree to align school-fee authorizations.
                </div>
              )}
              {activeTab === 'medical' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong>Support Disclosures:</strong> Sharing academic support plans allows Eunice to prepare appropriate counselor and facility readiness ahead of the school year.
                </div>
              )}
              {activeTab === 'fees_docs' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-900">
                  <strong>Document Quality:</strong> Blur or low-contrast uploads are the #1 cause of intake delays. Use clear scanning apps or photo-taking in good daylight.
                </div>
              )}
              {activeTab === 'review' && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900">
                  <strong>Submitting:</strong> Once you click submit, your files are locked. If you need changes later, you must contact the Admissions Office directly.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Progress Indicator:</span>
            <span className="font-semibold text-slate-900 uppercase">
              {stepOrder.indexOf(activeTab)} / 5 Complete
            </span>
          </div>
        </SurfaceCard>
      </div>

      {/* Main Interactive Form Simulation Surface */}
      <SurfaceCard className="mb-8 p-7 border border-slate-100">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h3 className="font-serif text-2xl font-semibold text-slate-950">
            {stepLabels[activeTab].split('. ')[1]}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {activeTab === 'checklist' && 'Familiarise yourself with the requirements and gather documents before you start.'}
            {activeTab === 'learner' && 'Provide primary academic history and target intake details.'}
            {activeTab === 'household' && 'Tell us about the parent/guardian household responsibilities.'}
            {activeTab === 'medical' && 'Help us support your child by sharing medical and learning accommodations.'}
            {activeTab === 'fees_docs' && 'Provide financial payer alignment and upload required documents.'}
            {activeTab === 'review' && 'Review your compiled answers and submit to the admissions queue.'}
          </p>
        </div>

        {/* TAB 0: CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  What You'll Need (Required)
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-700 font-semibold">✓</span> Learner Birth Certificate
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-700 font-semibold">✓</span> Parents/Guardians ID Copies
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-700 font-semibold">✓</span> Proof of Residence (under 3 months)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-700 font-semibold">✓</span> Learner Latest School Report Card
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  Conditional Documents
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600 font-semibold">ℹ</span> Custody Agreements (if divorced/separated)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600 font-semibold">ℹ</span> Study Permit / Visa (for non-SA learners)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600 font-semibold">ℹ</span> Medical aid cards and doctor certificates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600 font-semibold">ℹ</span> Learning support documentation (where applicable)
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-950 leading-relaxed">
              <strong>Save and Return Anytime:</strong> Your progress is automatically saved to the database. If you don't have all files ready, you can submit the form draft now and return to upload documents later.
            </div>
          </div>
        )}

        {/* TAB 1: LEARNER INFO */}
        {activeTab === 'learner' && (
          <div className="space-y-5 max-w-xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Learner Legal Names</label>
                <input 
                  type="text" 
                  value={learnerName} 
                  onChange={(e) => setLearnerName(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 px-3.5 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Grade</label>
                <select 
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 px-3.5 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                >
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date of Birth</label>
                <input 
                  type="date" 
                  defaultValue="2013-05-12"
                  className="w-full text-xs rounded-lg border border-slate-200 px-3.5 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current/Previous School</label>
                <input 
                  type="text" 
                  defaultValue="Heatherdale Intermediate"
                  className="w-full text-xs rounded-lg border border-slate-200 px-3.5 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FAMILY & HOME */}
        {activeTab === 'household' && (
          <div className="space-y-5 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Submitting Parent Legal Name</label>
              <input 
                type="text" 
                defaultValue="Lerato Khumalo" 
                className="w-full text-xs rounded-lg border border-slate-200 px-3.5 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact Number</label>
                <input 
                  type="text" 
                  defaultValue="+27 83 555 0102"
                  className="w-full text-xs rounded-lg border border-slate-200 px-3.5 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="lerato.khumalo@example.com"
                  className="w-full text-xs rounded-lg border border-slate-200 px-3.5 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Residential Address</label>
              <textarea 
                rows={2}
                defaultValue="14 Markgraaff Street, Westdene, Bloemfontein, 9301"
                className="w-full text-xs rounded-lg border border-slate-200 px-3.5 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            </div>
          </div>
        )}

        {/* TAB 3: MEDICAL & CARE */}
        {activeTab === 'medical' && (
          <div className="space-y-6 max-w-xl">
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-800">Healthcare Disclosures</label>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="medAid" 
                  checked={hasMedicalAid} 
                  onChange={(e) => setHasMedicalAid(e.target.checked)}
                  className="w-4 h-4 text-emerald-800 border-slate-300 rounded focus:ring-emerald-800"
                />
                <label htmlFor="medAid" className="text-xs text-slate-600">The learner is covered by a medical aid scheme</label>
              </div>

              {hasMedicalAid && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 grid gap-3 sm:grid-cols-2 mt-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Medical Aid Name</label>
                    <input 
                      type="text" 
                      defaultValue="Discovery Health" 
                      className="w-full text-xs rounded-lg border border-slate-200 px-3.5 py-2 bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Membership Number</label>
                    <input 
                      type="text" 
                      defaultValue="988273618" 
                      className="w-full text-xs rounded-lg border border-slate-200 px-3.5 py-2 bg-white text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-800">Support & Accommodations</label>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="support" 
                  checked={isBoarder} 
                  onChange={(e) => setIsBoarder(e.target.checked)}
                  className="w-4 h-4 text-emerald-800 border-slate-300 rounded focus:ring-emerald-800"
                />
                <label htmlFor="support" className="text-xs text-slate-600">This is an application for the Eunice School Boarding House (Hostel)</label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FEES & DOCS */}
        {activeTab === 'fees_docs' && (
          <div className="space-y-6">
            <div className="max-w-xl space-y-4">
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-800">School Fee Responsibility</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="feePayer" 
                    checked={feePayerSameAsParent} 
                    onChange={(e) => setFeePayerSameAsParent(e.target.checked)}
                    className="w-4 h-4 text-emerald-800 border-slate-300 rounded focus:ring-emerald-800"
                  />
                  <label htmlFor="feePayer" className="text-xs text-slate-600">The submitting parent (Lerato Khumalo) is responsible for school fees</label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-800 mb-3">Document Upload Check</h4>
              
              <div className="grid gap-3 sm:grid-cols-2">
                {featuredApplication.documents.map((doc) => (
                  <div 
                    key={doc.type} 
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        {doc.type === 'birth_cert' && 'Learner Birth Certificate'}
                        {doc.type === 'school_report' && 'Previous School Report'}
                        {doc.type === 'proof_residence' && 'Proof of Residence'}
                        {doc.type === 'id_copy' && 'Parent ID Document'}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {doc.uploadedAt ? `Uploaded ${doc.uploadedAt}` : 'Not uploaded'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        doc.status === 'verified'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-900/10'
                          : doc.status === 'needs_reupload'
                            ? 'bg-rose-50 text-rose-700 border border-rose-900/10 animate-pulse'
                            : 'bg-amber-50 text-amber-800 border border-amber-900/10'
                      }`}>
                        {doc.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: REVIEW & SUBMIT */}
        {activeTab === 'review' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50 space-y-4">
              <h4 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Admissions Summary Checklist
              </h4>
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <span className="text-slate-400">Learner Name:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{learnerName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Target Grade:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{grade}</p>
                </div>
                <div>
                  <span className="text-slate-400">Parent Submitter:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">Lerato Khumalo</p>
                </div>
                <div>
                  <span className="text-slate-400">Fee Payer Responsible:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {feePayerSameAsParent ? 'Lerato Khumalo (Parent)' : 'Other party'}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit logic warning */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-xs text-amber-950 flex items-start gap-3">
              <span className="text-amber-700 text-base">⚠️</span>
              <div>
                <strong>Notice:</strong> One or more documents are still marked as **needs re-upload**. While you can submit drafts, the Admissions Office will not begin the evaluation cycle until all blocking items are verified.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSubmitted(true)}
                disabled={isSubmitted}
                className={`inline-flex rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 ${
                  isSubmitted 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-850 hover:bg-emerald-900 hover:shadow-emerald-950/20'
                }`}
              >
                {isSubmitted ? '✓ Application Submitted' : 'Submit Final Application'}
              </button>
              {isSubmitted && (
                <span className="text-xs text-emerald-800 font-medium">
                  We've emailed a confirmation to lerato.khumalo@example.com
                </span>
              )}
            </div>
          </div>
        )}

        {/* Interactive Bottom Control Buttons */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={activeTab === 'checklist'}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous Step
          </button>
          
          <button
            onClick={handleNext}
            disabled={activeTab === 'review'}
            className="rounded-lg bg-emerald-850 text-white px-4 py-2 text-xs font-semibold hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next Step →
          </button>
        </div>
      </SurfaceCard>

      <SectionHeading
        title="Other Active Applications"
        description="Review or resume other submissions tied to your family record."
      />

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {previewApplications.slice(0, 3).map((app) => (
          <SurfaceCard key={app.id} className="overflow-hidden p-6 hover:shadow-lg transition-shadow duration-300 border border-slate-100 bg-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{app.ref}</div>
                <h3 className="mt-1 text-base font-bold text-slate-900">{app.learnerName}</h3>
                <p className="text-xs text-slate-500">{app.grade}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-slate-600">
              <div>Submitted: {app.submittedAt}</div>
              <div>Last updated: {app.updatedAt}</div>
              <div>
                {app.documents.filter((item) => isDocumentStateSubmissionReady(item.status)).length} of {app.documents.length} documents checked
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">
                Owner: {app.assignedTo}
              </span>
              <Link
                href={`/dev/application/${app.id}`}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900"
              >
                View Details →
              </Link>
            </div>
          </SurfaceCard>
        ))}
      </div>
    </PreviewShell>
  );
}
