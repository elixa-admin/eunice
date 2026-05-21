create extension if not exists "pgcrypto";

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key,
  school_id uuid references public.schools(id) on delete set null,
  role text not null check (role in ('parent', 'admin', 'principal', 'superadmin')),
  first_name text not null,
  last_name text not null,
  phone_number text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  parent_id uuid not null references public.profiles(id) on delete restrict,
  reference_number text not null unique,
  learner_first_name text not null,
  learner_last_name text not null,
  learner_date_of_birth date,
  grade_applying_for text not null,
  previous_school_name text,
  status text not null check (
    status in (
      'draft',
      'submitted',
      'awaiting_documents',
      'ready_for_review',
      'under_review',
      'decision_pending',
      'accepted',
      'rejected'
    )
  ) default 'draft',
  submitted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  document_type text not null check (
    document_type in ('birth_cert', 'school_report', 'proof_residence', 'id_copy', 'other')
  ),
  file_path text not null,
  file_name text not null,
  mime_type text,
  file_size bigint,
  upload_status text not null default 'accepted' check (
    upload_status in (
      'accepted',
      'wrong_format',
      'too_large',
      'corrupted',
      'blurry',
      'low_confidence_ocr',
      'needs_reupload',
      'manual_review',
      'verified',
      'missing'
    )
  ),
  quality_status text,
  ocr_status text,
  ocr_confidence numeric(5,2),
  processing_summary jsonb not null default '{}'::jsonb,
  reupload_required boolean not null default false,
  review_notes text,
  uploaded_at timestamptz not null default timezone('utc', now()),
  verified_at timestamptz
);

create table if not exists public.document_processing_jobs (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  job_type text not null check (job_type in ('validate', 'quality_check', 'ocr', 'classification')),
  status text not null check (status in ('queued', 'running', 'passed', 'failed', 'manual_review')) default 'queued',
  error_code text,
  error_message text,
  result_json jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.communications (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  communication_type text not null check (
    communication_type in ('acknowledgement', 'reminder', 'status_update', 'decision')
  ),
  subject text,
  template_key text,
  delivery_status text not null default 'queued',
  sent_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  admin_id uuid not null references public.profiles(id) on delete restrict,
  note_text text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.integration_connections (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  integration_type text not null,
  status text not null default 'inactive',
  config_json jsonb not null default '{}'::jsonb,
  last_sync_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_school_id on public.profiles(school_id);
create index if not exists idx_applications_school_id on public.applications(school_id);
create index if not exists idx_applications_parent_id on public.applications(parent_id);
create index if not exists idx_applications_status on public.applications(status);
create index if not exists idx_documents_application_id on public.documents(application_id);
create index if not exists idx_documents_document_type on public.documents(document_type);
create index if not exists idx_document_processing_jobs_document_id on public.document_processing_jobs(document_id);
create index if not exists idx_communications_application_id on public.communications(application_id);
create index if not exists idx_admin_notes_application_id on public.admin_notes(application_id);
