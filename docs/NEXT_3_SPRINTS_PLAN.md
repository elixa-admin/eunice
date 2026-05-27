# Next 3 Sprints Plan

**Status:** Proposed

## Planning Intent

Sequence the next three sprints so Eunice finishes the current foundation work, proves the real integrations, and then resumes product-facing admissions improvements without reintroducing the drift and verification loops that slowed Sprint I/J/K.

## Shared Decisions

- Keep Sprint K as the current cleanup sprint and finish its `P0/P1` before opening new product scope.
- Treat `src/` as the canonical app and `dev/` as the preview/prototyping surface.
- Keep the next passes centered on `dev/` surfaces and defer assessment-specific UI work unless it blocks shared infrastructure.
- Use Node 20 as the known-good runtime and check [docs/QUICKFIX_KB.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/QUICKFIX_KB.md) before repeating Node, Supabase, CodeGraph, or Git recovery paths.
- Use CodeGraph with explicit `projectPath: "/Users/brandondienar/Documents/Codex/Projects/Eunice"` for structural refactor planning.
- Do not rely on live Supabase behavior until `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are present and `/api/ping` confirms the integration is configured.

## Sprint L — Finish Foundation and Preview Extraction

**Goal**

Complete the remaining Sprint K `P1` work so the `dev/` preview surfaces are easier to maintain and the next sprint can focus on integration proof rather than cleanup.

### Task 1 — Extract large `dev/` route surfaces

**Goal**

Break the largest `dev` admin and parent preview pages into focused components and helpers without changing behavior.

**Context**

Sprint K started shared-domain and integration hardening. The next planned `P1` item is selective component extraction from the heaviest preview surfaces.

**Relevant files**

- [dev/app/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/admin/page.tsx)
- [dev/app/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/parent/page.tsx)
- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx)
- [dev/app/dev/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/parent/page.tsx)
- `dev/components/*`
- `dev/lib/*`

**Proposed approach**

Use CodeGraph to identify the largest `dev/` route-level symbols and repeated display logic. Extract route-local tables, status chips, metrics, and form/modal sections into named components or helper modules. Keep visual and behavioral changes minimal.

**Acceptance criteria**

- The largest affected route files are materially smaller and easier to scan.
- Repeated status and display logic is owned by named components/helpers.
- Parent and admin preview flows render the same information as before.

**Verify**

- `npm run verify:dev`
- Manual browser check for affected `dev` routes

### Task 2 — Complete docs and bootstrap cleanup

**Goal**

Make the repo entry path obvious for future sessions and make the `/dev` focus explicit.

**Context**

Sprint K added `.nvmrc`, CodeGraph, shared Supabase contracts, and new quick-fix guidance. The handoff and sprint docs should reflect that current truth.

**Relevant files**

- [CODEX_HANDOFF.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/CODEX_HANDOFF.md)
- [docs/QUICKFIX_KB.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/QUICKFIX_KB.md)
- [docs/SPRINT_K_PLAN.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_K_PLAN.md)
- [.nvmrc](/Users/brandondienar/Documents/Codex/Projects/Eunice/.nvmrc)

**Proposed approach**

Update active docs to point to the Sprint K/L state, record the Node 20 bootstrap path, call out the `/dev` priority, and decide whether `.cursor/rules/codegraph.mdc` should be committed or ignored.

**Acceptance criteria**

- Handoff points to the current sprint plan and quick-fix KB.
- Node 20 and CodeGraph expectations are documented in one obvious place.
- `.cursor/` handling is intentional before publishing.

**Verify**

- Read-through check for conflicting guidance
- `npm run verify:src`
- `npm run verify:dev`

## Sprint M — Integration Proof and Operational Readiness

**Goal**

Turn the hardened integration code into verified behavior by proving Supabase auth, storage, and health checks in realistic local and deploy-like conditions while keeping the `/dev` preview experience in sync.

### Task 1 — Configure and verify Supabase health

**Goal**

Make Supabase availability explicit and testable across `src` and `dev`.

**Context**

Sprint K found that the local `.env.local` did not include Supabase public env vars. The app now reports missing config cleanly, but live connectivity still needs proof.

**Relevant files**

- [src/app/api/ping/route.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/api/ping/route.ts)
- [dev/app/api/ping/route.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/api/ping/route.ts)
- [shared/integrations/supabase.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/shared/integrations/supabase.ts)
- [src/lib/supabase.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/supabase.ts)
- [dev/lib/supabase.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/lib/supabase.ts)

**Proposed approach**

Add the required Supabase public env vars locally and in the deploy environment. Exercise `/api/ping` in both workspaces. Record expected success and failure shapes in quick-fix docs.

**Acceptance criteria**

- `/api/ping` reports missing env vars when unconfigured.
- `/api/ping` reports live Supabase connectivity when configured.
- Both `src` and `dev` use the shared integration contract consistently.

**Verify**

- `npm run verify:src`
- `npm run verify:dev`
- Browser or HTTP check of `/api/ping` with and without Supabase env vars

### Task 2 — Prove auth and role routing

**Goal**

Confirm parent/admin sign-in, sign-up, and role redirects behave correctly with live Supabase configuration.

**Context**

Auth routes currently call Supabase directly and route users based on profile role. The shared database shape now types the profile table, but behavior still needs live validation.

**Relevant files**

- [src/app/auth/signin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/auth/signin/page.tsx)
- [src/app/auth/signup/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/auth/signup/page.tsx)
- [src/lib/auth-routing.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/auth-routing.ts)
- [src/app/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/parent/page.tsx)
- [src/app/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/admin/page.tsx)

**Proposed approach**

Create or identify test parent/admin accounts, verify profile rows, and exercise sign-in/sign-up redirects. Document any required seed data or Supabase table expectations.

**Acceptance criteria**

- Parent users land in the parent portal.
- Admin or superadmin users land in the admin dashboard.
- Missing or invalid profile states fail gracefully.
- Required Supabase setup is documented.

**Verify**

- `npm run verify:src`
- Manual browser auth flow with one parent account and one admin account

### Task 3 — Prove document upload storage behavior

**Goal**

Validate preview storage fallback and live Supabase storage upload behavior.

**Context**

Sprint K made storage use preview behavior unless Supabase uploads are explicitly enabled and configured. This needs real flow verification before document-heavy product work resumes.

**Relevant files**

- [src/lib/integrations/storage.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/integrations/storage.ts)
- [src/lib/documents/upload.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/upload.ts)
- [src/components/parent/application-workflow.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx)
- [shared/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/shared/documents/contracts.ts)

**Proposed approach**

Test one valid upload and one invalid upload in preview mode, then repeat with `NEXT_PUBLIC_ENABLE_SUPABASE_UPLOADS=true` and a configured Supabase bucket. Confirm database rows and storage paths line up.

**Acceptance criteria**

- Preview upload path works without live Supabase storage.
- Live upload path writes to the configured bucket when enabled.
- Invalid file type and oversized file behavior remains clear.
- Upload results preserve the document validation states expected by admin review.

**Verify**

- `npm run verify:src`
- Manual upload flow in parent workflow
- Admin view confirms uploaded document metadata

## Sprint N — Admissions Workflow Product Improvements

**Goal**

Resume product-facing improvements now that the foundation and integrations are less fragile.

### Task 1 — Improve parent application continuation

**Goal**

Make it easier for parents to understand what remains, resume where they left off, and complete required documents.

**Context**

Earlier sprint trackers emphasized guided parent onboarding and document-first uploads. After integration proof, the parent workflow can move from stable mechanics to better completion ergonomics.

**Relevant files**

- [src/components/parent/application-workflow.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx)
- [src/lib/parent-application.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/parent-application.ts)
- [src/lib/domain/application-requirements.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/application-requirements.ts)
- [shared/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/shared/documents/contracts.ts)

**Proposed approach**

Polish the resume state, remaining requirements summary, and upload progress behavior. Keep the interface calm and operational rather than adding more explanatory blocks.

**Acceptance criteria**

- Parents can clearly see what is complete, what is missing, and what can still be reviewed manually.
- Returning users resume with preserved progress and useful status.
- Required, conditional, and optional documents remain distinguishable.

**Verify**

- `npm run verify:src`
- Manual parent flow on desktop and mobile viewport

### Task 2 — Strengthen admin review queue actionability

**Goal**

Make the admin queue better at showing what needs attention next.

**Context**

The admin dashboard already has triage lanes, document summaries, and status actions. The next product step is to improve prioritization and decision support without expanding the backend model too aggressively.

**Relevant files**

- [src/app/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/admin/page.tsx)
- [src/lib/admin-dashboard.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/admin-dashboard.tsx)
- [src/lib/domain/applications.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/applications.ts)

**Proposed approach**

Improve queue filters, next-action labels, and selected-application detail states. Use existing status transitions and document summaries rather than inventing new statuses unless a real gap appears.

**Acceptance criteria**

- Admin users can quickly distinguish blocked, ready, in-review, and closed applications.
- Document blockers and review-only warnings are visible in the right context.
- Status actions remain consistent with allowed transitions.

**Verify**

- `npm run verify:src`
- Manual admin review flow with sample applications across multiple statuses

### Task 3 — Prepare a release-ready verification checklist

**Goal**

Create a repeatable checklist for publishing after product changes.

**Context**

The repo has had Git, Node, Vercel, and integration reliability issues. A short release checklist will prevent the team from relying on memory before deploys.

**Relevant files**

- [docs/QUICKFIX_KB.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/QUICKFIX_KB.md)
- [docs/GIT_PUBLISH_RECOVERY.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/GIT_PUBLISH_RECOVERY.md)
- [CODEX_HANDOFF.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/CODEX_HANDOFF.md)

**Proposed approach**

Write a compact release checklist covering Node version, verification commands, Supabase health, auth smoke test, document upload smoke test, Git status, and deploy source branch.

**Acceptance criteria**

- A release checklist exists and references the quick-fix KB.
- The checklist can be run by a future agent without this conversation.
- It includes both automated commands and manual smoke checks.

**Verify**

- Read-through check for ambiguity
- Execute automated checklist commands once before marking ready

## Dependency Order

1. Sprint L must finish before Sprint M so integration testing is not mixed with active preview refactors.
2. Sprint M must finish before Sprint N so parent/admin product changes are tested against real auth and storage behavior.
3. Sprint N should not expand status or document contracts unless Sprint M proves the current contracts are insufficient.

## Out Of Scope Across All Three

- New major product areas outside parent application, admin review, auth, storage, and deployment readiness.
- Schema migrations beyond what is needed to support already-used tables and columns.
- Aggressive package upgrades or `npm audit fix --force`.
- Broad visual redesigns that are not tied to completion, review, or operational clarity.
