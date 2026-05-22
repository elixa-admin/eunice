# Checkpoint: Dev Visual Target Reset

## Current State
- The branch is `codex/vercel-project-separation`.
- The latest published commit is the current branch head.
- The `dev/` surface is the Vercel preview the team is reviewing.
- `src/` remains the product app surface and should not be pulled into preview styling work unless the logic itself is changing.
- The parent portal has now been tightened with a clearer admissions-specific status band and a more explicit "what happens next" panel.
- The shared theme foundation has been refined so the preview reads more like a finished admissions website and less like a card wireframe.
- The public hub, parent portal, admin queue, and application detail view now share the same green-and-gold academic treatment.
- Parent and admin preview workflow now derives from computed document state:
  - parent step chips and submission gate use a shared workflow snapshot
  - admin queue health counts use derived workflow lanes (`blocking`, `review`, `ready`, `decision`)
- The admin dashboard now adds lane-colored cards, row tinting, and progress strips so stuck, waiting, and ready states are visible at a glance.

## Visual Target
- External-facing pages should feel academic, calm, and Eunice-specific.
- The preview should look like a real admissions website/form, not a generic card dashboard.
- The parent portal should be the clearest place to test this tone first.
- Keep the green and gold brand direction, but use it sparingly and deliberately.
- Use form-like structure, section labels, and clear preview framing so the interface reads as a finished site.

## Decisions
- Work in small slices, one surface at a time.
- Keep `dev/` as the preview-only surface for visible theme work.
- Prefer build changes and Git commits first, then check the live dev site after the commit lands.
- Use screenshots/preview review as the main validation path once the branch is comfortable, not local render loops.

## Next Slice
1. Review the live preview after the admin heatmap pass lands.
2. If the direction holds, continue only with narrow workflow-visibility refinements.
3. Stop and reassess before widening scope again.

## Open Notes
- Linear auth still needs a refresh before tracker updates can resume cleanly.
- The repo should stay free of broad theme churn until the parent slice is approved.
- Health-check automation is active for light code sweeps every 4 hours during heavy coding sessions, but it should skip itself if no code changed in the last hour.
