# Parent Application Portal Plan

Last updated: 2026-05-24  
Branch: `codex/vercel-project-separation`  
Primary surface: `dev/`

## Goal

Design the parent application front-end as a calm, guided admissions journey for first-time or unfamiliar parents, without assuming prior knowledge of Eunice Primary School.

The portal should:

- explain the intake journey at a high level before data entry begins
- prepare the parent for the documents and information they will need
- help parents understand why certain information is required
- reduce confusion, overload, and repeated explanations
- feel reassuring for different levels of digital confidence and literacy
- remain consistent with the Eunice school brand and admissions tone

## Parent Persona

Primary persona:

- A parent or guardian who may not know Eunice well
- May be applying to multiple schools and comparing admissions processes
- May be using a mobile phone, old laptop, or shared device
- May not know admissions terminology, document types, or school-specific expectations
- Needs a simple, respectful, step-by-step experience

Design implications:

- Use plain language first, school jargon second
- Explain why a section exists before asking for information
- Avoid long blocks of copy, dense forms, or hidden branching complexity
- Show progress and expectations clearly
- Never assume the parent knows which documents are critical or why

## Experience Principles

1. Start with orientation, not data capture.
- The first screen should explain the journey, time expectation, and required preparation.

2. Keep the application feel guided.
- The parent should always know what step they are on, what comes next, and what can be saved.

3. Explain the purpose of each section.
- Each major section should include one short sentence explaining why the information matters.

4. Treat documents as part of the journey.
- Documents should be introduced early, grouped logically, and explained in parent-friendly terms.

5. Use progressive disclosure.
- Only ask follow-up questions when answers make them relevant.

6. Reassure, don’t overwhelm.
- Make the process feel manageable even if the application is long underneath the surface.

## Simplicity Charter

The parent experience must feel easy, calm, and lightweight.

Non-negotiables:

- Never show more information than the parent needs at that moment.
- Never present every possible field up front.
- Never bury the next action inside dense paragraphs.
- Never make the parent feel like they need to “study” the form before starting.
- Never assume the parent already understands school admissions language.
- Never make document requirements feel punitive or mysterious.
- Never force the parent to mentally map the whole process before taking the first step.

What this means in the UI:

- one clear primary action on each screen
- one clear purpose statement per section
- short, human explanations instead of long technical blocks
- document guidance shown as a checklist with plain-language reasons
- optional or conditional items hidden until relevant
- progress always visible
- reassuring save and return behavior
- support cues that feel helpful, not alarmist

## Expectation-Setting Charter

The portal must manage expectations at every stage so parents do not have to guess what happens next.

This means the UI should clearly communicate:

- what the current step is for
- what information is required now
- what happens after this step is completed
- what might happen if information is missing or unclear
- whether the school may come back with a question, request, or next action
- what outcome the parent should expect after submission

Principles:

1. No surprises.
- If a step can trigger follow-up, say so in plain language.

2. One step at a time.
- Parents should only need to think about the current section, not the whole process.

3. Explain downstream impact.
- Let parents know why accuracy matters and what the school will use each section for.

4. Make next actions visible.
- Every step should end with a clear “what happens next” message.

5. Separate required, review, and optional items.
- Parents should know what blocks progress, what may be reviewed later, and what is simply helpful context.

6. Reassure about outcomes.
- Explain expected timing and possible review stages without promising exact timing that may change.

## Step-Level Messaging Rules

Each step should include a small expectation panel that answers:

- What is this step for?
- What should I prepare?
- How long might it take?
- What happens when I click continue?
- Will Eunice contact me after this?

Keep this panel brief, friendly, and always visible near the top or within the support rail.

What this means in the content:

- use fewer words, but make the words do more work
- prefer "what happens next" over internal process language
- explain why the school needs something before naming the field
- group complex details behind summaries or collapsible explanations
- keep the tone warm, respectful, and confidence-building

## Best Practice Grounding

These choices should guide every parent-facing screen:

1. Start with a clear service entry point.
- The first page should explain what the application is, who it is for, what the parent needs, and what happens next.
- Do not drop the parent into a form before they understand the journey.

2. One screen, one main job.
- Each page should ask one main question or complete one main task.
- If a screen starts to feel like a dump of fields, split it.

3. Ask only what Eunice truly needs.
- Do not collect information just because it might be useful someday.
- Keep the form lean and purposeful.

4. Explain why each section exists.
- Every section should earn its place with a short purpose statement.
- This is especially important for sensitive sections such as medical, household, and fee responsibility.

5. Use progressive disclosure for conditional complexity.
- Show extra questions only when the parent’s answers make them relevant.
- Hide irrelevant branches so the flow stays calm.

6. Make documents feel expected, not mysterious.
- Introduce the document checklist early.
- Explain why the school needs each document in simple language.
- Group documents by purpose, not by internal administration structure.

7. Reduce cognitive load.
- Short headings.
- Short paragraphs.
- Clear labels.
- Plain words first.
- Visual hierarchy that makes the next action obvious.

8. Design for trust and privacy.
- Explain what data is collected, why it is needed, and how it will be used.
- Minimise personal information to what is necessary for admissions.
- Make the privacy cue visible without making it heavy or legalistic.

9. Make mistakes recoverable.
- Parents should be able to save, return, correct, and continue.
- Avoid “all or nothing” states where possible.
- Clearly separate blockers from items that can be reviewed later.

10. Keep accessibility and inclusion built in.
- The flow should work for parents with lower digital confidence, screen readers, keyboard use, and small screens.
- Labels, instructions, and feedback should be easy to understand and consistently placed.

## Content Architecture

The parent portal should include these content layers:

### 1. Orientation Layer

Purpose:
- explain what the application is
- show how long it might take
- tell the parent what documents to prepare
- explain that they can save and return later

Content types:
- short introduction
- estimated time
- required document checklist
- optional/conditional document hints
- support contact cue

### 2. Progress Layer

Purpose:
- show where the parent is in the journey
- make the next step obvious
- reduce anxiety about “how much is left”

Content types:
- step indicator
- current section title
- short section subtitle
- progress state
- save status

### 3. Education Layer

Purpose:
- explain why each section matters
- help the parent understand document importance
- reduce drop-off caused by uncertainty

Content types:
- “why we ask this” copy
- document importance notes
- plain-language explanations
- next-step expectations

### 4. Submission Layer

Purpose:
- help the parent review, confirm, and submit with confidence

Content types:
- review summary
- incomplete item warning
- final consent copy
- submit confirmation
- after-submit expectation

## Parent Journey Structure

The parent should experience the flow as a guided journey, not a giant form.

### Step 0: Start Checklist

This is an orientation screen before the application begins.

What it should answer:
- What is this application for?
- How long will it take?
- What should I have ready?
- What happens if I need to stop and come back later?

### Step 1: Learner And Admission Details

What it should answer:
- Who is the child?
- Which grade and year are they applying for?
- What school context is needed?

### Step 2: Parent, Guardian, And Household

What it should answer:
- Who is applying?
- Who is responsible?
- What household context matters for admissions?

### Step 3: Medical, Support, And School Readiness

What it should answer:
- Does Eunice need to know anything important about care or support?
- Are there health, learning, or readiness details to consider?

### Step 4: Fee Responsibility And Documents

What it should answer:
- Who is responsible for fees?
- Which documents are required?
- Why are these documents needed?

### Step 5: Review, Consent, And Submit

What it should answer:
- Is everything complete?
- What still needs attention?
- What happens after submission?

## Information Design Rules

- Use short headings and short paragraphs
- Avoid academic or legal-heavy wording unless it is absolutely required
- Put the most important information first
- Never bury required documents inside long body copy
- Explain any “required” or “conditional” status in simple terms
- Use reassuring, human language for support and next steps

## Visual And Layout Rules

- Keep the Parent Portal wide and breathable on desktop
- Use a strong center content area with a calm support rail
- Avoid tall stacks of similar cards
- Make the top stepper or progress strip clear at a glance
- Keep primary actions visible and easy to understand
- Use brand color lightly and intentionally

## Interaction Rules

- The parent should always know:
  - where they are
  - what they need next
  - what can be saved
  - what documents matter
  - whether something blocks submission

- Conditional fields should appear only when relevant
- Completion should be obvious without forcing the user to interpret status codes
- Save/return behavior should be reassuring and visible
- Each step should communicate what happens next and reduce follow-up enquiries

## Trust And Privacy Rules

- Tell the parent why the school is asking for a piece of information before asking for it.
- Keep sensitive information grouped and clearly labelled.
- Only show fields that are necessary for the current step.
- Avoid asking the same thing twice.
- Make it clear which items are required for admissions and which are only needed in special circumstances.
- Use plain language for privacy reassurance: what is collected, why it is collected, and who can see it.

## Design Questions To Solve

1. How do we make the first screen feel like an orientation tour rather than a form?
2. How much explanatory text is helpful before it becomes noise?
3. Which guidance belongs in the main flow, and which belongs in the support rail?
4. Which document explanations should be upfront, and which should be contextual?
5. How should the portal adapt for parents with lower digital confidence?

## Recommended Implementation Slices

### Slice A: Parent Orientation Screen

Deliver:
- a start/checklist view that explains the journey before any form fields appear

### Slice B: Guided Step Flow

Deliver:
- the five-step parent flow with section-purpose copy and visible progress

### Slice C: Document Explanation Layer

Deliver:
- a plain-language document checklist with why-it-matters cues

### Slice D: Review And Reassurance

Deliver:
- a final review screen that clearly separates blockers, warnings, and ready-to-submit items

### Slice E: Responsive Refinement

Deliver:
- landscape and mobile tuning so the portal remains clear at any width

## Source References

- [docs/GUIDED_APPLICATION_FLOW_PLAN.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/GUIDED_APPLICATION_FLOW_PLAN.md)
- [docs/brand/eunice-school-knowledgebase.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/brand/eunice-school-knowledgebase.md)
- [docs/REQUIREMENTS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/REQUIREMENTS.md)
- [docs/PROJECT_BRIEF.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/PROJECT_BRIEF.md)
- [docs/phase-next-level-output/plan.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/phase-next-level-output/plan.md)
- [dev/app/dev/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/parent/page.tsx)

## Exit Criteria

This plan is done when the Parent Portal:

- feels understandable for a first-time parent
- explains the process without overload
- clearly prepares the parent for documents and time commitment
- stays calm, branded, and easy to follow
- becomes the main user-facing focus of the next implementation phase
