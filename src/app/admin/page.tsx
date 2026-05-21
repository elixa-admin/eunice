'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from '@/lib/domain/applications';

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
  status: ApplicationStatus;
  created_at: string;
  parent: {
    first_name: string;
    last_name: string;
  } | null;
}

function getAdminQueueTone(status: ApplicationStatus) {
  switch (status) {
    case 'accepted':
      return 'bg-emerald-500/20 text-emerald-300';
    case 'rejected':
      return 'bg-rose-500/20 text-rose-300';
    case 'submitted':
      return 'bg-blue-500/20 text-blue-300';
    case 'under_review':
      return 'bg-amber-500/20 text-amber-300';
    case 'awaiting_documents':
      return 'bg-rose-500/20 text-rose-300';
    case 'ready_for_review':
      return 'bg-sky-500/20 text-sky-300';
    case 'decision_pending':
      return 'bg-fuchsia-500/20 text-fuchsia-200';
    default:
      return 'bg-white/10 text-white/80';
  }
}

function getAdminNextAction(status: ApplicationStatus) {
  switch (status) {
    case 'submitted':
      return 'Assign reviewer';
    case 'awaiting_documents':
      return 'Request documents';
    case 'ready_for_review':
      return 'Start review';
    case 'under_review':
      return 'Continue review';
    case 'decision_pending':
      return 'Record decision';
    case 'accepted':
      return 'Prepare outcome';
    case 'rejected':
      return 'Finalize outcome';
    default:
      return 'Review file';
  }
}

export default function AdminDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      try {
        // 1. Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push('/auth/signin');
          return;
        }

        // 2. Load profile to verify admin role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, role, school_id')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        if (profileData.role !== 'admin' && profileData.role !== 'superadmin') {
          console.warn('Unauthorized access to admin dashboard, redirecting to parent portal');
          router.push('/parent');
          return;
        }
        setProfile(profileData);

        // 3. Load all applications for the admin's school
        const defaultSchoolId = profileData.school_id || '00000000-0000-0000-0000-000000000000';

        // We fetch applications, and use parent_id to fetch parent details.
        // We can load applications and then map/join profiles.
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select(`
            id,
            learner_first_name,
            learner_last_name,
            grade_applying_for,
            status,
            created_at,
            parent_id
          `)
          .eq('school_id', defaultSchoolId)
          .order('created_at', { ascending: false });

        if (appsError) throw appsError;

        if (appsData && appsData.length > 0) {
          // Fetch parent profiles for these applications in a single query
          const parentIds = Array.from(new Set(appsData.map(app => app.parent_id)));
          const { data: parentsData, error: parentsError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', parentIds);

          if (parentsError) throw parentsError;

          const parentsMap = new Map(parentsData?.map(p => [p.id, p]));

          const enrichedApps: Application[] = appsData.map(app => {
            const parentProfile = parentsMap.get(app.parent_id);
            return {
              id: app.id,
              learner_first_name: app.learner_first_name,
              learner_last_name: app.learner_last_name,
              grade_applying_for: app.grade_applying_for,
              status: app.status as ApplicationStatus,
              created_at: app.created_at,
              parent: parentProfile ? {
                first_name: parentProfile.first_name,
                last_name: parentProfile.last_name
              } : null
            };
          });

          setApplications(enrichedApps);
        } else {
          setApplications([]);
        }
      } catch (error: unknown) {
        console.error('Error loading admin dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, [router]);

  const handleUpdateStatus = async (appId: string, newStatus: 'under_review' | 'accepted' | 'rejected') => {
    setActioningId(appId);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', appId);

      if (error) throw error;

      // Update state locally
      setApplications(prev =>
        prev.map(app => (app.id === appId ? { ...app, status: newStatus } : app))
      );
    } catch {
      alert('Failed to update status.');
    } finally {
      setActioningId(null);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Stats computation
  const total = applications.length;
  const activeQueue = applications.filter(app => app.status !== 'accepted' && app.status !== 'rejected').length;
  const accepted = applications.filter(app => app.status === 'accepted').length;
  const rejected = applications.filter(app => app.status === 'rejected').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <span className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-primary-950 to-neutral-900 py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header strip */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass p-6 rounded-2xl border border-white/10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-primary-200 text-sm mt-1">
              Logged in as <span className="text-white font-semibold">{profile?.first_name} {profile?.last_name}</span> · Admissions Management Portal
            </p>
          </div>
          <div>
            <button
              onClick={handleSignOut}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm border border-white/10 w-full sm:w-auto"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass p-5 rounded-2xl border border-white/10 text-center">
            <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider">Total Apps</p>
            <p className="text-3xl font-bold mt-2 text-white">{total}</p>
          </div>
          <div className="glass p-5 rounded-2xl border border-white/10 text-center">
            <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider">Active Queue</p>
            <p className="text-3xl font-bold mt-2 text-amber-300">{activeQueue}</p>
          </div>
          <div className="glass p-5 rounded-2xl border border-white/10 text-center">
            <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider">Accepted</p>
            <p className="text-3xl font-bold mt-2 text-emerald-400">{accepted}</p>
          </div>
          <div className="glass p-5 rounded-2xl border border-white/10 text-center">
            <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider">Rejected</p>
            <p className="text-3xl font-bold mt-2 text-rose-400">{rejected}</p>
          </div>
        </section>

        <section className="glass p-5 rounded-2xl border border-white/10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Queue focus</h2>
              <p className="mt-1 text-sm text-primary-200">
                Use the current status to decide whether a file needs review, documents, or a final outcome.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-primary-100">
              Prioritize submitted and under-review files first, then complete outcomes.
            </div>
          </div>
        </section>

        {/* Applications List */}
        <main className="glass p-6 sm:p-8 rounded-3xl border border-white/10">
          <h2 className="text-xl font-bold mb-6">Manage Learner Applications</h2>

          {applications.length === 0 ? (
            <div className="text-center py-16 px-4 text-primary-200">
              <p>No applications have been submitted to your school yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-primary-300 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-4 px-4">Learner Name</th>
                    <th className="py-4 px-4">Grade</th>
                    <th className="py-4 px-4">Parent Name</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Next action</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-white/5 transition-all">
                      <td className="py-4 px-4 font-semibold text-white">
                        {app.learner_first_name} {app.learner_last_name}
                      </td>
                      <td className="py-4 px-4 text-primary-200">{app.grade_applying_for}</td>
                      <td className="py-4 px-4 text-primary-300">
                        {app.parent ? `${app.parent.first_name} ${app.parent.last_name}` : 'Unknown Parent'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          getAdminQueueTone(app.status)
                        }`}>
                          {APPLICATION_STATUS_LABELS[app.status]}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-primary-200">
                        {getAdminNextAction(app.status)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {actioningId === app.id ? (
                          <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                        ) : (
                          <div className="flex justify-end gap-2">
                            {app.status !== 'under_review' && app.status !== 'accepted' && app.status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'under_review')}
                                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 transition-all"
                              >
                                Review
                              </button>
                            )}
                            {app.status !== 'accepted' && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'accepted')}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-md"
                              >
                                Accept
                              </button>
                            )}
                            {app.status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-500/20 transition-all"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
