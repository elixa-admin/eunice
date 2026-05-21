**Shared Direction**

This plan implements the integration and document-processing spec in high-value slices that are safe for MVP, useful in the `dev/` preview workspace, and extensible for future applications or data stores. The order below prioritizes immediate operational value for Eunice while leaving room for later workflow discoveries and additional integrations.

**Task 1: Upload Validation Foundation**

Goal

Create the first real document-ingestion foundation: allowed types, size rules, document-category rules, and storage-path conventions.

Context

The spec requires authoritative backend validation, structured document states, and future-safe storage and metadata. This is the highest-value first slice because it prevents bad uploads from contaminating the workflow and becomes the base for every later document feature.

Relevant files or references

- [docs/integrations-and-document-processing/spec.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/integrations-and-document-processing/spec.md:1)
- [docs/REQUIREMENTS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/REQUIREMENTS.md:1)
- [docs/ARCHITECTURE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/ARCHITECTURE.md:1)

Proposed approach

- Add a document-validation module that defines:
  - supported MIME/type rules
  - allowed extensions
  - file-size limits
  - document-category constraints
- Add a storage helper that generates deterministic storage paths by school, application, and document type.
- Define the initial document metadata shape used by both upload endpoints and admin review views.
- In the `dev/` preview workspace, reflect these states in mock data and UI copy so the workflow is visible before backend wiring is complete.

Acceptance criteria

- There is one authoritative place for upload rules.
- The design distinguishes client-side prechecks from backend validation.
- Storage path rules are documented and deterministic.
- The preview surface can represent invalid, accepted, and reupload-required document states.

Source reference

- `Requirements`
- `Design`
- `Invariants`
- `Error Behavior`

Verify

- Review the validation module and confirm every supported document type has explicit rules.
- Confirm invalid file states can be represented in the preview model and UI.
- Confirm storage paths are predictable from application and document metadata.

Out of scope

- OCR
- image-quality analysis
- live Supabase upload implementation

**Task 2: Admin Document Review Workflow**

Goal

Turn the `dev/` preview detail and admin views into a believable document-review tool with document-processing states, re-upload flags, and reviewer notes.

Context

The current preview has a stronger application model, but the document-review workflow still needs to better reflect the real operational pain points surfaced by Eunice: missing documents, unreadable scans, incomplete applications, and manual follow-up.

Relevant files or references

- [dev/app/dev/admin/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/admin/page.tsx:1)
- [dev/app/dev/application/[id]/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/application/[id]/page.tsx:1)
- [dev/lib/dev-preview-data.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/lib/dev-preview-data.ts:1)
- [docs/integrations-and-document-processing/spec.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/integrations-and-document-processing/spec.md:1)

Proposed approach

- Expand preview document states to include:
  - wrong format
  - too large
  - blurry
  - low confidence OCR
  - needs reupload
  - verified
- Add admin-side visual summaries for:
  - processing state
  - upload metadata
  - reviewer notes
  - open action needed
- Add safe mock actions for:
  - mark verified
  - request re-upload
  - override automated flag

Acceptance criteria

- The admin detail view tells a clear story for each document.
- The UI distinguishes between hard failures and soft review flags.
- The preview admin workflow looks credible enough to discuss with stakeholders.

Source reference

- `Document state model`
- `Admin review surface`
- `Decisions`

Verify

- Open the preview routes and confirm a reviewer can identify what is missing, what is blocked, and what can proceed.
- Confirm mock applications cover multiple document problem states.

Out of scope

- live backend writes
- OCR engine execution

**Task 3: Parent Re-Upload and Upload Guidance Flow**

Goal

Design and implement the parent-facing upload and re-upload experience around the new validation and quality states.

Context

A large portion of Eunice’s admissions friction comes from poor or missing uploads. The parent experience must explain issues clearly and guide recovery without technical language.

Relevant files or references

- [docs/PROJECT_BRIEF.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/PROJECT_BRIEF.md:1)
- [docs/REQUIREMENTS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/REQUIREMENTS.md:1)
- [dev/app/dev/parent/page.tsx](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/app/dev/parent/page.tsx:1)
- [docs/integrations-and-document-processing/spec.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/integrations-and-document-processing/spec.md:1)

Proposed approach

- Add parent-facing document states and guidance copy to the preview.
- Show what happens when:
  - a file is unsupported
  - a document is blurry
  - a required item is missing
  - re-upload is required
- Include explicit next-step messaging and progress impact in the parent UI.

Acceptance criteria

- The parent preview clearly explains document problems in plain language.
- Re-upload-required states are visible and understandable without admin intervention.
- The design reduces ambiguity around what the parent must do next.

Source reference

- `Client upload gate`
- `Workflow routing`
- `Error Behavior`

Verify

- Review parent preview screens and confirm each blocked or soft-failed document state has a clear user-safe explanation.
- Confirm the preview can express both “continue later” and “cannot submit yet” cases.

Out of scope

- actual upload widget implementation
- live storage

**Task 4: OCR and Quality Processing Adapter Skeleton**

Goal

Define and scaffold the internal processing interfaces for OCR and quality checks without yet committing to a full production worker runtime.

Context

The spec intentionally separates the admissions workflow from processing engines. Before running real OCR, the codebase needs stable interfaces that can later call Tesseract, OCRmyPDF, OpenCV, or PaddleOCR without entangling feature code.

Relevant files or references

- [docs/integrations-and-document-processing/spec.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/integrations-and-document-processing/spec.md:1)
- [docs/ARCHITECTURE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/ARCHITECTURE.md:1)

Proposed approach

- Add interface contracts for:
  - file validator
  - quality analyzer
  - OCR adapter
  - processing-result mapper
- Define structured result objects for:
  - pass/fail state
  - confidence
  - retryability
  - user-facing summary
  - admin-facing detail
- Keep the initial implementation mock or no-op where real engine execution is not yet appropriate.

Acceptance criteria

- There is a clean contract boundary between admissions workflow code and document-processing engines.
- Future OCR or quality tools can be swapped without rewriting feature code.
- The result shape is rich enough for both parent and admin UI needs.

Source reference

- `Suggested implementation structure`
- `Open-source-first tooling choices`
- `Error Behavior`

Verify

- Review interfaces and confirm they can support Tesseract, OCRmyPDF, or a future PaddleOCR adapter.
- Confirm result objects cover both success and failure states from the spec.

Out of scope

- production OCR execution
- performance tuning

**Task 5: Integration Registry and Future Data Store Boundary**

Goal

Create the first integration registry and adapter pattern so future systems or data stores can be added safely as the workflow becomes clearer.

Context

The user has explicitly stated that more applications or data stores may be introduced later. This makes the integration boundary a high-value early architecture task, even if only Supabase and Resend are active today.

Relevant files or references

- [docs/integrations-and-document-processing/spec.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/integrations-and-document-processing/spec.md:1)
- [docs/ARCHITECTURE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/ARCHITECTURE.md:1)

Proposed approach

- Define an integration registry pattern with adapter interfaces for:
  - storage
  - email
  - future messaging
  - future external school systems
  - future analytics/export sinks
- Add configuration shape for school-level integration settings.
- Keep the first implementation simple and local to the app codebase.

Acceptance criteria

- The project has a documented and code-level pattern for adding new integrations.
- Feature code does not need to know integration implementation details directly.
- The architecture can absorb future systems without destabilizing the admissions workflow.

Source reference

- `Recommended system boundaries`
- `integration_connections`
- `Decisions`

Verify

- Review adapter interfaces and confirm a second datastore or external system could be added without rewriting the upload/review flow.
- Confirm current managed services still fit naturally inside the new pattern.

Out of scope

- implementing every future integration
- multi-tenant rollout mechanics

**Recommended Sprint Sequence**

1. Sprint A: Upload Validation Foundation + Admin Document Review Workflow
   - highest immediate value because it addresses document pain and makes the admin preview more operational
2. Sprint B: Parent Re-Upload and Upload Guidance Flow + OCR/Quality Adapter Skeleton
   - improves parent success rate while preparing the backend contracts
3. Sprint C: Integration Registry and Future Data Store Boundary
   - solidifies the extensibility layer once the core document workflow is modeled

**Why this order**

- It delivers visible stakeholder value early.
- It keeps us working from real Eunice pain points, especially document handling.
- It avoids prematurely wiring heavy OCR or integration infrastructure before the workflow is better understood.
- It preserves flexibility for later additions as more discovery input arrives.
