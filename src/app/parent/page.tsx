'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ParentApplicationWorkflow from '@/components/parent/application-workflow';
import { APPLICATION_STATUS_DESCRIPTIONS, APPLICATION_STATUS_LABELS } from '@/lib/domain/applications';
import supabase from '@/lib/supabase';

const statusHighlights = ['draft', 'awaiting_documents', 'under_review'] as const;

export default function ParentPortalPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setUser(authUser);
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (err) {
        console.warn('Error checking parent session:', err);
      } finally {
        setLoading(false);
      }
    }
    getSession();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.localStorage.removeItem('eunice-parent-application-draft-v1');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.08),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.06),_transparent_26%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6 rounded-full border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur">
          <span className="font-semibold text-slate-900">Admissions journey:</span> enquiry, profile, documents, review, decision.
          <span className="ml-2 text-primary-700">Guided. Saved. Trackable.</span>
        </div>

        <div className="mb-10 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="overflow-hidden rounded-[2.25rem] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="border-b border-slate-100 bg-gradient-to-r from-primary-50 via-white to-accent-50 px-8 py-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-900">
                Parent Portal
              </div>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {loading ? (
                  'Manage your Eunice application'
                ) : user ? (
                  `Welcome back, ${profile?.first_name || 'Nicola'}!`
                ) : (
                  'Manage your Eunice application in one place'
                )}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                {user
                  ? 'Your progress is automatically saved to your account. Feel free to leave and return to complete it at any time.'
                  : 'Keep track of your application status, required documents, and next steps without needing to follow up by phone or email.'}
              </p>
            </div>

            <div className="border-b border-slate-100 bg-slate-50/80 px-8 py-4">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span className="rounded-full bg-white px-3 py-1 text-slate-800 shadow-sm">1 Enquiry</span>
                <span className="rounded-full bg-white px-3 py-1 text-slate-800 shadow-sm">2 Profile</span>
                <span className="rounded-full bg-primary-700 px-3 py-1 text-white shadow-sm">3 Documents</span>
                <span className="rounded-full bg-white px-3 py-1 text-slate-800 shadow-sm">4 Review</span>
                <span className="rounded-full bg-white px-3 py-1 text-slate-800 shadow-sm">5 Decision</span>
              </div>
            </div>

            <div className="grid gap-0 border-b border-slate-100 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="border-b border-slate-100 px-8 py-6 lg:border-b-0 lg:border-r lg:border-slate-100">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status at a glance</div>
                <div className="mt-3 grid gap-3">
                  {statusHighlights.map((status) => (
                    <div key={status} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                      <div className="text-sm font-semibold text-slate-950">{APPLICATION_STATUS_LABELS[status]}</div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {APPLICATION_STATUS_DESCRIPTIONS[status]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-8 py-6">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_14px_40px_rgba(15,23,42,0.18)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Your next move</div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    {user ? 'Continue your saved application' : 'Sign in or start a new application'}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {user
                      ? 'Pick up exactly where you left off with progress saved in the portal.'
                      : 'Create an account to keep your application, uploads, and status in one place.'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {loading ? (
                      <div className="h-10 w-24 animate-pulse rounded-xl bg-white/10" />
                    ) : user ? (
                      <button
                        onClick={handleSignOut}
                        className="inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 cursor-pointer"
                      >
                        Sign Out
                      </button>
                    ) : (
                      <>
                        <Link
                          href="/auth/signup"
                          className="inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                        >
                          Start new application
                        </Link>
                        <Link
                          href="/auth/signin"
                          className="inline-flex rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                          Sign in
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Current focus</p>
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <div className="text-sm font-semibold text-white">What happens next</div>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                Complete the current stage, then the portal will show the next required action clearly.
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {statusHighlights.map((status) => (
                <div key={status} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">{APPLICATION_STATUS_LABELS[status]}</div>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {APPLICATION_STATUS_DESCRIPTIONS[status]}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <ParentApplicationWorkflow />
      </div>
    </div>
  );
}
