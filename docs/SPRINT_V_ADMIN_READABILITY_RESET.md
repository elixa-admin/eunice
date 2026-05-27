# Sprint V - Admin Readability Reset

**Status:** In progress

## Sprint Goal

Restore the admin dashboard to a bright, highly readable light theme while keeping the school's green and gold brand language. The goal is not to redesign the admin area again, but to make the existing dashboard comfortably scannable for administrative staff at a glance.

This sprint responds to the contrast issue surfaced in the latest review: the current dark treatment makes key text and bubbles too hard to read. For a school admin workflow, the dashboard should feel clear, professional, and operational, not dim or visually strained.

## Design Direction

- Keep the admin base surface light and readable.
- Use deep green and gold as accents, not as the main text surface.
- Preserve the school's original brand identity through headers, status marks, borders, and emphasis states.
- Keep the selected applicant and next action visually dominant.
- Reduce any lingering "dark mode" feel that weakens contrast or makes blocks unreadable.

## Scope

### In scope

- Admin dashboard contrast and surface reset
- Stronger text readability across cards, bubbles, and status modules
- Brand-color refinement so the palette feels school-appropriate rather than theme-heavy
- Minimal hierarchy cleanup where it improves scanning
- Visual QA on the latest preview after the reset

### Out of scope

- backend workflow changes
- new automation logic
- OCR or document intelligence
- multi-school schema expansion
- broad parent-flow redesign

## P0 - Light Surface Reset

**Goal**

Bring the admin dashboard back to a clean light base with readable text and clear card boundaries.

**Implementation notes**

- Remove any dark-panel treatment that lowers contrast on admin bubbles or cards.
- Ensure primary and secondary text both meet comfortable reading contrast.
- Keep the green/gold identity in accents, tags, and emphasis, not as the main legibility layer.

## P1 - Readability and Hierarchy Pass

**Goal**

Make the admin dashboard easier to scan without changing its operational shape.

**Implementation notes**

- Keep the selected applicant as the anchor.
- Reduce visual competition between status blocks.
- Simplify bubble density where it makes the page feel crowded.
- Preserve the decision-led structure from Sprint P, but make it lighter and easier to read.

## P2 - Browser Review and Polish

**Goal**

Confirm the refreshed admin theme reads well in the browser and still feels true to the school's brand.

**Implementation notes**

- Review the latest Vercel preview in browser.
- Check the main admin dashboard first, then the related detail view.
- Trim any remaining low-contrast or overly heavy surfaces.

## Success Definition

Sprint V is successful if:

1. The admin dashboard is clearly readable in light mode.
2. The school's green and gold branding still feels present and premium.
3. Status blocks, bubbles, and cards are legible at a glance.
4. The dashboard feels operational without looking dark or heavy.

## Verify

- `cd dev && npm run check`
- Browser review of the latest `/dev/admin` preview

## Source References

- [docs/UX_BRAINSTORM_AND_SPRINT_TRACK.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/UX_BRAINSTORM_AND_SPRINT_TRACK.md)
- [docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md)
- [docs/SPRINT_P_ADMIN_DECISION_ENGINE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_P_ADMIN_DECISION_ENGINE.md)
