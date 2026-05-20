'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';

interface Profile {
  first_name: string;
  last_name: string;
  role: string;
  school_id: string | null;
}

interface Application {
  id: string;
  learner_first_name: string;
  learner_last_name: string;
  grade_applying_for: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  created_at: string;
}

export default function ParentDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State for New Application
  const [showModal, setShowModal] = useState(false);
  const [learnerFirstName, setLearnerFirstName] = useState('');
  const [learnerLastName, setLearnerLastName] = useState('');
  const [grade, setGrade] = useState('Grade 8');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // 1. Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push('/auth/signin');
          return;
        }

        // 2. Load profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, role, school_id')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // 3. Load applications
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select('id, learner_first_name, learner_last_name, grade_applying_for, status, created_at')
          .eq('parent_id', user.id)
          .order('created_at', { ascending: false });

        if (appsError) throw appsError;
        setApplications(appsData || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !profile) throw new Error('Not authenticated.');

      // We need a valid school_id. If parent has no school_id, default to a general register or ask them.
      // For Eunice platform, we fall back to a default school or the parent's registered school.
      const defaultSchoolId = profile.school_id || '00000000-0000-0000-0000-000000000000';

      const { data: newApp, error: createError } = await supabase
        .from('applications')
        .insert({
          school_id: defaultSchoolId,
          parent_id: user.id,
          learner_first_name: learnerFirstName,
          learner_last_name: learnerLastName,
          grade_applying_for: grade,
          status: 'draft'
        })
        .select()
        .single();

      if (createError) throw createError;

      // Update local state
      setApplications(prev => [newApp, ...prev]);
      setShowModal(false);
      
      // Reset form
      setLearnerFirstName('');
      setLearnerLastName('');
      setGrade('Grade 8');
    } catch (err: any) {
      setFormError(err.message || 'Failed to create application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <span className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-neutral-950 py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header strip */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass p-6 rounded-2xl border border-white/10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Parent Portal</h1>
            <p className="text-primary-200 text-sm mt-1">
              Welcome back, <span className="text-white font-semibold">{profile?.first_name} {profile?.last_name}</span>. Manage your child's applications below.
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 sm:flex-none bg-white text-primary-950 font-bold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-all text-sm shadow-md"
            >
              + New Application
            </button>
            <button
              onClick={handleSignOut}
              className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm border border-white/10"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Applications List */}
        <main className="glass p-6 sm:p-8 rounded-3xl border border-white/10">
          <h2 className="text-xl font-bold mb-6">Submitted & Draft Applications</h2>

          {applications.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 stroke-primary-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">No applications yet</h3>
              <p className="text-primary-200 text-sm mt-1 max-w-sm mx-auto">
                Get started by creating your first school admission application for your child.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 bg-white text-primary-950 font-bold px-6 py-2.5 rounded-xl hover:bg-primary-50 transition-all text-sm shadow-lg"
              >
                Create First Application
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-primary-300 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-4 px-4">Learner Name</th>
                    <th className="py-4 px-4">Grade</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Date Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-white/5 transition-all">
                      <td className="py-4 px-4 font-semibold text-white">
                        {app.learner_first_name} {app.learner_last_name}
                      </td>
                      <td className="py-4 px-4 text-primary-200">{app.grade_applying_for}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-300' :
                          app.status === 'rejected' ? 'bg-rose-500/20 text-rose-300' :
                          app.status === 'submitted' ? 'bg-blue-500/20 text-blue-300' :
                          app.status === 'under_review' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-white/10 text-white/80'
                        }`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-primary-300">
                        {new Date(app.created_at).toLocaleDateString('en-ZA', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* New Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative glass border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white">New Application</h3>
              <p className="text-primary-200 text-sm mt-1">
                Enter your child's information to initiate a new admission request.
              </p>
            </div>

            {formError && (
              <div className="p-3 bg-red-500/15 border border-red-500/20 text-red-200 text-sm rounded-xl text-center">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateApplication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-100 mb-1.5" htmlFor="child-first-name">
                  Child's First Name
                </label>
                <input
                  id="child-first-name"
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
                  placeholder="Learner's first name"
                  value={learnerFirstName}
                  onChange={(e) => setLearnerFirstName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-100 mb-1.5" htmlFor="child-last-name">
                  Child's Last Name
                </label>
                <input
                  id="child-last-name"
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
                  placeholder="Learner's last name"
                  value={learnerLastName}
                  onChange={(e) => setLearnerLastName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-100 mb-1.5" htmlFor="grade-select">
                  Grade Applying For
                </label>
                <select
                  id="grade-select"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm appearance-none"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                >
                  <option value="Grade 8" className="bg-primary-950 text-white">Grade 8</option>
                  <option value="Grade 9" className="bg-primary-950 text-white">Grade 9</option>
                  <option value="Grade 10" className="bg-primary-950 text-white">Grade 10</option>
                  <option value="Grade 11" className="bg-primary-950 text-white">Grade 11</option>
                  <option value="Grade 12" className="bg-primary-950 text-white">Grade 12</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all text-sm border border-white/10"
                >
                  Cancel
                </button>
                <button
                  id="btn-app-submit"
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-white text-primary-950 font-bold py-3 rounded-xl hover:bg-primary-50 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span className="w-5 h-5 border-2 border-primary-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Submit Draft'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
