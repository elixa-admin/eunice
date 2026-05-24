# Next Sprint Execution Checklist (High Value / Low Burn)

## Window
- Start: 2026-05-24
- End target: 2026-05-31

## P0 Actions
- [ ] Finalize one canonical application state list shared by parent and admin surfaces.
- [ ] Separate document state from application state in UI labels and domain constants.
- [ ] Confirm `dev/` preview parity with latest intake role/document flow changes.
- [ ] Remove irrelevant required branches in parent flow (`No` answers should hide non-applicable follow-ups).
- [ ] Align admin queue buckets to: `blocked`, `review_ready`, `in_review`.

## P1 Actions
- [ ] Update active sprint plan references to the canonical state model once finalized.
- [ ] Add one short regression checklist for parent flow and admin queue before each push.
- [ ] Restore tracker hygiene path (reauth blocker resolution and backlog sync).

## Done Criteria
- [ ] Shared status model is visible in code and referenced in docs.
- [ ] Parent flow no longer requires workaround values for hidden branches.
- [ ] Admin can distinguish document blockers from application progression at a glance.
- [ ] Docs reflect real execution state (no "not started" drift for active phases).
