-- Migration: Guided Flow Details Support
-- Extends the database to support the 5-step Parent Intake Flow

-- 1. Households Table (Step 2)
create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  application_id uuid not null references public.applications(id) on delete cascade,
  residential_address text not null,
  postal_address text,
  marital_status text,
  custody_status text,
  sibling_legacy_info jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

-- 2. Medical & Support Profiles (Step 3)
create table if not exists public.medical_profiles (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  application_id uuid not null references public.applications(id) on delete cascade,
  has_medical_aid boolean not null default false,
  medical_aid_name text,
  medical_aid_number text,
  medical_aid_primary_member text,
  emergency_doctor_name text,
  emergency_doctor_phone text,
  allergies text,
  medical_conditions text,
  special_care_needs text,
  is_hostel_applicant boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

-- 3. Fee Payers Table (Step 4)
create table if not exists public.fee_payers (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  application_id uuid not null references public.applications(id) on delete cascade,
  is_submitting_parent boolean not null default true,
  legal_name text not null,
  id_number text,
  phone_number text,
  email_address text,
  employer_name text,
  employer_phone text,
  popia_consent_given boolean not null default false,
  popia_consent_date timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

-- 4. Application Consents Table (Step 5)
create table if not exists public.application_consents (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  application_id uuid not null references public.applications(id) on delete cascade,
  declaration_accepted boolean not null default false,
  terms_accepted boolean not null default false,
  popia_authorization boolean not null default false,
  ip_address text,
  user_agent text,
  consented_at timestamptz not null default timezone('utc', now())
);

-- Indexes for performance
create index if not exists idx_households_application_id on public.households(application_id);
create index if not exists idx_medical_profiles_application_id on public.medical_profiles(application_id);
create index if not exists idx_fee_payers_application_id on public.fee_payers(application_id);
create index if not exists idx_application_consents_application_id on public.application_consents(application_id);

create index if not exists idx_households_school_id on public.households(school_id);
create index if not exists idx_medical_profiles_school_id on public.medical_profiles(school_id);
create index if not exists idx_fee_payers_school_id on public.fee_payers(school_id);
create index if not exists idx_application_consents_school_id on public.application_consents(school_id);
