# Engineering Guardrails

These guardrails keep the Eunice codebase small, understandable, and safe to change while the product is still taking shape.

## Core Rules

- Keep one source of truth per concern.
- Build in small vertical slices.
- Verify every slice before calling it done.
- Prefer simple, local abstractions over broad shared frameworks.
- Treat `src/` as the product app and `dev/` as the sandbox.

## What Goes Where

- `src/lib` holds shared business rules, contracts, validation, and integration boundaries.
- `src/components` holds reusable UI pieces.
- `src/app` holds thin route files that compose the app from shared logic.
- `dev/` can contain experiments, previews, and design exploration that are not yet ready for the product app.

## Anti-Sprawl Rules

- Do not copy the same business rule into multiple route files.
- Do not add a helper or folder unless it removes real duplication or risk.
- Do not leave empty routes, placeholder pages, or temporary branches of logic in `src/`.
- Do not create a second implementation path for the same feature without retiring the first one.
- Do not move logic into a component just to make a page file shorter if the logic is still domain logic.

## Quality Bar

- Every meaningful change should pass `lint` and `typecheck`.
- Every user-facing slice should get a browser smoke test before merge.
- Every route should render without errors in the current app shell.
- Every new data shape should have an explicit contract or type.
- Every upload, status change, and integration touchpoint should fail safely.

## Decision Defaults

- If a rule is likely to change soon, keep it centralized.
- If a workflow is uncertain, model it in the domain layer first.
- If an experiment is useful but risky, keep it in `dev/` until the workflow is proven.
- If a feature requires a large architectural leap, split the leap into the smallest useful slice.

## Team Habits

- Prefer short-lived branches and small commits.
- Write down the intended shape of a feature before adding more files.
- Review the repo for duplicates before introducing new helpers.
- Fix the smallest real cause of a bug rather than patching around it in several places.
- When in doubt, choose clarity over cleverness.

