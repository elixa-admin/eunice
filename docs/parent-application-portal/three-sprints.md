# Parent Application Portal - Three Sprints

Last updated: 2026-05-24  
Branch: `codex/vercel-project-separation`  
Primary surface: `dev/`

## Purpose

Create a parent application experience that feels like a guided admissions journey for a first-time or unfamiliar applicant, with minimal confusion, low cognitive load, and no surprise-heavy data overload.

This plan keeps the experience simple, trustworthy, and outcome-oriented while improving the quality of the submitted data for Eunice.

## Design Intent

- Help the parent understand the journey before asking for anything
- Keep each screen focused on one clear job
- Set expectations at each step so there are fewer enquiries and fewer failures
- Use visuals only when they reduce confusion, never when they add noise
- Keep documents, timing, and outcomes clear without overexplaining

## Sprint 1 - Welcome, Orientation, And Trust

### Phase 1.1 - Guided Start And Expectation Setting

Goal:
- Make the very first screen feel like a calm introduction to the admissions journey.

What it should do:
- explain what the application is for
- tell the parent how long it might take
- explain what documents they should prepare
- say what happens after they start
- show that they can save and return

Visual approach:
- a single strong welcome panel
- a small checklist or “prepare these first” strip
- one clear primary action
- light support cues only, not a dense wall of text

Done when:
- a new parent can start without feeling intimidated or overloaded
- the screen feels like a tour, not a form

### Phase 1.2 - Step Expectations And Process Overview

Goal:
- Give every step a small, clear explanation so the parent is never guessing what comes next.

What it should do:
- explain what each step is for
- show what happens after each section
- indicate what might need follow-up or review
- make required vs reviewable items obvious

Visual approach:
- short expectation panels near the top or in a calm rail
- brief “what happens next” copy
- compact, readable progress cues

Done when:
- each step reduces uncertainty instead of adding it
- the parent can continue with confidence

## Sprint 2 - Guided Flow And Document Confidence

### Phase 2.1 - Progressive Disclosure Flow

Goal:
- Build the actual application path so it stays simple, one step at a time, and only shows complexity when relevant.

What it should do:
- keep each screen to one main task
- reveal conditional fields only when needed
- explain why sensitive sections exist
- keep the parent oriented with visible progress

Visual approach:
- a focused main column
- a calm guidance column
- no crowded multi-purpose screens

Done when:
- the flow feels guided and easy to finish
- the parent never has to mentally map the whole form at once

### Phase 2.2 - Document Readiness And Why-It-Matters Layer

Goal:
- Help the parent understand documents as part of the journey, not as an abrupt checklist dump.

What it should do:
- group documents by purpose
- explain why each document matters
- clearly mark required, conditional, and reviewable items
- reduce the chance of missing or low-quality submissions

Visual approach:
- checklist blocks with plain-language reasons
- compact labels and status cues
- no heavy tables or dense legal copy

Done when:
- document collection feels expected and manageable
- parents understand what the school needs and why

## Sprint 3 - Review, Reassurance, And Outcome Clarity

### Phase 3.1 - Final Review And Confidence Check

Goal:
- Make the final review feel safe, clear, and unsurprising.

What it should do:
- summarise what is complete
- separate blockers from items Eunice can review later
- remind the parent what to expect after submit
- make correction paths obvious

Visual approach:
- a calm summary section
- visually separated blocker/review blocks
- one clear submit action

Done when:
- the parent feels ready to submit without anxiety
- the final screen reduces follow-up confusion

### Phase 3.2 - Post-Submit Outcome And Handoff Expectations

Goal:
- Make the result of submission feel clear and trustworthy, not abrupt.

What it should do:
- explain what Eunice does next
- explain what the parent should expect
- make timing guidance feel realistic without overpromising
- show where support can be found if needed

Visual approach:
- reassuring confirmation copy
- a visible “what happens next” summary
- simple status language

Done when:
- the parent understands the outcome and next stage
- the school gets a higher-quality submission with fewer manual enquiries

## Shared Rules For All Three Sprints

- Use plain language before anything else
- Keep visuals light and purposeful
- Avoid cognitive overload
- Never show every possible field up front
- Use progressive disclosure for complexity
- Make the next step obvious
- Make trust and privacy visible but not heavy
- Support lower digital confidence without calling attention to it
- Keep assessment untouched
- Keep `src/` untouched until explicit promotion

## Source References

- [docs/parent-application-portal/plan.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/parent-application-portal/plan.md)
- [docs/parent-application-portal/next-two-sprints.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/parent-application-portal/next-two-sprints.md)
- [docs/GUIDED_APPLICATION_FLOW_PLAN.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/GUIDED_APPLICATION_FLOW_PLAN.md)
- [docs/brand/eunice-school-knowledgebase.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/brand/eunice-school-knowledgebase.md)
- [docs/phase-next-level-output/plan.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/phase-next-level-output/plan.md)
- [dev/app/dev/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/parent/page.tsx)

## Exit Criteria

This three-sprint plan is done when:

- the parent portal feels like a guided admissions tour,
- expectations are set clearly at every step,
- and the process feels smooth, trustworthy, and easy to complete from start to finish.
