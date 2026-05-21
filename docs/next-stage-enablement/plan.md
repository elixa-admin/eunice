# Next Stage Enablement Plan

This plan turns the current working preview into a repeatable delivery loop with a clear source of truth across `src/`, `dev/`, and `supabase/`.

## Stage Goal

Make the repo easy to change without creating code sprawl, tool confusion, or deployment ambiguity.

## Immediate Adoption Order

1. Make CLI the default for repo-local and deterministic work.
2. Use connectors for GitHub review workflows, Linear planning, and doc sources of truth.
3. Reserve browser and dashboard work for the small set of tasks that are visual or not CLI-friendly.
4. Keep `src/`, `dev/`, and `supabase/` aligned to their own sources of truth.

## Task 1: Lock the workflow policy

### Goal
Make tool choice, source-of-truth boundaries, and token-efficient habits explicit.

### Context
The repo now has separate surfaces for the product app, the preview app, and the schema. Without a written policy, future work can easily drift into duplicate logic or inconsistent deployment habits.

### Relevant Files
- [docs/TOOLING_POLICY.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/TOOLING_POLICY.md:1)
- [docs/ENGINEERING_GUARDRAILS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/ENGINEERING_GUARDRAILS.md:1)
- [README.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/README.md:1)

### Proposed Approach
- Keep the policy short and opinionated.
- State the priority ladder first so the default path is obvious.
- Make CLI the default for deterministic work.
- Reserve connectors for structured remote workflows.
- Reserve browser checks for visual or interactive validation.

### Acceptance Criteria
- The policy is easy to find from the README.
- The policy clearly names `src/`, `dev/`, and `supabase/` as distinct sources of truth.
- The policy explains when to prefer CLI, connectors, or browser tooling.
- The policy names GitHub, Vercel, Supabase, Linear, and browser defaults explicitly.

### Verify
- Read the policy top to bottom and confirm it matches how we are actually working.

### Out of Scope
- No code changes.
- No workflow automation beyond the written policy.

## Task 2: Keep the preview and product surfaces aligned

### Goal
Preserve one shared domain model while still allowing `dev/` to remain a safe preview layer.

### Context
We now have shared status and document contracts in `src/lib`, but the preview surface can still drift if it copies logic instead of consuming shared definitions.

### Relevant Files
- [src/lib/domain/applications.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/domain/applications.ts:1)
- [src/lib/documents/contracts.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/lib/documents/contracts.ts:1)
- [dev/lib/dev-preview-data.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/lib/dev-preview-data.ts:1)
- [dev/app/dev/*](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/page.tsx:1)
- [src/app/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/src/app/parent/page.tsx:1)

### Proposed Approach
- Continue centralizing status labels, document rules, and validation logic in shared modules.
- Use `dev/` for preview-only presentation and mock data, not duplicate business rules.
- Remove any new copy-pasted enums or validation paths before they spread.

### Acceptance Criteria
- The same status and document terminology appears in both `src/` and `dev/`.
- The preview surface still feels intentionally separate, but not contradictory.
- No duplicate business rule is introduced for the same workflow state.

### Verify
- Compare `src/lib` and `dev/lib` for duplicate workflow logic.
- Check that preview pages import shared contracts rather than redefining them.

### Out of Scope
- No production upload backend yet.
- No schema expansion beyond the current admissions model.

## Task 3: Make the deployment loop boring

### Goal
Ensure the repo can be pushed, built, and previewed without manual guesswork.

### Context
The `eunice-dev` Vercel project is linked, the root and `dev/` workspaces are both available, and the preview build has already proven the current structure can compile.

### Relevant Files
- [dev/vercel.json](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/vercel.json:1)
- [.vercel/project.json](/Users/brandondienar/Documents/Codex/Projects/Eunice/.vercel/project.json:1)
- [dev/package.json](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/package.json:1)
- [package.json](/Users/brandondienar/Documents/Codex/Projects/Eunice/package.json:1)

### Proposed Approach
- Keep the GitHub repository connected to the Vercel project.
- Keep the project root pointed at `dev/` for the preview surface.
- Use the CLI to pull settings, build locally, and deploy when needed.
- Avoid introducing a second deployment path unless it solves a real problem.

### Acceptance Criteria
- A preview build can be produced from the linked Vercel project.
- The project root remains `dev/`.
- The deployment path is clear enough that future work does not need detective work.

### Verify
- Run `vercel project inspect -y`.
- Run `vercel build --yes`.

### Out of Scope
- No new environments.
- No monorepo restructuring.

## Task 4: Enforce a merge gate

### Goal
Stop sprawl before it lands by making the pre-merge check routine part of normal work.

### Context
The repo is now large enough that accidental duplication or temporary paths can creep back in unless every change is checked against a common standard.

### Relevant Files
- [docs/PRE_MERGE_CHECKLIST.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/PRE_MERGE_CHECKLIST.md:1)
- [docs/ENGINEERING_GUARDRAILS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/ENGINEERING_GUARDRAILS.md:1)

### Proposed Approach
- Use the checklist on every meaningful change.
- Require lint, typecheck, and browser smoke checks where relevant.
- Treat empty routes, duplicate logic, and unclear ownership as blockers.

### Acceptance Criteria
- The checklist is used before merge, not after bugs land.
- New work is easier to review because it stays small and focused.
- The team has a consistent definition of "done".

### Verify
- Review the next merged slice against the checklist.

### Out of Scope
- No new CI system in this plan.
