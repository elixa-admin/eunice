# Sprint X - Admin Portal Decision Clarity

**Status:** Planned

## Sprint Goal

Keep the admin portal bright, readable, and operationally dense while making the selected applicant, next action, and queue state obvious at a glance.

## Why This Sprint Matters

The admin side should feel like a decision console, but it must stay readable and light. This sprint removes the visual heaviness that makes the dashboard harder to scan and restores the staff-facing hierarchy needed for fast review.

## P0 - Restore Readability And Hierarchy

### Goal

Keep the admin surface light and legible while preserving the school brand in accents.

### Focus

- use light surfaces for the admin workspace
- keep dark text and clear contrast throughout
- preserve green and gold as accents, not a full-surface burden
- keep the selected applicant hero dominant

### Acceptance Criteria

- Staff can read cards, bubbles, and status blocks without strain.
- The page feels like a clean workbench, not a dark theme experiment.

## P1 - Reduce Equal-Weight Clutter

### Goal

Make the queue and evidence areas more decision-focused and less fragmented.

### Focus

- collapse secondary details behind progressive disclosure
- reduce competing panels at the top of the page
- keep the next action and queue state visually strongest
- maintain queue, evidence, and communication context without overload

### Acceptance Criteria

- The admin page has a clear top-to-bottom reading order.
- Secondary data stays available without competing for attention.

## P2 - Browser Review And Pattern Lock

### Goal

Confirm the admin readability reset in browser and freeze the winning visual rules.

### Focus

- browser review of the updated preview
- check contrast and spacing across main admin states
- capture reusable rules for future admin screens

### Acceptance Criteria

- The admin portal feels unmistakably readable in browser.
- The visual pattern can be reused without reopening the theme debate.

## Source Reference

- [docs/SPRINT_V_ADMIN_READABILITY_RESET.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_V_ADMIN_READABILITY_RESET.md)
- [docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md)

## Verify

- Visual review of the `/dev/admin` experience
- `cd dev && npm run check`

