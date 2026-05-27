# Sprint O — Parent Calm-Flow Simplification

**Status:** Implemented

## Sprint Goal

Make the parent experience feel calmer, more linear, and more reassuring by reducing density, reducing explanation text, and making the next action unmistakable.

The parent portal should feel closer to a guided onboarding flow than a workspace. It should support confidence, not require interpretation.

## Design Direction

- Keep the forest-green and gold academic identity.
- Reduce explanatory prose.
- Use one clear primary action above the fold.
- Group information by purpose, not by technical workflow stage.
- Make the interface feel ceremonial and supportive on the parent side.
- Reserve denser operational surfaces for admin work.
- Keep implementation lightweight and avoid adding heavy backend complexity unless the UI improvement clearly requires it.

## Scope

### In scope

- Parent home/workflow simplification
- Reduced passive helper text
- Stronger action hierarchy
- Document grouping and progressive disclosure
- Upload guidance improvements
- Visual separation between parent reassurance and admin triage

### Out of scope

- New backend schema work unless it is strictly required for the UI changes
- Broad admin redesign beyond the minimum necessary to support hierarchy separation
- Document intelligence moat features
- Workflow automation beyond lightweight UI surfaces

## P0 — Parent Flow Simplification

**Goal**

Reduce visible noise on the parent journey and make the next step obvious.

**Relevant files**

- [src/components/parent/application-workflow.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx)
- [src/app/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/parent/page.tsx)
- [dev/app/dev/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/parent/page.tsx)
- [dev/components/parent-workflow-sidebar.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/parent-workflow-sidebar.tsx)
- [src/lib/domain/application-requirements.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/application-requirements.ts)

**Proposed approach**

- Collapse passive explanatory cards into a smaller number of higher-value surfaces.
- Keep one dominant CTA and one supporting progress cue.
- Reduce copy that repeats what the visual structure already communicates.
- Make resume state, current step, and remaining requirements easier to scan.

**Acceptance criteria**

- The parent page feels less crowded and less “dashboard-like.”
- The next action is visible without reading multiple helper blocks.
- The flow still preserves clear progress and document readiness cues.

**Verify**

- `npm run verify:dev`
- Manual browser review of `/dev/parent`

## P1 — Parent Document Intake Clarity

**Goal**

Make document submission more structured and less intimidating.

**Relevant files**

- [src/components/parent/application-workflow.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx)
- [src/lib/documents/upload.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/upload.ts)
- [src/lib/integrations/storage.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/integrations/storage.ts)
- [shared/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/shared/documents/contracts.ts)

**Proposed approach**

- Group documents into clear accordion sections:
  - Always Required
  - Conditional
  - Supporting
- Add or refine upload feedback so parents know what was accepted, what needs attention, and what can be deferred.
- Prepare the UI so later lightweight OCR and upload-quality checks can slot in cleanly without reshaping the full workflow.
- Keep upload behavior calm and data-conscious, especially on mobile.

**Acceptance criteria**

- Document requirements are easier to understand at a glance.
- Parents can tell which documents matter now versus later.
- Upload feedback reduces uncertainty instead of adding more text.

**Verify**

- `npm run verify:src`
- Manual upload flow on desktop and mobile viewport

## P2 — Lightweight Admin Alignment

**Goal**

Trim the admin surface enough that parent calmness is not undermined by a highly noisy shared visual language.

**Relevant files**

- [src/app/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/admin/page.tsx)
- [src/lib/admin-dashboard.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/admin-dashboard.tsx)
- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx)

**Proposed approach**

- Reduce any remaining equal-weight “bubble” styling that makes the admin workspace visually flat.
- Keep the selected applicant as the anchor.
- Collapse non-critical support content where it competes with decision-making.

**Acceptance criteria**

- Admin still feels operational and dense, but less visually fragmented.
- The selected application remains the dominant work surface.
- Parent and admin experiences feel intentionally different.

**Verify**

- `npm run verify:src`
- Manual browser review of `/dev/admin`

## Success Definition

Sprint O is successful if:

1. The parent experience feels calmer and more linear.
2. The number of explanatory blocks drops meaningfully.
3. Document grouping and progress cues are easier to scan.
4. The admin surface remains strong, but no longer competes visually with the parent calm-flow direction.

## Implementation Status

- `P0` parent calm-flow simplification is implemented in both `src` and `/dev`.
- `P1` parent document-intake clarity is implemented with calmer grouping, clearer readiness signals, and lighter supporting-document framing.
- `P2` lightweight admin alignment is implemented as a hierarchy pass that reduces equal-weight clutter and keeps the selected record as the anchor.

## Source References

- [docs/UI_UX_RECOMMENDATIONS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/UI_UX_RECOMMENDATIONS.md)
- [docs/UX_BRAINSTORM_AND_SPRINT_TRACK.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/UX_BRAINSTORM_AND_SPRINT_TRACK.md)
- [docs/NEXT_3_SPRINTS_PLAN.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/NEXT_3_SPRINTS_PLAN.md)
- [docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md)
