# Connector Readiness Plan

This plan makes sure the integrations we rely on are authenticated, permissioned, and testable before the next phase starts.

## Stage Goal

Make the repo ready for repeatable work by verifying the toolchain, the connectors, and the permission boundaries that each platform needs.

## Immediate Adoption Order

1. Treat the system of record as the first choice for each task.
2. Verify auth and permissions for each connector or CLI before using it in a new workstream.
3. Smoke-test each integration in the way we actually use it.
4. Record any recurring failures or missing scopes in the QuickFix knowledgebase.
5. Keep the fallback path clear so a blocked integration does not block the whole session.

## Task 1: Define the integration matrix

### Goal
Write down which tool owns which platform, so the team knows where to plan, where to build, and where to verify.

### Context
We now use GitHub, Vercel, Supabase, Linear, and browser-based preview checks. The workflow only stays clean if each platform has one clear access path and one clear source of truth.

### Relevant Files or References
- [docs/TOOLING_POLICY.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/TOOLING_POLICY.md:1)
- [docs/SESSION_BOOTSTRAP.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SESSION_BOOTSTRAP.md:1)
- [docs/FAILURE_TRIAGE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/FAILURE_TRIAGE.md:1)
- [docs/QUICKFIX_KB.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/QUICKFIX_KB.md:1)

### Proposed Approach
- List each platform and its preferred tool path.
- Note whether the path is read-only, write-capable, or review-only.
- Capture the required auth and the permission boundary for each one.
- Capture the fallback path if the primary tool cannot complete the task.

### Acceptance Criteria
- The matrix says which tool to use for GitHub, Vercel, Supabase, Linear, browser preview checks, and computer-use fallback.
- The matrix names the source of truth for each platform.
- The matrix is short enough to be used during session startup.

### Verify
- Read the matrix and confirm it matches the real workflow we use in practice.

### Out of Scope
- No platform migration or tooling replacement.

## Task 2: Verify auth and permissions for every active integration

### Goal
Make sure the current session can actually write to the tools it is supposed to use.

### Context
An integration can be present but still unusable if the login is stale, the project is wrong, or the permissions are not broad enough for the task. That is the failure mode we want to catch before feature work starts.

### Relevant Files or References
- Local CLI config and environment files
- Vercel project link metadata
- Linear project and team setup
- GitHub auth state

### Proposed Approach
- Check GitHub auth and repository permissions.
- Check Vercel auth, project link, and preview project root.
- Check Supabase CLI access and linked project state.
- Check Linear workspace, team, and project access before creating issues.
- Check browser or desktop login only when the next task truly needs a visual session.

### Acceptance Criteria
- Each active integration has a known auth state.
- Each active integration has a known permission boundary.
- Any missing permission is documented with a fallback path.

### Verify
- Run the session bootstrap checks and confirm the outputs are expected.

### Out of Scope
- No code changes unless an integration failure is caused by repo config.

## Task 3: Smoke-test the integrations in their real usage mode

### Goal
Prove that the connectors and CLIs work in the way we intend to use them during real work.

### Context
Read access alone is not enough. The next phase needs the tools to support the exact kinds of changes we will make: planning in Linear, pushes through GitHub, preview builds in Vercel, and schema work in Supabase.

### Relevant Files or References
- [docs/SESSION_BOOTSTRAP.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SESSION_BOOTSTRAP.md:1)
- [docs/TOOLING_POLICY.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/TOOLING_POLICY.md:1)

### Proposed Approach
- Run a non-destructive GitHub CLI check.
- Confirm the linked Vercel project and preview root.
- Confirm the Supabase CLI can inspect the active project or local migration state.
- Read or create a small Linear item in the intended Eunice project.
- Open a preview page only if the next workstream needs a rendered check.

### Acceptance Criteria
- Each active tool is proven in the same mode we will rely on later.
- The session can tell the difference between network, config, and code failures.
- The fallback path is known if one tool breaks.

### Verify
- Complete one smoke pass and record the result in the session notes or QuickFix KB if anything repeats.

### Out of Scope
- No broad automation buildout yet.

## Task 4: Lock the fallback and QuickFix loop

### Goal
Make repeated failures easier to classify and reuse instead of rediscovering them.

### Context
When an integration fails repeatedly, the next question is not "what else can we try indefinitely?" It is "is this network, config, or code, and what is the fastest safe fallback?"

### Relevant Files or References
- [docs/FAILURE_TRIAGE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/FAILURE_TRIAGE.md:1)
- [docs/QUICKFIX_KB.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/QUICKFIX_KB.md:1)

### Proposed Approach
- Document the exact fallback path for each integration.
- Record any repeated issue after a fix is discovered.
- Keep the QuickFix entry short and reusable.

### Acceptance Criteria
- Repeat failures can be classified quickly.
- Work can continue on an alternate path when one connector is blocked.
- Known recurring issues are captured once and reused later.

### Verify
- Re-run the affected check using the documented fallback path.

### Out of Scope
- No attempt to automate every fallback at once.
