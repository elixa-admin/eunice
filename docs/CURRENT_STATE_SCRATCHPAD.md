# Current State Scratchpad

Working notes from live workflow inspection, discovery, and product-direction signals.

Update this when we learn something material about the real Eunice process that should shape product decisions, but is not yet a final requirement or signed-off workflow rule.

## 2026-05-22: Repo, Tracker, and Deployment Alignment Snapshot

### Repo state

- The working repo has moved beyond a pure Phase 0 planning state.
- `src/` is present as the real product app surface.
- `dev/` is present as the preview and exploration surface.
- `supabase/migrations/20260521_000001_phase2_foundation.sql` exists, which confirms early Phase 2 foundation work has already started.

### Linear state

- Active Linear project found:
  - `Eunice Admissions Platform`
- Current project issues found in backlog:
  - `ELI-134` Lock the session bootstrap and tooling policy
  - `ELI-135` Align source-of-truth boundaries across `src`, `dev`, and `supabase`
  - `ELI-136` Make the deployment loop boring for the `/dev` preview
  - `ELI-137` Enforce the merge gate and QuickFix habit

### GitHub state

- Connected repository:
  - `elixa-admin/eunice`
- Recent merged pull requests confirm active implementation work:
  - PR `#2` `feat: add top-level dev preview app`
  - PR `#3` `chore: separate Vercel project configs`
- Older open PR still exists:
  - PR `#1` `feat: add separate dev preview surface`
- Local branch during this alignment check:
  - `codex/vercel-project-separation`

### Vercel state

- Workspace link files at repo root and `dev/` both point to:
  - project name `eunice-dev`
  - root directory `dev`
- This confirms the current local deployment path is aligned to the preview surface rather than the real `src/` product app.

### Integration health notes

- The GitHub connector is working for repository and pull request reads.
- Local `gh` CLI auth is not currently healthy in this workspace because the saved token is invalid.
- Vercel local link metadata is present and resolves to the same `eunice-dev` project from both the repo root and `dev/`.

### Implication

- The durable docs should treat the old phase markers as baseline planning, not as the current operational state.
- Linear should remain the source of truth for active execution slices.
- GitHub already reflects implementation momentum.
- Vercel is presently aligned to the preview deployment path, so any statement about “current deployment” should be explicit about whether it means `dev/` or the real product app in `src/`.

## 2026-05-22: Live Eunice Form Walkthrough Completed

### Scope completed

- Visited the public Eunice applications page.
- Confirmed the Grade 000 expression-of-interest form is closed.
- Walked the active 2027 admissions Google Form through all 13 pages using dummy data.
- Stopped on the final submit screen without submitting.

### Most important findings

- The active workflow is materially more detailed than the older lightweight MVP assumptions.
- The form collects a separate fee-payer identity on the final page.
- The process is document-heavy throughout, not just at the end.
- Parent, guardian, medical, academic, consent, and finance concerns are all mixed into one long completion path.
- Weak conditional logic is a real issue in the current Google Form.

### Confirmed document packet

The school’s live intake shape requires support for at least:

- learner birth certificate
- learner photograph
- motivation letter to the principal
- proof of residence
- parent or guardian ID copy
- proof of employment or income
- medical aid card
- immunisation record
- latest school report
- fee-payer or debtor ID
- non-South African permit documents where applicable
- divorce or custody documents where applicable

### Product direction impact

- The shared document contract in code should match the real Eunice packet rather than a generic school-admissions minimum.
- The schema should treat submitter, guardian, and fee-payer as related but distinct roles.
- The parent flow can stay compressed into four stages, but those stages must cover the full real intake structure.
- Admin review needs explicit awareness of conditional document rules.

## 2026-05-21: Live Admissions Entry Flow

### Observed live state

- The public parent entry point is the Eunice applications page:
  - [Eunice applications page](https://euniceps.co.za/about/applications/)
- The page currently points parents to:
  - a closed Grade 000 expression-of-interest Google Form
  - an active Google Form for 2027 admissions
- The active admissions form redirects immediately to a Google sign-in screen before any application questions are visible.
- I did not continue with a dummy submission because that would have required a real Google account and would risk polluting the live admissions workflow.

### Why the current environment is not optimized for a smooth parent workflow

- There is a high-friction entry gate at the very start.
  - A parent must authenticate with Google before even seeing the live application questions.
- The document burden is heavy.
  - The website asks parents to prepare a long list of documents before they start.
- Guidance is split across two places.
  - The website explains readiness and required documents.
  - The form likely handles the structured data capture only after login.
- The current flow is not easy to inspect or test safely.
  - Even a product walkthrough requires authenticated access.
  - A realistic test risks creating real records in a live school workflow.

### Product implications

- The Google sign-in requirement is likely one of the biggest parent-experience weaknesses in the current process.
- Our platform should allow parents to understand the journey before authentication or at least before deep data entry.
- The document load should be staged clearly and progressively, rather than presented as one overwhelming precondition.
- The parent workflow should unify guidance and data capture in one experience instead of splitting them between a public page and a gated form.
- We need a safe way to inspect and test live workflows without creating fake production records.

### Design and workflow prompts for future sprints

- Show the application journey, requirements, and estimated effort before login.
- Make required documents visible as a guided checklist with plain-language explanations.
- Let parents save progress without needing to complete the entire journey in one sitting.
- Reduce surprises by surfacing what will be asked, what files are needed, and what can be added later.
- Keep the system testable in preview and staging without relying on live production forms.
## Live Google Form Walkthrough - 2026-05-21

Observed directly in the live Google Forms journey using dummy information and without final submission.

### Progress Reached

- Reached Page 6 of 13.
- Stopped before final submission.
- Used safe dummy parent and learner data.
- Confirmed that uploads, draft saving, and question validation are all live and tied to the signed-in Google account.

### Confirmed Workflow Pattern

- Public website guidance and real data capture are split across two surfaces.
- Parents are forced into Google sign-in before seeing the real application flow.
- The form saves drafts live and records the Google account identity used in the session.
- The form is long, multi-page, and document-heavy from the beginning.
- File uploads are repeatedly interleaved with ordinary data entry instead of being grouped more intentionally.

### Page-Level Observations

#### Page 1

- The intro page is not passive. It establishes account identity, draft saving, and upload attribution immediately.
- Parents are told that their Google account details will be recorded when files are uploaded and when the form is submitted.

#### Page 2 - Applicant Information

- Requires grade, boarding/daygirl status, learner name, learner identity number, and three uploads very early:
  - birth certificate
  - learner photograph
  - motivation letter to the Principal
- Each upload opens a Google file-insert layer and then the local file picker, creating repeated interruption.

#### Page 3 - Demographical Information

- Requires nationality, home language, race, religion, address, proof of residence, and emergency contact details.
- Another mandatory upload appears mid-flow.
- The parent cannot simply finish personal details first and upload later.

#### Page 4 - Family Information

- Requires household birth order, sibling/school relationship, previous Eunice association, and related-school application context.
- Important friction:
  - selecting `No` for sibling attendance still leaves the follow-up free-text question visible and marked required
  - this forces parents to type a workaround such as `N/A`
- This is a strong example of poor conditional logic in the current workflow.

#### Page 5 - Family Information (continued)

- Requires living arrangement and marital status.
- Includes a long, intimidating inline divorce/maintenance warning block inside the form itself.
- Includes a divorce-agreement upload field labelled `if applicable`.
- Compliance intent is understandable, but the placement and wording increase emotional and cognitive load.

#### Page 6 - Parent Details

- This is the heaviest section reached so far.
- Requires a full father profile and full mother profile on one page:
  - full names
  - identity numbers
  - cellphone numbers
  - email addresses
  - residential addresses
  - profession/employer details
  - parent ID uploads
  - proof-of-employment uploads
- The form mixes long-form parent data capture with four separate upload interruptions on the same page.
- Validation is strict:
  - clicking `Next` does not advance if required uploads are missing
  - the form highlights the specific missing upload block in red
- This confirms a very rigid, high-friction completion model.

### Strong Friction Signals

- Google sign-in is a hard gate before real progress starts.
- Identity and upload activity are tightly bound to the Google account.
- Draft saving is useful, but it does not offset the high entry friction.
- Upload handling is repetitive and interruptive.
- Conditional logic appears weak or inconsistently applied.
- Dense legal/compliance text is inserted directly into the middle of the application flow.
- Parent-detail capture is highly demanding and likely increases abandonment risk.

### Product Implications For Our Platform

- The future Eunice platform should separate:
  - account creation/sign-in
  - form completion
  - document upload
  - review and final submission
- Conditional logic must hide non-applicable follow-up questions cleanly.
- Documents should be staged deliberately:
  - light early uploads only if truly essential
  - grouped upload steps later with clearer progress
- Parent data for each guardian should be chunked more gently instead of presenting a single very dense dual-parent page.
- Legal and policy content should be surfaced contextually, not dropped as long warning blocks inside the primary completion flow.
- The system should support a lower-friction path than mandatory Google-authenticated Google Forms.
