# Sprint K Plan

**Status:** Approved for P0/P1

## Sprint Goal

Reduce delivery friction across the `src/` and `dev/` workspaces so the next product-facing sprint can ship on a cleaner shared foundation.

## Shared Decisions

- Keep scope focused on consolidation and hardening, not net-new feature expansion.
- Treat `src/` as the canonical application path and use `dev/` as the preview/prototyping surface.
- Prefer extracting reusable rules, labels, and shape mappers into shared or clearly-owned library modules before adding more UI logic.
- Use the working Node 20 toolchain for verification until the local machine defaults are aligned.
- Execute `P0` and `P1` in this sprint, then return for the stretch item after the core work lands.

## Sprint Order

### P0

- Task 1 — Consolidate shared rules used by both workspaces
- Task 3 — Harden admin and parent data shapes

### P1

- Task 2 — Extract the largest remaining `dev/` surfaces into focused components
- Task 4 — Clean the working docs and bootstrap path

### Stretch Next

- Rebuild CodeGraph for the repaired main workspace once `P0/P1` is complete

## Task 1 — Consolidate shared rules used by both workspaces

**Goal**

Move duplicated domain constants and document/application rules into one canonical home so `src/` and `dev/` stop drifting.

**Context**

Sprint I called out shared-layer consolidation as unfinished work, and Sprint J explicitly recommended continuing with shared system consolidation before more UI expansion. The repo already has one shared seam in [shared/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/shared/documents/contracts.ts), which makes this a natural next move.

**Relevant files**

- [shared/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/shared/documents/contracts.ts)
- [src/lib/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/contracts.ts)
- [src/lib/domain/application-requirements.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/application-requirements.ts)
- `dev/lib/*`

**Proposed approach**

Audit duplicate constants, labels, and validation rules across `src/` and `dev/`. Promote the stable ones into `shared/` or another single owner module, then update both workspaces to consume those exports rather than maintaining parallel copies.

**Acceptance criteria**

- Shared rules used by both workspaces exist in one canonical module.
- No obvious copy-paste rule sets remain for document contracts, application requirements, or intake labels that are meant to stay aligned.
- `src/` and `dev/` import the shared definitions without changing user-visible behavior.

**Source reference**

- [docs/SPRINT_I_IMPLEMENTATION_TRACKER.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_I_IMPLEMENTATION_TRACKER.md)
- [docs/SPRINT_J_REPO_HEALTH_AND_SHARED_CLEANUP.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_J_REPO_HEALTH_AND_SHARED_CLEANUP.md)

**Verify**

- `npm run verify:src`
- `npm run verify:dev`
- Spot-check one parent flow and one admin flow in `dev/`

## Task 2 — Extract the largest remaining `dev/` surfaces into focused components

**Goal**

Reduce the cost of iterating on preview pages by breaking the heaviest `dev/` routes into smaller, easier-to-change pieces.

**Context**

Sprint J finished the same kind of slimming work in `src/`, especially around admin and parent workflow helpers. The next highest-leverage follow-up is to apply that pattern to the preview workspace, where route files still appear to carry a lot of direct UI composition responsibility.

**Relevant files**

- [dev/app/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/admin/page.tsx)
- [dev/app/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/parent/page.tsx)
- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx)
- [dev/app/dev/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/parent/page.tsx)
- `dev/components/*`
- `dev/lib/*`

**Proposed approach**

Identify the two or three largest `dev/` route surfaces and extract repeated sections, display helpers, and route-local mappers into focused components or library helpers. Keep the extraction behavioral only; do not redesign the flows in this sprint.

**Acceptance criteria**

- The heaviest `dev/` pages are materially smaller and easier to scan.
- Repeated UI sections and formatting helpers are owned by named components or helper modules.
- Preview behavior remains the same from a user perspective.

**Source reference**

- [docs/SPRINT_J_REPO_HEALTH_AND_SHARED_CLEANUP.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_J_REPO_HEALTH_AND_SHARED_CLEANUP.md)
- [CODEX_HANDOFF.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/CODEX_HANDOFF.md)

**Verify**

- `npm --prefix dev run check`
- Manually open the affected preview pages and confirm they render without regressions

## Task 3 — Harden admin and parent data shapes

**Goal**

Remove the most fragile `any` usage and informal mapping logic in the core parent/admin paths so future feature work lands on stable contracts.

**Context**

Sprint I left type-safety follow-through explicitly unfinished. Sprint J already extracted some admin and parent helper logic into dedicated modules, which creates a good place to finish the next layer of typing and mapper cleanup.

**Relevant files**

- [src/lib/admin-dashboard.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/admin-dashboard.tsx)
- [src/lib/parent-application.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/parent-application.ts)
- [src/app/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/admin/page.tsx)
- [src/components/parent/application-workflow.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx)
- [src/lib/domain/applications.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/applications.ts)

**Proposed approach**

Target the most obvious `any` hot spots and loose mapper boundaries in admin and parent flows. Introduce narrow local types where the backend shape is stable, and centralize translation from raw records into UI-ready models.

**Acceptance criteria**

- Core admin/parent helpers no longer rely on avoidable `any` usage in the highest-traffic paths.
- Mapper logic is easier to follow and has clearer ownership.
- Type narrowing improves confidence without forcing a wider schema redesign.

**Source reference**

- [docs/SPRINT_I_IMPLEMENTATION_TRACKER.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_I_IMPLEMENTATION_TRACKER.md)
- [CODEX_HANDOFF.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/CODEX_HANDOFF.md)

**Verify**

- `npm --prefix src run typecheck`
- `npm run verify:src`

## Task 4 — Clean the working docs and bootstrap path

**Goal**

Make the repo easier to enter for the next session by aligning sprint docs and recording the Node 20 bootstrap expectation.

**Context**

The current repo is in better shape, but onboarding is still split across sprint trackers, handoff notes, and implicit local knowledge. We also just confirmed that Node 25 causes false-negative verification failures while Node 20 works.

**Relevant files**

- [CODEX_HANDOFF.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/CODEX_HANDOFF.md)
- [docs/QUICKFIX_KB.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/QUICKFIX_KB.md)
- [docs/SPRINT_I_IMPLEMENTATION_TRACKER.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_I_IMPLEMENTATION_TRACKER.md)
- [docs/SPRINT_K_PLAN.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_K_PLAN.md)
- [.nvmrc](/Users/brandondienar/Documents/Codex/Projects/Eunice/.nvmrc)

**Proposed approach**

Standardize the active sprint references, document Node 20 as the current known-good runtime, and trim or relabel stale procedural guidance so the next person knows exactly where to start.

**Acceptance criteria**

- Active sprint docs clearly point to the current plan and tracker.
- The known-good runtime expectation is documented in a discoverable place.
- Handoff and quick-fix notes no longer leave the bootstrap path implicit.

**Source reference**

- [docs/SPRINT_I_IMPLEMENTATION_TRACKER.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_I_IMPLEMENTATION_TRACKER.md)
- [docs/QUICKFIX_KB.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/QUICKFIX_KB.md)

**Verify**

- Read-through check for conflicting guidance
- `npm run check`

## Stretch

Rebuild CodeGraph for the repaired main workspace after `P0/P1` lands, so deeper structural refactors can use the index again without competing with the core sprint work.
