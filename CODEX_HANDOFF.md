# Compact Handoff — Sprint Q Ready

## Date
2026-05-27

## Canonical Workspace
`/Users/brandondienar/Documents/Codex/Projects/Eunice`

## Current Branch
`codex/vercel-project-separation`

## Current State
- `/dev` remains the active product-shaping lane.
- Sprint O is complete: parent calm-flow simplification landed.
- Sprint P is now implemented locally: admin decision-engine simplification for `/dev/admin` and `/dev/application/[id]`.
- A quick health sweep removed obvious duplicate local artifacts and added ignore rules for local numbered copies and `.cursor/`.
- Focused `dev` checks are green.
- Sprint Q is now the next planned sprint and is focused on workflow automation and communication history.

## What Landed Most Recently
1. Parent calm-flow and document grouping in the real and preview parent surfaces.
2. Admin hierarchy simplification in [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx):
   - fewer competing blocks
   - stronger selected-applicant anchor
   - issue-first worklist
   - evidence grouped by state
3. Application detail alignment in [dev/app/dev/application/[id]/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/application/[id]/page.tsx):
   - one decision lens
   - one evidence section
   - shorter reviewer/context rail
4. Sprint P planning doc created:
   - [docs/SPRINT_P_ADMIN_DECISION_ENGINE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_P_ADMIN_DECISION_ENGINE.md)
5. Repo hygiene pass:
   - duplicate `CODEX_HANDOFF`, `.eslintcache`, and `package-lock` copy artifacts removed
   - `.gitignore` now hides `.cursor/` and numbered duplicate local artifacts

## Verified Checks
- `cd dev && npm run check` passed

## Current Files To Review First
- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx)
- [dev/app/dev/application/[id]/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/application/[id]/page.tsx)
- [docs/SPRINT_P_ADMIN_DECISION_ENGINE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_P_ADMIN_DECISION_ENGINE.md)
- [docs/SPRINT_Q_WORKFLOW_AUTOMATION_AND_COMMS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_Q_WORKFLOW_AUTOMATION_AND_COMMS.md)
- [docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md)

## Next Sprint
Sprint Q should shift from layout simplification into lightweight operational workflow support:
1. communication history rail in admin
2. notification templates and status-change map
3. magic-link reupload path scaffolding
4. keep the implementation light and compatible with later `n8n` orchestration

## Notes
- Keep the parent side calm and the admin side operationally denser.
- Do not add heavy infrastructure for automation yet; scaffold the workflow contracts first.
- Keep using `/dev` preview plus Vercel for browser review.
- Check [docs/QUICKFIX_KB.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/QUICKFIX_KB.md) before revisiting Vercel, Supabase, or runtime loops.
