# Sprint AB - Browser QA and Pattern Lockdown

**Status:** In progress

## Sprint Goal

Lock the strongest parent/admin UI patterns into reusable components and verify in browser so visual quality stays consistent as features expand.

## Focus

- reusable confidence-chip pattern across parent/admin
- light-surface contrast and hierarchy checks
- copy and cue consistency for decision states
- browser validation on `/dev/parent`, `/dev/admin`, and `/dev/application/[id]`

## Acceptance Criteria

- repeated status cues use shared components instead of duplicated class strings
- parent and admin confidence cues look consistent but still fit each surface
- no regression in readability or action clarity on light surfaces

## Verify

- `npm run verify:src`
- `cd dev && npm run check`
- browser review on latest `/dev` preview

