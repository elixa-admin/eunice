import type { ApplicationStatus } from '@/lib/domain/applications';

export type UserRole = 'parent' | 'admin' | 'principal' | 'superadmin';

export function getPostAuthRoute(role: string | null | undefined) {
  const normalizedRole = role?.toLowerCase() ?? 'parent';

  if (normalizedRole === 'admin' || normalizedRole === 'principal' || normalizedRole === 'superadmin') {
    return '/admin';
  }

  return '/parent';
}

export function getInitialApplicationStatus(role: UserRole): ApplicationStatus {
  return role === 'parent' ? 'draft' : 'ready_for_review';
}
