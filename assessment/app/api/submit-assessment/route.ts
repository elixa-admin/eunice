import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

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
          contact_email: formData.contact_email,
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
          info_other: formData.info_other,
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
          tool_other: formData.tool_other,
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
          third_parties: formData.third_parties,
          time_sinks: formData.time_sinks,
          infra_limits: formData.infra_limits,
          system_wishlist: formData.system_wishlist,
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

    // Send email via Gmail SMTP
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      // Admin notification with full assessment
      await transporter.sendMail({
        from: `"Eunice Assessment" <${process.env.GMAIL_USER}>`,
        to: 'brandondienar@gmail.com',
        subject: `New Assessment: ${formData.school_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
            <h2 style="color: #4338ca;">New Assessment Received</h2>
            <h3>${formData.school_name}</h3>
            <table style="width:100%; border-collapse: collapse; font-size:14px;">
              <tr style="background:#f3f4f6;"><td style="padding:8px; font-weight:bold; width:200px;">Contact Person</td><td style="padding:8px;">${formData.contact_person || '—'}</td></tr>
              <tr><td style="padding:8px; font-weight:bold;">Email</td><td style="padding:8px;">${formData.contact_email || '—'}</td></tr>
              <tr style="background:#f3f4f6;"><td style="padding:8px; font-weight:bold;">Role</td><td style="padding:8px;">${formData.contact_role || '—'}</td></tr>
              <tr><td style="padding:8px; font-weight:bold;">Intake Grades</td><td style="padding:8px;">${formData.intake_grades || '—'}</td></tr>
              <tr style="background:#f3f4f6;"><td style="padding:8px; font-weight:bold;">Applications/Year</td><td style="padding:8px;">${formData.apps_per_year || '—'}</td></tr>
              <tr><td style="padding:8px; font-weight:bold;">Accepted/Year</td><td style="padding:8px;">${formData.accepted_per_year || '—'}</td></tr>
              <tr style="background:#f3f4f6;"><td style="padding:8px; font-weight:bold;">Intake Period</td><td style="padding:8px;">${formData.intake_period || '—'}</td></tr>
              <tr><td style="padding:8px; font-weight:bold;">Process Description</td><td style="padding:8px;">${formData.process_description || '—'}</td></tr>
              <tr style="background:#f3f4f6;"><td style="padding:8px; font-weight:bold;">Time Sinks</td><td style="padding:8px;">${formData.time_sinks || '—'}</td></tr>
              <tr><td style="padding:8px; font-weight:bold;">Infrastructure Limits</td><td style="padding:8px;">${formData.infra_limits || '—'}</td></tr>
              <tr style="background:#f3f4f6;"><td style="padding:8px; font-weight:bold;">System Wishlist</td><td style="padding:8px;">${formData.system_wishlist || '—'}</td></tr>
              <tr><td style="padding:8px; font-weight:bold;">Third Parties</td><td style="padding:8px;">${formData.third_parties || '—'}</td></tr>
              <tr style="background:#f3f4f6;"><td style="padding:8px; font-weight:bold;">Final Comments</td><td style="padding:8px;">${formData.final_comments || '—'}</td></tr>
              <tr><td style="padding:8px; font-weight:bold;">Submitted By</td><td style="padding:8px;">${formData.signoff_name || '—'} on ${formData.signoff_date || '—'}</td></tr>
            </table>
          </div>
        `,
      });

      // Confirmation to respondent (best effort)
      if (formData.contact_email) {
        await transporter.sendMail({
          from: `"Eunice Assessment" <${process.env.GMAIL_USER}>`,
          to: formData.contact_email,
          subject: 'Assessment Received – Thank You',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4338ca;">Thank You for Completing the Assessment</h2>
              <p>Dear ${formData.contact_person},</p>
              <p>We have successfully received your school intake workflow assessment for <strong>${formData.school_name}</strong>.</p>
              <p>Our team will carefully review your responses. Should we require any additional information, we will be in touch within the next 7 days.</p>
              <p>We appreciate your time and look forward to building the right solution for your admissions process.</p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">Best regards,<br/>The Eunice Team</p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error('Email error:', emailError);
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
