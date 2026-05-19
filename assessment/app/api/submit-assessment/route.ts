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

      // Helper: render checked items
      const renderChecks = (keys: string[], labels: string[]) => {
        return keys
          .map((key, idx) => formData[key] ? `<li>${labels[idx]}</li>` : '')
          .filter(Boolean)
          .join('');
      };

      // Admin notification with FULL assessment
      await transporter.sendMail({
        from: `"Eunice Assessment" <${process.env.GMAIL_USER}>`,
        to: 'brandondienar@gmail.com',
        subject: `New Assessment: ${formData.school_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4338ca; border-bottom: 2px solid #4338ca; padding-bottom: 10px;">New Assessment Received</h2>
            <h3 style="margin-bottom: 20px;">${formData.school_name}</h3>

            <!-- SCHOOL INFORMATION -->
            <h4 style="background:#f3f4f6; padding:10px; margin-top:20px;">School Information</h4>
            <table style="width:100%; border-collapse: collapse; font-size:13px;">
              <tr><td style="padding:6px; font-weight:bold; width:200px;">School Name</td><td style="padding:6px;">${formData.school_name || '—'}</td></tr>
              <tr style="background:#fafafa;"><td style="padding:6px; font-weight:bold;">Contact Person</td><td style="padding:6px;">${formData.contact_person || '—'}</td></tr>
              <tr><td style="padding:6px; font-weight:bold;">Email</td><td style="padding:6px;">${formData.contact_email || '—'}</td></tr>
              <tr style="background:#fafafa;"><td style="padding:6px; font-weight:bold;">Role</td><td style="padding:6px;">${formData.contact_role || '—'}</td></tr>
              <tr><td style="padding:6px; font-weight:bold;">Intake Grades</td><td style="padding:6px;">${formData.intake_grades || '—'}</td></tr>
              <tr style="background:#fafafa;"><td style="padding:6px; font-weight:bold;">Applications/Year</td><td style="padding:6px;">${formData.apps_per_year || '—'}</td></tr>
              <tr><td style="padding:6px; font-weight:bold;">Accepted/Year</td><td style="padding:6px;">${formData.accepted_per_year || '—'}</td></tr>
              <tr style="background:#fafafa;"><td style="padding:6px; font-weight:bold;">Intake Period</td><td style="padding:6px;">${formData.intake_period || '—'}</td></tr>
            </table>

            <!-- PARENT ACCESS -->
            <h4 style="background:#f3f4f6; padding:10px; margin-top:20px;">How Parents Access Admissions</h4>
            <ul style="margin: 10px 0 10px 20px; font-size:13px;">
              ${renderChecks(['access_website', 'access_google_forms', 'access_pdf', 'access_email', 'access_whatsapp', 'access_social', 'access_physical'],
                ['Website', 'Google Forms', 'PDF Forms', 'Email', 'WhatsApp', 'Social Media', 'Physical Office Visit'])}
            </ul>

            <!-- INFORMATION COLLECTED -->
            <h4 style="background:#f3f4f6; padding:10px; margin-top:20px;">Information Collected</h4>
            <ul style="margin: 10px 0 10px 20px; font-size:13px;">
              ${renderChecks(['info_parent', 'info_learner', 'info_prev_school', 'info_academic', 'info_medical', 'info_boarding', 'info_sibling'],
                ['Parent/Guardian Information', 'Learner Information', 'Previous School Information', 'Academic Records', 'Medical/Health Information', 'Boarding Status', 'Sibling Information'])}
            </ul>
            ${formData.info_other ? `<p style="margin: 5px 0; font-size:13px;"><strong>Other:</strong> ${formData.info_other}</p>` : ''}

            <!-- DOCUMENT ISSUES -->
            <h4 style="background:#f3f4f6; padding:10px; margin-top:20px;">Document Issues</h4>
            <ul style="margin: 10px 0 10px 20px; font-size:13px;">
              ${renderChecks(['issue_missing', 'issue_incorrect', 'issue_blurry', 'issue_duplicate', 'issue_incomplete', 'issue_contact', 'issue_late', 'issue_confusion'],
                ['Missing Documents', 'Incorrect Documents', 'Blurry/Unreadable', 'Duplicate Submissions', 'Incomplete Applications', 'Difficulty Contacting Parents', 'Late Submissions', 'Parent Confusion'])}
            </ul>

            <!-- STORAGE -->
            <h4 style="background:#f3f4f6; padding:10px; margin-top:20px;">Application Storage</h4>
            <ul style="margin: 10px 0 10px 20px; font-size:13px;">
              ${renderChecks(['store_drive', 'store_network', 'store_local', 'store_email', 'store_printed'],
                ['Google Drive', 'Network Drive', 'Local Computer', 'Email', 'Printed Files'])}
            </ul>

            <!-- IMPROVEMENT AREAS -->
            <h4 style="background:#f3f4f6; padding:10px; margin-top:20px;">Improvement Priorities</h4>
            <ul style="margin: 10px 0 10px 20px; font-size:13px;">
              ${renderChecks(['improve_admin', 'improve_docs', 'improve_reminders', 'improve_comms', 'improve_visibility', 'improve_speed', 'improve_tracking', 'improve_records', 'improve_compliance'],
                ['Reduce Admin Work', 'Document Management', 'Automated Reminders', 'Communication with Parents', 'Workflow Visibility', 'Speed of Process', 'Application Tracking', 'Record Keeping', 'Compliance/Audit Trail'])}
            </ul>

            <!-- CURRENT TOOLS -->
            <h4 style="background:#f3f4f6; padding:10px; margin-top:20px;">Current Tools & Systems</h4>
            <ul style="margin: 10px 0 10px 20px; font-size:13px;">
              ${renderChecks(['tool_gforms', 'tool_excel', 'tool_gsheets', 'tool_outlook', 'tool_whatsapp', 'tool_sms'],
                ['Google Forms', 'Excel', 'Google Sheets', 'Outlook', 'WhatsApp', 'SMS'])}
            </ul>
            ${formData.tool_other ? `<p style="margin: 5px 0; font-size:13px;"><strong>Other:</strong> ${formData.tool_other}</p>` : ''}

            <!-- FUTURE FEATURES -->
            <h4 style="background:#f3f4f6; padding:10px; margin-top:20px;">Future System Priorities</h4>
            <ul style="margin: 10px 0 10px 20px; font-size:13px;">
              ${renderChecks(['future_reminders', 'future_tracking', 'future_dashboard', 'future_ai', 'future_whatsapp', 'future_analytics', 'future_multiuser', 'future_multicampus'],
                ['Automated Reminders', 'Application Tracking', 'Admin Dashboard', 'AI/Automation', 'WhatsApp Integration', 'Analytics & Reporting', 'Multi-User Access', 'Multi-Campus Support'])}
            </ul>

            <!-- DETAILED NARRATIVE -->
            <h4 style="background:#f3f4f6; padding:10px; margin-top:20px;">Process Details</h4>
            <table style="width:100%; border-collapse: collapse; font-size:13px;">
              ${formData.process_description ? `<tr><td style="padding:6px; font-weight:bold; vertical-align:top; width:200px;">Current Process</td><td style="padding:6px;">${formData.process_description}</td></tr>` : ''}
              ${formData.naming_explain ? `<tr style="background:#fafafa;"><td style="padding:6px; font-weight:bold; vertical-align:top;">Document Naming</td><td style="padding:6px;">${formData.naming_explain}</td></tr>` : ''}
              ${formData.parent_questions ? `<tr><td style="padding:6px; font-weight:bold; vertical-align:top;">Common Parent Questions</td><td style="padding:6px;">${formData.parent_questions}</td></tr>` : ''}
              ${formData.parent_confusion ? `<tr style="background:#fafafa;"><td style="padding:6px; font-weight:bold; vertical-align:top;">Parent Confusion Points</td><td style="padding:6px;">${formData.parent_confusion}</td></tr>` : ''}
              ${formData.statuses ? `<tr><td style="padding:6px; font-weight:bold; vertical-align:top;">Application Statuses</td><td style="padding:6px;">${formData.statuses}</td></tr>` : ''}
            </table>

            <!-- ROLES & STAKEHOLDERS -->
            <h4 style="background:#f3f4f6; padding:10px; margin-top:20px;">Roles & Stakeholders</h4>
            <table style="width:100%; border-collapse: collapse; font-size:13px;">
              ${formData.role_initial ? `<tr><td style="padding:6px; font-weight:bold; width:200px;">Initial Review</td><td style="padding:6px;">${formData.role_initial}</td></tr>` : ''}
              ${formData.role_docs ? `<tr style="background:#fafafa;"><td style="padding:6px; font-weight:bold;">Document Verification</td><td style="padding:6px;">${formData.role_docs}</td></tr>` : ''}
              ${formData.role_approval ? `<tr><td style="padding:6px; font-weight:bold;">Final Approval</td><td style="padding:6px;">${formData.role_approval}</td></tr>` : ''}
              ${formData.role_comms ? `<tr style="background:#fafafa;"><td style="padding:6px; font-weight:bold;">Parent Communication</td><td style="padding:6px;">${formData.role_comms}</td></tr>` : ''}
              ${formData.third_parties ? `<tr><td style="padding:6px; font-weight:bold;">Third Parties Notified</td><td style="padding:6px;">${formData.third_parties}</td></tr>` : ''}
            </table>

            <!-- CONSTRAINTS & WISHLIST -->
            <h4 style="background:#f3f4f6; padding:10px; margin-top:20px;">Constraints & Vision</h4>
            <table style="width:100%; border-collapse: collapse; font-size:13px;">
              ${formData.time_sinks ? `<tr><td style="padding:6px; font-weight:bold; vertical-align:top; width:200px;">Time Sinks</td><td style="padding:6px;">${formData.time_sinks}</td></tr>` : ''}
              ${formData.infra_limits ? `<tr style="background:#fafafa;"><td style="padding:6px; font-weight:bold; vertical-align:top;">Infrastructure Limits</td><td style="padding:6px;">${formData.infra_limits}</td></tr>` : ''}
              ${formData.system_wishlist ? `<tr><td style="padding:6px; font-weight:bold; vertical-align:top;">System Wishlist</td><td style="padding:6px;">${formData.system_wishlist}</td></tr>` : ''}
              ${formData.final_comments ? `<tr style="background:#fafafa;"><td style="padding:6px; font-weight:bold; vertical-align:top;">Final Comments</td><td style="padding:6px;">${formData.final_comments}</td></tr>` : ''}
            </table>

            <!-- SUBMISSION -->
            <div style="background:#f3f4f6; padding:10px; margin-top:20px; font-size:13px;">
              <strong>Submitted by:</strong> ${formData.signoff_name || '—'} on ${formData.signoff_date || '—'}
            </div>
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
