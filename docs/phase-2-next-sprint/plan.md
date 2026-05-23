# Phase 2 Next Sprint Plan

## Sprint Goal

Build the production-shaped foundation for Eunice so the platform can move fast without painting itself into a corner:

- separate Parent and Admin experiences clearly
- keep dev and prod databases isolated
- keep the schema multi-school ready from day one
- ship a usable parent/admin workflow spine
- prove file validation and retrieval with real tests
- keep the parent journey mobile-first and calm

## Sprint Outcome

By the end of this sprint, we should be able to say:

- the app has a clean role split
- Supabase is the canonical backend, with dev/prod separation
- school-aware data modeling is in place
- parents can move through the core application flow
- admins can review and update applications
- file uploads are validated and confirmed with dummy data
- the UI is noticeably better on mobile

## Must-Do

### 1. Supabase foundation and environment split

Goal

Establish the real backend shape for both development and production.

Context

We already have Supabase as the backend direction, and the repo has early migration work. The next sprint should formalize that into separate dev and prod instances so testing is safe and the eventual pilot has a real production boundary.

Relevant files or references

- [docs/ARCHITECTURE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/ARCHITECTURE.md:1)
- [supabase/migrations/20260521_000001_phase2_foundation.sql](/Users/brandondienar/Documents/Codex/Projects/Eunice/supabase/migrations/20260521_000001_phase2_foundation.sql:1)
- [README.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/README.md:1)

Proposed approach

- Confirm the canonical Supabase schema path for the app.
- Keep dev and prod credentials separate.
- Use the existing migration as the baseline, then extend it only where needed.
- Ensure `school_id` remains a first-class partition key across school-scoped tables.

Acceptance criteria

- Dev and prod database targets are clearly separated.
- The schema remains multi-school ready.
- Migrations are the source of truth for structural changes.

Verify

- Confirm the app can point at dev without risking prod data.
- Confirm every school-scoped table has a `school_id` path or equivalent partitioning rule.

### 2. Role-separated app shells

Goal

Make the Parent front-end and Admin back-end feel like distinct products sharing one platform.

Context

The existing app already has parent/admin routes, but the experience still needs stronger separation in layout, intent, and navigation.

Relevant files or references

- [src/app/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/page.tsx:1)
- [src/app/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/parent/page.tsx:1)
- [src/app/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/admin/page.tsx:1)
- [src/lib/auth-routing.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/auth-routing.ts:1)

Proposed approach

- Tighten the visual and functional separation between roles.
- Make parent navigation simpler and more guided.
- Make admin navigation denser and operational.
- Ensure auth redirects land users in the right place by role.

Acceptance criteria

- Parents and admins land in clearly different experiences.
- Role routing is predictable.
- The UI language matches the user’s job: apply vs review.

Verify

- Manually open both experiences and confirm they feel intentionally different.
- Confirm role redirects land correctly after auth.

### 3. Core application workflow spine

Goal

Keep the minimum admissions workflow usable even before the final assessment flow is fully resolved.

Context

We know the platform must support draft, upload, review, submit, status tracking, and admin triage. The next sprint should make that backbone dependable.

Relevant files or references

- [src/components/parent/application-workflow.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx:1)
- [src/lib/domain/applications.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/applications.ts:1)
- [docs/REQUIREMENTS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/REQUIREMENTS.md:1)

Proposed approach

- Keep the application flow stateful and draft-safe.
- Ensure the parent can start, save, return, review, and submit.
- Ensure the admin can see the queue, open a record, and change status.
- Keep the workflow adaptable so the final assessment process can slot in later.

Acceptance criteria

- The parent flow is usable from start to submission.
- The admin can move an application through review states.
- The workflow is flexible enough to absorb the final assessment process later.

Verify

- Walk the flow end-to-end from parent start to admin status change.
- Confirm no hardcoded assessment assumption blocks future refinement.

### 4. File upload validation and proof

Goal

Make file handling trustworthy, not aspirational.

Context

Document handling is one of the highest-value operational improvements for Eunice. We need file checks that actually work and clear feedback when something fails.

Relevant files or references

- [src/lib/documents/validation.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/validation.ts:1)
- [src/lib/documents/storage.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/storage.ts:1)
- [src/lib/documents/upload.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/upload.ts:1)
- [shared/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/shared/documents/contracts.ts:1)

Proposed approach

- Validate file type and size.
- Surface upload progress.
- Confirm uploaded files are stored and retrievable.
- Test the rejection path with dummy data.
- Make the parent-facing feedback plain-language and recoverable.

Acceptance criteria

- Good files upload successfully.
- Bad file types and oversized files are rejected cleanly.
- Uploaded files can be confirmed from storage.
- Dummy upload tests prove the checks behave as expected.

Verify

- Upload test files and confirm both acceptance and rejection paths.
- Confirm the admin can view uploaded files after they are stored.

### 5. Mobile-first UX pass

Goal

Make the parent journey feel calm and usable on older phones and poor connections.

Context

The project is explicitly mobile-first, and the parent journey should feel like a guided task, not a complicated system.

Relevant files or references

- [src/app/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/parent/page.tsx:1)
- [src/app/auth/signup/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/auth/signup/page.tsx:1)
- [src/app/auth/signin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/auth/signin/page.tsx:1)
- [docs/UI_THEME_SPEC.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/UI_THEME_SPEC.md:1)

Proposed approach

- Strengthen hierarchy and spacing on the parent flow.
- Keep copy short and specific.
- Reduce friction on forms and file upload screens.
- Make errors actionable.

Acceptance criteria

- The parent flow reads clearly on mobile.
- The UX feels intentional rather than cramped.
- The app remains legible and usable on small screens.

Verify

- Inspect the UI in a mobile viewport.
- Confirm no critical labels, buttons, or instructions collapse or overlap.

## Should-Do

- Internal admin notes
- Search and filters on the admin list
- Document verification states
- CSV export
- Reminder trigger plumbing
- Status history display
- Accessibility pass

## Nice-to-Have

- Bulk actions
- Email history timeline
- Advanced reporting dashboard
- Workflow customization UI
- WhatsApp integration
- OCR / AI-assisted validation
- Multi-school admin tooling beyond the base tenancy model

## Recommended Execution Order

1. Supabase foundation and environment split
2. Role-separated app shells
3. Core application workflow spine
4. File upload validation and proof
5. Mobile-first UX pass

## Definition of Done

The sprint is done when the platform has:

- separate parent and admin experiences
- safe dev/prod database isolation
- multi-school-ready schema assumptions
- a usable core admissions flow
- verified upload validation and storage
- a stronger mobile experience than before

