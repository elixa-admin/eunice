**What**

This spec defines the integration architecture and document-processing strategy for the Eunice admissions platform, with a focus on safe document uploads, flexible downstream integrations, and free/open-source-first tooling. The system must validate uploaded documents before they enter the admissions workflow, detect wrong formats and low-quality scans early, support OCR-assisted review, and remain extensible as additional school applications, third-party services, and data stores are introduced over time.

**Context**

The project brief and architecture already position Eunice as a workflow-heavy, document-centric admissions system built on Next.js, Supabase, Vercel, and Resend. Today, the main operational pain points include fragmented document handling, repeated manual follow-up, missing or unreadable uploads, and low workflow visibility. The current codebase has a dedicated `dev/` preview surface for product exploration, but it does not yet define the real document-processing architecture or the integration boundaries required for future systems. The existing references are [docs/ARCHITECTURE.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/ARCHITECTURE.md:1), [docs/REQUIREMENTS.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/REQUIREMENTS.md:1), [docs/PROJECT_BRIEF.md](/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/PROJECT_BRIEF.md:1), and the current preview model in [dev/lib/dev-preview-data.ts](/Users/brandondienar/Documents/Codex/Projects/Eunice/dev/lib/dev-preview-data.ts:1).

**Requirements**

1. The system must enforce allowed upload formats for admissions documents before they enter the application workflow.
2. The system must validate file type using file content or trusted backend detection, not filename extension alone.
3. The system must support a configurable set of required document types per workflow or school.
4. The system must identify and stop obviously invalid uploads, including unsupported formats, oversize files, and corrupted files.
5. The system must detect low-quality image-based uploads such as blurry or unreadable documents and route them to re-upload or manual review.
6. The system must support OCR-assisted extraction for uploaded images and scanned PDFs using free/open-source tools where practical.
7. The system must record document-processing outcomes as structured status and metadata that admins can review.
8. The system must allow admissions staff to manually override automated document-quality or OCR flags.
9. The system must preserve the raw uploaded file and a normalized processing record for auditability.
10. The integration architecture must support additional future applications and data stores without forcing a rewrite of the core admissions workflow.
11. The architecture must prefer managed services already adopted by the project, while using open-source processing tools where local or server-side execution is viable.
12. The design must remain safe to operate during MVP, avoiding heavy infrastructure such as Kubernetes, custom queues, or multi-service orchestration unless clearly required.

**Design**

The design introduces a staged document-ingestion and processing pipeline with explicit integration boundaries.

Core stages:

1. Client upload gate
   - The parent portal accepts only supported document categories and file formats.
   - The UI enforces basic constraints early: allowed extensions, max file size, and required file presence before final submission.
   - This stage improves user feedback but is not authoritative.

2. Backend intake validation
   - The upload endpoint re-validates type, size, and declared document category on the server.
   - File type detection is performed using content-aware detection instead of trusting filename suffixes.
   - Valid raw files are stored in Supabase Storage using a deterministic path convention.
   - A document-processing record is created immediately after successful intake.

3. Document-processing pipeline
   - A lightweight processor inspects the file and writes structured results.
   - The pipeline runs checks in this order:
     - file format validation
     - file readability / corruption check
     - image or PDF quality assessment
     - OCR pass when the file is image-based or scanned
     - basic content heuristics for future document classification
   - Processing results are stored as metadata on the document and optionally in a separate processing-job table for traceability.

4. Workflow routing
   - Hard-stop failures block the document from being accepted into the submission-ready workflow.
   - Soft quality failures allow the document to exist but mark it for re-upload or manual review.
   - OCR or content-confidence issues create flags rather than hard rejection.

5. Admin review surface
   - The admin application detail page shows each document’s processing state, upload metadata, OCR confidence summary, and reviewer notes.
   - Admins remain the final authority for document acceptance.

Recommended system boundaries:

- `Application service`
  - Owns application lifecycle, parent progress, and workflow states.
- `Document service`
  - Owns upload validation, storage pathing, processing-state metadata, and review flags.
- `Integration adapters`
  - Own external service connections such as email, future WhatsApp, future SIS/ERP, and future analytics sinks.
- `Processing workers`
  - Own OCR, quality analysis, and derived metadata generation.

Proposed data additions:

- `documents`
  - add `mime_type`
  - add `upload_status`
  - add `quality_status`
  - add `ocr_status`
  - add `ocr_confidence`
  - add `processing_summary`
  - add `reupload_required`
  - add `review_notes`

- `document_processing_jobs`
  - `id`
  - `document_id`
  - `job_type` (`validate`, `quality_check`, `ocr`, `classification`)
  - `status` (`queued`, `running`, `passed`, `failed`, `manual_review`)
  - `started_at`
  - `finished_at`
  - `error_code`
  - `error_message`
  - `result_json`

- `integration_connections`
  - `id`
  - `school_id`
  - `integration_type`
  - `status`
  - `config_json`
  - `last_sync_at`

Document state model:

- `accepted`
  - correct type, valid file, no blocking issues
- `wrong_format`
  - unsupported or mismatched file type
- `too_large`
  - exceeds configured size limit
- `corrupted`
  - unreadable binary or parse failure
- `blurry`
  - image quality below threshold
- `low_confidence_ocr`
  - OCR completed but confidence is too low for trust
- `needs_reupload`
  - user action required before review can proceed
- `manual_review`
  - admin must inspect and decide
- `verified`
  - admissions team approved the document

Suggested implementation structure:

- `src/lib/documents/validation.ts`
  - allowed file types, size rules, category rules
- `src/lib/documents/storage.ts`
  - path generation, storage upload helpers
- `src/lib/documents/processing/`
  - quality checks
  - OCR adapters
  - processing result mapper
- `src/lib/integrations/`
  - integration registry
  - adapter interfaces
  - school-specific connection configs
- `src/app/api/documents/route.ts` or equivalent upload endpoint
  - authoritative validation entrypoint

Open-source-first tooling choices:

- File-type detection
  - `file-type` in Node for content-aware MIME/type detection
- Image metadata and normalization
  - `sharp`
- Image quality heuristics
  - `OpenCV`
  - Use practical heuristics such as blur scoring, contrast/readability thresholds, and rotation/preprocessing support
- OCR for images
  - `Tesseract OCR` as the default MVP engine
- OCR for scanned PDFs
  - `OCRmyPDF` as the default PDF OCR wrapper
- Optional future OCR upgrade
  - `PaddleOCR` if accuracy requirements exceed Tesseract and the added runtime cost is justified

Suggested sprint sequence for highest-value delivery:

1. Upload validation and storage hardening
   - deliver strict file gating, storage pathing, and document metadata
2. Document-quality checks and re-upload workflow
   - deliver blur/readability checks and better parent/admin handling of unclear scans
3. OCR-assisted review
   - deliver searchable text extraction and admin-facing OCR summaries
4. Integration registry and adapter layer
   - deliver a reusable pattern for future systems and data stores
5. Content heuristics and advanced classification
   - deliver smarter flags once real document samples and workflows are better understood

**Decisions**

1. Choice: Use a staged document pipeline instead of validating everything only at upload time.
   - Alternatives considered: single-step upload validation; fully synchronous OCR before storing.
   - Why this choice: it separates hard-stop rules from softer review logic and keeps the architecture extensible.
   - Reversible: partially. The internal stages can change later, but the concept of intake plus processing should remain.

2. Choice: Keep admins as the final authority for document verification during MVP.
   - Alternatives considered: full automatic accept/reject; OCR-driven autonomous document validation.
   - Why this choice: school documents are messy, variable, and high-stakes; human review remains safer and more realistic.
   - Reversible: yes.

3. Choice: Prefer `Tesseract` and `OCRmyPDF` first, with `PaddleOCR` as a later upgrade path.
   - Alternatives considered: start with PaddleOCR; use paid OCR APIs; defer OCR entirely.
   - Why this choice: Tesseract and OCRmyPDF are free, mature, and good enough for MVP assistive workflows while keeping infrastructure simple.
   - Reversible: yes.

4. Choice: Introduce an explicit integration layer even before all integrations exist.
   - Alternatives considered: directly embedding Supabase, Resend, and future connectors into feature code.
   - Why this choice: the user has already identified likely future additions of applications and data stores; an adapter boundary reduces future refactoring cost.
   - Reversible: yes, but costly to remove once multiple integrations rely on it.

5. Choice: Treat poor-quality documents as guided re-upload or manual-review cases, not silent failures.
   - Alternatives considered: accept everything; reject everything with low confidence.
   - Why this choice: it balances user progress, admin workload, and operational safety.
   - Reversible: yes.

6. Assumption: The MVP will run document validation and OCR in a lightweight server-side or worker context compatible with the existing Vercel/Supabase architecture, while allowing heavier processing strategies to be introduced later if needed.

7. Assumption: More school systems or workflow-specific data stores may be added over time, so the spec treats integrations as a first-class architectural concern rather than a later add-on.

**Versions**

- `Tesseract OCR`
  - Use the current stable open-source engine from the official project.
  - Source: [Tesseract docs](https://tesseract-ocr.github.io/) and [GitHub](https://github.com/tesseract-ocr/tesseract)
- `OCRmyPDF`
  - Use the current stable release for PDF OCR processing.
  - Source: [OCRmyPDF docs](https://ocrmypdf.readthedocs.io/)
- `PaddleOCR`
  - Treat as an optional later upgrade path if adopted.
  - Source: [PaddleOCR docs](https://www.paddleocr.ai/main/en/index/index.html) and [GitHub](https://github.com/PaddlePaddle/PaddleOCR)
- `OpenCV`
  - Use current stable OpenCV bindings appropriate to the chosen runtime.
  - Source: [OpenCV docs](https://docs.opencv.org/)
- `file-type`
  - Use current npm release compatible with the project’s Node/Next runtime.
  - Source: [npm file-type](https://www.npmjs.com/package/file-type)
- `sharp`
  - Use current npm release compatible with the project’s Node/Next runtime.
  - Source: [npm sharp](https://www.npmjs.com/package/sharp)

**Invariants**

1. Unsupported document formats must never quietly enter the review workflow as if they were valid.
2. Raw uploaded files must remain traceable to the application, document type, and uploader.
3. Automated OCR or quality scoring must never replace human review as the final decision-maker during MVP.
4. The architecture must continue to work if a second application surface or external datastore is added later.
5. Parent-facing upload validation must be mirrored by authoritative backend validation.

Checks:

- upload invalid files and confirm they are blocked
- upload low-quality but supported files and confirm they are flagged, not silently accepted
- verify document metadata persists even when OCR or quality analysis fails
- verify admin review screens can display processing outcomes without requiring raw OCR internals

**Error Behavior**

- Wrong format
  - Return a user-safe validation error and block upload acceptance.
- Oversize file
  - Return a user-safe validation error and block upload acceptance.
- Corrupted file
  - Store no accepted document record; return actionable re-upload guidance.
- Quality-check failure
  - Mark document as `manual_review` or `needs_reupload` depending on severity.
- OCR engine failure
  - Preserve the upload, mark OCR as failed, and allow manual review.
- Processing timeout
  - Preserve the upload, mark job as failed or retryable, and do not block admin visibility.
- Integration adapter unavailable
  - Fail only the dependent integration path; do not corrupt the core admissions record.

Error responses should be brief, parent-friendly, and non-technical on the frontend, while full diagnostics should be stored in structured logs or job records for admin and developer review.

**Testing Strategy**

1. Unit tests
   - file-type validation
   - size-limit validation
   - storage path generation
   - processing-result mapping to document states

2. Integration tests
   - upload valid PDF/JPG/PNG and confirm accepted metadata
   - upload unsupported format and confirm rejection
   - upload blurry or low-quality sample and confirm flag state
   - run OCR pipeline on sample PDF/image and confirm metadata is written

3. Manual tests
   - test on mobile upload flows
   - test parent-facing re-upload messaging
   - test admin review visibility for document flags
   - test realistic school documents with varied scan quality

4. Future acceptance dataset
   - maintain a small internal sample pack of real-world anonymized document cases
   - use it to compare OCR and quality-check performance as the workflow evolves

**Out of Scope**

- Full automatic document acceptance or rejection without human review
- Paid OCR or document-intelligence APIs as the default MVP path
- Virus scanning, anti-malware, or content-security scanning beyond format and corruption checks
- Final school-specific workflow rules for every document type before more discovery input is available
- Full SIS/ERP integrations before the core adapter pattern is established
- Multi-tenant implementation details beyond ensuring the design supports future school-specific integration settings
