# Session + Integration Memory

Last updated: 2026-05-22 (Africa/Johannesburg)
Canonical owner: active implementer on `codex/vercel-project-separation`

## Purpose

This document is the fast bootstrap memory for any new developer, agent, or external platform.
It consolidates session startup variables, project environment keys, connector status, automation routines, and recovery behavior.

Read this file first for initialization, then follow the read-order below.

## Read Order

1. `docs/SOURCE_OF_TRUTH.md`
2. `docs/HANDOVER_BOOTSTRAP_PROMPT.md`
3. `docs/PLATFORM_RELAY_PROTOCOL.md`
4. `docs/SESSION_BOOTSTRAP.md`
5. `docs/SESSION_CONTINUITY.md`
6. `docs/QUICKFIX_KB.md`

## Project Identity

- Project: Eunice School Intake Platform
- Repo root: `/Users/brandondienar/Documents/Codex/Projects/Eunice`
- GitHub repo: `elixa-admin/eunice`
- Active branch: `codex/vercel-project-separation`
- Primary active surface for current sprint: `dev/`

## Required Session Startup Routine

At the start of every new coding session, run:

```bash
npm run session:start
```

This prints:

- current branch
- latest commit
- git remote URL
- remote branch head
- working tree state
- environment-key coverage
- latest Vercel preview hint
- connector notes
- read-first docs
- next slice hint

The user should not need to remember startup steps manually.

## Environment Variables (Project-Level)

Expected keys:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_THEME_FONT_UI_FALLBACK`

Policy:

- Real secrets live only in `.env.local`.
- `.env.example` should stay aligned with required key names.
- Never put secret values in docs, commits, tickets, or chat.

## Connectors and Integrations

### Local Source

- Local repo is the first technical source of truth for implementation state.
- Keep one coherent branch head for each slice.

### GitHub

- Remote: `origin https://github.com/elixa-admin/eunice.git`
- Branch push is the deployment trigger path for Vercel previews.
- If GitHub CLI is unavailable in app UI, use git path and document status in `docs/SOURCE_OF_TRUTH.md`.

### Vercel

- Project: `eunice-dev`
- Root directory: `dev`
- Standard flow: push branch -> Vercel preview deploy.
- Use preview URL as the verification artifact for visual slices.

### Linear

- Project: `Eunice Admissions Platform`
- Intended role: planning and slice status narration.
- Known recurring blocker: connector may return `401 Reauthentication required`.
- Rule: reconnect once, retry once, then document blocker and continue without repeated retry loops.

### Supabase

- Managed backend for auth, database, storage.
- Schema/migrations source of truth: `supabase/`.

### Resend

- Email provider for workflow notifications.
- API key must remain in local environment only.

## Automations and Routines

### Implemented Routine

- `npm run session:start` is the canonical startup automation routine for every session.

### Working Routine Rules

- Operate in short deterministic slices.
- Avoid long conversational dependence.
- Update durable docs after each coherent slice.
- Prefer code changes + commit/push + Vercel verification over repeated local preview loops.
- If no meaningful changes occurred, do not force commits.

### Planned/Policy Routine References

- `docs/AUTOMATION_POLICY.md`
- `docs/automation-routines/plan.md`
- `docs/ARCHITECTURE_REVIEW_CADENCE.md`

## Recovery and Failure Rules

- On repeated command failure, classify once (auth/network/code), then switch path.
- For Linear `401`, do not loop retries.
- For git index locks, retry once on the approved elevated path, then stop looping.
- For verification stalls/timeouts, use bounded checks and rely on pushed preview for final UI validation.
- Record unresolved blockers in:
  - `docs/SOURCE_OF_TRUTH.md`
  - `docs/QUICKFIX_KB.md`
  - `docs/FAILURE_TRIAGE.md`

## Current Design/Implementation Intent Snapshot

- Parent-facing flow: academic, structured, Eunice green/gold brand discipline.
- Admin-facing dashboard: more expressive operational UI while still brand-aligned.
- Functional priority now: compress long intake into guided 4-5 step flow and strengthen admin workflow visibility.

## Handover Protocol (Minimum Packet)

When handing over across agent/platform/developer, include:

- repo root
- active branch
- latest commit hash
- current sprint intent
- current next slice
- env key list (names only)
- connector/auth status (GitHub/Vercel/Linear/Supabase)
- latest Vercel preview URL
- known blockers and fallback decisions
- read-order docs in this file

This document should be updated whenever integration state, startup routine, or connector constraints change.
