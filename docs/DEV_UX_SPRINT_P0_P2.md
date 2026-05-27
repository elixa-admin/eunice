# Dev UX Sprint Plan

**Status:** Completed

## Goal

Make the `/dev` preview feel decisive, readable, and operational for both admin staff and parents before we carry patterns back into the main app.

## P0

### Admin readability and actionability

**Outcome**

The admin dashboard should scan in seconds and make the next action obvious.

**Focus**

- Remove low-contrast status treatments and washed-out summary states.
- Fill dead space in the hero and status band with meaningful operational context.
- Make the selected record, queue health, and next action readable at a glance.

**Acceptance criteria**

- No important admin status label is visually lost against its background.
- The selected application panel tells the reviewer who this is, what is wrong, and what to do next.
- Queue state cards are legible and useful without clicking further into the page.

### Parent momentum and primary action

**Outcome**

The parent portal should feel like a guided task flow, not a passive information surface.

**Focus**

- Reframe step guidance into immediate actions.
- Make the next CTA explicit and repeated consistently.
- Reduce “guide-card drift” where content explains but does not move the user forward.

**Acceptance criteria**

- Each active step answers `what do I do now`, `what do I need`, and `what happens next`.
- The strongest CTA is obvious above the fold.
- The right-hand rail reinforces progress and next action instead of repeating passive guidance.

## P1

### Shared preview UX patterns

**Outcome**

The new admin and parent improvements become stable reusable patterns instead of one-off page fixes.

**Focus**

- Consolidate stronger card treatments, progress blocks, and status summaries into reusable components.
- Standardize spacing, hierarchy, and CTA rhythm across `/dev/admin`, `/dev/parent`, and `/dev/application/[id]`.
- Tighten copy so every support panel earns its place.

**Acceptance criteria**

- Shared components carry the improved contrast and hierarchy defaults.
- `/dev` surfaces feel like one product family rather than adjacent mockups.
- Repeated UI logic is reduced in the route files.

## P2

### Visual QA and responsive polish

**Outcome**

The preview holds up in real browser review, not just in isolated code changes.

**Focus**

- Verify desktop and mobile behavior from the Vercel preview.
- Catch spacing collapse, weak CTA hierarchy, and awkward empty states.
- Clean up any remaining visual regressions introduced by the P0/P1 pass.

**Acceptance criteria**

- Core `/dev` routes are readable on desktop and mobile.
- No critical contrast, overflow, or hierarchy regressions remain on admin or parent.
- The preview is strong enough to use as the reference lane for later `src` uplift.

## Current implementation status

- P0 admin readability improvements are complete.
- P0 parent action-flow improvements are complete.
- P1 shared preview UX consistency is complete across `/dev/admin`, `/dev/parent`, and `/dev/application/[id]`.
- P2 verification is complete with `npm run verify:dev` and a live Vercel preview.
- Latest verified preview: `https://dev-a5y0q5vy2-elixa-admins-projects.vercel.app`
