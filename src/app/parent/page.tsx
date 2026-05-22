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
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-900">
                Parent Portal
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
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

            <div className="mt-8 flex flex-wrap gap-3">
              {loading ? (
                <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-100" />
              ) : user ? (
                <button
                  onClick={handleSignOut}
                  className="inline-flex rounded-xl bg-slate-950 hover:bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition cursor-pointer"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/signup"
                    className="inline-flex rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
                  >
                    Start new application
                  </Link>
                  <Link
                    href="/auth/signin"
                    className="inline-flex rounded-xl border border-primary-200 bg-primary-50 px-5 py-3 text-sm font-semibold text-primary-900 transition hover:bg-primary-100"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </section>

          <aside className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Current focus</p>
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
