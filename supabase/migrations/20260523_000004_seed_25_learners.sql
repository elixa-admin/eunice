-- Migration: Seed 25 High-Fidelity Learner Profiles (Multi-School Tenancy)
-- Populates Eunice High School and Royal Blue Academy with rich, diverse mock data for scale testing.

-- 1. Ensure Tenant Schools Exist
insert into public.schools (id, name, slug, is_active) values
  ('00000000-0000-0000-0000-000000000000', 'Eunice High School', 'eunice', true),
  ('b82d3e51-cb8e-4f76-8092-123456789abc', 'Royal Blue Academy', 'royalblue', true)
on conflict (id) do update set name = excluded.name, slug = excluded.slug;

-- 2. Seed Mock Parent Profiles (15 Parents)
insert into public.profiles (id, school_id, role, first_name, last_name, phone_number) values
  ('p0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'parent', 'Nicola', 'Adams', '+27 82 555 0101'),
  ('p0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'parent', 'Zola', 'Dlamini', '+27 73 555 0102'),
  ('p0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'parent', 'David', 'Smith', '+27 84 555 0103'),
  ('p0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'parent', 'Fatima', 'Patel', '+27 82 555 0104'),
  ('p0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'parent', 'Johan', 'Pretorius', '+27 72 555 0105'),
  ('p0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'parent', 'Naledi', 'Mokoena', '+27 83 555 0106'),
  ('p0000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'parent', 'Grace', 'Chauke', '+27 61 555 0107'),
  ('p0000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'parent', 'Sipho', 'Nkosi', '+27 82 555 0108'),
  ('p0000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'parent', 'Elize', 'Botha', '+27 83 555 0109'),
  ('p0000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000010', 'parent', 'Amina', 'Khan', '+27 74 555 0110'),
  ('p0000000-0000-0000-0000-000000000011', 'b82d3e51-cb8e-4f76-8092-123456789abc', 'parent', 'Thabo', 'Molefe', '+27 82 555 0111'),
  ('p0000000-0000-0000-0000-000000000012', 'b82d3e51-cb8e-4f76-8092-123456789abc', 'parent', 'Sarah', 'Jenkins', '+27 83 555 0112'),
  ('p0000000-0000-0000-0000-000000000013', 'b82d3e51-cb8e-4f76-8092-123456789abc', 'parent', 'Kopano', 'Lekota', '+27 84 555 0113'),
  ('p0000000-0000-0000-0000-000000000014', 'b82d3e51-cb8e-4f76-8092-123456789abc', 'parent', 'Liezel', 'Meyer', '+27 82 555 0114'),
  ('p0000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000000', 'parent', 'Admin', 'User', '+27 83 555 9999')
on conflict (id) do nothing;

-- Ensure an Admin profile exists for note logs
insert into public.profiles (id, school_id, role, first_name, last_name, phone_number) values
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'admin', 'Admissions', 'Officer', '+27 82 555 9999')
on conflict (id) do nothing;

-- 3. Seed 25 Applications
-- We generate fixed UUIDs for reliability and testing links
insert into public.applications (id, school_id, parent_id, reference_number, learner_first_name, learner_last_name, learner_date_of_birth, grade_applying_for, previous_school_name, status, created_at) values
  -- Eunice High School (20 Applications)
  ('app00000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000001', 'EUN-2026-1001', 'Chloe', 'Adams', '2012-04-12', 'Grade 8', 'President Brand Primary', 'accepted', '2026-05-01 09:00:00+02'),
  ('app00000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000002', 'EUN-2026-1002', 'Buhle', 'Dlamini', '2012-08-22', 'Grade 8', 'Willem Postma Primary', 'under_review', '2026-05-02 10:15:00+02'),
  ('app00000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000003', 'EUN-2026-1003', 'Emma', 'Smith', '2012-01-05', 'Grade 8', 'Oranje Meisies Primêr', 'decision_pending', '2026-05-03 11:30:00+02'),
  ('app00000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000004', 'EUN-2026-1004', 'Yasmin', 'Patel', '2012-11-30', 'Grade 8', 'Grey College Primary', 'awaiting_documents', '2026-05-04 14:20:00+02'),
  ('app00000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000005', 'EUN-2026-1005', 'Anika', 'Pretorius', '2012-05-18', 'Grade 8', 'Universitas Primêr', 'draft', '2026-05-05 08:10:00+02'),
  ('app00000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000006', 'EUN-2026-1006', 'Lerato', 'Mokoena', '2012-07-09', 'Grade 8', 'Sandveld Primêr', 'ready_for_review', '2026-05-06 16:45:00+02'),
  ('app00000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000007', 'EUN-2026-1007', 'Tsakani', 'Chauke', '2012-03-14', 'Grade 8', 'Giyani Primary School', 'submitted', '2026-05-07 12:00:00+02'),
  ('app00000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000008', 'EUN-2026-1008', 'Nomalanga', 'Nkosi', '2012-09-03', 'Grade 8', 'Phakama Primary', 'rejected', '2026-05-08 10:50:00+02'),
  ('app00000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000009', 'EUN-2026-1009', 'Mieke', 'Botha', '2012-02-28', 'Grade 8', 'Bainsvlei Primêr', 'under_review', '2026-05-09 09:15:00+02'),
  ('app00000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000010', 'EUN-2026-1010', 'Aaliyah', 'Khan', '2012-10-15', 'Grade 8', 'Bloemfontein Primary', 'awaiting_documents', '2026-05-10 11:10:00+02'),
  ('app00000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000001', 'EUN-2026-1016', 'Jessica', 'Adams', '2011-03-24', 'Grade 9', 'President Brand Primary', 'accepted', '2026-05-01 09:30:00+02'),
  ('app00000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000002', 'EUN-2026-1017', 'Palesa', 'Dlamini', '2012-07-14', 'Grade 8', 'Willem Postma Primary', 'ready_for_review', '2026-05-02 11:20:00+02'),
  ('app00000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000003', 'EUN-2026-1018', 'Sophia', 'Smith', '2012-09-08', 'Grade 8', 'Oranje Meisies Primêr', 'draft', '2026-05-03 12:40:00+02'),
  ('app00000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000004', 'EUN-2026-1019', 'Fatima', 'Patel', '2012-04-04', 'Grade 8', 'Grey College Primary', 'submitted', '2026-05-04 15:55:00+02'),
  ('app00000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000005', 'EUN-2026-1020', 'Nika', 'Pretorius', '2012-12-12', 'Grade 8', 'Universitas Primêr', 'under_review', '2026-05-05 09:30:00+02'),
  ('app00000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000006', 'EUN-2026-1021', 'Kgomotso', 'Mokoena', '2012-05-06', 'Grade 8', 'Sandveld Primêr', 'under_review', '2026-05-06 17:15:00+02'),
  ('app00000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000007', 'EUN-2026-1022', 'Amara', 'Chauke', '2012-06-20', 'Grade 8', 'Giyani Primary School', 'awaiting_documents', '2026-05-07 13:40:00+02'),
  ('app00000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000008', 'EUN-2026-1023', 'Tshidi', 'Nkosi', '2012-03-30', 'Grade 8', 'Phakama Primary', 'submitted', '2026-05-08 11:20:00+02'),
  ('app00000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000009', 'EUN-2026-1024', 'Cara', 'Botha', '2012-01-22', 'Grade 8', 'Bainsvlei Primêr', 'draft', '2026-05-09 10:30:00+02'),
  ('app00000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000000', 'p0000000-0000-0000-0000-000000000010', 'EUN-2026-1025', 'Layla', 'Khan', '2012-07-07', 'Grade 8', 'Bloemfontein Primary', 'ready_for_review', '2026-05-10 12:45:00+02'),
  
  -- Royal Blue Academy (5 Applications)
  ('app00000-0000-0000-0000-000000000011', 'b82d3e51-cb8e-4f76-8092-123456789abc', 'p0000000-0000-0000-0000-000000000011', 'RBA-2026-1101', 'Kabelo', 'Molefe', '2012-05-05', 'Grade 8', 'Sehunelo High School', 'under_review', '2026-05-11 10:00:00+02'),
  ('app00000-0000-0000-0000-000000000012', 'b82d3e51-cb8e-4f76-8092-123456789abc', 'p0000000-0000-0000-0000-000000000012', 'RBA-2026-1102', 'Lucy', 'Jenkins', '2012-09-14', 'Grade 8', 'Sand du Plessis Primêr', 'accepted', '2026-05-12 11:30:00+02'),
  ('app00000-0000-0000-0000-000000000013', 'b82d3e51-cb8e-4f76-8092-123456789abc', 'p0000000-0000-0000-0000-000000000013', 'RBA-2026-1103', 'Lebohang', 'Lekota', '2012-04-18', 'Grade 8', 'Heatherdale Intermediate', 'awaiting_documents', '2026-05-13 14:00:00+02'),
  ('app00000-0000-0000-0000-000000000014', 'b82d3e51-cb8e-4f76-8092-123456789abc', 'p0000000-0000-0000-0000-000000000014', 'RBA-2026-1104', 'Monique', 'Meyer', '2012-12-03', 'Grade 8', 'St Andrew Primary', 'ready_for_review', '2026-05-14 15:45:00+02'),
  ('app00000-0000-0000-0000-000000000015', 'b82d3e51-cb8e-4f76-8092-123456789abc', 'p0000000-0000-0000-0000-000000000011', 'RBA-2026-1105', 'Reatile', 'Molefe', '2011-02-12', 'Grade 9', 'Sehunelo High School', 'draft', '2026-05-11 11:00:00+02')
on conflict (id) do nothing;

-- 4. Seed Sub-Table households (Step 2 details)
insert into public.households (school_id, application_id, residential_address, postal_address, marital_status, custody_status, sibling_legacy_info) values
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000001', '12 Brandwag Avenue, Bloemfontein', 'PO Box 1234, Brandwag', 'Married', 'Both parents', '{"hasSibling": true, "siblingDetails": "Sarah Adams - Grade 10"}'::jsonb),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000002', '45 Westdene Road, Bloemfontein', 'PO Box 456, Westdene', 'Single', 'Mother only', '{"hasSibling": false}'::jsonb),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000003', '78 Rayton Ridge, Bloemfontein', 'PO Box 789, Rayton', 'Married', 'Both parents', '{"hasSibling": false}'::jsonb),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000004', '15 Heidedal Crescent, Bloemfontein', 'PO Box 15, Heidedal', 'Married', 'Both parents', '{"hasSibling": true, "siblingDetails": "Bilal Patel - Grade 11"}'::jsonb),
  ('00000000-0000-0000-0000-000000000005', 'app00000-0000-0000-0000-000000000005', '89 Fichardtpark Road, Bloemfontein', 'PO Box 89, Fichardtpark', 'Married', 'Both parents', '{"hasSibling": false}'::jsonb)
on conflict do nothing;

-- 5. Seed Sub-Table medical_profiles (Step 3 details)
insert into public.medical_profiles (school_id, application_id, has_medical_aid, medical_aid_name, medical_aid_number, medical_aid_primary_member, emergency_doctor_name, emergency_doctor_phone, allergies, medical_conditions, special_care_needs, is_hostel_applicant) values
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000001', true, 'Discovery Health', '123456789', 'Nicola Adams', 'Dr. van Rensburg', '+27 51 555 1234', 'Peanuts', 'Mild Asthma', 'None', false),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000002', true, 'Bonitas', '987654321', 'Zola Dlamini', 'Dr. Molefe', '+27 51 555 5678', 'None', 'None', 'None', true),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000003', false, null, null, null, 'Dr. Smith', '+27 51 555 9012', 'Penicillin', 'Eczema', 'None', false),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000004', true, 'Medihelp', '456789123', 'Fatima Patel', 'Dr. Patel', '+27 51 555 3456', 'None', 'None', 'None', false),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000005', true, 'Discovery Health', '789123456', 'Johan Pretorius', 'Dr. Kruger', '+27 51 555 7890', 'Bees', 'None', 'None', true)
on conflict do nothing;

-- 6. Seed Sub-Table fee_payers (Step 4 details)
insert into public.fee_payers (school_id, application_id, is_submitting_parent, legal_name, id_number, phone_number, email_address, employer_name, employer_phone, popia_consent_given, popia_consent_date) values
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000001', true, 'Nicola Adams', '8503145089082', '+27 82 555 0101', 'nicola.adams@example.com', 'Standard Bank', '+27 11 555 0000', true, '2026-05-01 08:30:00+02'),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000002', true, 'Zola Dlamini', '8807225091081', '+27 73 555 0102', 'zola.dlamini@example.com', 'Bloemfontein Clinic', '+27 51 555 1111', true, '2026-05-02 09:45:00+02'),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000003', false, 'George Smith', '7905185012089', '+27 82 555 0999', 'george.smith@example.com', 'Self-Employed', null, true, '2026-05-03 10:15:00+02'),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000004', true, 'Fatima Patel', '9002285098083', '+27 82 555 0104', 'fatima.patel@example.com', 'University of FS', '+27 51 555 2222', true, '2026-05-04 13:10:00+02'),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000005', true, 'Johan Pretorius', '8204125098081', '+27 72 555 0105', 'johan.pretorius@example.com', 'Transnet', '+27 12 555 3333', true, '2026-05-05 07:45:00+02')
on conflict do nothing;

-- 7. Seed Sub-Table application_consents (Step 5 details)
insert into public.application_consents (school_id, application_id, declaration_accepted, terms_accepted, popia_authorization, ip_address, user_agent, consented_at) values
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000001', true, true, true, '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '2026-05-01 09:00:00+02'),
  ('00000000-0000-0000-0000-000000000002', 'app00000-0000-0000-0000-000000000002', true, true, true, '192.168.1.101', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', '2026-05-02 10:15:00+02'),
  ('00000000-0000-0000-0000-000000000003', 'app00000-0000-0000-0000-000000000003', true, true, true, '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2026-05-03 11:30:00+02'),
  ('00000000-0000-0000-0000-000000000004', 'app00000-0000-0000-0000-000000000004', true, true, true, '192.168.1.103', 'Mozilla/5.0 (Linux; Android 11; SM-A515F)', '2026-05-04 14:20:00+02'),
  ('00000000-0000-0000-0000-000000000005', 'app00000-0000-0000-0000-000000000005', false, false, false, null, null, '2026-05-05 08:10:00+02')
on conflict do nothing;

-- 8. Seed Documents Checklist for review flow (identity, school, family, medical)
insert into public.documents (school_id, application_id, document_type, file_path, file_name, mime_type, file_size, upload_status, review_notes, uploaded_at) values
  -- Chloe Adams documents (Verified)
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000001', 'birth_cert', 'preview/birth_cert/sample-birth_cert.pdf', 'birth_cert_chloe.pdf', 'application/pdf', 1048576, 'verified', 'Verified by admissions.', '2026-05-01 08:45:00+02'),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000001', 'school_report', 'preview/school_report/sample-school_report.pdf', 'report_card_q4.pdf', 'application/pdf', 2048576, 'verified', 'Verified by admissions.', '2026-05-01 08:46:00+02'),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000001', 'proof_residence', 'preview/proof_residence/sample-proof_residence.pdf', 'municipial_bill.pdf', 'application/pdf', 848576, 'verified', 'Verified by admissions.', '2026-05-01 08:47:00+02'),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000001', 'id_copy', 'preview/id_copy/sample-id_copy.pdf', 'parent_id_copy.pdf', 'application/pdf', 1548576, 'verified', 'Verified by admissions.', '2026-05-01 08:48:00+02'),

  -- Buhle Dlamini documents (Low confidence OCR & Blurry checks)
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000002', 'birth_cert', 'preview/birth_cert/sample-birth_cert.pdf', 'buhle_birth.jpg', 'image/jpeg', 1248576, 'low_confidence_ocr', 'Needs admissions eyes.', '2026-05-02 09:50:00+02'),
  ('00000000-0000-0000-0000-000000000002', 'app00000-0000-0000-0000-000000000002', 'school_report', 'preview/school_report/sample-school_report.pdf', 'report_buhle.pdf', 'application/pdf', 2148576, 'accepted', 'Awaiting review.', '2026-05-02 09:52:00+02'),
  ('00000000-0000-0000-0000-000000000002', 'app00000-0000-0000-0000-000000000002', 'proof_residence', 'preview/proof_residence/sample-proof_residence.pdf', 'proof_res.pdf', 'application/pdf', 948576, 'blurry', 'Uploaded photo looks dark.', '2026-05-02 09:54:00+02'),
  ('00000000-0000-0000-0000-000000000002', 'app00000-0000-0000-0000-000000000002', 'id_copy', 'preview/id_copy/sample-id_copy.pdf', 'zola_id.jpg', 'image/jpeg', 1448576, 'accepted', 'Awaiting review.', '2026-05-02 09:55:00+02'),

  -- Yasmin Patel documents (Needs Reupload Flagging check)
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000004', 'birth_cert', 'preview/birth_cert/sample-birth_cert.pdf', 'yasmin_birth.pdf', 'application/pdf', 1048576, 'needs_reupload', 'Wrong child birth cert uploaded.', '2026-05-04 13:30:00+02'),
  ('00000000-0000-0000-0000-000000000004', 'app00000-0000-0000-0000-000000000004', 'school_report', 'preview/school_report/sample-school_report.pdf', 'report_card.pdf', 'application/pdf', 2248576, 'accepted', 'Awaiting review.', '2026-05-04 13:35:00+02')
on conflict do nothing;

-- 9. Seed Internal admin_notes logs timeline
insert into public.admin_notes (school_id, application_id, admin_id, note_text, created_at) values
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Admissions folder verified. Sibling legacy confirmed in Grade 10.', '2026-05-01 10:00:00+02'),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Sent acceptance offer email.', '2026-05-01 11:30:00+02'),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Needs manual review of proof of residence - utility bill is under spouse name.', '2026-05-02 14:00:00+02'),
  ('00000000-0000-0000-0000-000000000000', 'app00000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Flagged birth certificate for reupload - name mismatch.', '2026-05-04 16:00:00+02')
on conflict do nothing;
