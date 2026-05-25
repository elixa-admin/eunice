# Sprint E Execution Checklist

## Sprint Window
2026-06-15 to 2026-06-26

## Status
Planned

## Sprint Goal
Make the admin dashboard faster to act on while keeping the parent upload flow concise, guided, and mobile-friendly. Keep the visual language consistent across the public site, auth, parent, and admin surfaces.

## P0 Workstream 1: Admin Decision Intelligence
- [ ] Validate the current queue snapshot and risk flags on the published preview
- [ ] Confirm the admin “focus now” guidance reads clearly at a glance
- [ ] Trim any repeated or noisy copy in the quick-view / risk panels
- [ ] Verify trend signals are understandable without extra context
- [ ] Document one example of a fast decision path from queue to action

## P0 Workstream 2: Guided Parent Flow
- [ ] Review upload cards on mobile-sized layouts
- [ ] Remove any remaining duplicated helper text
- [ ] Keep upload labels short and state-based
- [ ] Ensure the review step feels like a finish line
- [ ] Confirm parent guidance does not over-explain the process

## P1 Workstream 3: Cross-Screen Consistency
- [ ] Verify landing, auth, parent, and admin all share the same visual rhythm
- [ ] Keep surface/card patterns reusable rather than one-off
- [ ] Reduce style drift by preferring shared classes and shared panel patterns
- [ ] Ensure the navigation feels like one system across all pages

## P1 Workstream 4: Source Alignment
- [ ] Confirm docs match current sprint scope and current repo behavior
- [ ] Keep `public/` assets aligned with the served app path
- [ ] Verify the handoff reflects the current sprint and current branch state
- [ ] Keep GitHub as the published source of truth for the sprint work

## Daily Execution Flow
- Day 1: Review published preview and capture page-by-page issues
- Day 2: Tighten admin decision panels and copy
- Day 3: Tighten parent upload guidance and review flow
- Day 4: Cross-screen visual consistency pass
- Day 5: Source alignment and handoff refresh
- Day 6: Re-review the published preview and fix final rough edges
- Day 7: Final documentation and branch sync

## Exit Criteria
- [ ] Admin can tell what to do next within a few seconds
- [ ] Parent upload guidance is short, direct, and mobile-friendly
- [ ] Visual language is consistent across all major screens
- [ ] Docs, handoff, and GitHub all describe the same sprint state
- [ ] A published preview reflects the final Sprint E changes

## Risks
- Browser-only issues may show up differently in the published preview than in local code review.
- Repetition may reappear if shared UI primitives are not used consistently.

## Carry-over
- Any browser-only polish issues found after the published review
- Any admin copy that still feels too verbose
- Any parent upload guidance that still needs shortening

