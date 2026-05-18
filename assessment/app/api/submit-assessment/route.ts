import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return Response.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('discovery_assessments')
      .insert([
        {
          school_name: formData.school_name,
          contact_person: formData.contact_person,
          contact_role: formData.contact_role,
          intake_grades: formData.intake_grades,
          apps_per_year: formData.apps_per_year,
          accepted_per_year: formData.accepted_per_year,
          intake_period: formData.intake_period,
          access_website: formData.access_website || false,
          access_google_forms: formData.access_google_forms || false,
          access_pdf: formData.access_pdf || false,
          access_email: formData.access_email || false,
          access_whatsapp: formData.access_whatsapp || false,
          access_social: formData.access_social || false,
          access_physical: formData.access_physical || false,
          info_parent: formData.info_parent || false,
          info_learner: formData.info_learner || false,
          info_prev_school: formData.info_prev_school || false,
          info_academic: formData.info_academic || false,
          info_medical: formData.info_medical || false,
          info_boarding: formData.info_boarding || false,
          info_sibling: formData.info_sibling || false,
          issue_missing: formData.issue_missing || false,
          issue_incorrect: formData.issue_incorrect || false,
          issue_blurry: formData.issue_blurry || false,
          issue_duplicate: formData.issue_duplicate || false,
          issue_incomplete: formData.issue_incomplete || false,
          issue_contact: formData.issue_contact || false,
          issue_late: formData.issue_late || false,
          issue_confusion: formData.issue_confusion || false,
          store_drive: formData.store_drive || false,
          store_network: formData.store_network || false,
          store_local: formData.store_local || false,
          store_email: formData.store_email || false,
          store_printed: formData.store_printed || false,
          improve_admin: formData.improve_admin || false,
          improve_docs: formData.improve_docs || false,
          improve_reminders: formData.improve_reminders || false,
          improve_comms: formData.improve_comms || false,
          improve_visibility: formData.improve_visibility || false,
          improve_speed: formData.improve_speed || false,
          improve_tracking: formData.improve_tracking || false,
          improve_records: formData.improve_records || false,
          improve_compliance: formData.improve_compliance || false,
          tool_gforms: formData.tool_gforms || false,
          tool_excel: formData.tool_excel || false,
          tool_gsheets: formData.tool_gsheets || false,
          tool_outlook: formData.tool_outlook || false,
          tool_whatsapp: formData.tool_whatsapp || false,
          tool_sms: formData.tool_sms || false,
          future_reminders: formData.future_reminders || false,
          future_tracking: formData.future_tracking || false,
          future_dashboard: formData.future_dashboard || false,
          future_ai: formData.future_ai || false,
          future_whatsapp: formData.future_whatsapp || false,
          future_analytics: formData.future_analytics || false,
          future_multiuser: formData.future_multiuser || false,
          future_multicampus: formData.future_multicampus || false,
          process_description: formData.process_description,
          naming_explain: formData.naming_explain,
          parent_questions: formData.parent_questions,
          parent_confusion: formData.parent_confusion,
          statuses: formData.statuses,
          role_initial: formData.role_initial,
          role_docs: formData.role_docs,
          role_approval: formData.role_approval,
          role_comms: formData.role_comms,
          time_sinks: formData.time_sinks,
          infra_limits: formData.infra_limits,
          final_comments: formData.final_comments,
          signoff_name: formData.signoff_name,
          signoff_date: formData.signoff_date,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return Response.json(
        { error: `Failed to save assessment: ${error.message}` },
        { status: 400 }
      );
    }

    return Response.json({ success: true, id: data?.[0]?.id });
  } catch (error) {
    console.error('Server error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
