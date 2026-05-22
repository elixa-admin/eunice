# Sprint: Visual Punch With Minimal Scope

Date: 2026-05-22

## Goal
Make the `dev/` preview feel like a finished Eunice admissions website and form, not a wireframe, using the fewest possible changes with the biggest visible effect.

## Strategy
- Touch shared chrome first so one change improves every preview surface.
- Prioritise the public/parent-facing experience before internal polish.
- Avoid logic changes unless they directly improve visual hierarchy.
- Make the build change first, then verify on the live dev site after the commit.
- Keep admin work out of this sprint unless it is required to preserve visual coherence.

## Slice 1: Public Site Shell

### Goal
Turn the preview hub into a proper admissions landing experience with clear framing, sections, and a more website-like rhythm.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/preview-shell.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/nav.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/page.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/globals.css`

### Approach
- Strengthen the hero and surface framing.
- Make the top-level preview feel like a public website, not a demo panel.
- Keep Eunice green and gold restrained and formal.

### Acceptance Criteria
- The preview hub reads like a finished school admissions landing page.
- The visual hierarchy is obvious at a glance.
- The interface feels more like a site than a wireframe.

### Verify
- Open the latest Vercel preview and inspect the preview hub on desktop width.

### Out of Scope
- Workflow logic changes.
- Admin dashboard redesign.
- Backend schema changes.

## Slice 2: Parent Portal Form Feel

### Goal
Make the parent portal feel like a polished online admissions form with stronger sectioning, step cues, and a clearer next action.

### Relevant files
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/parent/page.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/components/surface-card.tsx`
- `/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/lib/dev-preview-data.ts`

### Approach
- Rework the top section into a form-like journey.
- Show progress and next step more explicitly.
- Reduce the sense of “dashboard tiles” and increase the sense of a real admissions form.

### Acceptance Criteria
- The parent page looks like a structured admissions form experience.
- The next step is obvious without reading everything.
- The page feels finished and reviewable in a screenshot.

### Verify
- Open the parent portal in the latest preview and compare it against the preview hub.

### Out of Scope
- Admin dashboard polish.
- New backend behavior.
- Extra visual experimentation outside the public flow.

## Stop Rule
After Slice 2, pause and review before touching admin or application detail views.
