# Sprint F — Deployment Stability and Source of Truth

**Status:** Active
**Window:** 2026-05-26 to 2026-06-06

## Goal
Restore a single, stable working source in `/dev`, keep Vercel pointed at the correct app root, and make the published branch mirror the latest working code without branch drift.

## Why this sprint
We used a temporary recovery branch to keep work moving after the main checkout became unstable. That was useful, but it introduced confusion around what Vercel should build. Sprint F removes that ambiguity and gets the project back onto one predictable path.

## Scope
### P0
1. Confirm `/dev` is the active working root for the app
2. Confirm the Vercel project points at the correct GitHub branch and root directory
3. Confirm the deployed branch matches the latest working code in `/dev`
4. Re-establish one source of truth for docs, branch, and deployment settings

### P1
1. Simplify or retire temporary recovery references in docs where they are no longer useful
2. Update handoff notes so the next sprint starts from the correct branch and folder
3. Capture the recovery pattern as a short reference, not a permanent workflow

### P2
1. Final polish on any remaining deployment-copy notes
2. Small documentation cleanup for clarity

## Deliverables
1. Vercel project settings documented and aligned with `/dev`
2. Canonical branch confirmed for publishing
3. Source-of-truth note added to the handoff
4. Sprint tracker updated to show the stable path
5. Any temporary recovery references clearly labeled as such

## Acceptance Criteria
1. The app builds from the correct `/dev` root without path confusion
2. The GitHub branch used by Vercel is the canonical working branch, not a temporary publish branch
3. The docs and handoff point to the same branch and folder
4. The project can be published without re-opening the root-directory issue

## Exit Criteria
1. Vercel deploys successfully from the intended branch and root
2. The branch/root configuration is documented in the repo
3. The next sprint can begin without additional deployment drift

## Current Truth
- Active app root: `dev/`
- Active build config: `dev/vercel.json`
- Active app package: `dev/package.json`
- Canonical publish branch: `codex/vercel-project-separation`
- Temporary recovery branch: `temp/sprint-e-publish` (do not use as the long-term source of truth)
