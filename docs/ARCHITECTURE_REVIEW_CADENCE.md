# Architecture Review Cadence

This project should revisit architecture often enough to stay smart, but not so often that the reviews become busywork.

## Cadence

- Micro-review: every sprint
- Architecture review: after every major phase
- Deep architecture and tool review: once a week

## What Each Review Answers

### Micro-review

- Did the last sprint introduce duplicate logic, unnecessary abstraction, or a stale assumption?
- Did we accidentally create two sources of truth for the same behaviour?
- Did any tool choice become slower or more fragile than needed?

Keep this review short. It should be a quick health check, not a redesign session.

### Architecture review

- Is the current app structure still the right shape for the workflow we understand now?
- Do `src/`, `dev/`, and `supabase/` still have clear boundaries?
- Did a major phase change the product or data model enough to justify a structural update?

### Deep weekly review

- Which open-source tools, libraries, or integrations now look better than the ones we originally chose?
- Are there any deprecated patterns, stale links, or repeated workarounds that should be retired?
- Do we need to update the knowledgebase, relay playbook, or quick-fix notes?

## Decision Rule

- If the answer is “small cleanup,” fix it in the current slice.
- If the answer is “architecture changed,” schedule a deliberate architecture update.
- If the answer is “new tool is better,” record why it wins before replacing the old path.

## Keep It Light

- Do not run a full architecture debate every session.
- Do not reopen settled decisions unless the workflow, data, or tool landscape has changed.
- Treat weekly review as a small strategic checkpoint, not a new planning cycle.

