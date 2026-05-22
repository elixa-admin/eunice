# Eunice Single Source Of Truth

Last updated: 2026-05-22 (Africa/Johannesburg)
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
- Scope discipline:
  - Prioritize coherent visual slices
  - Avoid broad architecture churn during UI sprint
- Current functional focus:
  - Drive admin visibility from workflow state, not static cards
  - Lightly color cards and lane summaries by blocking / review / ready / decision state
  - Keep the parent-facing workflow aligned to the same shared document logic

## Delivered Outcome Snapshot

- Shared visual foundation updated across the `dev/` surface
- Public preview shell, parent portal, admin dashboard, and application detail brought into a common polished theme
- Commit published to GitHub and branch-aligned with Vercel preview
- Admin dashboard now includes lane-aware heatmap cards and row tinting so progress, waiting, and blocking states are visible at a glance

## Environment And Configuration

Do not store secrets in docs. Store real values in `.env.local` (uncommitted).

Expected environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_THEME_FONT_UI_FALLBACK`

Reference docs:

- `docs/ARCHITECTURE.md`
- `docs/REQUIREMENTS.md`
- `docs/PROJECT_BRIEF.md`
- `docs/PHASES.md`
- `docs/UI_THEME_SPEC.md`

## Integration Alignment State

### Local Source

- Branch: `codex/vercel-project-separation`
- Latest commit: current branch head (see `git log -1 --oneline`)
- Working tree note: untracked `.claude/` exists and is intentionally excluded

### GitHub

- Remote: `origin https://github.com/elixa-admin/eunice.git`
- Remote branch head verified at current branch head
- PR workflow remains branch-based on `codex/vercel-project-separation`

### Vercel

- Project: `eunice-dev`
- Root directory: `dev`
- Latest ready preview (at update time): previous ready preview remains the last confirmed validation target while the new `17ce8f3` deployment settles
- Most recent deployment status check: after the admin lane-heatmap push, verify the newest branch deployment in Vercel before treating the preview as final

### Linear

- Project name: `Eunice Admissions Platform`
- Source of truth role: planning, ownership, status narration
- Action for every coherent slice: post or update project status against this same document state
- Current blocker at update time: connector returned `401 Reauthentication required`, so status sync must resume after reconnect

## Execution Instructions For Any New Developer

1. Read this file first.
2. Read `docs/SESSION_MANIFEST.md`, `docs/SESSION_BOOTSTRAP.md`, and `docs/SESSION_CONTINUITY.md`.
3. Confirm branch, commit, remote, and active surface.
4. Confirm GitHub, Vercel, and Linear auth/connectivity.
5. Continue from the next smallest coherent slice, not from chat history.

## Handover Packet Template

Use this exact packet when relaying to another platform or engineer:

```text
Project: Eunice School Intake Platform
Repo root: /Users/brandondienar/Documents/Codex/Projects/Eunice
Branch: codex/vercel-project-separation
Commit: current branch head (see `git log -1 --oneline`)
Primary surface now: dev/
Sprint intent: professional admissions UI uplift, brand-aligned, workflow-visible admin cards
GitHub: aligned at branch head
Vercel: aligned to eunice-dev preview
Linear: update status from SOURCE_OF_TRUTH.md after each coherent slice
Known local note: .claude/ remains untracked and excluded
Next slice: validate the live branch preview, then keep refining workflow visibility only if needed
```

## Non-Negotiable Working Rules

- Keep one durable source of truth for state: this file.
- Reflect coherent state changes to GitHub and Linear, not just local files.
- Keep Vercel alignment branch-driven (push -> deploy).
- If auth/connectors fail, record blocker and fallback in docs before ending session.
- Prefer small deterministic slices and explicit checkpoints over long conversational context.
