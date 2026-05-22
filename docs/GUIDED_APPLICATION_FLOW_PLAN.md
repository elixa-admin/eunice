# Guided Application Flow Plan

Last updated: 2026-05-22

## Purpose

Eunice's current Google Form takes 13 pages to complete. The product should preserve the school's required information, but compress the parent experience into a guided 4-5 step journey that feels predictable, interactive, and respectful of a parent's time.

The goal is not to remove critical admissions data. The goal is to stop making parents discover the workload one page at a time.

## Design Principle

Start with orientation, then progressively disclose the right questions.

Parents should understand before they begin:

- how many sections there are
- how long the application usually takes
- which documents they need nearby
- which sections are about the learner, family, finances, documents, and final consent
- when conditional questions may appear
- what happens after submission

## Proposed 5-Step Flow

### Step 0: Start Checklist

This is a preparation screen, not a data-capture page.

Purpose:
- reduce uncertainty before the parent begins
- show the full journey upfront
- let the parent gather documents before investing effort

Content:
- estimated time to complete
- required documents checklist
- conditional documents checklist
- save-and-return reassurance
- privacy and POPIA reassurance
- admissions contact/support cue

Outcome:
- parent clicks "Start application"
- application draft is created
- parent understands the path ahead

### Step 1: Learner And Admission Details

This combines the basic learner and target intake information.

Captures:
- learner legal names
- preferred name if needed
- date of birth / ID or birth certificate context
- grade applied for
- intake year
- current school
- previous school context
- repeated grade or academic support flags where needed

Why this matters:
- establishes the application record
- determines grade-specific expectations
- prepares academic document requirements

### Step 2: Parent, Guardian, And Household

This combines family context without forcing every branch on every parent.

Captures:
- submitting parent details
- second parent details if applicable
- legal guardian only if different
- marital / custody context only where relevant
- residential address
- sibling / legacy links to Eunice

Smart behavior:
- if there is no separate legal guardian, hide guardian fields
- if custody or divorce context applies, surface custody document guidance
- if the same person is parent, guardian, and submitter, avoid duplicate entry

Why this matters:
- separates responsibility without making the parent repeat themselves
- gives admissions the household context they need

### Step 3: Medical, Support, And School Readiness

This groups sensitive learner-care questions in one calm section.

Captures:
- medical aid details
- emergency doctor details
- allergies and conditions
- medication or special care needs
- immunisation status
- learning support / developmental disclosures
- co-curricular, sport, culture, or leadership profile where useful

Smart behavior:
- use yes/no gates before detailed follow-ups
- make sensitive disclosures feel supportive, not punitive
- allow "not applicable" where appropriate

Why this matters:
- supports duty of care
- helps Eunice prepare appropriately if the learner is accepted

### Step 4: Fee Responsibility And Documents

This combines fee-payer responsibility with upload collection, because many document requirements depend on who is financially responsible.

Captures:
- person responsible for school fees
- relationship to learner
- fee-payer ID / contact details
- income or employment proof where required
- learner documents
- parent / guardian documents
- residence documents
- medical documents
- academic documents
- conditional custody / permit / supporting documents

Smart behavior:
- if fee-payer is the submitting parent, prefill from parent details
- show only documents required for the family's answers
- group uploads by purpose, not by form history
- explain why each document is needed
- show document readiness before final review

Why this matters:
- turns the heaviest section into a checklist with context
- avoids making parents upload irrelevant documents

### Step 5: Review, Consent, And Submit

This is the parent confidence checkpoint.

Captures:
- final declarations
- consent confirmations
- data accuracy confirmation
- submit action

Shows:
- section completion summary
- missing required items
- items allowed under manual review
- next expected action after submission
- what Eunice will do next

Outcome:
- application moves from draft to submitted
- parent sees a clear status page
- admissions receives a structured review packet

## How This Shortens The Cycle

The old model is page-count driven. The new model is task-driven.

| Current 13-page form pattern | Proposed guided flow |
| --- | --- |
| basic learner pages | Step 1 |
| parent / mother / father pages | Step 2 |
| guardian / household branches | Step 2, conditional |
| medical pages | Step 3 |
| school history and activities | Step 3 where relevant |
| finance page at the end | Step 4, surfaced earlier |
| scattered document upload prompts | Step 4 grouped checklist |
| declarations at the end | Step 5 |

The parent sees fewer windows, but Eunice still receives the same core admissions packet.

## Interaction Patterns

Use these patterns in the parent-facing product:

- visible progress: "Step 2 of 5"
- upfront checklist: "Have these ready before you start"
- section purpose copy: one sentence explaining why the section matters
- conditional branching: hide irrelevant fields after parent answers
- inline save state: "Saved just now"
- document grouping: Identity, Household, Medical, Academic, Financial, Legal
- recovery guidance: "This can be fixed after submission" versus "This blocks submission"
- final review: one consolidated readiness screen

## Information Architecture

The product should store detailed data in normalized entities, even if the parent sees only five steps.

Suggested mapping:

- `application`: reference, grade, year, state
- `learner_profile`: learner identity, academic context, readiness context
- `household`: address, family structure, sibling links
- `responsible_parties`: submitter, parent, guardian, fee-payer
- `medical_profile`: healthcare and support disclosures
- `documents`: required, conditional, optional, status
- `consents`: legal and data confirmations

## Next Implementation Slice

Build the parent preview as a guided 5-step application experience:

1. Add the Step 0 start checklist to the parent preview.
2. Rename the existing step model to match the proposed five parent-facing sections.
3. Replace static guidance with section-purpose copy and readiness signals.
4. Keep the underlying document and role logic unchanged.
5. Commit, push, and verify on the live `eunice-dev` preview.

## Acceptance Criteria

- The parent can understand the full journey before entering data.
- The visible application journey is no more than five steps after orientation.
- Conditional details are explained as adaptive, not hidden complexity.
- Documents are introduced upfront and collected in one guided section.
- The final review clearly separates blockers from items Eunice can manually review.
