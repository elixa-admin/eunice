# Sprint F Implementation Tracker

**Status:** Active

See [SPRINT_F_DEPLOYMENT_STABILITY_AND_SOURCE_OF_TRUTH.md](./SPRINT_F_DEPLOYMENT_STABILITY_AND_SOURCE_OF_TRUTH.md) for the sprint scope.

## Track 1 — App Root and Vercel Alignment
- [ ] Confirm `/dev` is the app root
- [ ] Confirm Vercel root directory matches `/dev`
- [ ] Confirm Vercel framework preset remains Next.js
- [ ] Confirm build settings match `dev/package.json`

## Track 2 — Branch and Source Hygiene
- [ ] Confirm the canonical GitHub branch used for publishing
- [ ] Stop using the temporary recovery branch as the deploy source
- [ ] Document the working branch and why it is the source of truth

## Track 3 — Docs and Handoff
- [ ] Update handoff to reference `/dev` as the active working root
- [ ] Record the final Vercel/GitHub setup in a short recovery note
- [ ] Keep Sprint F docs aligned with the actual published setup

## Track 4 — Verification
- [ ] Successful Vercel deploy from the intended branch and root
- [ ] Confirm the published preview reflects the latest working code
- [ ] Verify no root-directory or Next.js detection errors remain

## Current Truth
- `/dev` is the working root for the app
- `dev/package.json` contains the Next.js dependency set
- `dev/vercel.json` already reflects the correct framework/build defaults
- GitHub publishing should use `codex/vercel-project-separation`
