# Parent-Led High-Value Sprint Plan

Last updated: 2026-05-24  
Branch: `codex/vercel-project-separation`  
Primary surface: `dev/`

## Purpose

Package the highest-value returns from the current Eunice learning into the next two sprints, each with two phases, so the product becomes easier to understand, easier to complete, and easier for the school to operate.

This plan keeps the parent experience first, then carries the same cue system into the admin and preview surfaces so the whole `dev/` experience feels coherent.

## Core UX Principles

- Start with orientation, not data capture
- Set expectations before asking for input
- Use short, calm explanations instead of dense instruction blocks
- Show only the next relevant step and hide complexity until needed
- Make document purpose visible so parents understand why items matter
- Keep trust, privacy, and recoverability visible without sounding legalistic
- Make every screen answer: what is this, what do I do next, and what happens after

## Sprint 1 - Parent Orientation And Guided Confidence

### Phase 1.1 - Parent Welcome And Cue Framework

Goal:
- Make the first parent screen feel like a short guided introduction to the admissions journey.

What it should do:
- explain the journey at a high level
- give a gentle time estimate
- list the documents or information the parent should have ready
- explain what happens after the application begins
- reassure the parent that they can save and return

Visual approach:
- one clear welcome panel
- one compact preparation cue area
- one primary action
- minimal supporting text, no overload

Done when:
- a first-time parent understands the journey before the form begins
- the screen feels calm, trustworthy, and manageable

### Phase 1.2 - Step Expectations And Gentle Progress

Goal:
- Make each step feel understandable on its own, so the parent never has to guess what comes next.

What it should do:
- explain what the step is for
- explain what happens after this step
- show whether something may need follow-up or review
- distinguish required, optional, and conditional items

Visual approach:
- compact expectation panels
- a visible progress cue
- a clear current-step state
- short reassurance notes, not dense instructions

Done when:
- each step reduces uncertainty instead of adding it
- the parent can continue without needing school-insider knowledge

## Sprint 2 - Submission Confidence And Whole-System Cue Cohesion

### Phase 2.1 - Document Confidence And Review Readiness

Goal:
- Turn documents into a guided part of the journey, not a flat checklist dump.

What it should do:
- group documents by purpose
- explain why each document matters
- mark required, conditional, and reviewable items clearly
- make the final review feel safe and unsurprising

Visual approach:
- grouped readiness blocks
- gentle labels and status cues
- one calm review summary section

Done when:
- parents understand what is needed and why
- the process feels like it is helping them succeed

### Phase 2.2 - Admin And Preview Cue Cohesion

Goal:
- Apply the same cue system to Admin and the preview hub so the entire `dev/` experience feels like one product.

What it should do:
- make queue states and next actions obvious in Admin
- keep the selected record and record detail easy to scan
- make the preview hub feel like a designed entrance, not a link list
- align the hub, parent, and admin surfaces with the same brand logic and cue language

Visual approach:
- split-view clarity for Admin
- route cards that explain purpose and outcome
- consistent brand, spacing, and selected-state logic across surfaces

Done when:
- the parent, admin, and preview hub all speak the same cue language
- the `dev/` surface feels coherent and functional across routes

## Shared Rules For Both Sprints

- Keep assessment untouched
- Keep `src/` untouched until explicit promotion
- Use `dev/` as the active implementation surface
- Keep visuals calm and functional, not noisy
- Prefer clarity, trust, and next-step guidance over novelty
- Reduce manual enquiries by setting expectations at every stage
- Only add visual elements if they remove confusion

## Source References

- [docs/parent-application-portal/plan.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/parent-application-portal/plan.md)
- [docs/parent-application-portal/three-sprints.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/parent-application-portal/three-sprints.md)
- [docs/phase-next-level-output/plan.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/phase-next-level-output/plan.md)
- [docs/brand/eunice-school-knowledgebase.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/brand/eunice-school-knowledgebase.md)
- [docs/GUIDED_APPLICATION_FLOW_PLAN.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/GUIDED_APPLICATION_FLOW_PLAN.md)
- [dev/app/dev/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/parent/page.tsx)
- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx)
- [dev/app/dev/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/page.tsx)

## Exit Criteria

This plan is successful when:

- the parent portal feels like a guided admissions journey for a first-time applicant,
- the admin experience feels operational and clear,
- the preview hub helps users orient quickly,
- and the whole `dev/` surface feels coherent, calm, and Eunice-branded.
