-- Migration: Initial Multi-Tenant Schema
-- Description: Core tables and RLS policies for schools, profiles, applications, documents, and communications.

-- 1. Custom Types (Enums)
CREATE TYPE user_role AS ENUM ('parent', 'admin', 'superadmin');
CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'under_review', 'accepted', 'rejected');
CREATE TYPE document_status AS ENUM ('uploaded', 'verified', 'rejected');
CREATE TYPE document_type AS ENUM ('birth_cert', 'school_report', 'proof_residence', 'id_copy', 'other');

-- 2. Schools Table (Tenants)
CREATE TABLE public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Profiles Table (Linked to auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL, -- Nullable for superadmins
    role user_role NOT NULL DEFAULT 'parent',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Applications Table
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    learner_first_name TEXT NOT NULL,
    learner_last_name TEXT NOT NULL,
    grade_applying_for TEXT NOT NULL,
    status application_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_applications_modtime
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 5. Documents Table
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    doc_type document_type NOT NULL,
    storage_path TEXT NOT NULL,
    status document_status NOT NULL DEFAULT 'uploaded',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE
);

-- 6. Communications Table
CREATE TABLE public.communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    body_snippet TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- =====================================================================================

-- Enable RLS on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;

-- Utility Function: Get current user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Utility Function: Get current user school_id
CREATE OR REPLACE FUNCTION public.get_user_school_id()
RETURNS UUID AS $$
  SELECT school_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- --------------------------------------------------------
-- SCHOOLS POLICIES
-- --------------------------------------------------------
-- Superadmins can do everything. Admins can see their own school. Parents can see their school.
CREATE POLICY "Superadmins can manage all schools" ON public.schools
    FOR ALL USING (public.get_user_role() = 'superadmin');

CREATE POLICY "Anyone authenticated can view their own school" ON public.schools
    FOR SELECT USING (id = public.get_user_school_id());

-- --------------------------------------------------------
-- PROFILES POLICIES
-- --------------------------------------------------------
CREATE POLICY "Superadmins can manage all profiles" ON public.profiles
    FOR ALL USING (public.get_user_role() = 'superadmin');

CREATE POLICY "Admins can view profiles in their school" ON public.profiles
    FOR SELECT USING (school_id = public.get_user_school_id() AND public.get_user_role() = 'admin');

CREATE POLICY "Users can view and update their own profile" ON public.profiles
    FOR ALL USING (id = auth.uid());

-- --------------------------------------------------------
-- APPLICATIONS POLICIES
-- --------------------------------------------------------
CREATE POLICY "Superadmins can manage all applications" ON public.applications
    FOR ALL USING (public.get_user_role() = 'superadmin');

CREATE POLICY "Admins can manage applications for their school" ON public.applications
    FOR ALL USING (school_id = public.get_user_school_id() AND public.get_user_role() = 'admin');

CREATE POLICY "Parents can manage their own applications" ON public.applications
    FOR ALL USING (parent_id = auth.uid() AND public.get_user_role() = 'parent');

-- --------------------------------------------------------
-- DOCUMENTS POLICIES
-- --------------------------------------------------------
CREATE POLICY "Superadmins can manage all documents" ON public.documents
    FOR ALL USING (public.get_user_role() = 'superadmin');

CREATE POLICY "Admins can manage documents for their school" ON public.documents
    FOR ALL USING (school_id = public.get_user_school_id() AND public.get_user_role() = 'admin');

CREATE POLICY "Parents can manage documents for their applications" ON public.documents
    FOR ALL USING (
      application_id IN (SELECT id FROM public.applications WHERE parent_id = auth.uid())
      AND public.get_user_role() = 'parent'
    );

-- --------------------------------------------------------
-- COMMUNICATIONS POLICIES
-- --------------------------------------------------------
CREATE POLICY "Superadmins can manage all communications" ON public.communications
    FOR ALL USING (public.get_user_role() = 'superadmin');

CREATE POLICY "Admins can view and send communications for their school" ON public.communications
    FOR ALL USING (school_id = public.get_user_school_id() AND public.get_user_role() = 'admin');

CREATE POLICY "Parents can view communications for their applications" ON public.communications
    FOR SELECT USING (
      application_id IN (SELECT id FROM public.applications WHERE parent_id = auth.uid())
      AND public.get_user_role() = 'parent'
    );
