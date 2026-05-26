# Sprint I Implementation Tracker

**Status:** Verification blocker fixed

## Track 1 — Shared Layer Consolidation
- [ ] Move remaining reusable labels/rules into one canonical shared place
- [ ] Remove leftover copy-paste between `src/` and `dev/`

## Track 2 — Verification Stability
- [x] Fix repeated lint timeout by rebuilding workspace dependencies
- [x] Keep bounded verification as the default path with cache and changed-file targeting
- [x] Record any new repeat failure in QuickFix

## Track 3 — Type Safety Follow-Through
- [ ] Finish obvious remaining `any` hot spots in core parent/admin routes
- [ ] Prefer narrow local types where the data shape is stable

## Track 4 — Docs Polish
- [ ] Standardize sprint/checkpoint naming
- [x] Mark archive/reference docs more clearly
- [x] Make active vs procedural docs obvious at a glance

## Track 5 — Nice-to-Have Cleanup
- [x] Add a quick “what to open first” note to handoff docs
- [x] Add a compact safe-fallback list for browser/Git/Vercel recovery
- [ ] Trim a few remaining dense UI instruction blocks

## Current Truth
- The next sprint is about lowering friction further, not expanding scope
- Shared rules and verification behavior are the main pressure points left
- The lint timeout is fixed and documented as a QuickFix recovery path
