# QuickFix Knowledgebase

This is the lightweight memory for recurring problems, fast fixes, and safe fallbacks.

## When to Add an Entry

- A bug or failure repeats after a fix.
- A timeout or integration issue appears more than once.
- A workaround is safer or faster than the original path.
- A config issue keeps resurfacing in new sessions.

## Entry Template

### Title

Short name for the issue.

### Symptom

What failed, timed out, or behaved unexpectedly.

### Classification

- network
- config
- code

### Root Cause

The actual reason the problem happened.

### Fix

The solution that worked.

### Fallback

The safer or faster path used while the issue was unresolved.

### Commands / Checks

The exact commands, checks, or UI steps used to confirm the fix.

### Last Verified

Date and environment where the fix was confirmed.

### Notes

Any caveats or things to avoid next time.

## Usage Rule

- Check this file before repeating a failed path.
- Add a new entry when the same issue appears again.
- Keep entries short and practical.
- Prefer the smallest useful note over a long incident report.
- Include connector quirks, auth/key recovery steps, config fixes, and safe workarounds when they are part of the repeated problem.
- If the same workaround becomes the standard path across platforms, record the platform-agnostic version here.

## Recent QuickFixes

### Lint verification times out in both `verify:src` and `verify:dev`

**Symptom**

- `npm run verify:src` or `npm run verify:dev` hangs at the lint stage and exits with a timeout.
- Both workspaces fail the same way before showing normal lint or type errors.

**Classification**

- config

**Root Cause**

- Corrupted or stale dependency installs caused ESLint to hang while loading.
- The verifier timeout was also too tight for useful recovery because it stopped before surfacing real code errors.

**Fix**

- Rebuild both workspace dependency folders with a clean install.
- Confirm ESLint loads directly in each workspace before rerunning full verification.
- Keep `scripts/verify-workspace.mjs` on the safer path: 120 second timeout, ESLint cache enabled, changed-file lint targets, and a short Git lookup timeout.

**Fallback**

- If the same hang returns, test ESLint directly first before assuming code is broken.
- If direct ESLint load hangs, rebuild dependencies again instead of repeatedly rerunning full verification.

**Commands / Checks**

- `npm --prefix src ci`
- `npm --prefix dev ci`
- `cd src && node -e "require('eslint'); console.log('eslint-load-ok')"`
- `cd dev && node -e "require('eslint'); console.log('dev-eslint-load-ok')"`
- `npm run verify:src`
- `npm run verify:dev`

**Last Verified**

- 2026-05-26 in the Eunice workspace.

**Notes**

- This is now a fixed dependency/config issue, not an unresolved lint mystery.
- Do not run `npm audit fix --force` unless explicitly approved; it may change package versions aggressively.

### Local Git pack corruption or status hangs

**Symptom**

- `git status`, `git diff`, or `git reset` hangs or takes longer than 10 seconds.
- Git reports messages such as `far too short to be a packfile`, `garbage found`, `invalid sha1 pointer`, or `Operation canceled` while indexing.

**Classification**

- config

**Root Cause**

- The local `.git` metadata has damaged pack/index state. The source files can still be fine while Git's local tracking layer is unstable.

**Fix**

- Move corrupted pack files out of `.git/objects/pack`.
- Remove stale lock files and temporary pack files.
- Rebuild the index only if Git can do so quickly.
- If index commands still hang, stop and use a clean clone/worktree as the publish path.

**Fallback**

- Do not keep rerunning broad Git commands in the damaged checkout.
- Continue feature work only with bounded checks, then publish from a clean clone.

**Commands / Checks**

- `git count-objects -vH`
- `perl -e 'alarm 10; exec @ARGV' git status --short --untracked-files=normal`
- clean-clone fallback: clone `github.com/elixa-admin/eunice`, checkout the working branch, copy intended source/docs changes, verify, then commit and push from the clean clone.

**Last Verified**

- 2026-05-26 in the Eunice workspace.

**Notes**

- A clean source tree does not guarantee a healthy `.git` directory.
- Keep `.git-corrupt-backups/` ignored.

### Broken Git ref or stale lock blocks branch sync

**Symptom**

- `git status` or `git push` starts failing with messages like:
  - `bad ref refs/heads/...`
  - `index file smaller than expected`
  - `unable to create ... .lock`
  - push rejected even though the local branch looks current

**Classification**

- config

**Root Cause**

- A previous interrupted Git operation leaves stale lock files or broken ref files in `.git/`.
- The code is usually fine; the Git metadata is what is damaged.

**Fix**

- Remove only the broken Git lock/ref files.
- Rebuild the index from `HEAD`.
- If the workspace still refuses to push cleanly, use the clean publish clone instead of forcing the broken repo.

**Fallback**

- Use the clean clone in `/private/tmp` as the publish path.
- Keep the main workspace for editing, but do not keep fighting the broken metadata in a loop.

**Commands / Checks**

- Remove stale locks and rebuild index:
  - `rm -f .git/index.lock .git/HEAD.lock .git/ORIG_HEAD.lock`
  - `rm -f .git/index`
  - `git reset --mixed HEAD --no-refresh`
- If the repo still misbehaves, inspect `.git/refs` for stray duplicate lock/ref files.
- Verify:
  - `git status --short`
  - `git rev-parse --short HEAD`

**Last Verified**

- 2026-05-25 in the Eunice workspace.

**Notes**

- Do not use destructive repo-wide cleanup unless the user explicitly asks.
- Prefer the clean publish clone if the main checkout has corrupted Git metadata.
- After recovery, push from a healthy clone so Vercel can see the latest commit.

### Linear connector returns `401 Reauthentication required`

**Symptom**

- Linear connector calls fail with: `401: Server returned 401: 'Reauthentication required'`.
- Project status updates cannot be read or written from the connector.

**Classification**

- config

**Root Cause**

- The Linear connector session for this workspace expires or disconnects and must be re-authorized in the host app.

**Fix**

- Reconnect Linear from the app connector settings, then rerun a minimal read check before any write:
  - Read test: fetch the latest project status update for `Eunice Admissions Platform`.
  - Write test: create/update one short status update.

**Fallback**

- Continue coding and commit/push as normal.
- Record the exact Linear blocker in `docs/SOURCE_OF_TRUTH.md`.
- Retry connector auth once per session boundary, not repeatedly during active implementation.

**Commands / Checks**

- Connector read check: Linear status updates list for `Eunice Admissions Platform`.
- Connector write check: save one project status update.
- If read fails, do not attempt repeated writes until reconnect is complete.

**Last Verified**

- 2026-05-22 in the Eunice workspace.

**Notes**

- Treat Linear availability as a startup gate for tracker-dependent work.
- Avoid silent drift: if Linear is down, explicitly mark it in the handover source of truth.

### GitHub CLI keyring mismatch in Codex shell

**Symptom**

- `gh auth status` showed an invalid token in the Codex shell even after a browser login succeeded on the machine.

**Classification**

- config

**Root Cause**

- The shell was reading a stale credential state while the browser-side GitHub session was already valid.

**Fix**

- Re-authenticate GitHub CLI from stdin using the fresh PAT, then re-check `gh auth status`.

**Fallback**

- Use the GitHub connector for repo metadata and review work while the shell is being re-synced.

**Last Verified**

- 2026-05-21 in the Eunice workspace.

### Supabase CLI sign-in session failure

**Symptom**

- `supabase login` opened the browser flow, but the dashboard reported `Unable to create CLI sign-in` / `Could not create CLI login session`.

**Classification**

- network

**Root Cause**

- The dashboard-side CLI sign-in session could not be created reliably in this environment.

**Fix**

- Retry the CLI login from a fresh shell session and complete the browser verification code when Supabase presents it.

**Fallback**

- If CLI sign-in remains unstable, use the browser session as the source of truth and avoid repeating the failed path.

**Last Verified**

- 2026-05-21 in the Eunice workspace.

### Workspace verification quiet stall

**Symptom**

- Lint or typecheck starts, then sits silently for too long in the Codex shell without returning a pass or failure.

**Classification**

- config

**Root Cause**

- The default workspace checks are unbounded, so an environment-level stall looks the same as a long-running valid check.

**Fix**

- Run the bounded verifier instead:
  - `npm run verify:src`
  - `npm run verify:dev`
- The verifier kills a stalled step after the timeout and reports the issue clearly.

**Fallback**

- Treat the stall as an environment/config problem first, use structural sweeps and targeted review, and continue with the smallest safe slice while documenting the limitation honestly.

**Commands / Checks**

- `npm run verify:src`
- `npm run verify:dev`
- If needed: set `EUNICE_VERIFY_TIMEOUT_MS` to a higher value for one session.

**Last Verified**

- 2026-05-21 in the Eunice workspace.
