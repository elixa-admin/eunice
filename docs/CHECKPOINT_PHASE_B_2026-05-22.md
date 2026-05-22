# Checkpoint: Phase B Start

## Current State
- The intake-role and document-orchestration sprint is complete and wrapped.
- The branch `codex/vercel-project-separation` is the active working branch.
- The latest Phase B UI polish commit is pushed to GitHub.
- Vercel should be refreshing the branch preview from the latest commit.
- The parent portal is now more dashboard-like and visibly different from the earlier scaffold feel.

## Recent Decisions
- Keep Phase B focused on product feel, not more intake logic.
- Prioritize the parent portal first because it still reads the most utilitarian.
- Treat expectation timing ("when is the next action?") as a lower-priority trust cue, not the main UI focus.
- Use short implementation cycles and avoid depending on long conversational continuity.

## UI Work Already Landed
- Landing page now uses a stronger admissions-product presentation.
- Parent portal now has a dashboard-like hero with a clear status band and next-step card.
- Admin dashboard now has a stronger hero/status block and a clearer operational summary layout.
- Parent workflow has more visible guidance and a more distinct structure band.

## Unresolved Issues
- The Vercel preview should be checked visually to confirm the UI difference is obvious enough.
- The admin dashboard may still need one more pass if the current contrast or hierarchy is not bold enough in preview.
- The parent workflow may still need stronger empty states and upload-state treatment.
- We have not yet done a final pass on spacing, typography consistency, and brand treatment across all surfaces.

## Recommended Next Cycle
1. Open the current branch preview and verify the admin dashboard now reads as a stronger product surface.
2. If the difference is still too subtle, make one bolder UI change in a single file.
3. Then move to the remaining parent workflow polish in a separate cycle.
4. After each major milestone, start a fresh session and resume from this checkpoint.

## Session Rule
- Prefer short deterministic implementation cycles.
- Persist architecture decisions and unresolved issues in markdown checkpoints.
- Recommend a fresh session after each major implementation milestone.

## Latest Cycle
- Parent portal now has a clearer admissions journey strip and a more explicit "what happens next" cue.
- This was intentionally kept as a contained visual hierarchy pass, not a backend or logic change.
- Verification started with TypeScript but did not return a clean result yet in this environment.
- Next step should be either a browser preview check or the admin polish slice, depending on what feels most visually urgent.

## Next Phase Direction
- External public pages should move toward a more academic, structured, Eunice-faithful visual language.
- Internal admin surfaces can be more expressive, interactive, and visually adventurous because they are not public-facing.
- Keep one product family, but vary the intensity by audience.
- The new planning reference is `docs/PHASE_C_THEME_SPLIT_PLAN.md`.

## Latest Theme Cycle
- Public pages now lean more academic and formal with a serif-led headline treatment and a restrained Eunice green-and-gold palette.
- The admin dashboard now has a richer, more colorful operational tone while still staying rooted in Eunice's actual brand direction.
- This cycle was intentionally kept to the theme split only; no intake logic changed.
- TypeScript verification still has not completed cleanly in this environment, and the local build check was still running when this cycle was closed, so the next session should recheck before any bigger structural follow-up.

## Next Two Phases
- Phase D: data and flow hardening, focusing on canonical roles, persistence, state alignment, and preview/product boundary hygiene.
- Phase E: pilot readiness and launch stability, focusing on parent comms, admin readiness, deployment reliability, and support handoff.
- The new phase docs are `docs/PHASE_D_DATA_AND_FLOW_HARDENING_PLAN.md` and `docs/PHASE_E_PILOT_READINESS_PLAN.md`.

## Cross-School Research Notes
- Compare Eunice against SPARK, Reddam House Constantia, Michaelhouse, and St Stithians before finalizing Phase B UX.
- Carry forward the useful patterns: staged journey, expectation-setting, human support, role separation, and conditional documents.
- Avoid copying any school’s first-step burden directly; keep Eunice’s unique intake requirements but present them as a guided admissions journey.
- Use `docs/INTAKE_COMPARISON_SA_SCHOOLS.md` as the durable reference for later UI and workflow decisions.

## Eunice Synthesis
- Adopt: staged journey, support cues, expectation-setting, role-aware intake, conditional docs, and interview/review handoff.
- Avoid: front-loading every possible requirement, making fees the visual centre, or importing boarding-school patterns that do not fit Eunice.
- Keep provisional until Eunice confirms: final weighting of non-academic factors, exact interview flow, and any policy-specific wording.
- Treat current work as initiative-led, but easy to revise once the school's second assessment arrives.
