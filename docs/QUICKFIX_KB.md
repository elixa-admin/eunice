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

### Node 25 causes false-negative lint/typecheck failures

**Symptom**

- ESLint or TypeScript exits with environment-looking errors instead of normal code errors.
- Examples seen:
  - `/usr/bin/env: bad interpreter: Operation canceled`
  - `ECANCELED: operation canceled, read`
- Re-running the same checks can waste time because the failures look like unstable lint issues.

**Classification**

- config

**Root Cause**

- The workspace was running under Node 25, while the current Next/ESLint/TypeScript toolchain is stable under Node 20 LTS.
- A local Homebrew Node 22 install was also unusable because it referenced a missing `simdjson` dylib.

**Fix**

- Use Node 20 for this repo.
- Keep the root `.nvmrc` set to `20`.
- Reinstall dependencies with the Node 20/npm 10 toolchain when the environment has drifted.

**Fallback**

- If the local shell still defaults to Node 25, run checks through temporary npm 10:
  - `cd src && npx -y npm@10 run check`
  - `cd dev && npx -y npm@10 run check`
- If network access is blocked, rerun the `npx` command with approved network access instead of debugging lint first.

**Commands / Checks**

- `node -v`
- `npm -v`
- `cat .nvmrc`
- `cd src && npx -y npm@10 run check`
- `cd dev && npx -y npm@10 run check`
- `npm run verify:src`
- `npm run verify:dev`

**Last Verified**

- 2026-05-26 in the Eunice workspace.

**Notes**

- Do not treat this as a code regression until Node 20 has been confirmed.
- Do not run `npm audit fix --force` as part of this recovery.

### Supabase public env vars missing in local workspace

**Symptom**

- Auth, admin, parent, or `/api/ping` routes fail before reaching normal Supabase behavior.
- The root `.env.local` may contain unrelated keys, but not:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Before Sprint K hardening, importing the Supabase client could throw immediately.

**Classification**

- config

**Root Cause**

- The local workspace did not have the public Supabase browser env vars configured.
- The app assumed Supabase was present at module import time.

**Fix**

- Add the required public Supabase env vars in the app-local environment.
- Keep `/api/ping` behavior explicit: it should report `configured: false` and list missing keys when env is absent.
- Keep document uploads on preview storage unless both `NEXT_PUBLIC_ENABLE_SUPABASE_UPLOADS=true` and Supabase public env vars are present.

**Fallback**

- Use preview/local storage behavior for document uploads while Supabase env is absent.
- Check `/api/ping` before debugging route-level auth or database code.

**Commands / Checks**

- `node -e "const fs=require('fs'); console.log(fs.readFileSync('.env.local','utf8').split(/\\n/).filter(Boolean).map(l=>l.split('=')[0]).join('\\n'))"`
- `npm run verify:src`
- `npm run verify:dev`
- With the app running, open `/api/ping` and confirm it reports either configured Supabase or the missing keys.

**Last Verified**

- 2026-05-26 in the Eunice workspace.

**Notes**

- Do not paste secret values into docs or logs.
- `LINEAR_API_KEY` alone does not mean Supabase is configured.

### Supabase typed client collapses table results to `never`

**Symptom**

- After adding or editing the shared Supabase `Database` type, TypeScript reports many unrelated-looking errors such as:
  - `Property 'role' does not exist on type 'never'`
  - `Object literal may only specify known properties ... does not exist in type 'never[]'`
  - `Argument of type '{ ... }' is not assignable to parameter of type 'never'`
- The errors appear across admin, auth, parent workflow, inserts, updates, and selects at the same time.

**Classification**

- code

**Root Cause**

- The Supabase SDK expects each table shape to include `Row`, `Insert`, `Update`, and `Relationships`.
- The database namespace also needs `Tables`, `Views`, `Functions`, `Enums`, and `CompositeTypes`.
- If the shared schema type is incomplete, query builder inference can collapse to `never`, creating a noisy cascade.

**Fix**

- Define the shared schema in `shared/integrations/supabase.ts`.
- Ensure every table has:
  - `Row`
  - `Insert`
  - `Update`
  - `Relationships: []`
- Ensure `Database['public']` also includes:
  - `Views: Record<string, never>`
  - `Functions: Record<string, never>`
  - `Enums: Record<string, never>`
  - `CompositeTypes: Record<string, never>`
- Add new columns to the shared schema before using them in route/component code.

**Fallback**

- Fix the shared schema first.
- Avoid casting many query results locally just to silence the cascade; that hides the real type contract problem.

**Commands / Checks**

- `cd src && npx -y npm@10 run typecheck`
- `cd dev && npx -y npm@10 run typecheck`
- `npm run verify:src`
- `npm run verify:dev`

**Last Verified**

- 2026-05-26 in the Eunice workspace.

**Notes**

- If a single new column causes one type error, add the column to the shared schema.
- If many tables suddenly become `never`, inspect the database type shape before editing application logic.

### CodeGraph not initialized after workspace repair

**Symptom**

- CodeGraph MCP returns that no project is loaded or no `.codegraph/` directory exists.
- Structural questions cannot use `codegraph_*` tools even though the project instructions prefer them.

**Classification**

- config

**Root Cause**

- The repaired main workspace did not yet have a local CodeGraph index.
- The MCP server may also need an explicit `projectPath` because it can launch outside the workspace root.

**Fix**

- Initialize CodeGraph from the repo root:
  - `codegraph init -i`
- When using MCP tools, pass:
  - `projectPath: "/Users/brandondienar/Documents/Codex/Projects/Eunice"`
- Confirm index health before structural refactors.

**Fallback**

- If CodeGraph is unavailable, use `rg` for literal text and keep exploration narrow.
- Do not repeatedly query CodeGraph without `projectPath` if the first call reports workspace detection trouble.

**Commands / Checks**

- `codegraph init -i`
- CodeGraph MCP status with explicit project path
- Check that `.codegraph/` exists

**Last Verified**

- 2026-05-26 in the Eunice workspace.

**Notes**

- `codegraph init -i` also created `.cursor/rules/codegraph.mdc`.
- The repo already ignores `.codegraph/`; review whether `.cursor/` should be committed or ignored before publishing.

### Vercel `/dev` preview fails when the app imports sibling workspace code

**Symptom**

- The `/dev` Vercel preview either fails to build or shows `Module not found` errors for paths like:
  - `@eunice-shared/documents/contracts`
  - `@eunice-shared/domain/applications`
  - `@eunice-shared/integrations/supabase`
- Local `next build` can still pass, which makes the deployment failure look inconsistent.

**Classification**

- config

**Root Cause**

- The `/dev` preview was deployed as its own Vercel project rooted in `dev/`.
- That project only uploads the `dev/` folder during build, so imports that reach into `../shared` are unavailable in Vercel even if they work locally.

**Fix**

- Keep the `/dev` project self-contained for deployment.
- Point `dev/tsconfig.json` alias resolution at `./eunice-shared/*`.
- Mirror the small shared contracts needed by the preview into:
  - `dev/eunice-shared/documents/contracts.ts`
  - `dev/eunice-shared/domain/applications.ts`
  - `dev/eunice-shared/integrations/supabase.ts`

**Fallback**

- If the main `eunice` Vercel project is still mis-rooted or broken, deploy the preview directly with:
  - `vercel deploy --cwd dev --yes --scope elixa-admins-projects --target preview`

**Commands / Checks**

- `cd dev && npm run build`
- `cd dev && vercel pull --yes --environment preview`
- `cd dev && vercel build --yes`
- `vercel deploy --cwd dev --yes --scope elixa-admins-projects --target preview`

**Last Verified**

- 2026-05-26 in the Eunice workspace.

**Notes**

- The current working `/dev` preview project is `elixa-admins-projects/dev`.
- A successful preview URL from this fix path was `https://dev-a5y0q5vy2-elixa-admins-projects.vercel.app`.

### Deployed `/api/ping` checks are blocked by interactive deployment protection

**Symptom**

- `curl` against deployed `/dev` `/api/ping` returns the Vercel authentication wall HTML instead of JSON.
- `vercel curl /api/ping --deployment <preview-url>` can still return the auth wall even after auto-generating a bypass token.

**Classification**

- config

**Root Cause**

- Deployment protection on the preview requires an interactive authenticated flow in this environment for API-route access.
- The generated protection bypass token was insufficient on its own for this protected endpoint path in the current automation context.

**Fix**

- Validate `/api/ping` from an authenticated browser session (logged in to the protected team/project), or use a known-good deployment protection bypass secret with explicit access.
- Capture and document the JSON response from that authenticated path.

**Fallback**

- Confirm deployment health first via:
  - `vercel ls dev --scope elixa-admins-projects`
  - `vercel inspect <preview-url> --scope elixa-admins-projects`
- Mark P0.1 as blocked-on-protection until authenticated endpoint access is available.

**Commands / Checks**

- `curl -sS https://<preview>/api/ping`
- `vercel curl /api/ping --deployment https://<preview> --scope elixa-admins-projects`
- `vercel ls dev --scope elixa-admins-projects`
- `vercel inspect https://<preview> --scope elixa-admins-projects`

**Last Verified**

- 2026-05-26 in the Eunice workspace.

**Notes**

- This is not an app build failure when the deployment itself is `Ready`; it is an access path issue.

### Main `eunice` Vercel project fails instantly with `No Next.js version detected`

**Symptom**

- Root `eunice` preview deployments fail in about `0-2s`.
- The deployment page shows:
  - `No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies". Also check your Root Directory setting matches the directory of your package.json file.`
- `/dev` deployments can still succeed, which makes this look like a random branch or code regression at first.

**Classification**

- config

**Root Cause**

- The main `eunice` Vercel project was pointed at the repo root `./`.
- The actual main Next.js app lives in `src/`, while the repo-root `package.json` is only a workspace runner and does not declare `next` as a direct dependency.
- Vercel therefore tried to detect Next.js from the wrong `package.json` and failed before the build meaningfully started.

**Fix**

- In Vercel project settings for `elixa-admins-projects/eunice`, set:
  - `Settings -> Build and Deployment -> Root Directory -> src`
- Then redeploy the `eunice` project.
- Sync local Vercel metadata afterwards with:
  - `vercel pull --yes --environment preview`

**Fallback**

- If the main `eunice` project is still blocked and a review build is needed immediately, keep using the separate `/dev` preview project while the root project settings are corrected.

**Commands / Checks**

- `vercel project inspect eunice --scope elixa-admins-projects`
- `vercel inspect <failed-deployment> --scope elixa-admins-projects`
- `vercel --yes --scope elixa-admins-projects`
- `vercel pull --yes --environment preview --scope elixa-admins-projects`

**Last Verified**

- 2026-05-27 in the Eunice workspace.

**Notes**

- A successful post-fix root preview was `https://eunice-freqr38r7-elixa-admins-projects.vercel.app`.
- The synced local `.vercel/project.json` should show `"rootDirectory": "src"`.

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
