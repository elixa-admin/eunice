# Sprint J — Repo Health and Shared Cleanup

**Status:** P0/P1 partially executed on 2026-05-26

## Goal

Make the Eunice workspace faster and safer to work in before the next UI expansion.

## P0 — Repo and Git Health

### Completed

- Confirmed generated/local files are ignored:
  - `.env.local`
  - `.env*.local`
  - `.vercel/`
  - `.codegraph/`
  - `.next/`
  - `node_modules/`
  - `*.tsbuildinfo`
- Isolated a corrupted Git pack file from `.git/objects/pack`.
- Removed temporary pack garbage from Git's object store.
- Confirmed `git count-objects -vH` reports no Git garbage after cleanup.

### Still Fragile

- `git status` and some index-touching Git commands can still hang or fail locally.
- A later index rebuild reported `Operation canceled` while indexing `docs/SESSION_BOOTSTRAP.md`.
- Treat local Git as usable for narrow checks only until a clean-clone recovery is performed.

### Recommended Next Fix

Use a clean clone/worktree as the canonical publish path if Git status remains slow. Do not keep fighting this local `.git` directory during feature work.

## P1 — Verification Cleanup

### Completed

- Removed the remaining `dev` lint warnings by replacing logo `<img>` tags with `next/image`.
- Reran both verification commands successfully.

### Verified

- `npm run verify:src` passes lint and typecheck.
- `npm run verify:dev` passes lint and typecheck.

## Files Touched

- `.gitignore`
- `dev/.gitignore`
- `src/.gitignore`
- `dev/app/dev/page.tsx`
- `dev/components/nav.tsx`
- `dev/components/preview-shell.tsx`
- `docs/SPRINT_J_REPO_HEALTH_AND_SHARED_CLEANUP.md`

## Next Sprint Slice

Proceed with P1 shared system consolidation only after Git status is either stable or the team agrees to use a clean clone as the publish path.
