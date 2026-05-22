# Checkpoint: Dev Visual Target Reset

## Current State
- The branch is `codex/vercel-project-separation`.
- The latest published commit is `ab940e8 feat: refine dev preview admissions theme`.
- The `dev/` surface is the Vercel preview the team is reviewing.
- `src/` remains the product app surface and should not be pulled into preview styling work unless the logic itself is changing.
- The parent portal has now been tightened with a clearer admissions-specific status band and a more explicit "what happens next" panel.

## Visual Target
- External-facing pages should feel academic, calm, and Eunice-specific.
- The preview should look like a real admissions website/form, not a generic card dashboard.
- The parent portal should be the clearest place to test this tone first.
- Keep the green and gold brand direction, but use it sparingly and deliberately.
- Use form-like structure, section labels, and clear preview framing so the interface reads as a finished site.

## Decisions
- Work in small slices, one surface at a time.
- Keep `dev/` as the preview-only surface for visible theme work.
- Use screenshots/preview review as the main validation path, not local render loops.

## Next Slice
1. Review the updated parent portal in the preview branch.
2. If the website/form feel is closer to the target, move to one small admin-dashboard polish slice next.
3. Keep every follow-on change narrow enough to fit in a single screenshot.

## Open Notes
- Linear auth still needs a refresh before tracker updates can resume cleanly.
- The repo should stay free of broad theme churn until the parent slice is approved.
