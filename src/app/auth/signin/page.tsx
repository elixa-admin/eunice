'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '@/lib/supabase';
import { getPostAuthRoute } from '@/lib/auth-routing';
import { AUTH_INPUT_CLASS_NAME, SURFACE_CARD_CLASS_NAME } from '@/lib/ui-classes';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Fetch user profile to check role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        // Fallback if profile not found
        console.warn('Profile not found, defaulting to parent portal');
        setStatus('Signed in successfully.');
        router.replace(getPostAuthRoute('parent'));
        return;
      }

      setStatus('Signed in successfully.');
      router.replace(getPostAuthRoute(profile.role));
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-accent-950 p-4">
      {/* Ambient backgrounds */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-accent-500/10 blur-3xl" />

      <div className={`${SURFACE_CARD_CLASS_NAME} relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-10`}>
        <div className="mb-8 text-center">
          <div className="mx-auto inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-100">
            Secure access
          </div>
          <h2 className="display-serif mt-5 text-3xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-primary-100/80">
            Sign in to continue your application or review the admissions queue.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/15 p-4 text-center text-sm text-red-100" role="alert">
            {error}
          </div>
        )}
        {status && (
          <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/15 p-4 text-center text-sm text-emerald-100" role="status" aria-live="polite">
            {status}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-primary-100 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className={AUTH_INPUT_CLASS_NAME}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-100 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className={AUTH_INPUT_CLASS_NAME}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            id="btn-signin-submit"
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 font-bold text-primary-950 shadow-lg transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-primary-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-primary-200">
          Do not have an account?{' '}
          <Link href="/auth/signup" className="text-white font-semibold hover:underline">
            Create account
          </Link>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-primary-200">
            Preview Access
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Link
              href="/dev/parent"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              Parent Demo
            </Link>
            <Link
              href="/dev/admin"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              Admin Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
