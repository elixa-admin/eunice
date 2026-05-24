# Eunice Handover Bootstrap Prompt

Last updated: 2026-05-24 (Africa/Johannesburg)

Use this document when moving the project to a new agent, new coding platform, new developer, or fresh session. It is written as a practical bootstrap prompt plus the minimum project facts needed to continue safely.

## Copy This Into A New Agent

```text
You are continuing work on the Eunice School Intake Platform.

Repo root:
/Users/brandondienar/Documents/Codex/Projects/Eunice

GitHub:
elixa-admin/eunice

Active branch:
codex/vercel-project-separation

Current branch head at last handover:
current branch head after handover docs are committed

Primary surface right now:
dev/ is the Vercel preview and UX exploration app.
src/ is the product app surface.
shared/ contains contracts used by both.
supabase/ contains schema and migrations.

Read first:
1. docs/SOURCE_OF_TRUTH.md
2. docs/HANDOVER_BOOTSTRAP_PROMPT.md
3. docs/PLATFORM_RELAY_PROTOCOL.md
4. docs/SESSION_MANIFEST.md
5. docs/SESSION_BOOTSTRAP.md
6. docs/SESSION_CONTINUITY.md
7. docs/GUIDED_APPLICATION_FLOW_PLAN.md
8. docs/UI_THEME_SPEC.md
9. docs/QUICKFIX_KB.md
10. docs/FAILURE_TRIAGE.md

Current intent:
Continue the latest dev-preview work on the Eunice admissions platform: apply the screenshot-driven visual system to `dev/` first, keep the UI premium and operational, tighten admin hierarchy, and preserve the guided parent-friendly flow that replaces the 13-page Google Form while still capturing the school's required data and document needs.

Most recent product decision:
Compress the 13-page application into an upfront preparation screen plus a guided 5-step parent flow:
1. Start checklist
2. Learner and admission details
3. Parent, guardian, and household
4. Medical, support, and school readiness
5. Fee responsibility and documents
6. Review, consent, and submit

Current next slice:
Continue the landscape UI sprint in `docs/SPRINT_NEXT_LANDSCAPE_UI.md`: finalize the shared visual shell, finish the wide Parent Portal flow, elevate the Admin review surface, and keep the preview hub and handoff docs aligned.

At the start of a new session, run:
npm run session:start

Do not restart discovery from scratch.
Do not redesign the whole app.
Continue in small deterministic slices.
Commit and push coherent slices to GitHub.
Let Vercel deploy from the branch.
Update docs/SOURCE_OF_TRUTH.md and Linear after coherent milestones.
```

## Current Project Reality

The older baseline docs still describe Phase 0 as the official starting phase, but actual repo work has moved ahead. Treat the current source-of-truth docs as more accurate than older phase labels.

Current state:

- Live Eunice application form research has been captured.
- Other South African school admissions flows have been reviewed for patterns.
- The preview surface has a green-and-gold Eunice-aligned theme.
- Parent and admin previews now use shared workflow/document logic.
- Admin dashboard has lane-aware cards for blocking, review, ready, and decision states.
- Platform relay rules are captured in `docs/PLATFORM_RELAY_PROTOCOL.md`.
- The next priority is the guided parent application workflow, not more broad theme work.

## Product Direction

Eunice should feel:

- academic
- structured
- premium but not flashy
- green-and-gold brand aligned
- calm and trustworthy for parents
- more operational and expressive for internal staff

The product is not meant to be a prettier Google Form. It should behave like an admissions workflow system.

## Current Functional Model

Important concepts already identified:

- submitter
- learner
- parent / guardian
- separate legal guardian where applicable
- separate fee-payer / debtor where applicable
- household context
- medical and support profile
- academic history
- document packet
- consent and declarations

Important document categories:

- identity
- household / residence
- academic
- medical
- financial
- legal / custody
- supporting documents

Parent-side behavior should:

- show the full journey upfront
- disclose conditional branches only when relevant
- save drafts
- explain why each section matters
- explain why each document is needed
- separate blockers from manual-review items

Admin-side behavior should:

- show where applications are stuck
- separate document state from application status
- make next action obvious
- support review, re-upload, verification, and decision workflows

## Environment Variables

Do not commit real secrets. Real values belong in `.env.local`.

Tracked template:
`.env.example`

Expected keys:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_THEME_FONT_UI_FALLBACK=IBM Plex Sans
```

Current note:

- `NEXT_PUBLIC_THEME_FONT_UI_FALLBACK` exists to keep the UI font fallback explicit across platforms.
- Supabase and Resend keys are required before backend, auth, storage, or email work can be verified end-to-end.

## Integrations And Connectors

### GitHub

- Repo: `elixa-admin/eunice`
- Active branch: `codex/vercel-project-separation`
- Verified remote head should match the current branch head. Confirm with `git ls-remote origin codex/vercel-project-separation`.
- Use Git CLI for commits and pushes.
- Use GitHub connector or `gh` for PR metadata and CI when available.
- Known issue: Codex sandbox may show GitHub CLI unavailable while unrestricted keychain-backed `gh` works. See `docs/QUICKFIX_KB.md`.

### Vercel

- Project: `eunice-dev`
- Root directory: `dev`
- Latest ready preview at final protocol check: `https://eunice-3kklwbn5q-elixa-admins-projects.vercel.app`
- Confirm newest preview with `vercel ls eunice-dev --scope elixa-admins-projects`.
- Deploy model: push branch to GitHub, Vercel builds preview automatically.
- Validate user-facing changes on the live branch preview after commit/push.
- Avoid local preview loops unless a local-only UI bug needs browser inspection.

### Linear

- Project: `Eunice Admissions Platform`
- Role: planning, ownership, and status narration.
- Known blocker: connector has repeatedly returned `401 Reauthentication required`.
- Latest sync attempt: a project status update for this handover was attempted on 2026-05-22 and still returned `401 Reauthentication required`.
- Startup rule: do one read check. If it fails with `401`, reconnect in app settings, retry once, then document the blocker and continue implementation without repeated write attempts.
- Recovery details live in `docs/QUICKFIX_KB.md` and `docs/SESSION_BOOTSTRAP.md`.

### Supabase

- Role: auth, database, storage, migrations.
- Migrations live in `supabase/migrations/`.
- Do not run schema-changing work without confirming environment and migration target.

### Resend

- Role: future email notifications.
- Do not hard-code API keys.

## Working Rules

- Small slices beat broad rewrites.
- Make build changes first, then verify the dev site after commit/push.
- Do not chase local render loops.
- Do not keep retrying stale locks or connector failures.
- If a command fails, classify it once and switch to the documented fallback.
- Keep `.claude/` untracked unless the user explicitly asks otherwise.
- Update durable docs at coherent milestones, not after every small edit.
- If token or credit headroom is low, update this file and `docs/SOURCE_OF_TRUTH.md` before starting new feature work.
- Use `docs/PLATFORM_RELAY_PROTOCOL.md` when moving work between agents, coding platforms, GitHub, Vercel, Linear, or a human developer.

## Suggested Startup Commands

Run from repo root:

```bash
npm run session:start
git branch --show-current
git status --short
git log -1 --oneline
git remote -v
```

For checks:

```bash
npm run verify:dev
npm run verify:src
```

Known verification note:

- Bounded verification can time out in this environment even when the code change is small.
- If it times out, do not loop. Inspect the changed files, record the limitation, and rely on Vercel preview after push.

## Immediate Next Work

Begin the Phase 2 MVP build foundation:

1. Deploy the new SQL schema database migrations (`supabase/migrations/20260523_000003_guided_flow_schema.sql`) to prepare standard household, medical, fee-payer, and consent profiles.
2. Initialize and configure the Next.js routes and layouts under `src/` to receive authentications.
3. Bind the Resend email service adapter to trigger automated notifications.
4. Establish row-level database security (RLS) filters.

## Handoff Packet

Use this short packet in Slack, Linear, a PR, or a fresh agent prompt:

```text
Project: Eunice School Intake Platform
Repo: elixa-admin/eunice
Root: /Users/brandondienar/Documents/Codex/Projects/Eunice
Branch: codex/vercel-project-separation
Last known commit: current branch head
Primary surface: dev/ (landscape UI sprint)
Current goal: keep the preview aligned to the premium Eunice website brand and wide-screen admissions layout
Next slice: Task 1 of docs/SPRINT_NEXT_LANDSCAPE_UI.md
Vercel: eunice-dev, root dev/
Linear: Eunice Admissions Platform, currently needs connector reauth if 401 appears
Read first: docs/SOURCE_OF_TRUTH.md and docs/HANDOVER_BOOTSTRAP_PROMPT.md
Relay rules: docs/PLATFORM_RELAY_PROTOCOL.md
```
