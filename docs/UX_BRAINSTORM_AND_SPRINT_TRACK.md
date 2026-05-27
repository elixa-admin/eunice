# UX Brainstorm and Sprint Track

**Status:** Proposed

## North Star

Shift the platform from "beautiful screens" to "decision acceleration and emotional clarity" while preserving the current premium academic identity.

This UX direction sits inside a broader product constraint: Eunice should become a lightweight admissions operating system, not a heavyweight enterprise platform.

The strongest parts of the current direction are worth keeping:

- the forest-green and gold palette
- the institutional, calm tone
- the serif hero typography paired with restrained UI sans-serif
- the premium, school-appropriate feel

The next UX work should not dilute those strengths. It should make the product more decisive, less verbose, and easier to act on.

## Core UX Principles

1. Reduce explanatory copy by roughly 40-60%.
2. Replace passive guidance with stronger visual hierarchy and action mechanics.
3. Make the parent flow feel calm, linear, and reassuring.
4. Make the admin flow feel dense, operational, and decision-centric.
5. Use progressive disclosure so detail is available without competing for attention.
6. Treat document intelligence as a first-class product feature, not an afterthought.
7. Keep the implementation lightweight, low-cost, and easy to maintain.

## What To Preserve

- The current brand tone and palette
- The premium academic feel
- The distinction between parent reassurance and admin triage
- Clear status segmentation where it already works
- The strong selected-applicant hero treatment

## Current UX Gaps To Address

### 1. Too much passive explanation text

The platform currently explains itself too much. In production, the interface should feel obvious because of structure, hierarchy, and state, not because every panel is narrating its purpose.

### 2. Parent flow still feels too much like internal software

The parent experience should feel calmer and more guided. It should not visually resemble a back-office tool with many simultaneous blocks competing for attention.

### 3. Admin dashboard is strong, but still record-centric

The admin side needs to become more decisively "decision-centric":

- blockers
- missing documents
- exceptions
- validation failures

### 4. Visual hierarchy is still too uniform

There is too much medium-emphasis styling. The next pass needs clearer contrast between:

- quiet surfaces
- action surfaces
- urgent surfaces
- completed surfaces

### 5. Document intelligence is underdeveloped

The upload path should validate and guide before the document reaches the review queue.

## Proposed Sprint Track

### Phase 1 — Parent Calm-Flow Simplification

**Goal**

Reduce density on the parent side so the experience feels more ceremonial, supportive, and linear.

**Focus**

- Reduce visible blocks and competing rails
- Keep one clear primary action above the fold
- Add POPIA consent gating at the right moment
- Improve input contrast and form legibility
- Group documents into accordion checklists:
  - Always Required
  - Conditional
  - Supporting
- Add document-upload quality checks:
  - blur detection
  - orientation
  - partial capture
  - unsupported file types
- Add client-side WebP compression before upload to protect mobile data use and storage costs
- Add the mobile document bounding-box overlay for camera capture

**Acceptance criteria**

- The parent page feels calmer and less crowded.
- The next action is always obvious.
- Parents can complete the flow without feeling like they are in an internal admin tool.

### Phase 2 — Admin Decision Engine

**Goal**

Turn the admin workspace into a decision accelerator rather than a record browser.

**Focus**

- Simplify the master-detail hierarchy
- Make one selected applicant the clear anchor
- Collapse passive helper blocks
- Move toward a decision-centric queue:
  - blockers
  - review items
  - ready items
- Add a dense speed-triage grid as a secondary power-user mode, not the primary visual default
- Add role-based document compartmentalization:
  - registrars
  - finance
  - health
- Add simple zone tagging so queue context is visible early

**Acceptance criteria**

- The admin dashboard is easier to scan at a glance.
- The queue shows what needs attention first.
- The selected applicant area feels like the primary work surface.

### Phase 3 — Workflow Automation and Communication History

**Goal**

Reduce follow-up friction and make status transitions feel operationally complete.

**Focus**

- Add passwordless re-upload magic links for flagged documents
- Prefer lightweight `n8n` flows for status-based notifications:
  - awaiting documents
  - accepted
  - needs reupload
- Record a communication history log in the admin timeline
- Make SMS/email dispatch status visible

**Acceptance criteria**

- Parents can resume uploads from a secure, short-lived link.
- Staff can see what communication was sent and whether it landed.
- Status changes feel like part of a coherent workflow, not separate side effects.

### Phase 4 — Competitive Moat Features

**Goal**

Build the capabilities that would make the platform materially stronger than a generic admissions system.

**Focus**

- OCR extraction, ideally beginning with lightweight `Tesseract OCR`
- duplicate detection
- application risk scoring
- capacity management
- waitlist automation
- richer validation heuristics for documents and applicant data

**Acceptance criteria**

- The platform becomes more predictive and less manual over time.
- New intelligence features reduce review effort rather than adding noise.

## Suggested Sprint Ordering

1. Parent calm-flow simplification
2. Admin decision engine
3. Workflow automation and communication history
4. Document intelligence and moat features

## Non-Goals For Now

- Broad schema rewrites that are not required by the UX changes
- Reintroducing dense explanation text as a substitute for structure
- Making the parent portal feel like a back-office dashboard
- Adding unrelated product areas before the admissions flow is crisp

## Source References

- [docs/UI_UX_RECOMMENDATIONS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/UI_UX_RECOMMENDATIONS.md)
- [docs/NEXT_3_SPRINTS_PLAN.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/NEXT_3_SPRINTS_PLAN.md)
- [docs/DEV_UX_SPRINT_P0_P2.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/DEV_UX_SPRINT_P0_P2.md)
- [docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/LIGHTWEIGHT_PLATFORM_DIRECTION.md)
