# Live Eunice Application Form Discovery Report
**Date:** 2026-05-22  
**Researcher:** Codex (live browser walkthrough)  
**Entry page:** [https://euniceps.co.za/about/applications/](https://euniceps.co.za/about/applications/)  
**Closed form:** [Grade 000 expression of interest](https://docs.google.com/forms/d/e/1FAIpQLSf7gZU3V-uTh1wtrdlSB0sR6_I_OZ2OPp4Ou0QO3TZbxKWSjQ/closedform)  
**Active form:** [2027 Application for Admission - Eunice Primary School for Girls](https://docs.google.com/forms/d/e/1FAIpQLSfwZMFasKBnwCtDeSr8drI-Pf3W0o0T-N10wfpzY7RWUTxZww/viewform)

## Executive Summary

The live Eunice primary-school admissions workflow is currently split across a public website checklist and a 13-page Google Form. The process is highly document-heavy, strongly compliance-oriented, and tightly coupled to a signed-in Google account.

The biggest product signals are:

1. The school gathers materially more information than our earlier lightweight MVP assumptions.
2. Document handling is central to the workflow, not a side attachment.
3. The current form mixes parent identity, guardian context, medical data, academic history, consent, and school-fee liability into one long journey.
4. A separate fee-payer or debtor concept exists and should be modeled explicitly.

## Live Entry Points

### Public applications page

The public page currently points parents to two different flows:

- A closed Grade 000 expression-of-interest form
- An active 2027 admissions Google Form

The page also publishes a document checklist before the parent starts:

1. Birth certificate or ID of learner
2. ID documents for parent, legal guardian, and debtor
3. Passport, study permit, or permanent residence document for non-South African applicants
4. Latest school report
5. Recent learner photograph
6. Proof of income, employment, SARS, or company registration documents where relevant
7. Medical aid card
8. Health profile or vaccination record
9. Divorce or custody order
10. Proof of residence
11. Motivation letter to the principal

### Closed Grade 000 form

The Grade 000 expression-of-interest form is currently closed and not accepting responses.

### Active 2027 admissions form

The active form is a live 13-page Google Form with draft-saving and file uploads tied to the signed-in Google account. The form warns parents that the name, email address, and profile photo linked to the Google account are recorded when files are uploaded and when the form is submitted.

## Confirmed Form Structure

### Page 1 of 13: Entry and account binding

- Introductory instructions
- Account-binding notice
- Required `Email` field

### Page 2 of 13: Applicant information

- Grade applying for
- Admission type: `Daygirl` or `Boarder`
- Full name and surname of applicant
- Identity number or study permit number
- Upload learner birth certificate
- Upload learner photograph
- Upload motivation letter to the principal

### Page 3 of 13: Applicant demographical information

- Nationality
- Home language
- Race
- Religion or denomination
- Residential address
- Upload proof of residence
- Emergency contact details

### Page 4 of 13: Family information

- Birth order or number of children in the family
- Whether the learner has a sister at Eunice Girls School
- Sister details if applicable
- Previous association with Eunice Girls School
- Whether another relative is applying to Eunice schools

Important current-form flaw:

- Some follow-up fields remain visible and effectively required even when the parent selects `No`
- Parents are forced to type a workaround such as `N/A`

### Page 5 of 13: Family information continued

- Who the applicant is living with
- Marital status
- Inline divorce and maintenance warning text
- Upload divorce agreement if applicable

### Page 6 of 13: Parent details

Father section:

- Full name and title
- Identity number
- Upload father ID
- Cellphone number
- Email address
- Residential address
- Profession, occupation, and employer
- Upload father proof of employment

Mother section:

- Full name and title
- Identity number
- Upload mother ID
- Cellphone number
- Email address
- Residential address
- Profession, occupation, and employer
- Upload mother proof of employment

### Page 7 of 13: Legal guardian

- Instruction to enter `N/A` if not applicable
- Legal guardian full name and title
- Legal guardian identity number

### Page 8 of 13: Medical information

- Medical aid name and number
- Main member name and contact number
- Upload medical aid card
- Upload immunisation record
- Doctor or healthcare provider name and contact number
- Chronic conditions or allergies
- Developmental and medical concern checklist
- Disability disclosure

### Page 9 of 13: Applicant academic performance

- Current school
- Upload most recent school report
- Current school address
- Previous schools attended and grades
- Repeated-grade question
- Repeated-grade detail if applicable
- Dexterity or handedness

### Page 10 of 13: Co-curricular activities

- Cultural activities
- Sporting activities
- Other interests
- Leadership positions

### Page 11 of 13: Consent

Required acknowledgements covering:

- Support team or therapy involvement
- School fees and terms
- Joint parent liability for fees and collection costs
- Truthfulness of supplied information
- Parent obligations and code of conduct
- Indemnity and emergency medical consent
- Hostel policy where relevant
- Media and publication notice

### Page 12 of 13: Terms and conditions

- Name and surname of person submitting the application
- Acknowledgement that demand exceeds available places and parents should apply elsewhere too
- Acknowledgement of school-fee liability

### Page 13 of 13: School finance

Separate fee-payer capture:

- Full name, surname, and title of person responsible for payment of school fees
- Identity number
- Relationship to applicant
- Cellphone number
- Email address

The form then exposes the final `Submit` button. The walkthrough stopped there and did not submit.

## Canonical Data Domains We Must Support

The live form confirms that our platform needs these data domains as first-class structures:

1. `application`
2. `applicant_profile`
3. `household`
4. `parent_one`
5. `parent_two`
6. `legal_guardian`
7. `medical_profile`
8. `academic_history`
9. `co_curricular_profile`
10. `consents`
11. `fee_payer`
12. `documents`

## Document Contract Implications

The school is not collecting a generic upload bundle. It is collecting named artifacts with review meaning. The initial product contract should account for at least:

- Learner birth certificate
- Learner photo
- Motivation letter
- Proof of residence
- Parent or guardian ID copies
- Proof of employment or income
- Medical aid card
- Immunisation or health record
- Most recent school report
- Fee-payer or debtor ID
- Residency permit documents for non-South African applicants
- Divorce or custody documentation where applicable

## Product Implications

### What should be different in our platform

1. Separate readiness from data capture.
2. Group document uploads more intentionally.
3. Use real conditional logic so irrelevant fields disappear.
4. Keep legal language available, but avoid burying parents in warning blocks mid-flow.
5. Treat fee-payer responsibility as a distinct model, not a loose note on the application.
6. Preserve a draft-safe journey without binding the workflow to a third-party Google identity.

### What this means for current implementation work

1. The parent flow should stay compressed into a smaller number of stages, but those stages must cover the real Eunice data shape.
2. The shared document contract should expand beyond the earlier minimal set.
3. Admin review must be able to distinguish missing, reviewable, and conditional documents.
4. The schema should reserve space for separate submitter, guardian, and fee-payer roles.
