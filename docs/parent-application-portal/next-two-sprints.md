# Parent Portal - Next Two Sprints

Last updated: 2026-05-24  
Branch: `codex/vercel-project-separation`  
Primary surface: `dev/`

## Purpose

Prioritise the parent application front-end so a first-time or unfamiliar parent can move through the journey with the least possible confusion, friction, and manual follow-up.

These two sprints are ordered to reduce anxiety first, then improve the flow quality and submission confidence.

## Sprint 1 - Orientation And Expectations

### Goal

Make the first parent interaction feel like a guided welcome, not the start of a dense form.

### What This Sprint Must Achieve

- explain the journey before asking for data
- tell the parent what the process is for
- show how long it might take
- list the documents they should prepare
- explain what happens after each step
- make follow-up or review stages unsurprising
- keep the language simple, short, and reassuring

### UX Priorities

1. First-time clarity
- The parent should understand the process without needing admissions knowledge.

2. Low cognitive load
- Avoid dense paragraphs, long lists, and information overload.

3. Trust and privacy reassurance
- Explain why information is needed and how it helps Eunice process the application well.

4. Visible progress and next steps
- Every step should say what happens now and what happens next.

5. Document readiness upfront
- Parents should know what to gather before they begin.

### Recommended Deliverables

- a clear Step 0 / start-checklist screen
- brief expectation panels for each step
- plain-language document readiness guidance
- reduced top-level form intimidation
- visible save-and-return reassurance

### Done When

- a new applicant can start confidently without feeling overwhelmed
- the portal reads like a guided tour
- the parent knows what to expect before entering the form flow

## Sprint 2 - Guided Flow And Submission Confidence

### Goal

Make the actual application journey feel easy to complete, easy to recover from, and easy to trust through to submission.

### What This Sprint Must Achieve

- keep each step focused on one main job
- use progressive disclosure for conditional or sensitive information
- explain why medical, household, and fee responsibility sections exist
- make document collection feel organised and purposeful
- clearly separate required, review, and optional items
- end every step with a clear “what happens next” cue
- make the final review feel safe and unsurprising

### UX Priorities

1. One step at a time
- The parent should only need to think about the current section.

2. Purpose-led sections
- Each screen should explain why Eunice needs the information.

3. Recoverability
- Saving, returning, and correcting should feel easy.

4. Document confidence
- Documents should be grouped by purpose and explained in plain language.

5. Submission reassurance
- The final review should reduce last-minute confusion and manual enquiries.

### Recommended Deliverables

- a refined step flow with concise section-purpose copy
- a document checklist with “why it matters” notes
- a review screen that separates blockers from reviewable items
- clearer completion and save states
- mobile and desktop refinement so the flow stays calm at any width

### Done When

- the parent can move from start to submit without surprises
- the portal feels like guided hand-holding instead of a workload dump
- the school receives higher-quality, more complete submissions with fewer follow-up questions

## Shared Design Rules For Both Sprints

- Use plain language first
- Ask only for what is needed
- Never show every possible field up front
- Use progressive disclosure for complexity
- Make the next action obvious
- Keep the tone warm, calm, and confidence-building
- Minimise manual enquiries by setting expectations at every step
- Keep assessment untouched
- Keep `src/` untouched until explicit promotion

## Source References

- [docs/parent-application-portal/plan.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/parent-application-portal/plan.md)
- [docs/GUIDED_APPLICATION_FLOW_PLAN.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/GUIDED_APPLICATION_FLOW_PLAN.md)
- [docs/REQUIREMENTS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/REQUIREMENTS.md)
- [docs/brand/eunice-school-knowledgebase.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/brand/eunice-school-knowledgebase.md)
- [docs/phase-next-level-output/plan.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/phase-next-level-output/plan.md)
- [dev/app/dev/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/parent/page.tsx)

## Exit Criteria

These two sprints are done when:

- the parent portal feels approachable for someone unfamiliar with Eunice,
- expectation-setting reduces confusion and manual follow-up,
- and the journey feels like guided support from start to finish.
