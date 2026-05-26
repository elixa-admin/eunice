'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '@/lib/supabase';

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

      // Redirect on success
      router.push('/parent');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary-950 via-primary-900 to-accent-950 p-4">
      {/* Ambient background blur blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-lg glass rounded-3xl p-8 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-primary-200 mt-2 text-sm">
            Join the digital admissions platform
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/20 text-red-200 text-sm text-center">
            {error}
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
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
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
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
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
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
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
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm appearance-none"
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
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
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
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            id="btn-signup-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-white text-primary-950 font-bold py-3 rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-primary-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6 text-sm text-primary-200">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-white font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
