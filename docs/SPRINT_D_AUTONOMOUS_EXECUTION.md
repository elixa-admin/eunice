# Sprint D Autonomous Execution

## Operating Rule
Execute Sprint D in the order below, verify each change, and keep a running checkpoint after every meaningful step.

## Sequence
1. Parent auth and submit-state UX hardening.
2. Parent upload recovery and duplicate handling verification.
3. Admin queue sorting and next-action flow polish.
4. RLS/access verification checklist review.
5. Daily checkpoint evidence capture.

## Stop Conditions
- If access control behavior is unclear, pause before shipping and verify against database policy.
- If a regression changes submission or document handling, fix before moving to the next step.

## End State
- Parent and admin flows are easier to understand.
- Retry and failure states are explicit.
- Access boundaries are documented and checked.
