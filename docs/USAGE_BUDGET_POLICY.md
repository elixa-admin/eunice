# Usage Budget Policy

This project should treat model usage like any other finite delivery resource.

## Purpose

Keep work productive when usage is healthy, and shift into deliberate wrap-up mode before the budget gets tight.

## Required Checks

Check usage at these boundaries:

- Session start
- After each sprint or coherent slice
- Before a push, handoff, or publishing step
- Any time work is about to expand in scope

Each check should answer two questions:

1. What is the current usage status against the next 4 hours?
2. What is the current usage status against the 7-day limit?

## Thresholds

- Below `75%`: work normally
- At or above `75%`: prioritize critical-path work, documentation, and publishing
- At or above `85%`: shorten sprints, reduce exploration, and wrap up aggressively

## Behaviour By Threshold

### Below 75%

- Keep normal sprint size
- Allow moderate exploration and refactoring
- Continue with planned work order

### 75% to 84%

- Prioritize only the most critical tasks for the active slice
- Reduce non-essential exploration
- Make sure docs, handoff notes, and publishable checkpoints stay current
- Prefer shorter, higher-certainty tasks over broader architecture work

### 85% and above

- Split work into very short sprints
- Focus on finishable tasks only
- Stop opening new workstreams unless they unblock the current one
- Favour documentation, verification, commit, and publishing over optional polish
- Prepare the repo for relay or handoff as early as possible

## Priority Rule

When usage is constrained, prioritize in this order:

1. Critical-path implementation already in progress
2. Verification needed to avoid leaving broken work behind
3. Durable documentation and handoff state
4. Commit, push, and publishing steps
5. Nice-to-have polish and broader exploration

## Suggested Environment Variables

- `EUNICE_USAGE_WARN_PCT=75`
- `EUNICE_USAGE_WRAP_PCT=85`

These values are not platform APIs. They are project guardrails that help every session follow the same escalation pattern.

## Notes

- Use the native platform usage/status tool to gather the numbers.
- Use the command dialect registry to translate the shared `usage` intent into the native command for the current platform.
- If exact usage data is unavailable, fall back to the best available native status indicator and act conservatively.
