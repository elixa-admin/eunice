# Dev Surface Theme Sprint Plan

Last updated: 2026-05-24
Primary surface: `dev/`
Goal: adopt the two screenshot references as the visual north star for the Eunice admissions preview and admin experience.

## Sprint Goal

Make the `dev/` surface feel like a finished Eunice admissions product:

- deep green and gold brand framing
- soft cream page canvas
- premium academic typography
- calmer card geometry
- clear status chips, queue health, and next-action panels
- one shared visual language across parent and admin views

## Source References

- Screenshot 1: parent application flow reference
- Screenshot 2: admin operations / review reference
- [docs/UI_THEME_SPEC.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/UI_THEME_SPEC.md)
- [docs/SPRINT_MICRO_SLICES_NEXT.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_MICRO_SLICES_NEXT.md)
- [docs/SOURCE_OF_TRUTH.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SOURCE_OF_TRUTH.md)
- [dev/app/globals.css](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/globals.css)
- [dev/components/preview-shell.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/preview-shell.tsx)
- [dev/app/dev/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/parent/page.tsx)
- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx)
- [dev/app/dev/application/[id]/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/application/[id]/page.tsx)

## Shared Decisions

- Use the `dev/` surface as the first implementation target and keep `src/` unchanged until the new look is stable.
- Treat the screenshots as a visual system reference, not a pixel-perfect mock to clone.
- Keep the parent and admin experiences different in density, but identical in brand family, color logic, and status language.
- Prefer one reusable theme layer over screen-specific styling fixes.
- Preserve current workflows and document logic while changing presentation.

## Task 1: Establish The Visual Foundation

### Goal

Lock the shared visual language in the preview shell and global styles so every `dev/` page inherits the same Eunice identity.

### Context

The screenshots rely on a strong top bar, cream backgrounds, deep green surfaces, subtle gold accents, and restrained borders/shadows. The existing `dev/` shell already frames pages consistently, so this slice should strengthen that frame instead of replacing it.

### Relevant files or references

- [dev/app/globals.css](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/globals.css)
- [dev/app/layout.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/layout.tsx)
- [dev/components/preview-shell.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/preview-shell.tsx)
- [dev/components/nav.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/nav.tsx)
- [docs/UI_THEME_SPEC.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/UI_THEME_SPEC.md)

### Proposed approach

- Introduce or refine a shared palette with Eunice green, gold, cream, and soft slate neutrals.
- Tune page background, top bar, borders, and card shadows to feel calmer and more institutional.
- Standardize typography tokens so headings, labels, and metadata use a consistent hierarchy.
- Keep the shell adaptable enough for both parent and admin surfaces.

### Acceptance criteria

- The `dev/` shell reads as one cohesive branded system across pages.
- The top-level page background no longer feels flat or generic.
- Typography and spacing feel premium rather than playful or demo-like.

### Verify

- Open the `dev/` preview shell and confirm the overall frame matches the screenshot tone.
- Check that parent and admin pages still render with consistent structure and readable contrast.

### Out of scope

- Reworking page content.
- Changing application logic.
- Mirroring the screenshots pixel-for-pixel.

## Task 2: Rebuild The Parent Preview Rhythm

### Goal

Make the parent application preview feel like a guided admissions journey with a polished before-you-begin section, step progression, and helpful next-action cues.

### Context

The parent screenshot shows a strong hierarchy: stepper, left navigation, central content cards, and a right-hand guidance rail. We already have a working guided flow, so this slice should reshape the presentation around that flow.

### Relevant files or references

- [dev/app/dev/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/parent/page.tsx)
- [src/components/parent/application-workflow.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx)
- [docs/GUIDED_APPLICATION_FLOW_PLAN.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/GUIDED_APPLICATION_FLOW_PLAN.md)
- [docs/SPRINT_MICRO_SLICES_NEXT.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_MICRO_SLICES_NEXT.md)

### Proposed approach

- Add a polished “Before you begin” panel with document prep, estimated time, save-and-return, and next-response guidance.
- Rebalance the page into a stronger two- or three-column admissions layout with a visible progress cue.
- Make the right rail feel like a real guidance and summary column instead of a generic sidebar.
- Keep the parent journey emotionally calm and operationally clear.

### Acceptance criteria

- The parent page feels like a premium guided application, not a stacked form.
- Required documents are visible up front and easy to understand.
- The page keeps the current workflow while improving perceived quality and clarity.

### Verify

- Review the parent preview at desktop width and ensure the layout feels intentional.
- Confirm the step flow, guidance rail, and summary card work together visually.

### Out of scope

- Changing document rules or data capture logic.
- Rebuilding the backend.
- Introducing new workflow steps.

## Task 3: Recast The Admin Review Surface

### Goal

Make the admin preview look like a confident admissions operations dashboard with queue health, clear review lanes, and strong record-level detail.

### Context

The admin screenshot shows a practical but premium operations desk: strong header, left navigation, queue review table, risk indicators, and focused next-action cards. Our current admin preview already has the right ingredients, so this slice should sharpen them into one coherent system.

### Relevant files or references

- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx)
- [dev/app/dev/application/[id]/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/application/[id]/page.tsx)
- [dev/lib/dev-preview-data.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/lib/dev-preview-data.ts)
- [docs/SPRINT_MICRO_SLICES_NEXT.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_MICRO_SLICES_NEXT.md)

### Proposed approach

- Tighten queue card hierarchy and the list/detail split so the review workflow is obvious at a glance.
- Strengthen status chips, risk indicators, and next-action panels using the green/gold/cream system.
- Keep density high enough for operations without losing visual calm.
- Make the detail pane feel like a proper admissions record instead of a preview widget.

### Acceptance criteria

- The admin surface reads like a real queue review environment.
- Blocked, review-ready, and decision-ready states are visually distinct.
- The record detail view feels aligned with the parent application experience.

### Verify

- Open the admin preview and check that queue health, status, and next actions are immediately readable.
- Click through the detail view and confirm the same visual language holds.

### Out of scope

- New queue logic.
- Backend review actions.
- Changing the underlying preview data model.

## Task 4: Align Docs And Handoff State

### Goal

Keep the sprint and relay docs aligned with the visual direction so the next session can continue without rediscovery.

### Context

This sprint will be easier to continue if the new visual direction is recorded once in durable docs and referenced from the active sprint board.

### Relevant files or references

- [docs/SOURCE_OF_TRUTH.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SOURCE_OF_TRUTH.md)
- [docs/HANDOVER_BOOTSTRAP_PROMPT.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/HANDOVER_BOOTSTRAP_PROMPT.md)
- [docs/SESSION_INTEGRATION_MEMORY.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SESSION_INTEGRATION_MEMORY.md)
- [docs/SPRINT_MICRO_SLICES_NEXT.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_MICRO_SLICES_NEXT.md)

### Proposed approach

- Record the screenshot-driven theme direction as the current `dev/` visual north star.
- Update the active sprint notes so the next implementation slice is obvious.
- Keep the handoff prompt and source-of-truth file consistent with the chosen look and surface order.

### Acceptance criteria

- A future agent can read the docs and understand the target look without reopening chat history.
- The `dev/` surface remains the first-class preview target.
- The next implementation slice is unambiguous.

### Verify

- Read the docs in a fresh context and confirm the theme direction is obvious.
- Check that the sprint board still matches the live implementation intent.

### Out of scope

- Broad process redesign.
- New platform tooling.

## Sprint Order

1. Establish the visual foundation.
2. Rebuild the parent preview rhythm.
3. Recast the admin review surface.
4. Align docs and handoff state.

## Exit Check

We’re done with this sprint when:

- the `dev/` surface clearly feels like the screenshot reference family,
- parent and admin views share one premium Eunice visual system,
- and the next session can continue from docs without rediscovery.
