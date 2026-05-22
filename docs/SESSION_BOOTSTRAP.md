# Session Bootstrap

Run this at the start of a new coding session to make sure the repo, CLIs, and key connectors are healthy before code changes begin.

For a fresh start or a relay from another platform, read [SOURCE_OF_TRUTH.md](./SOURCE_OF_TRUTH.md) first, then [HANDOVER_BOOTSTRAP_PROMPT.md](./HANDOVER_BOOTSTRAP_PROMPT.md), then [SESSION_MANIFEST.md](./SESSION_MANIFEST.md), and then use this checklist to confirm the workspace is actually ready.

## Goal

Confirm that the local workspace and the connected services are ready for a smooth session.

If this is a resumed session or work is being transferred from another platform, read [SESSION_CONTINUITY.md](./SESSION_CONTINUITY.md) first so the current branch, surface, and handoff state are clear.

## Check Order

1. Confirm the repo is clean enough to work in.
   - `git status --short`
   - Confirm `.env.example` and `.env.local` are aligned for required keys, including `NEXT_PUBLIC_THEME_FONT_UI_FALLBACK`
2. Confirm GitHub CLI access.
   - `gh auth status`
3. Confirm Vercel CLI access.
   - `vercel whoami`
4. Confirm the linked Vercel project.
   - From the repo root: `vercel project inspect -y`
   - From `dev/` when working on the preview surface: `vercel project inspect -y`
5. If this session may move across Codex, Claude Code, or Antigravity, read `docs/COMMAND_DIALECT.md` before writing commands so the shared intent maps to the native syntax for the current platform.
6. Confirm connector and workspace readiness for any remote system you plan to use.
   - Linear: verify the connector is available and the target team/project is the intended one for the workstream.
   - GitHub: verify the repo scope and permissions are enough to read, commit, push, and review.
   - Supabase: verify the linked project and auth are sufficient for the intended schema or migration work.
   - Google Drive/Figma: verify the connector or plugin is available if the session depends on documents or design assets.
7. Confirm the active integrations are healthy before feature work begins.
   - GitHub: `gh auth status`
   - Supabase: `supabase projects list`
   - Vercel: `vercel whoami`
   - Linear: confirm the intended team/project is available in the connector and matches the workstream
   - Linear hard gate:
     - Run one connector read check against `Eunice Admissions Platform`.
     - If the connector returns `401 Reauthentication required`, pause tracker writes, reconnect Linear in app settings, and retest read before any write.
     - If still failing after reconnect, document blocker in `docs/SOURCE_OF_TRUTH.md` and continue implementation without repeated retries.
8. Confirm the current app package can verify cleanly.
   - Prefer the bounded verifier so quiet stalls fail clearly:
     - `npm run verify:src` from the repo root when working on the `src/` app
     - `npm run verify:dev` from the repo root when working on the `dev/` preview surface
   - If you need the native package scripts afterward:
     - `npm run check` from the repo root for `src/`
     - `npm --prefix dev run check` for `dev/`
9. Confirm the active remote branches and current branch are what you expect.
   - `git branch --show-current`
   - `git branch -r`
10. Confirm the current usage budget before starting broad work.
   - Check the native usage/status tool for the current platform.
   - Compare current usage against:
     - the next 4 hours
     - the 7-day limit
   - Apply the thresholds in `docs/USAGE_BUDGET_POLICY.md`.

## Failure Handling

- If a command times out or fails, retry once before changing anything.
- If the same failure repeats after a few retries, classify it as network, config, or code.
- Switch to the matching fallback instead of repeating the same command path.
- Check `docs/FAILURE_TRIAGE.md` before spending more time on the same failure.
- If the bug recurs later, add it to `docs/QUICKFIX_KB.md`.
- If lint or typecheck go quiet without finishing, use the bounded verifier before assuming a code failure.

## Optional If Relevant

- If the session will touch Linear, confirm the Linear connector is available in the app, confirm the target team/project, and use Linear for issue state rather than duplicating tracking in docs.
- If the session will touch Google Drive or Figma, confirm the relevant connector or plugin is available before starting design or document work.
- If usage is at or above `75%`, shrink the planned slice before starting.
- If usage is at or above `85%`, switch to wrap-up mode before adding new work.

## What Success Looks Like

- GitHub auth is valid.
- Vercel auth is valid.
- Supabase auth is valid.
- Linear access is confirmed for the active workstream.
- The linked Vercel project matches the intended workspace.
- The Linear team/project for the workstream is known before any task creation starts.
- The relevant connector or app permissions are known before any state-changing work starts.
- The working package checks pass or fail with a clear, local reason.
- There is no ambiguity about which branch or app surface is active.
- The workstream is aligned to one common goal across docs, code, and tracker.

## If Something Fails

- Fix auth or project linking before starting feature work.
- If Linear fails with `401`, use the QuickFix entry in `docs/QUICKFIX_KB.md` and do not keep retrying writes in a loop.
- Do not create a new branch just to work around a broken integration.
- Do not duplicate configuration in another folder unless the workspace truly needs a separate source of truth.
- Do not keep retrying the same failing command without a classification decision.
