# Platform Relay Protocol

Last updated: 2026-05-22 (Africa/Johannesburg)

## Purpose

This protocol keeps Codex, future agents, local source, GitHub, Vercel, Linear, and any later coding platform aligned through one durable relay path.

The rule is simple: every platform may work, but the repo docs remain the portable memory.

## Canonical Flow

1. Run `npm run session:start` from the repo root.
2. Read `docs/SOURCE_OF_TRUTH.md`.
3. Read `docs/HANDOVER_BOOTSTRAP_PROMPT.md`.
4. Confirm local branch, remote branch, and deployment target from the automated report.
5. Do one small coherent slice.
6. Update the relevant source-of-truth docs.
7. Commit and push to GitHub.
8. Let Vercel deploy from GitHub.
9. Update Linear if available.
10. If Linear or another connector fails, document the blocker once and continue from local/GitHub truth.

## Source-Of-Truth Priority

Use this priority when two systems disagree:

1. Local repo files on the active branch
2. GitHub remote branch
3. Vercel preview built from that branch
4. Linear project status and issues
5. Chat history

Chat history is useful context, but it must not be the only place a decision lives.

## Required Sync Points

After every coherent slice, sync:

- `docs/SOURCE_OF_TRUTH.md`
- `docs/HANDOVER_BOOTSTRAP_PROMPT.md` when next actions, integrations, or handover instructions change
- the specific phase or feature plan for the active workstream
- GitHub branch `codex/vercel-project-separation`
- Linear project `Eunice Admissions Platform` when connector access works

## Approval Boundaries

Autonomous agents may:

- read and edit repo files
- run local checks
- run `npm run session:start` without asking the user
- commit coherent slices
- push the active branch
- query GitHub and Vercel state
- update docs and checkpoints
- attempt one Linear read/write sync

Agents must ask before:

- changing production deployment settings
- merging to `main`
- deleting branches
- rotating secrets
- changing real Supabase schema or production data
- exposing or storing secrets in docs
- approving plain-text token storage

## Current Integration State

- GitHub remote: `https://github.com/elixa-admin/eunice.git`
- Active branch: `codex/vercel-project-separation`
- Latest verified remote head: current branch head. Confirm with `git ls-remote origin codex/vercel-project-separation`.
- Vercel project: `eunice-dev`
- Vercel root directory: `dev`
- Latest ready Vercel preview at final protocol check: `https://eunice-3kklwbn5q-elixa-admins-projects.vercel.app`
- Confirm newest preview with `vercel ls eunice-dev --scope elixa-admins-projects` from `dev/`.
- Linear project: `Eunice Admissions Platform`
- Linear status: connector blocked by `401 Reauthentication required`; latest project-status sync attempt on 2026-05-22 returned the same error

## Next Pass Instruction

The next agent should not broaden scope.

Next slice:

1. Implement the guided parent preview in `dev/app/dev/parent/page.tsx`.
2. Use `docs/GUIDED_APPLICATION_FLOW_PLAN.md` as the specification.
3. Preserve existing role and document logic in `dev/lib/dev-preview-data.ts`.
4. Commit and push once the parent preview is coherent.
5. Verify the new Vercel preview after the push.
6. Update this protocol only if integration state or approval boundaries change.

## Failure Rules

- If Git index locks appear, retry the commit path once with the documented elevated route.
- If Vercel deploy fails, capture the failed URL and the latest ready URL.
- If Linear returns `401`, do not retry writes in a loop.
- If local verification times out, inspect changed files and rely on the Vercel preview after push.
- If token or credit headroom is low, stop feature work and update `docs/HANDOVER_BOOTSTRAP_PROMPT.md` first.
