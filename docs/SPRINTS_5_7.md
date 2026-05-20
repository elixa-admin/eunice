# Sprint Plan: Next Three Sprints While Waiting for Assessment Data

**Purpose:** Keep advancing the separate dev product surface and core workflow scaffolding while the assessment responses are still coming in.

**Principle:** Each sprint has two phases so we can keep the work shippable and reviewable in small pieces.

---

## Sprint 5: Dev Foundation + Preview Shell

**Goal:** Stabilize the separate dev surface so every future screen shares a common frame, route structure, and visual language.

### Phase 5.1: Preview Shell and Route Cohesion
- Build the shared preview shell used by `/dev`, `/dev/admin`, `/dev/parent`, and `/dev/application/[id]`
- Keep the dev routes clearly separate from the live assessment experience
- Ensure the top-level `/` route on the dev app points to the preview hub

### Phase 5.2: Navigation and Surface Polish
- Make route links consistent across the dev experience
- Improve the preview hub copy and structure so it reads as an intentional product workbench
- Verify the main preview paths open cleanly in Vercel

**Exit criteria:** A reviewer can land in the dev app and move between the preview hub, admin view, parent view, and application detail without confusion.

---

## Sprint 6: Application Model + Detail Views

**Goal:** Turn the preview into a believable admissions system by shaping the record model and the detail surfaces around it.

### Phase 6.1: Data Model Refinement
- Expand the preview application shapes to include the fields we already know we need
- Keep mock records aligned with the current requirements: parent info, learner info, documents, status, notes, and timeline
- Prepare the shape for later Supabase mapping

### Phase 6.2: Richer Application Detail
- Add stronger document and timeline presentation to the dev detail page
- Show clear status states for complete, incomplete, submitted, under review, accepted, and rejected
- Make the application detail page feel like the real unit of work for admissions staff

**Exit criteria:** The dev detail view tells the story of a real application without depending on backend data.

---

## Sprint 7: Admin Actions + Operational Readiness

**Goal:** Simulate the operational parts of admissions management so the admin flow feels like a real desk tool, not a static mockup.

### Phase 7.1: Admin Review Actions
- Add preview actions for status change, note-taking, and document verification states
- Surface the consequences of a review action clearly in the UI
- Keep everything safe and mock-driven

### Phase 7.2: Readiness Hardening
- Add a tighter empty/error-state story for the dev surface
- Verify route behavior, responsive layouts, and deploy stability
- Capture any remaining decisions needed before real backend work starts

**Exit criteria:** The admin preview is credible enough to discuss with stakeholders as a near-real operational workflow.

---

## What We Are Deliberately Not Doing Yet
- No live assessment form changes
- No production data migration
- No backend write actions
- No dependency on the assessment responses before the preview work can continue

---

## Immediate Next Implementation Targets
1. Finish the shared preview shell rollout
2. Expand the preview application model with one more realistic record set
3. Start the first admin action mock interactions
