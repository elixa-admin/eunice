# Phase C Plan: Academic Public Experience + Expressive Internal Dashboard

Date: 2026-05-22

## Goal
Elevate the Eunice platform’s visual polish by splitting the product into two clearly different design modes:

- External parent-facing experience: academic, structured, premium, and brand-faithful
- Internal admin experience: more expressive, interactive, and operationally rich

## Context
We have enough structural product work in place to improve the emotional and visual quality of the platform. The user direction is now explicit:

- The public parent journey must feel restrained, academic, and aligned to Eunice’s brand.
- The admin dashboard can be more creative, tactile, and exploratory because it is not exposed publicly.
- Both surfaces still need to feel like the same product family.

The design inspiration examples suggest:

- bright, airy dashboards
- soft shadows and rounded cards
- strong hierarchy
- premium spacing
- a polished product feel rather than a generic admin tool

For Eunice, the public-facing layer should be more formal and school-like than those references, while the internal layer can borrow more of their dashboard energy.

## Shared Decisions

- Keep the public experience academically restrained and brand-faithful.
- Allow the internal dashboard more creative latitude.
- Preserve the current workflow logic; this phase is about presentation and product feel.
- Use Eunice’s brand colors and formal tone externally.
- Keep design changes small, shippable, and previewable in short cycles.
- Record any design decisions that should survive into the next session in checkpoint markdown.

## Task 1: Public Academic Theme

### Goal
Make the parent-facing experience feel premium, formal, and school-appropriate.

### Context
The public application journey is where trust matters most. It should feel like a serious admissions process, not a flashy product demo.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/page.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/parent/page.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/parent/application-workflow.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/globals.css`

### Proposed approach
- Rework the public palette around Eunice’s school identity rather than generic startup blues.
- Use more disciplined layout framing and calmer decorative treatment.
- Increase editorial whitespace and reduce visual noise.
- Make the status language feel formal, helpful, and reassuring.

### Acceptance criteria
- The parent-facing experience feels academic and premium.
- The school brand is visible without overpowering readability.
- The UI looks like a serious admissions portal rather than a template dashboard.

### Verify
- Compare the public pages in the branch preview and confirm the tone is formal and coherent.

### Out of scope
- New admissions logic.
- Internal dashboard styling experiments.

## Task 2: Internal Dashboard Expressiveness

### Goal
Give the admin workspace more creative energy and operational richness.

### Context
Internal staff do not need the same restraint as parents. They need clarity, density, and a workspace that feels active and useful.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/admin/page.tsx`

### Proposed approach
- Add richer cards, status zones, or small dashboard accents.
- Allow more experimentation with color, layout density, and micro-visualization.
- Improve the sense of a working admissions control room.

### Acceptance criteria
- The admin area feels more lively and operational than the public pages.
- It still reads as part of the same Eunice product family.
- The interface helps staff scan status and act faster.

### Verify
- Open the admin page in the preview and compare it to the parent-facing surfaces.

### Out of scope
- Public-facing brand experimentation.
- Changing workflow semantics.

## Task 3: Brand System Refinement

### Goal
Translate the Eunice brand into a coherent UI system that works across both experiences.

### Context
We need one family of tokens and patterns, but two presentation modes.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/globals.css`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/layout.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/components/nav.tsx`

### Proposed approach
- Define a calmer public palette and a slightly richer internal surface palette.
- Keep typography, spacing, and border treatment consistent.
- Use the same brand language but vary the intensity by audience.

### Acceptance criteria
- The product feels cohesive even though the two audiences have different visual energy.
- The public experience remains restrained while the admin experience feels more alive.

### Verify
- Review both surfaces side by side in preview.

### Out of scope
- A full rebrand.
- Rewriting the application model.

## Task 4: Visual Polish Handoff

### Goal
Leave the phase in a state that is easy to resume or refine after the school’s next input.

### Context
We still expect additional school guidance. The theme work should be easy to adjust, not fragile.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/CHECKPOINT_PHASE_B_2026-05-22.md`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_NEXT_INTAKE_UX.md`

### Proposed approach
- Record what visual direction was chosen.
- Note any unresolved palette or layout choices.
- Recommend a fresh session once a major visual milestone is complete.

### Acceptance criteria
- The checkpoint reflects the chosen public/private visual split.
- The next cycle can start without relying on memory.

### Verify
- Review the checkpoint markdown after each substantial slice.

### Out of scope
- More intake requirements.

## Recommended Order
1. Public academic theme.
2. Internal dashboard expressiveness.
3. Brand system refinement.
4. Visual polish handoff.

## Notes on Creative Scope

- Public pages: disciplined, school-first, emotionally calm.
- Internal pages: more exploratory, more tactile, more dashboard-like.
- The public experience should never feel as visually loud as the internal one.

