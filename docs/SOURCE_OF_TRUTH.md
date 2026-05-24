# Eunice Single Source Of Truth

Last updated: 2026-05-24 (Africa/Johannesburg)
Owner: Current sprint implementer on `codex/vercel-project-separation`

## Purpose

This is the canonical relay and handover document for the Eunice project.
If chat context is lost, a platform changes, or a new developer joins, start here.

## Canonical Project Identity

- Project: Eunice School Intake Platform
- Local repo root: `/Users/brandondienar/Documents/Codex/Projects/Eunice`
- GitHub repo: `elixa-admin/eunice`
- Active branch: `codex/vercel-project-separation`
- Latest aligned commit: see `git log -1 --oneline` on branch `codex/vercel-project-separation`

## Canonical Surfaces

- `src/`: product application surface
- `dev/`: preview and UX exploration surface (currently primary for UI theme sprint work)
- `shared/`: contracts reused by `src/` and `dev/`
- `supabase/`: schema and migration source of truth
- `docs/`: durable decisions, operating policies, and continuity artifacts

## Current Sprint Intent

- Primary goal: move the visible UI from "wireframe-like" to "professional admissions product feel"
- Theme direction:
  - External and parent-facing: structured, academic, green-and-gold Eunice-aligned
  - Internal admin: slightly more expressive, still brand-aligned
  - Current visual north star: the two latest screenshot references showing a deep green header, gold accents, cream surfaces, refined typography, and clear admissions queue/detail panels
  - Adopted visual north star (2026-05-23): premium academic product UI with modern professional typography, compact action-focused layouts, guided progression cues, and explicit "what happens next" messaging
- Scope discipline:
  - Prioritize coherent visual slices
  - Avoid broad architecture churn during UI sprint
- Current functional focus:
  - Drive admin visibility from workflow state, not static cards
  - Lightly color cards and lane summaries by blocking / review / ready / decision state
  - Keep the parent-facing workflow aligned to the same shared document logic
  - Compress the current 13-page Eunice application pattern into a guided 4-5 step parent journey with upfront document preparation

## Delivered Outcome Snapshot

- Shared visual foundation updated across the `dev/` surface
- Public preview shell, parent portal, admin dashboard, and application detail brought into a common polished theme
- Commit published to GitHub and branch-aligned with Vercel preview
- Admin dashboard now includes lane-aware heatmap cards and row tinting so progress, waiting, and blocking states are visible at a glance
- Guided application flow direction documented in `docs/GUIDED_APPLICATION_FLOW_PLAN.md`
- Admin dashboard typography and hierarchy were tightened to reduce the wireframe/cartoon feel: serif headings removed, rounded geometry reduced, invalid Tailwind utility names fixed, and queue/action copy made more operational
- Visual goal/vision aligned for handoff: parent journey, administrator review, and admin dashboard should all converge on this same premium green/gold Eunice system with dense but calm operational clarity
- Updated visual target now explicitly mirrors the screenshot references: dark green top bars, soft cream content surfaces, gentle gold accents, restrained borders, and calmer institutional card geometry
- Parent portal upgraded to an interactive 5-step guided wizard with preparation checklist (Step 0), care, fee-payer, and consent gates
- Database schema migration drafted in `supabase/migrations/20260523_000003_guided_flow_schema.sql` to back the guided intake flows with sub-tables for households, medical profiles, fee payers, and consent logs
- Admin Operations Dashboard made fully interactive, enabling sidebar detail card updates when clicking any table row
- Stuck-state visibility chips ('Waiting on Parent', 'Needs Staff Verification', 'Ready for Decision', 'Finalized') and color-coded progress health indicators integrated into the admin list and details card
- Screenshot-driven theme sprint now underway on the `dev/` surface first, with the preview shell and global styles as the base layer

## Environment And Configuration

Do not store secrets in docs. Store real values in `.env.local` (uncommitted).

Expected environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_THEME_FONT_UI_FALLBACK`

Reference docs:

- `docs/HANDOVER_BOOTSTRAP_PROMPT.md`
- `docs/SESSION_INTEGRATION_MEMORY.md`
- `docs/PLATFORM_RELAY_PROTOCOL.md`
- `docs/ARCHITECTURE.md`
- `docs/REQUIREMENTS.md`
- `docs/PROJECT_BRIEF.md`
- `docs/PHASES.md`
- `docs/UI_THEME_SPEC.md`
- `docs/GUIDED_APPLICATION_FLOW_PLAN.md`
- `docs/SPRINT_MICRO_SLICES_NEXT.md`

## Integration Alignment State

### Local Source

- Branch: `codex/vercel-project-separation`
- Latest commit: current branch head (see `git log -1 --oneline`)
- Working tree note: untracked `.claude/` exists and is intentionally excluded

### GitHub

- Remote: `origin https://github.com/elixa-admin/eunice.git`
- Remote branch head should match current branch head; verify with `git ls-remote origin codex/vercel-project-separation`
- PR workflow remains branch-based on `codex/vercel-project-separation`
- GitHub issue creation from the Codex integration is currently blocked by repository permissions (`Resource not accessible by integration`), so sprint coordination is temporarily doc-driven

### Vercel

- Project: `eunice-dev`
- Root directory: `dev`
- Latest ready preview at final protocol check: `https://eunice-3kklwbn5q-elixa-admins-projects.vercel.app`
- Most recent deployment status check: Vercel reports `Ready` for the latest checked `eunice-dev` preview; confirm newest preview with `vercel ls eunice-dev --scope elixa-admins-projects`

### Linear

- Project name: `Eunice Admissions Platform`
- Source of truth role: planning, ownership, status narration
- Action for every coherent slice: post or update project status against this same document state
- Current blocker at update time: connector returned `401 Reauthentication required`, including the 2026-05-22 handover, platform-relay status sync attempts, and the micro-slice sprint status sync attempt; status sync must resume after reconnect

## Execution Instructions For Any New Developer

1. Read this file first.
2. Read `docs/HANDOVER_BOOTSTRAP_PROMPT.md`, `docs/PLATFORM_RELAY_PROTOCOL.md`, `docs/SESSION_MANIFEST.md`, `docs/SESSION_BOOTSTRAP.md`, and `docs/SESSION_CONTINUITY.md`.
3. Confirm branch, commit, remote, and active surface.
4. Confirm GitHub, Vercel, and Linear auth/connectivity.
5. Continue from the next smallest coherent slice, not from chat history.
6. Use `docs/SPRINT_MICRO_SLICES_NEXT.md` as the active low-token sprint queue.

## Handover Packet Template

Use this exact packet when relaying to another platform or engineer:

```text
Project: Eunice School Intake Platform
Repo root: /Users/brandondienar/Documents/Codex/Projects/Eunice
Branch: codex/vercel-project-separation
Commit: current branch head (see `git log -1 --oneline`)
Primary surface now: dev/
Sprint intent: guided parent application flow, brand-aligned UI, workflow-visible admin cards
GitHub: aligned at branch head
Vercel: aligned to eunice-dev preview
Linear: update status from SOURCE_OF_TRUTH.md after each coherent slice
Known local note: .claude/ remains untracked and excluded
Next slice: Slice 4 (Trust ROI: Handover + Bootstrap Hardening and system sync verification)
Next sprint focus: typography/hierarchy polish, guided parent flow compression, admin queue health, handover hardening
Bootstrap prompt: docs/HANDOVER_BOOTSTRAP_PROMPT.md
Relay protocol: docs/PLATFORM_RELAY_PROTOCOL.md
```

## Non-Negotiable Working Rules

- Keep one durable source of truth for state: this file.
- Reflect coherent state changes to GitHub and Linear, not just local files.
- Keep Vercel alignment branch-driven (push -> deploy).
- If auth/connectors fail, record blocker and fallback in docs before ending session.
- Prefer small deterministic slices and explicit checkpoints over long conversational context.
- Treat `docs/PLATFORM_RELAY_PROTOCOL.md` as the rule for moving work between agents, platforms, GitHub, Vercel, and Linear.
