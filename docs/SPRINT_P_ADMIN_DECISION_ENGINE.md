# Sprint P — Admin Decision Engine

**Status:** In progress

## Sprint Goal

Turn the `/dev` admin workspace into a faster decision surface by reducing competing blocks, grouping evidence by state, and keeping the selected applicant as the primary anchor.

This sprint follows Sprint O. The parent side is now calmer and more linear. The next priority is making the admin side feel more like an operating console than a record browser.

## Design Direction

- Keep the selected applicant as the first place the eye lands.
- Reduce equal-weight cards and helper prose.
- Group information into fewer, stronger zones:
  - selected application
  - queue worklist
  - evidence snapshot
- Make the queue issue and next action more visible than raw record metadata.
- Keep the visual tone premium and academic, but let the admin side be denser and more operational than the parent side.

## Scope

### In scope

- `/dev` admin dashboard hierarchy simplification
- clearer queue issue framing
- evidence grouped by state instead of scattered support cards
- application detail alignment so the full record view keeps the same decision rhythm
- compact sprint documentation updates

### Out of scope

- backend schema changes
- live reviewer assignment logic
- bulk triage mode
- communication automation
- OCR or document intelligence implementation

## P0 — Dashboard Hierarchy Simplification

**Goal**

Make the top of the admin dashboard readable at a glance.

**Relevant files**

- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx)
- [dev/components/surface-card.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/surface-card.tsx)
- [dev/components/status-badge.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/status-badge.tsx)

**Implementation notes**

- Merge small summary blocks into a tighter hero + work panel.
- Keep one strong next-action area.
- Move queue states into a compact side panel instead of letting them compete with the main record.

## P1 — Queue and Evidence Restructure

**Goal**

Shift the workspace from record-centric to issue-centric.

**Relevant files**

- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx)
- [dev/lib/dev-preview-data.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/lib/dev-preview-data.ts)

**Implementation notes**

- Rewrite the queue table so the issue reads before the status decoration.
- Group evidence into `Blocking`, `Needs review`, and `Ready` buckets.
- Keep the right rail short: one evidence summary and one context summary.

## P2 — Full Record Alignment

**Goal**

Keep the application detail route consistent with the simplified admin workbench.

**Relevant files**

- [dev/app/dev/application/[id]/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/application/[id]/page.tsx)

**Implementation notes**

- Remove repeated helper prose.
- Keep one decision lens, one evidence section, one reviewer-summary rail.
- Make evidence grouping match the admin dashboard buckets.

## Success Definition

Sprint P is successful if:

1. The admin dashboard feels less fragmented.
2. The selected applicant remains the clear anchor.
3. Staff can see the issue, the next action, and the supporting evidence with less scanning effort.
4. The full record page reinforces the same decision rhythm instead of reintroducing clutter.

## Verify

- `cd dev && npm run check`
- Browser review of:
  - `/dev/admin`
  - `/dev/application/app-001`

## Source References

- [docs/SPRINT_O_PARENT_CALM_FLOW_SIMPLIFICATION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_O_PARENT_CALM_FLOW_SIMPLIFICATION.md)
- [docs/UX_BRAINSTORM_AND_SPRINT_TRACK.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/UX_BRAINSTORM_AND_SPRINT_TRACK.md)
- [docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md)
