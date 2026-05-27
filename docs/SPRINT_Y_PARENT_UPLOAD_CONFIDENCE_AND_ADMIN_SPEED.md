# Sprint Y - Parent Upload Confidence and Admin Decision Speed

**Status:** In progress

## Sprint Goal

Deliver the biggest UI/UX win for the least implementation churn by making the parent upload path feel unmistakably safe and guided, while making the admin queue faster to scan and act on.

## Why This Sprint Matters

This is the highest-value next step because it improves both ends of the workflow without overengineering the platform:

- Parents need confidence at the exact moment they upload documents.
- Staff need to know what to do within a glance.

If we get those two things right, the whole admissions system feels stronger.

## P0 - Parent Upload Confidence

### Goal

Reduce upload anxiety and make the parent journey feel more guided, reassuring, and low-friction.

### Focus

- tighter upload feedback for blurry, incomplete, or duplicate documents
- clearer visual cues for what is ready, what needs another attempt, and what is still processing
- keep one primary action visible at a time
- continue to keep the parent flow light, calm, and mobile-friendly

### Acceptance Criteria

- Parents can tell immediately whether a file is good enough.
- Upload problems are framed as guidance, not failure.
- The parent portal still feels calm and spacious.

## P1 - Admin Decision Speed

### Goal

Reduce the time it takes staff to understand the queue and choose the next action.

### Focus

- keep the selected applicant and next action dominant
- reduce any remaining equal-weight card clutter
- make issue, urgency, waiting time, and owner easier to scan
- keep secondary evidence available without competing visually

### Acceptance Criteria

- Staff can identify the next action quickly.
- The queue reads top to bottom without friction.
- The dashboard feels like a decision console, not a record browser.

## P2 - Browser Review And Pattern Lock

### Goal

Confirm the parent and admin changes in browser, then lock the visual patterns we want to keep.

### Focus

- review the updated `/dev/parent` and `/dev/admin` pages
- trim anything that still feels noisy or ambiguous
- record the winning hierarchy and disclosure rules

### Acceptance Criteria

- The parent and admin portals feel clearly different in intent.
- The best layout patterns are safe to reuse in future work.

## Source Reference

- [docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md)
- [docs/UX_BRAINSTORM_AND_SPRINT_TRACK.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/UX_BRAINSTORM_AND_SPRINT_TRACK.md)
- [docs/SPRINT_W_PARENT_PORTAL_CONFIDENCE_LIFT.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_W_PARENT_PORTAL_CONFIDENCE_LIFT.md)
- [docs/SPRINT_X_ADMIN_PORTAL_DECISION_CLARITY.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_X_ADMIN_PORTAL_DECISION_CLARITY.md)

## Verify

- Visual review of the `/dev/parent` and `/dev/admin` experiences
- `cd dev && npm run check`
