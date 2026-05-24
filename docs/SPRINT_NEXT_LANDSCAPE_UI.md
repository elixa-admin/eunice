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
| 1 | Shared visual shell | Now | Sets the brand frame for every preview page |
| 2 | Parent wide flow | Next | Makes the parent journey feel calm and premium |
| 3 | Admin review surface | Next | Makes queue health and next action obvious |
| 4 | Preview hub polish | Later | Keeps the landing point coherent and useful |
| 5 | Docs and handoff sync | Later | Preserves continuity for the next session |

Owner: current sprint implementer on `codex/vercel-project-separation`
Primary verification path: Vercel preview on `eunice-dev`
Current work: Task 1, shared visual shell

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
- Treat the screenshots and the primary Eunice site as the brand reference set, not a pixel-perfect cloning target.
- Keep parent and admin different in density, but identical in brand family, typography, and core color logic.
- Prefer one reusable shell and shared visual language over one-off page fixes.
- Preserve workflow logic while improving presentation.

## Sprint Order

1. Finalize the shared visual shell and brand cues.
2. Finish the Parent Portal as a true wide-screen guided flow.
3. Elevate the Admin review surface and detail view.
4. Tighten the preview hub and route cards.
5. Sync durable docs and handoff state.

## Current Slice

Slice 1 is live: finalize the shared visual shell. That means the next implementation should start with the shell, nav, spacing, and brand treatment before touching flow content.

## Task 1: Finalize The Shared Visual Shell

### Goal

Lock the reusable brand frame so every `dev/` screen feels like the same Eunice product.

### Context

The current shell is much wider and closer to the target, but it still needs final polish so the header, logo treatment, background rhythm, and selected states feel fully aligned with the primary Eunice brand.

### Relevant files or references

- [dev/components/preview-shell.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/preview-shell.tsx)
- [dev/components/nav.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/nav.tsx)
- [dev/app/globals.css](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/globals.css)
- [dev/app/layout.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/layout.tsx)
- [docs/UI_THEME_SPEC.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/UI_THEME_SPEC.md)

### Proposed approach

- Tune the shared page background, shadow depth, and border softness.
- Keep the logo visible and consistent in the shell and nav.
- Ensure active nav states use the cream/gold Eunice treatment.
- Standardize typography scale and spacing rhythm for wide screens.

### Acceptance criteria

- The shell reads as a premium Eunice admissions frame on desktop.
- The same visual language carries across parent, admin, and detail views.
- Selected nav and brand cues feel intentional and not placeholder-like.

### Verify

- Open the `dev/` hub in wide desktop mode.
- Check that header, nav, and card framing feel coherent.
- Confirm the shell feels like a real product, not a wrapper.

### Out of scope

- Reworking page content.
- Changing application logic.

## Task 2: Finish The Parent Portal As A Wide Guided Flow

### Goal

Make the parent experience feel like a calm, guided admissions journey that uses the full landscape width well.

### Context

The parent page already has the right ingredients, but it still needs a stronger landscape layout and a more refined relationship between stepper, content, and guidance rail.

### Relevant files or references

- [dev/app/dev/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/parent/page.tsx)
- [dev/lib/dev-preview-data.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/lib/dev-preview-data.ts)
- [src/components/parent/application-workflow.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx)
- [docs/GUIDED_APPLICATION_FLOW_PLAN.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/GUIDED_APPLICATION_FLOW_PLAN.md)

### Proposed approach

- Rebalance the page into a stronger wide-screen admissions composition.
- Keep the “before you begin” and document preparation panels prominent.
- Make the guidance rail feel like a real support column.
- Keep the progress and next-step cues calm and obvious.

### Acceptance criteria

- The page feels like a premium guided application flow.
- Required documents and expectations are visible up front.
- The layout uses wide desktop space more effectively.

### Verify

- Open the Parent Portal in wide desktop preview.
- Confirm the stepper, main content, and right rail feel balanced.
- Check that the page no longer feels vertically cramped.

### Out of scope

- Workflow contract changes.
- New form steps.

## Task 3: Elevate The Admin Review Surface

### Goal

Make the admin preview feel like a confident admissions operations desk with queue health and clear next actions.

### Context

The admin page is already visually stronger, but it should now be pushed toward the same polished landscape format as the reference screenshot family.

### Relevant files or references

- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx)
- [dev/app/dev/application/[id]/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/application/[id]/page.tsx)
- [dev/lib/dev-preview-data.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/lib/dev-preview-data.ts)

### Proposed approach

- Strengthen list/detail balance so the queue feels like a working console.
- Keep blocked, review, ready, and decision states obvious.
- Make the detail panel feel like a proper admissions record.
- Maintain the green/gold/cream brand system across the whole surface.

### Acceptance criteria

- Queue health is readable at a glance.
- Selected rows are obvious but not noisy.
- The detail page remains visually consistent with the parent view.

### Verify

- Open the admin preview at wide width.
- Click between records and confirm the selection state remains clear.
- Check that the detail pane feels aligned with the list.

### Out of scope

- Backend queue logic.
- Real review actions.

## Task 4: Tighten The Preview Hub And Route Cards

### Goal

Make the `dev/` entry surface feel polished and useful as a product preview hub.

### Context

The preview hub now carries the right brand cues, but it should still feel like a carefully designed landing point rather than a generic link grid.

### Relevant files or references

- [dev/app/dev/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/page.tsx)
- [dev/components/surface-card.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/surface-card.tsx)

### Proposed approach

- Refine the route cards and supporting callouts.
- Keep the preview hub visually consistent with the rest of the `dev/` system.
- Make the landing page feel like part of the same admissions product family.

### Acceptance criteria

- The hub feels like a designed control center, not a card list.
- Route cards are easy to scan and use.
- Branding and spacing feel consistent with the rest of the preview.

### Verify

- Open the preview hub and scan the route cards.
- Confirm the branding and spacing match the rest of the system.

### Out of scope

- Adding new routes.
- Changing preview data.

## Task 5: Sync Docs And Handoff State

### Goal

Keep the sprint and bootstrap docs aligned so the next session can continue without rediscovery.

### Context

The work is now in a more stable layout phase, so the durable docs should explicitly point to this sprint and its order.

### Relevant files or references

- [docs/SOURCE_OF_TRUTH.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SOURCE_OF_TRUTH.md)
- [docs/HANDOVER_BOOTSTRAP_PROMPT.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/HANDOVER_BOOTSTRAP_PROMPT.md)
- [docs/SPRINT_MICRO_SLICES_NEXT.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_MICRO_SLICES_NEXT.md)
- [docs/SESSION_INTEGRATION_MEMORY.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SESSION_INTEGRATION_MEMORY.md)

### Proposed approach

- Record the current landscape UI sprint as the active next sprint.
- Update the handoff bootstrap prompt to point at this plan.
- Keep the source-of-truth doc and sprint queue consistent.

### Acceptance criteria

- A fresh agent can find the current sprint direction immediately.
- The docs point to the same live branch and primary surface.
- The next implementation slice is unambiguous.

### Verify

- Read the docs from a cold start and confirm the current sprint is obvious.
- Check that the sprint order matches the intended implementation plan.

### Out of scope

- Rewriting broader project governance.

## Exit Criteria

This sprint is done when:

- the `dev/` surface feels wide, polished, and landscape-friendly,
- the parent and admin portals share one premium Eunice brand system,
- and the docs make the next session easy to resume.
