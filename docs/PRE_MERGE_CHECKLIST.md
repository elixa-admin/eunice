# Pre-Merge Checklist

Use this checklist before merging any Eunice change.

## Scope

- The change stays within the current sprint or approved follow-up.
- The diff does not add duplicate logic for something that already exists.
- New files are necessary and placed in the right part of the repo.
- Temporary or experimental code is not being merged into `src/`.

## Correctness

- The feature behaves the way the user-facing flow expects.
- Empty routes, broken links, and dead buttons have been removed.
- Status or validation logic uses the shared domain types, not ad hoc strings.
- Any new data shape has a clear contract or type.

## Verification

- `lint` passes.
- `typecheck` passes.
- The affected route or screen was opened in a browser.
- The main happy path was exercised end-to-end.
- Any known limitation is noted clearly in the handoff.

## UI and UX

- The screen uses the approved Eunice theme.
- The layout works on a narrow screen as well as desktop.
- Loading, empty, error, and success states are sensible.
- Copy is clear and avoids placeholder language.

## Data and Safety

- File uploads are validated before acceptance.
- Sensitive data is not logged.
- Role-based access still matches the intended audience.
- Any integration boundary fails safely if the downstream service is unavailable.

## Final Check

- The change is small enough to review quickly.
- The commit message describes the real outcome.
- The merge will not make the codebase harder to understand.

