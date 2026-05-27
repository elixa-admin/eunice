'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ParentApplicationWorkflow from '@/components/parent/application-workflow';
import { APPLICATION_STATUS_DESCRIPTIONS, APPLICATION_STATUS_LABELS } from '@/lib/domain/applications';
import supabase from '@/lib/supabase';
import { SURFACE_CARD_CLASS_NAME } from '@/lib/ui-classes';

const statusHighlights = ['draft', 'awaiting_documents', 'under_review'] as const;

type AuthUser = {
  id: string;
  email?: string | null;
};

type ParentProfile = {
  first_name: string | null;
  last_name: string | null;
};

export default function ParentPortalPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<ParentProfile | null>(null);
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.09),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(202,138,4,0.06),_transparent_26%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.28fr_0.72fr]">
          <section className={`${SURFACE_CARD_CLASS_NAME} overflow-hidden rounded-[2.25rem] border border-emerald-100/80 bg-white/92 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl`}>
            <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-amber-50 px-8 py-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-950">
                Parent Portal
              </div>
              <h1 className="display-serif mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
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
              <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-800 shadow-sm">1 Start</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-800 shadow-sm">2 Details</span>
                <span className="rounded-full border border-emerald-800 bg-emerald-900 px-3 py-1 text-white shadow-sm">3 Documents</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-800 shadow-sm">4 Review</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-800 shadow-sm">5 Decision</span>
              </div>
            </div>

            <div className="grid gap-4 border-b border-slate-100 px-8 py-6 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">What this portal helps you do</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="text-sm font-semibold text-slate-950">Complete the essentials</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">Work through the form in a clear order without needing to guess what comes first.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="text-sm font-semibold text-slate-950">Upload the right documents</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">See which files are required now and which only apply to some families.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="text-sm font-semibold text-slate-950">Come back anytime</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">Your progress is saved so you can pause and return without starting over.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_14px_40px_rgba(15,23,42,0.18)]">
                <div className="flex h-full flex-col justify-between">
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

          <aside className={`${SURFACE_CARD_CLASS_NAME} rounded-[2rem] border border-slate-200/80 bg-[#071f14] p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]`}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Application rhythm</p>
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
              <div className="text-sm font-semibold text-white">One clear step at a time</div>
              <p className="mt-1 text-sm leading-6 text-white/72">
                Start, complete the required details, upload the important documents, then review before submission.
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {statusHighlights.map((status) => (
                <div key={status} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <div className="text-sm font-semibold text-white">{APPLICATION_STATUS_LABELS[status]}</div>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {APPLICATION_STATUS_DESCRIPTIONS[status]}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-4 text-sm leading-6 text-amber-50">
              Need a break? You can safely leave and return later without losing your place.
            </div>
          </aside>
        </div>

        <ParentApplicationWorkflow />
      </div>
    </div>
  );
}
