# Sprint M Execution Plan

**Status:** In progress
**Date:** 2026-05-26

## Sprint Goal

Prove production-like integrations on the deployed `/dev` lane while elevating the UI so landing-page guidance and cards become clear action flows, not passive information blocks.

## Guiding Principle

Every major panel should answer one of these:
- `What do I do now?`
- `What do I need next?`
- `What happens after this?`

If a card cannot answer one, we either rewrite it or remove it.

## P0 — Integration Proof On Deployed Preview

### P0.1 `/api/ping` end-to-end proof

**Outcome**

Supabase integration state is explicit and trustworthy in deployed preview checks.

**Scope**

- Verify `/api/ping` in deployed `/dev` preview returns the expected configured payload.
- Confirm failure shape remains explicit when keys are missing (documented behavior).
- Record exact expected response shapes in docs.

**Acceptance criteria**

- `/api/ping` returns stable, readable integration status in deployed preview.
- Missing-key behavior is documented and reproducible.

**Execution status (2026-05-26)**

- Deployment target verified and ready:
  - `https://dev-a5y0q5vy2-elixa-admins-projects.vercel.app`
  - deployment id: `dpl_14RxWDSttqdbUJBQdbNVqyePTzia`
- Blocker: deployment protection still requires interactive Vercel authentication for API-route access in this automation environment.
- Attempts performed:
  - direct `curl` to `/api/ping` returned Vercel auth wall
  - `vercel curl /api/ping --deployment <preview-url>` generated a bypass token but still returned the auth wall HTML
- Next step to complete P0.1:
  - run authenticated browser verification on `/api/ping` from a logged-in session (or provide a protection bypass secret with sufficient access), then capture and record the exact JSON payload.

### P0.2 Auth and role routing proof

**Outcome**

Parent/admin flows route correctly under live Supabase configuration.

**Scope**

- Validate sign-in and sign-up behavior with representative parent/admin users.
- Confirm role-based routing is deterministic.
- Confirm graceful handling for missing profile or invalid role edges.

**Acceptance criteria**

- Parent users land in parent surface.
- Admin users land in admin surface.
- Error states are clear and non-breaking.

### P0.3 Upload/storage proof

**Outcome**

Document uploads are reliable and map cleanly to review states.

**Scope**

- Test valid and invalid uploads in preview path.
- Test live upload behavior when enabled.
- Confirm admin surface reflects document states correctly.

**Acceptance criteria**

- Upload paths are deterministic for both preview and live modes.
- Validation states remain visible and actionable in admin review.

## P1 — UI Elevation From Landing-Page Guidance

### P1.1 Parent: guidance-to-action conversion

**Outcome**

Landing-page guidance cards become an action lane with clear next moves.

**Scope**

- Reframe guide cards into action cards with explicit CTA and step outcomes.
- Keep one dominant action above the fold.
- Reduce repeated explanatory text that does not move the user.

**Acceptance criteria**

- Each step has a dominant CTA.
- Parent can identify next step in under 3 seconds.
- “What happens next” is visible without expanding optional details.

### P1.2 Admin: status readability and decision velocity

**Outcome**

Status and triage information is readable at a glance under real usage conditions.

**Scope**

- Ensure contrast and hierarchy on status blocks and queue summaries.
- Tighten selected-record context to show identity, risk, and next action immediately.
- Remove dead visual space that hides critical signals.

**Acceptance criteria**

- No primary status signal is visually washed out.
- Queue and selected-record panels communicate immediate action clearly.

### P1.3 Application detail parity

**Outcome**

`/dev/application/[id]` matches the same action language and hierarchy as admin and parent.

**Scope**

- Align status framing and triage language with admin surface.
- Elevate next-step framing above the fold.
- Keep timeline and document checklist operational, not decorative.

**Acceptance criteria**

- Detail view reads as operational workflow, not static profile page.
- Next action is explicit and consistent with admin queue intent.

## P2 — Finish, Verify, and Document

### P2.1 Cross-route visual QA

**Scope**

- Browser verification on:
  - `/dev/admin`
  - `/dev/parent`
  - `/dev/application/app-001`
- Desktop and mobile checks for hierarchy, contrast, and spacing.

**Acceptance criteria**

- No critical readability or CTA hierarchy regressions remain.
- Core flow remains coherent across route transitions.

### P2.2 Documentation and handoff close

**Scope**

- Update sprint tracker with done/in-progress/not-started.
- Update quick-fix notes for any new deployment/integration traps.
- Refresh handoff with exact preview URL and next sprint starter tasks.

**Acceptance criteria**

- Tomorrow pickup requires no reconstruction.
- Active preview URL and verification commands are recorded in one place.

## Verification Checklist

- `npm run verify:dev`
- `cd dev && npm run build`
- deployed preview check on `/api/ping`
- manual auth and routing check
- manual upload and admin reflection check

## Current Sprint State

- P0.1: In progress, blocked on deployment-protection API access path
- P0.2: Not started
- P0.3: Not started
- P1.*: Not started
- P2.*: Not started

## Suggested Execution Order

1. P0.1 `/api/ping`
2. P0.2 auth/role routing
3. P0.3 upload/storage
4. P1.1 parent action conversion
5. P1.2 admin readability/decision velocity
6. P1.3 detail parity
7. P2.1 visual QA
8. P2.2 documentation close
