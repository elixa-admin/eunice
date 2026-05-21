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
