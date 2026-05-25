# Compact Handoff — Sprint F Rebase

## Date
2026-05-25

## Current Working Root
`/dev`

## Current Branch
`codex/vercel-project-separation`

## Verified Live State
- GitHub remote: `https://github.com/elixa-admin/eunice.git`
- Vercel project linked: `eunice-dev`
- Local app root: `dev/`
- Vercel build settings should point at the `dev` root and Next.js framework preset

## What Was Completed
1. Sprint C execution kickoff for P0/P1 with initial product updates:
   - parent duplicate upload signaling
   - admin queue high-value filters
2. Pilot operations docs added:
   - support playbook
   - KPI baseline/cadence
   - daily checkpoint template
   - Sprint C execution checkpoint
3. Sprint D plan authored and activated:
   - `docs/SPRINT_D_UX_ELEVATION_AND_PRODUCTION_HARDENING.md`
4. UI/UX polish passes applied to:
   - global visual system
   - admin dashboard density and scanability
   - parent application workspace
   - auth screens
   - landing page messaging
   - admin analytics and quick-view layer
   - admin smart insights and risk flags
5. Sprint E package drafted locally:
   - `docs/SPRINT_E_ADMIN_DECISION_INTELLIGENCE_AND_GUIDED_PARENT_FLOW.md`
   - `docs/SPRINT_E_IMPLEMENTATION_TRACKER.md`
   - `docs/SPRINT_E_EXECUTION_CHECKLIST.md`
6. Shared UI primitives introduced:
   - `src/lib/ui-classes.ts`
   - reused across auth, landing, parent, and admin shells to reduce style drift
7. Sprint F was scoped to restore a single source of truth and deployment stability:
   - `docs/SPRINT_F_DEPLOYMENT_STABILITY_AND_SOURCE_OF_TRUTH.md`
   - `docs/SPRINT_F_IMPLEMENTATION_TRACKER.md`

## Active Working Files
- `src/components/parent/application-workflow.tsx`
- `src/app/admin/page.tsx`
- `docs/SPRINT_D_UX_ELEVATION_AND_PRODUCTION_HARDENING.md`
- `docs/SPRINT_D_IMPLEMENTATION_TRACKER.md`
- `docs/RLS_AND_ACCESS_VERIFICATION_CHECKLIST.md`
- `docs/CHECKPOINT_SPRINT_D_2026-06-03.md`
- `docs/PILOT_SUPPORT_PLAYBOOK.md`
- `docs/PILOT_KPI_BASELINE_AND_CADENCE.md`
- `docs/DAILY_PILOT_CHECKPOINT_TEMPLATE.md`
- `docs/CHECKPOINT_SPRINT_C_EXECUTION_2026-05-24.md`
- `docs/SPRINT_F_DEPLOYMENT_STABILITY_AND_SOURCE_OF_TRUTH.md`
- `docs/SPRINT_F_IMPLEMENTATION_TRACKER.md`

## Sprint D Autonomous Implementation Order
1. Parent form UX hardening (pending/error/submit safety)
2. RLS + role-scope verification pass
3. Admin queue table-driven usability uplift
4. Upload recovery clarity completion
5. Observability + KPI instrumentation and daily checkpoint evidence
6. Smart insight panel and trend-delta polish

## Sprint E Focus
1. Admin decision intelligence and risk flags
2. Guided parent upload flow refinement
3. Cross-screen visual consistency and browser verification
4. Shared UI primitives and code-smell reduction
5. Sprint E execution checklist and day-by-day delivery flow

## Sprint F Focus
1. Keep `/dev` as the active app root
2. Keep Vercel pointed at the correct app root and canonical branch
3. Remove ambiguity between temporary recovery work and the published source of truth
4. Document the stable setup so the next sprint starts from a clean baseline

## Definition of Done Gate
- P0 complete and verified
- P1 complete (or explicit carry-over risks)
- Parent/admin critical regressions pass
- KPI evidence captured in checkpoint docs
- Pilot-planning summary ready for stakeholder review

## Immediate Next Action
Lock in the Sprint F source-of-truth notes, then verify the live Vercel project settings match `/dev` and the canonical GitHub branch.

## Deployment Recovery Note
- If Vercel reports that the root directory is missing, first confirm the project is using `dev/` as the app root.
- If Vercel reports that Next.js cannot be detected, confirm `dev/package.json` is the package Vercel is reading and that it includes `next`.
- Do not use the temporary recovery branch as the normal publish source once the canonical branch is healthy again.
