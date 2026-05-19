# Assessment Form Healthcheck & Next Sprint Plan

**Date:** 2026-05-18  
**Status:** Pre-production (email delivery pending)

---

## Healthcheck Summary

### ✅ Coverage Audit

**Form Sections (9 total):**
1. School Information (4 required + 4 optional fields)
2. Parent Access Channels (7 checkboxes)
3. Information Collected (7 checkboxes + 1 freetext)
4. Document Issues (8 checkboxes)
5. Application Storage (5 checkboxes)
6. Improvement Areas (9 checkboxes)
7. Current Tools (6 checkboxes + 1 freetext)
8. Future Features (8 checkboxes)
9. Additional Details (11 textfields + 2 signoff fields)

**Total Data Points Captured:** 102

### Database Alignment

All 102 form fields are mapped to Supabase `discovery_assessments` table columns:
- Text fields: 18 (process, naming, comments, wishlist, etc.)
- Boolean fields: 84 (all checkboxes)
- Timestamp fields: 2 (signoff_date, auto created_at)

### ✅ Strengths

1. **Comprehensive scope** — Covers workflow, pain points, stakeholders, tools, and future vision
2. **Multi-choice + freetext** — Allows both structured and narrative data
3. **Role mapping** — Captures who does what (initial review, verification, approval, comms)
4. **Third-party identification** — Captures external stakeholders needing notifications
5. **Constraints capture** — Asks about infrastructure/budget limits (critical for design)
6. **Future roadmap input** — Gets stakeholder buy-in on system priorities

### ⚠️ Potential Gaps (Assessment-Only Scope)

The form is **discovery-focused** and comprehensive *for that phase*. However, before Phase 2 (MVP build), these should be validated:

| Gap | Impact | Mitigation |
|-----|--------|-----------|
| No document type specificity | May not know required docs upfront | Covered by "info_other" + initial interview |
| No capacity planning (applicants/day) | Could affect system load design | Covered by "apps_per_year" |
| No current system name/license | May affect integration strategy | Covered by "tool_other" |
| No current failure/escalation process | Could cause workflow gaps | Covered by "issue_contact" + "process_description" |
| No budget/timeline confirmation | Risk to MVP scope | Out of scope for discovery (Phase 0) |

**Verdict:** These gaps are *intentional* — they're Phase 1 (Design) or Phase 2 (Dev) questions, not Phase 0.

---

## Current Technical State

### Working
- ✅ Form submission to Supabase
- ✅ Multi-section progressive disclosure UI
- ✅ All 102 fields mapped to database
- ✅ Dark text on light background (readable)
- ✅ Git workflow (commits pushing to main)
- ✅ Vercel deployment pipeline
- ✅ nodemailer dependency added

### Pending
- ⏳ Email delivery test (GMAIL_USER + GMAIL_APP_PASSWORD env vars added, awaiting redeploy)
- ⏳ Vercel redeploy with env vars active

### Testing Status
- Manual form fill: Incomplete (field visibility fixed, but full submission not tested end-to-end with email)
- Mobile test: Not done
- Old Android device test: Not done

---

## Next Sprint Plan (Day 2 — Tomorrow)

### Sprint Goal
Validate form submission flow end-to-end, fix any delivery issues, and prepare for stakeholder testing.

### Tasks

**1. Email Delivery Validation (1 hour)**
   - [ ] Wait for Vercel redeploy to complete
   - [ ] Test form submission on eunice-blue.vercel.app
   - [ ] Verify email arrives at brandondienar@gmail.com
   - [ ] Check admin email HTML formatting + readability
   - [ ] Check confirmation email to respondent's email
   - **If success:** Move to next task
   - **If failure:** Debug Vercel logs, check GMAIL_APP_PASSWORD is correct

**2. Form UX Polish (1 hour)**
   - [ ] Test on mobile (iPhone + Android)
   - [ ] Test on old Android device (3G if possible)
   - [ ] Verify form is fully visible on small screens
   - [ ] Test back/next navigation across all sections
   - [ ] Check that all text is readable (dark gray/black on white)

**3. Test Data Review (30 min)**
   - [ ] Complete form with realistic Eunice data (copied from handoff docs if available)
   - [ ] Verify submitted data in Supabase matches form input
   - [ ] Check email contains all key fields (no null/undefined values visible)

**4. Stakeholder Prep (30 min)**
   - [ ] Generate shareable link (eunice-blue.vercel.app/assessment or custom domain)
   - [ ] Create simple instructions for Eunice staff to complete form
   - [ ] Document submission confirmation (what they'll see + email they'll receive)

**5. Phase 1 Handoff Prep (30 min)**
   - [ ] Export sample submission from Supabase (for design reference)
   - [ ] Document any field clarifications needed from Eunice before MVP design
   - [ ] List open questions for design phase (e.g., required document types, SLA for decisions)

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| Email doesn't deliver (Gmail auth fails) | Medium | Blocks testing | Check Vercel logs, verify password character-for-character |
| Mobile form breaks (small screen) | Medium | Poor UX for future users | Test on actual devices tomorrow |
| Supabase capacity (100+ submissions) | Low | Data loss risk | Not a Phase 0 issue; validate in Phase 2 |
| Stakeholder confusion about form scope | Low | Scope creep | Provide clear instructions + success criteria email |

---

## Success Criteria (End of Day 2)

- [x] Form deployed to Vercel with working submission
- [ ] Email successfully delivers to brandondienar@gmail.com with full data
- [ ] Form is readable on mobile devices
- [ ] Sample data in Supabase verified
- [ ] Stakeholder ready to complete real assessment

---

## Phase 1 Preview (Design Phase)

Once Phase 0 closes (assessments returned):

1. **Analyze responses** — Identify workflow patterns, pain points, priorities
2. **Design parent portal** — Wireframes for signup, application form, status tracking, document upload
3. **Design admin dashboard** — List view, detail view, status updates, email templates
4. **Define data model** — Applications, learners, documents, communications
5. **Get stakeholder sign-off** — On scope, timeline, and design approach

---

**Next Action:** Complete redeploy with env vars, run end-to-end test, and report results in morning standup.
