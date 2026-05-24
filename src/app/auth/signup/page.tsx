'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '@/lib/supabase';
import { getPostAuthRoute } from '@/lib/auth-routing';
import { AUTH_INPUT_CLASS_NAME, SURFACE_CARD_CLASS_NAME } from '@/lib/ui-classes';

interface School {
  id: string;
  name: string;
}

export default function SignUp() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  // Load schools from database
  useEffect(() => {
    async function loadSchools() {
      try {
        const { data, error: fetchError } = await supabase
          .from('schools')
          .select('id, name')
          .order('name');
        
        if (fetchError) throw fetchError;
        if (data) {
          setSchools(data);
          if (data.length > 0) {
            setSchoolId(data[0].id);
          }
        }
      } catch (err) {
        console.warn('Failed to load schools, using default placeholder:', err);
        // Pre-populate with a fallback school if DB query is blocked or empty
        setSchools([{ id: 'fallback-school-id', name: 'Eunice High School' }]);
        setSchoolId('fallback-school-id');
      }
    }
    loadSchools();
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      // 1. Sign up user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Sign up failed — user object not returned.');

      // 2. Create row in public.profiles table
      // If using fallback school id, set school_id to null or a valid uuid
      const finalSchoolId = schoolId === 'fallback-school-id' ? null : schoolId;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          school_id: finalSchoolId,
          role: 'parent',
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
        });

      if (profileError) throw profileError;

      setStatus('Account created. Taking you to the parent portal.');
      router.replace(getPostAuthRoute('parent'));
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-accent-950 p-4">
      {/* Ambient background blur blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-accent-500/10 blur-3xl" />

      <div className={`${SURFACE_CARD_CLASS_NAME} relative z-10 w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-10`}>
        <div className="mb-8 text-center">
          <div className="mx-auto inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-100">
            Create your account
          </div>
          <h2 className="display-serif mt-5 text-3xl font-bold tracking-tight text-white">Start your application</h2>
          <p className="mt-2 text-sm leading-6 text-primary-100/80">
            Create a secure profile so your progress, documents, and status stay in one place.
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

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-100 mb-1.5" htmlFor="first-name">
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                required
                className={AUTH_INPUT_CLASS_NAME}
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-100 mb-1.5" htmlFor="last-name">
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                required
                className={AUTH_INPUT_CLASS_NAME}
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-100 mb-1.5" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              className={AUTH_INPUT_CLASS_NAME}
              placeholder="+27 82 123 4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-100 mb-1.5" htmlFor="school">
              Select School
            </label>
            <select
              id="school"
              className={AUTH_INPUT_CLASS_NAME}
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id} className="bg-primary-950 text-white">
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-100 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className={inputClassName}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-100 mb-1.5" htmlFor="password">
              Password (min. 6 chars)
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              className={inputClassName}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            id="btn-signup-submit"
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 font-bold text-primary-950 shadow-lg transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-primary-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-primary-200">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-white font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
