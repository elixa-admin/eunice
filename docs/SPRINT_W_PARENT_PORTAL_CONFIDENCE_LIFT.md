# Sprint W - Parent Portal Confidence Lift

**Status:** Planned

## Sprint Goal

Raise the parent portal's UI/UX value with the smallest possible implementation footprint by making the journey calmer, clearer, and more confidence-building on mobile and desktop.

## Why This Sprint Matters

The parent side is the highest-friction entry point for families. If the portal feels confusing, too busy, or too operational, parents slow down or stall. This sprint aims to reduce uncertainty and make the next step obvious without adding heavy infrastructure.

## P0 - Reduce Friction At The Point Of Upload

### Goal

Make upload and capture feel safe, guided, and easy to complete.

### Focus

- keep one primary action visible at a time
- strengthen upload confirmations and autosave cues
- keep POPIA consent and trust language crisp
- reduce explanation text in favor of visual progression

### Acceptance Criteria

- Parents can tell what to do next within a glance.
- The upload path feels calm rather than operational.
- Primary actions remain visually dominant across the workflow.

## P1 - Tighten Document Grouping And Progress

### Goal

Make documents easier to understand without turning the page into a dashboard.

### Focus

- compact required / conditional / supporting grouping
- stronger “what still matters” cues
- clearer missing-document guidance
- subtle progress and status feedback

### Acceptance Criteria

- Parents can tell which documents matter now versus later.
- Missing items are obvious without overwhelming the page.
- The journey feels more linear and reassuring.

## P2 - Polish And Browser Check

### Goal

Confirm the calmer parent flow in the browser and trim anything that still feels noisy.

### Focus

- review the latest preview visually
- keep copy concise and actionable
- remove any blocks that compete for attention

### Acceptance Criteria

- The parent portal feels more premium and less crowded.
- The flow reads clearly on desktop and mobile.

## Source Reference

- [docs/SPRINT_O_PARENT_CALM_FLOW_SIMPLIFICATION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_O_PARENT_CALM_FLOW_SIMPLIFICATION.md)
- [docs/UX_BRAINSTORM_AND_SPRINT_TRACK.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/UX_BRAINSTORM_AND_SPRINT_TRACK.md)
- [docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md)

## Verify

- Visual review of the `/dev/parent` experience
- `cd dev && npm run check`

