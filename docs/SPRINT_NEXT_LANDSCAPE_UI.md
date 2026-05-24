# Eunice Next Sprint - Landscape UI and Brand Polish

Last updated: 2026-05-24
Branch: `codex/vercel-project-separation`
Primary surface: `dev/`

## Sprint Goal

Make the `dev/` surface feel like a finished Eunice admissions product in wide desktop landscape mode, with the same visual family as the primary Eunice website.

The sprint should deliver:

- wider, more screen-efficient portal layouts
- stronger brand fidelity to the primary Eunice website
- clearer parent and admin hierarchy
- premium green, gold, and cream presentation
- consistent focus states and selected states
- durable docs that keep the next session moving without rediscovery

## Sprint Board

| # | Slice | Status | Why it matters |
|---|---|---|---|
| 1 | Parent guided wizard uplift | Now | Biggest user-facing UX win and the most visible landscape improvement |
| 2 | Admin split-view and detail clarity | Next | Makes queue review feel operational and fast |
| 3 | Preview hub + docs polish | Later | Keeps the entrance point and handoff clean after the main UX upgrades |

Owner: current sprint implementer on `codex/vercel-project-separation`
Primary verification path: Vercel preview on `eunice-dev`
Current work: Slice 1, Parent guided wizard uplift

## Source References

- [docs/SOURCE_OF_TRUTH.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SOURCE_OF_TRUTH.md)
- [docs/HANDOVER_BOOTSTRAP_PROMPT.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/HANDOVER_BOOTSTRAP_PROMPT.md)
- [docs/SPRINT_MICRO_SLICES_NEXT.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_MICRO_SLICES_NEXT.md)
- [docs/UI_THEME_SPEC.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/UI_THEME_SPEC.md)
- [dev/components/preview-shell.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/preview-shell.tsx)
- [dev/components/nav.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/nav.tsx)
- [dev/app/dev/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/parent/page.tsx)
- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx)
- [dev/app/dev/application/[id]/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/application/[id]/page.tsx)

## Shared Decisions

- Use `dev/` as the first implementation surface and leave `src/` unchanged until the preview is stable.
- Do not touch the assessment page or assessment flow during this sprint.
- Do not promote these changes to production until we explicitly decide the preview is ready.
- Treat the screenshots and the primary Eunice site as the brand reference set, not a pixel-perfect cloning target.
- Keep parent and admin different in density, but identical in brand family, typography, and core color logic.
- Prefer one reusable shell and shared visual language over one-off page fixes.
- Preserve workflow logic while improving presentation.

## Sprint Order

1. Uplift the Parent Portal into a true guided wizard.
2. Make the Admin review experience feel like a split-view operations console.
3. Polish the preview hub and keep docs/handoff aligned.

## Current Slice

Slice 1 is live: Parent guided wizard uplift. The next implementation should focus on the parent stepper, main content width, and right-rail support, not on the assessment surface or production promotion.

## Task 1: Parent Guided Wizard Uplift

### Goal

Make the parent portal feel like a premium, calm, multi-step admissions wizard that uses the screen width well.

### Context

The parent portal already contains the key ingredients, but the current composition still reads as a set of stacked cards. This slice should make the active step, the supporting guidance, and the required documents feel like one coherent admissions workflow.

### Relevant files or references

- [dev/app/dev/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/parent/page.tsx)
- [dev/lib/dev-preview-data.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/lib/dev-preview-data.ts)
- [docs/brand/eunice-school-knowledgebase.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/brand/eunice-school-knowledgebase.md)

### Proposed approach

- Rebalance the left, center, and right columns so the center step content owns the page.
- Keep the stepper visible and readable without compressing the page.
- Make the “before you begin” content, required documents, and next-step guidance feel like a single flow.
- Preserve the calm, premium, and brand-aligned look while reducing stacked-card fatigue.

### Acceptance criteria

- The parent page feels like a polished guided admissions wizard at desktop width.
- Required documents and next steps remain visible and easy to understand.
- The page no longer feels cramped or overly stacked.

### Verify

- Open the Parent Portal in wide desktop preview.
- Confirm the active step, help rail, and document column feel balanced.
- Check that the page uses the available landscape width more effectively.

### Out of scope

- Reworking the assessment surface.
- Changing application logic.

## Task 2: Admin Split-View And Detail Clarity

### Goal

Make the admin review experience feel like a focused split-view operations console with clear queue scanning and record inspection.

### Context

The admin page already has a strong brand frame, but it still needs sharper separation between queue scanning, selected-row state, and the record detail surface so it can act like a real admissions desk.

### Relevant files or references

- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx)
- [dev/app/dev/application/[id]/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/application/[id]/page.tsx)
- [dev/lib/dev-preview-data.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/lib/dev-preview-data.ts)
- [docs/brand/eunice-school-knowledgebase.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/brand/eunice-school-knowledgebase.md)

### Proposed approach

- Strengthen list/detail balance so queue scanning is fast.
- Give the selected application more room and clearer hierarchy.
- Make the risk indicators and document checklist feel like working controls, not decorations.
- Keep the same Eunice brand language while reducing visual noise.

### Acceptance criteria

- The admin page feels like a real operations console.
- Queue health is readable at a glance.
- The detail pane feels clearly connected to the selected row.

### Verify

- Open the admin preview at wide width.
- Click between records and confirm the selected row and detail panel read clearly.
- Check that the record pane uses the space better than before.

### Out of scope

- Backend queue logic.
- Real review actions.

## Task 3: Preview Hub And Docs Polish

### Goal

Keep the preview hub useful and keep the durable docs aligned after the main UX improvements.

### Context

The preview hub and handoff docs already exist, but they should remain aligned with the latest phase and keep the next session easy to start without rediscovery.

### Relevant files or references

- [dev/app/dev/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/page.tsx)
- [dev/components/surface-card.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/surface-card.tsx)
- [docs/SOURCE_OF_TRUTH.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SOURCE_OF_TRUTH.md)
- [docs/HANDOVER_BOOTSTRAP_PROMPT.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/HANDOVER_BOOTSTRAP_PROMPT.md)

### Proposed approach

- Refine the route cards and top-level callouts.
- Keep the preview hub visually consistent with the rest of the `dev/` system.
- Reconfirm that the docs point to the right phase, the right surface, and the right boundary rules.

### Acceptance criteria

- The hub feels like a designed entrance, not just a link list.
- The docs are aligned with the current phase and boundary rules.
- The next session can start without rediscovery.

### Verify

- Open the preview hub and scan the route cards.
- Confirm the docs reflect the current phase and sprint plan.

### Out of scope

- Adding new routes.
- Changing preview data.

## Exit Criteria

This sprint is done when:

- the `dev/` surface feels wide, polished, and landscape-friendly,
- the parent and admin portals share one premium Eunice brand system,
- and the docs make the next session easy to resume.
