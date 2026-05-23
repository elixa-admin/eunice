alter table if exists public.documents
  add column if not exists school_id uuid references public.schools(id) on delete restrict;

alter table if exists public.communications
  add column if not exists school_id uuid references public.schools(id) on delete restrict;

alter table if exists public.admin_notes
  add column if not exists school_id uuid references public.schools(id) on delete restrict;

alter table if exists public.document_processing_jobs
  add column if not exists school_id uuid references public.schools(id) on delete restrict;

create table if not exists public.status_history (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  application_id uuid not null references public.applications(id) on delete cascade,
  old_status text,
  new_status text not null,
  changed_by uuid references public.profiles(id) on delete set null,
  change_reason text,
  created_at timestamptz not null default timezone('utc', now())
);

update public.documents d
set school_id = a.school_id
from public.applications a
where d.application_id = a.id
  and d.school_id is null;

update public.communications c
set school_id = a.school_id
from public.applications a
where c.application_id = a.id
  and c.school_id is null;

update public.admin_notes n
set school_id = a.school_id
from public.applications a
where n.application_id = a.id
  and n.school_id is null;

update public.document_processing_jobs j
set school_id = a.school_id
from public.applications a
join public.documents d on d.application_id = a.id
where j.document_id = d.id
  and j.school_id is null;

create index if not exists idx_documents_school_id on public.documents(school_id);
create index if not exists idx_communications_school_id on public.communications(school_id);
create index if not exists idx_admin_notes_school_id on public.admin_notes(school_id);
create index if not exists idx_document_processing_jobs_school_id on public.document_processing_jobs(school_id);
create index if not exists idx_status_history_school_id on public.status_history(school_id);
create index if not exists idx_status_history_application_id on public.status_history(application_id);
create index if not exists idx_status_history_created_at on public.status_history(created_at desc);

