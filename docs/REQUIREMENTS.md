# Functional & Technical Requirements

## Parent Portal Requirements

### User Flows

#### Authentication
- **Signup** — Parent creates account with email, password
  - Email verification before activation
  - Optional: Phone number for SMS (future)
  
- **Login** — Parent logs in with email/password
  - Session persistence (remember me option)
  - Password reset via email

#### Application Creation
- **Start New Application** — Parent initiates application
  - Auto-generate unique application reference number
  - Show welcome/checklist of required information
  
- **Application Form (Multi-step)**
  - Step 1: Parent Information (name, email, phone, address)
  - Step 2: Learner Information (name, DOB, previous school, etc.)
  - Step 3: Academic Details (current grades, special needs, interests)
  - Step 4: Document Uploads
  - Step 5: Review & Submit
  
  Features:
  - Progress indicator (show current step, steps remaining)
  - Save & return (draft mode, resume later)
  - Form validation (required fields, email format, etc.)
  - Clear help text / instructions for each field
  - Mobile-friendly input (date pickers, dropdowns)

#### Document Upload
- **Upload Interface**
  - Drag & drop OR file picker
  - Show required documents checklist
  - Required documents: birth certificate, previous school report, proof of residence, ID copy
  - File validation: accepted formats (PDF, JPG, PNG), max file size (5MB per file)
  - Upload progress indicator
  - Show uploaded documents with delete option (before submission)

#### Application Review
- **Review & Submit**
  - Display all entered information for review
  - Show all uploaded documents with thumbnails
  - Final confirmation before submission
  - Submit button launches application
  - Submission acknowledgement (display application reference number)

#### Status Tracking
- **Application Status Page**
  - Show current status (pending, incomplete, submitted, under_review, accepted, rejected)
  - Show date submitted
  - Show documents uploaded with verify status (✓ verified, ⏳ pending review, ✗ not accepted)
  - Flag missing documents (if status = "incomplete")
  - Timeline of status changes (when submitted, when under review, when decision made)
  
- **Notifications**
  - Show in-app notification badge
  - Link to email communications

#### Communication History
- **Messages Dashboard**
  - View all communications from school
  - Types: acknowledgement, missing document reminder, status update, decision notification
  - Show date, sender, content, action items
  - Link to re-upload documents (if flagged as missing)

---

## Admin Dashboard Requirements

### User Flows

#### Authentication
- **Admin Login**
  - Email + password
  - Admin users created/managed by principal or system admin
  - Role-based access (admissions officer, principal, eventually multi-school admin)

#### Application Management
- **Application List**
  - Display all applications in a table
  - Columns: Reference number, Parent name, Learner name, Status, Submitted date, Last updated
  - Filters:
    - By status (pending, incomplete, submitted, under_review, accepted, rejected)
    - By submission date range
    - By search (parent name, learner name, email, phone)
  - Sorting: By reference number, date submitted, status, last updated
  - Pagination (50 per page)
  - Quick actions: View, email, change status
  - Bulk operations (future): batch status change, bulk email

#### Application Detail View
- **Full Application Card**
  - Parent information (name, email, phone, address)
  - Learner information (name, DOB, previous school, grades)
  - Application metadata (reference number, submitted date, current status)
  - Document section (list of uploaded documents with file names, upload dates)
  - Status history (timeline of all status changes, who changed, when)
  - Notes section (internal admin notes)

#### Document Review
- **Document Viewer**
  - Preview uploaded documents (PDF viewer, image viewer)
  - Show file metadata (name, upload date, file size)
  - Mark as verified/not-accepted
  - Categorize documents (birth cert, report, etc.)
  - Add verification notes

#### Status Management
- **Update Application Status**
  - Current status display
  - Dropdown to select new status
  - Automatic email trigger on status change:
    - Status → "incomplete": Send "missing documents" reminder email
    - Status → "accepted": Send acceptance email
    - Status → "rejected": Send rejection email
  - Confirmation: "Confirm status change to [X]? Email will be sent."
  - Status change history logged (who changed, when, to what)

#### Communications
- **Reminder Emails**
  - View email template for each status
  - Trigger reminder email manually (for specific application)
  - Bulk trigger (all applications with status "incomplete" and submitted >7 days ago)
  - Email history (show what was sent, when, to whom, delivery status)

#### Notes & Collaboration
- **Internal Notes**
  - Add timestamped notes on application (admin-only, not visible to parent)
  - Show note author
  - Edit/delete own notes (not others)
  - Use case: "Flagged for principal review", "Parent called, additional docs coming Monday"

#### Reporting & Export
- **Data Export**
  - Export all applications to CSV (columns: ref #, parent name, learner name, email, status, documents, submitted date)
  - Filter before export (by status, date range, etc.)
  - Export includes: parent info, learner info, status, submission date, document names
  
- **Dashboard Metrics** (future, Phase 4)
  - Total applications received
  - Applications by status (pending, incomplete, submitted, under_review, accepted, rejected)
  - Average time to completion
  - Documents submitted vs. incomplete
  - Email delivery success rate

---

## Communication Requirements

### Email Templates (Resend)

1. **Submission Acknowledgement**
   - Triggered: On application submit
   - Content: Application reference number, thank you message, next steps, status tracking link
   - Recipient: Parent email

2. **Missing Document Reminder**
   - Triggered: On status → "incomplete" OR manually by admin
   - Content: Which documents are missing, deadline for submission, link to re-upload, urgency
   - Recipient: Parent email

3. **Status Update Notification**
   - Triggered: On status → "under_review"
   - Content: Application received and being reviewed, no action needed, timeline expectation
   - Recipient: Parent email

4. **Final Decision Notification**
   - Triggered: On status → "accepted" OR "rejected"
   - Content: Decision, next steps (if accepted: dates/deadlines; if rejected: appeal info)
   - Recipient: Parent email

### Email Features
- Professional, clear, mobile-friendly design
- Include application reference number in every email
- Include link to application status page
- Plain text + HTML fallback
- Unsubscribe link (required by email standards)
- Delivery tracking (logged in communications table)

### Future: WhatsApp Integration
- Same messages but via WhatsApp (Phase 4)
- Parent opts into WhatsApp notifications
- Shorter, conversational format

---

## Document Management Requirements

### Storage
- Documents stored in Supabase Storage (S3-compatible)
- Folder structure: `/school/[school_id]/applications/[application_id]/[document_type]/`
- File naming: `[document_type]_[timestamp].[ext]`
- Secure: only parent and assigned admin can access their documents

### Document Types (Mandatory)
- Birth certificate
- Previous school report card
- Proof of residence
- Parent ID/passport copy

### File Validation
- Accepted formats: PDF, JPG, PNG
- Max file size: 5 MB per file
- Max files per application: 20
- Virus scan (future, Phase 4)

### Audit Trail
- Track: who uploaded, when, file size, format
- Track: who accessed (viewed), when
- Track: who marked as verified, when
- Delete audit (soft delete, keep audit trail)

---

## Data Model

### Applications Table
```
applications
├── id (UUID, PK)
├── school_id (FK → schools)
├── parent_id (FK → users)
├── learner_id (FK → users)
├── reference_number (unique string, e.g., "EUNICE-2024-001")
├── status (enum: pending, incomplete, submitted, under_review, accepted, rejected)
├── created_at (timestamp)
├── updated_at (timestamp)
├── submitted_at (timestamp, nullable)
├── notes (text)
```

### Users Table
```
users (Supabase Auth + custom fields)
├── id (UUID, PK from Auth)
├── email
├── first_name
├── last_name
├── phone (nullable)
├── address
├── role (enum: parent, admin, principal, superadmin)
├── school_id (FK → schools)
├── created_at
```

### Documents Table
```
documents
├── id (UUID, PK)
├── application_id (FK → applications)
├── document_type (enum: birth_cert, school_report, proof_residence, id_copy, other)
├── file_path (path in Supabase Storage)
├── file_name (original uploaded name)
├── file_size (bytes)
├── verified_at (timestamp, nullable)
├── verified_by (FK → users, nullable)
├── uploaded_at (timestamp)
├── deleted_at (timestamp, nullable, soft delete)
```

### Communications Table
```
communications
├── id (UUID, PK)
├── application_id (FK → applications)
├── type (enum: acknowledgement, reminder, status_update, decision)
├── sent_at (timestamp)
├── recipient_email
├── subject
├── template_used
├── delivery_status (sent, failed, bounced)
├── delivery_error (nullable, if failed)
```

### Statuses Table
```
status_history
├── id (UUID, PK)
├── application_id (FK → applications)
├── old_status
├── new_status
├── changed_by (FK → users, admin who changed it)
├── changed_at (timestamp)
├── reason (nullable, text)
```

---

## Security & Privacy Requirements

### Authentication
- Supabase Auth (email/password)
- Session-based (JWT tokens)
- HTTPS everywhere (Vercel default)
- Email verification required for signup

### Authorization
- Row-level security (RLS) on all tables
- Parents can only access their own applications
- Admins can access all applications at their school
- Principals can access all + see admin logs
- No cross-school access (school_id partition)

### Data Protection
- Encrypt documents at rest (Supabase default)
- Encrypt in transit (HTTPS)
- No unencrypted sensitive data in logs
- PII handling: GDPR-compliant (data retention, deletion, export)
- POPIA compliance (South African privacy law)

### Audit Trail
- Log all data access (who viewed what, when)
- Log all document uploads/deletions
- Log all status changes
- Log all admin actions (email sent, notes added)
- Retain audit logs for ≥1 year

### File Validation
- File type validation (PDF, JPG, PNG only)
- File size limits enforced
- Filename sanitization (prevent path traversal)
- Virus scanning (future, Phase 4)

---

## Performance Requirements

### Page Load Times
- Parent portal home: <3 seconds on 3G (poor connectivity)
- Admin dashboard: <2 seconds on good connectivity
- Document upload: <5 seconds for 5MB file on 3G

### Device Compatibility
- Mobile: iOS 12+, Android 5.0+ (older devices supported)
- Desktop: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Responsive: mobile, tablet, desktop

### Database
- Support ≥1,000 concurrent users (Phase 3-4)
- Query response time <500ms for all endpoints
- No N+1 queries

### Uptime
- Target: 99.9% uptime (4 hours downtime/year)
- No maintenance downtime during admissions period
- Graceful degradation (if email fails, application still works)

---

## Compliance Requirements

### Data Protection
- GDPR compliance (if EU users)
- POPIA compliance (South African privacy law)
- Data minimisation (only collect necessary data)
- Right to deletion (parents can request data deletion)
- Data export (parents can request their data in exportable format)

### Educational Compliance
- Schools act (South African)
- Admissions policy compliance (per school)
- Student data protection (no public student lists)

### Accessibility
- WCAG 2.1 Level AA (web accessibility)
- Mobile-first responsive design
- Keyboard navigation support
- Screen reader support

---

## Success Criteria (MVP)

### Functional
- [ ] All parent portal features work end-to-end
- [ ] All admin dashboard features work end-to-end
- [ ] Email communications send reliably
- [ ] Documents upload and retrieve correctly
- [ ] Status changes trigger correct emails
- [ ] Data exports include all required fields
- [ ] Search and filtering work correctly
- [ ] Save-and-return works on all devices

### Performance
- [ ] Page load times meet requirements
- [ ] Works reliably on older Android devices
- [ ] Works on poor (3G/4G) connectivity
- [ ] No timeout errors
- [ ] Responsive on mobile, tablet, desktop

### Security
- [ ] Authentication required for all pages
- [ ] Parents can only access own applications
- [ ] Admins can only access school's applications
- [ ] Data encrypted in transit (HTTPS)
- [ ] No sensitive data in logs
- [ ] File uploads validated (type, size)

### User Experience
- [ ] Parent process takes <10 minutes to complete
- [ ] Admin can find application in <30 seconds
- [ ] Mobile experience feels native and responsive
- [ ] Instructions are clear and helpful
- [ ] Error messages are clear and actionable

### Reliability
- [ ] Zero data loss during MVP
- [ ] Email delivery success >99%
- [ ] Uptime >99.9% during pilot
- [ ] No unplanned downtime
