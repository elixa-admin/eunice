# RLS and Access Verification Checklist

## Purpose
Sprint D safety gate for verifying that parent, admin, and principal/superadmin data access stays within intended scope.

## Tables and Paths to Verify
- `profiles`
- `applications`
- `documents`
- `admin_notes`

## Parent Scope
- Parent can read only their own profile record.
- Parent can read only their own applications.
- Parent can read only documents attached to their application(s).
- Parent cannot update another user's application or document row.

## Admin Scope
- Admin can read only rows for the configured school tenant.
- Admin can update application status only for their school tenant.
- Admin can update document review states only for their school tenant.
- Admin note creation is restricted to authenticated staff roles.

## Principal / Superadmin Scope
- Principal can view school-wide records as intended.
- Superadmin behavior is explicit and documented.
- Any bypass path is documented with justification and audit expectations.

## Verification Steps
1. Review row-level policies in Supabase dashboard or SQL migration files.
2. Confirm client queries match policy scope.
3. Attempt unauthorized access from a non-owner session.
4. Confirm denied reads/writes fail cleanly and do not leak data.
5. Record results in the sprint checkpoint.

## Pass Criteria
- No unintended read or write access is possible from client paths.
- Role boundaries are documented and tested.
- Any exception is intentional, minimal, and auditable.
