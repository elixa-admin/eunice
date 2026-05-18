# Tomorrow's Sprint Plan (2 Sprints)

---

## Sprint 1: Validate & Ship (1.5 hours)

**Goal:** Confirm form → email pipeline works end-to-end.

### Tasks
1. Check Vercel deployment status (should be green with env vars active)
2. Fill form on https://eunice-blue.vercel.app with test data
3. Submit and verify email arrives at brandondienar@gmail.com within 30 seconds
4. Check email HTML renders correctly (no formatting issues)
5. Verify Supabase has the submitted row with all 102 fields populated
6. **If success:** Mark DONE. If failure: Debug GMAIL_APP_PASSWORD or Vercel logs

### Definition of Done
- Email arrives with full assessment data
- Supabase row complete and queryable
- No errors in Vercel function logs

---

## Sprint 2: Mobile & Stakeholder Ready (1.5 hours)

**Goal:** Form ready for real users (Eunice staff).

### Tasks
1. Test form on iPhone Safari (borrow device or use DevTools mobile emulation)
2. Test form on Android Chrome (old device if available)
3. Verify all sections are readable and scrollable on small screens
4. Verify form doesn't break on any device
5. Draft 1-paragraph completion instructions for Eunice staff
6. Create email template for respondent to see (what they'll receive as confirmation)
7. Test one full submission on mobile end-to-end

### Definition of Done
- Mobile tests pass (no layout breaking)
- Completion instructions clear enough for non-technical user
- Ready to share link with Eunice stakeholders

---

## Phase Transition
- **Phase 0 Closes:** When 1-2 real assessments returned from Eunice
- **Phase 1 Starts:** Design phase begins after responses analyzed (est. May 25)

---

## Success Metrics
| Sprint | Success Looks Like |
|--------|-------------------|
| 1 | Email in inbox, data in DB, no errors |
| 2 | Form works on mobile, stakeholders ready to respond |
