'use client';

import { useState } from 'react';

export default function AssessmentForm() {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-4">
            Your assessment has been submitted successfully.
          </p>
          <p className="text-sm text-gray-500">
            We've received your school intake workflow assessment. Our team will analyze your responses and reach out within 7 days with recommendations for your admissions platform.
          </p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: 'School Information',
      fields: [
        { name: 'school_name', label: 'School Name', required: true },
        { name: 'contact_person', label: 'Contact Person Name', required: true },
        { name: 'contact_role', label: 'Contact Person Role', required: true },
        { name: 'intake_grades', label: 'Intake Grades (e.g., Grade 1-3)', required: true },
        { name: 'apps_per_year', label: 'Applications Received Per Year' },
        { name: 'accepted_per_year', label: 'Number Accepted Per Year' },
        { name: 'intake_period', label: 'Intake Period (e.g., Jan-Feb)' },
      ],
    },
    {
      title: 'How Do Parents Currently Access the Admissions Process?',
      checkboxes: [
        { name: 'access_website', label: 'Website' },
        { name: 'access_google_forms', label: 'Google Forms' },
        { name: 'access_pdf', label: 'PDF Forms' },
        { name: 'access_email', label: 'Email' },
        { name: 'access_whatsapp', label: 'WhatsApp' },
        { name: 'access_social', label: 'Social Media' },
        { name: 'access_physical', label: 'Physical Office Visit' },
      ],
    },
    {
      title: 'What Information Is Currently Collected?',
      checkboxes: [
        { name: 'info_parent', label: 'Parent/Guardian Information' },
        { name: 'info_learner', label: 'Learner Information' },
        { name: 'info_prev_school', label: 'Previous School Information' },
        { name: 'info_academic', label: 'Academic Records' },
        { name: 'info_medical', label: 'Medical/Health Information' },
        { name: 'info_boarding', label: 'Boarding Status' },
        { name: 'info_sibling', label: 'Sibling Information' },
      ],
    },
    {
      title: 'What Issues Do You Face With Documents?',
      checkboxes: [
        { name: 'issue_missing', label: 'Missing Documents' },
        { name: 'issue_incorrect', label: 'Incorrect Documents' },
        { name: 'issue_blurry', label: 'Blurry/Unreadable Documents' },
        { name: 'issue_duplicate', label: 'Duplicate Submissions' },
        { name: 'issue_incomplete', label: 'Incomplete Applications' },
        { name: 'issue_contact', label: 'Difficulty Contacting Parents' },
        { name: 'issue_late', label: 'Late Submissions' },
        { name: 'issue_confusion', label: 'Parent Confusion About Requirements' },
      ],
    },
    {
      title: 'Where/How Are Applications Currently Stored?',
      checkboxes: [
        { name: 'store_drive', label: 'Google Drive' },
        { name: 'store_network', label: 'Network Drive' },
        { name: 'store_local', label: 'Local Computer' },
        { name: 'store_email', label: 'Email' },
        { name: 'store_printed', label: 'Printed Files' },
      ],
    },
    {
      title: 'What Areas Would You Like to Improve Most?',
      checkboxes: [
        { name: 'improve_admin', label: 'Reduce Admin Work' },
        { name: 'improve_docs', label: 'Document Management' },
        { name: 'improve_reminders', label: 'Automated Reminders' },
        { name: 'improve_comms', label: 'Communication with Parents' },
        { name: 'improve_visibility', label: 'Workflow Visibility' },
        { name: 'improve_speed', label: 'Speed of Process' },
        { name: 'improve_tracking', label: 'Application Tracking' },
        { name: 'improve_records', label: 'Record Keeping' },
        { name: 'improve_compliance', label: 'Compliance/Audit Trail' },
      ],
    },
    {
      title: 'Current Tools & Systems',
      checkboxes: [
        { name: 'tool_gforms', label: 'Google Forms' },
        { name: 'tool_excel', label: 'Excel' },
        { name: 'tool_gsheets', label: 'Google Sheets' },
        { name: 'tool_outlook', label: 'Outlook' },
        { name: 'tool_whatsapp', label: 'WhatsApp' },
        { name: 'tool_sms', label: 'SMS' },
      ],
    },
    {
      title: 'If We Build a Digital System, What Matters Most?',
      checkboxes: [
        { name: 'future_reminders', label: 'Automated Reminders' },
        { name: 'future_tracking', label: 'Application Tracking' },
        { name: 'future_dashboard', label: 'Admin Dashboard' },
        { name: 'future_ai', label: 'AI/Automation' },
        { name: 'future_whatsapp', label: 'WhatsApp Integration' },
        { name: 'future_analytics', label: 'Analytics & Reporting' },
        { name: 'future_multiuser', label: 'Multi-User Access' },
        { name: 'future_multicampus', label: 'Multi-Campus Support' },
      ],
    },
    {
      title: 'Additional Details',
      textfields: [
        { name: 'process_description', label: 'Describe Your Current Process (Step by Step)', placeholder: 'Walk us through how an application flows...' },
        { name: 'naming_explain', label: 'How Do You Currently Name/Categorize Documents?' },
        { name: 'parent_questions', label: 'What Questions Do Parents Most Commonly Ask?' },
        { name: 'parent_confusion', label: 'What Confuses Parents Most About Your Current Process?' },
        { name: 'statuses', label: 'What Are Your Application States/Statuses?' },
        { name: 'role_initial', label: 'Who Handles Initial Application Review?' },
        { name: 'role_docs', label: 'Who Verifies Documents?' },
        { name: 'role_approval', label: 'Who Makes Final Approval Decisions?' },
        { name: 'role_comms', label: 'Who Communicates Decisions to Parents?' },
        { name: 'time_sinks', label: 'What Takes the Most Time in Your Current Process?' },
        { name: 'infra_limits', label: 'What Infrastructure/Budget Limitations Exist?' },
        { name: 'final_comments', label: 'Final Comments or Notes' },
      ],
    },
  ];

  const section = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-black mb-2">School Intake Workflow Assessment</h1>
          <p className="text-gray-600 text-sm mb-4">
            Help us understand your current admissions process. Est. time: 15-20 minutes.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Section {currentSection + 1} of {sections.length}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-black mb-6">{section.title}</h2>

            {section.fields && (
              <div className="space-y-4">
                {section.fields.map(field => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}{field.required ? '*' : ''}
                    </label>
                    <input
                      id={field.name}
                      type="text"
                      value={formData[field.name] || ''}
                      onChange={e => handleInputChange(field.name, e.target.value)}
                      placeholder={field.label}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    />
                  </div>
                ))}
              </div>
            )}

            {section.checkboxes && (
              <div className="space-y-3">
                {section.checkboxes.map(checkbox => (
                  <div key={checkbox.name} className="flex items-center">
                    <input
                      id={checkbox.name}
                      type="checkbox"
                      checked={formData[checkbox.name] || false}
                      onChange={e => handleCheckboxChange(checkbox.name, e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={checkbox.name} className="ml-3 text-sm text-gray-700">
                      {checkbox.label}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {section.textfields && (
              <div className="space-y-4">
                {section.textfields.map(field => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <textarea
                      id={field.name}
                      value={formData[field.name] || ''}
                      onChange={e => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    />
                  </div>
                ))}
                <div className="space-y-4 mt-6 pt-6 border-t">
                  <div>
                    <label htmlFor="signoff_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Authorized By (Name) *
                    </label>
                    <input
                      id="signoff_name"
                      type="text"
                      value={formData.signoff_name || ''}
                      onChange={e => handleInputChange('signoff_name', e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="signoff_date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      id="signoff_date"
                      type="date"
                      value={formData.signoff_date || ''}
                      onChange={e => handleInputChange('signoff_date', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            {currentSection > 0 && (
              <button
                type="button"
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            )}
            {currentSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentSection(currentSection + 1)}
                className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {loading ? 'Submitting...' : 'Submit Assessment'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
