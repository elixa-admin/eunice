# Assessment Form Setup

## 1. Create Supabase Table

Log into your Supabase project and run this SQL in the SQL Editor:

```sql
CREATE TABLE discovery_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  contact_role TEXT,
  intake_grades TEXT,
  apps_per_year TEXT,
  accepted_per_year TEXT,
  intake_period TEXT,
  
  -- Access Methods
  access_website BOOLEAN DEFAULT FALSE,
  access_google_forms BOOLEAN DEFAULT FALSE,
  access_pdf BOOLEAN DEFAULT FALSE,
  access_email BOOLEAN DEFAULT FALSE,
  access_whatsapp BOOLEAN DEFAULT FALSE,
  access_social BOOLEAN DEFAULT FALSE,
  access_physical BOOLEAN DEFAULT FALSE,
  
  -- Information Collected
  info_parent BOOLEAN DEFAULT FALSE,
  info_learner BOOLEAN DEFAULT FALSE,
  info_prev_school BOOLEAN DEFAULT FALSE,
  info_academic BOOLEAN DEFAULT FALSE,
  info_medical BOOLEAN DEFAULT FALSE,
  info_boarding BOOLEAN DEFAULT FALSE,
  info_sibling BOOLEAN DEFAULT FALSE,
  
  -- Document Issues
  issue_missing BOOLEAN DEFAULT FALSE,
  issue_incorrect BOOLEAN DEFAULT FALSE,
  issue_blurry BOOLEAN DEFAULT FALSE,
  issue_duplicate BOOLEAN DEFAULT FALSE,
  issue_incomplete BOOLEAN DEFAULT FALSE,
  issue_contact BOOLEAN DEFAULT FALSE,
  issue_late BOOLEAN DEFAULT FALSE,
  issue_confusion BOOLEAN DEFAULT FALSE,
  
  -- Storage Methods
  store_drive BOOLEAN DEFAULT FALSE,
  store_network BOOLEAN DEFAULT FALSE,
  store_local BOOLEAN DEFAULT FALSE,
  store_email BOOLEAN DEFAULT FALSE,
  store_printed BOOLEAN DEFAULT FALSE,
  
  -- Improvements
  improve_admin BOOLEAN DEFAULT FALSE,
  improve_docs BOOLEAN DEFAULT FALSE,
  improve_reminders BOOLEAN DEFAULT FALSE,
  improve_comms BOOLEAN DEFAULT FALSE,
  improve_visibility BOOLEAN DEFAULT FALSE,
  improve_speed BOOLEAN DEFAULT FALSE,
  improve_tracking BOOLEAN DEFAULT FALSE,
  improve_records BOOLEAN DEFAULT FALSE,
  improve_compliance BOOLEAN DEFAULT FALSE,
  
  -- Current Tools
  tool_gforms BOOLEAN DEFAULT FALSE,
  tool_excel BOOLEAN DEFAULT FALSE,
  tool_gsheets BOOLEAN DEFAULT FALSE,
  tool_outlook BOOLEAN DEFAULT FALSE,
  tool_whatsapp BOOLEAN DEFAULT FALSE,
  tool_sms BOOLEAN DEFAULT FALSE,
  
  -- Future Features
  future_reminders BOOLEAN DEFAULT FALSE,
  future_tracking BOOLEAN DEFAULT FALSE,
  future_dashboard BOOLEAN DEFAULT FALSE,
  future_ai BOOLEAN DEFAULT FALSE,
  future_whatsapp BOOLEAN DEFAULT FALSE,
  future_analytics BOOLEAN DEFAULT FALSE,
  future_multiuser BOOLEAN DEFAULT FALSE,
  future_multicampus BOOLEAN DEFAULT FALSE,
  
  -- Text Fields
  process_description TEXT,
  naming_explain TEXT,
  parent_questions TEXT,
  parent_confusion TEXT,
  statuses TEXT,
  role_initial TEXT,
  role_docs TEXT,
  role_approval TEXT,
  role_comms TEXT,
  time_sinks TEXT,
  infra_limits TEXT,
  final_comments TEXT,
  
  -- Signoff
  signoff_name TEXT,
  signoff_date DATE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (public can insert, admins can read all)
ALTER TABLE discovery_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert_assessments" ON discovery_assessments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "service_role_read_assessments" ON discovery_assessments
  FOR SELECT USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
```

## 2. Get Your Supabase Credentials

In Supabase dashboard:
1. Go to **Settings → API**
2. Copy `Project URL` → set as `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` key → set as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Create .env.local

Create `.env.local` in the `assessment/` directory:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Test Locally

```bash
cd assessment
npm run dev
```

Visit `http://localhost:3000` and test the form end-to-end.

## 5. Deploy to Vercel

### Option A: Via Vercel Dashboard
1. Push to GitHub (if not already)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the GitHub repo (assessment folder)
4. Add environment variables (same as .env.local)
5. Deploy

### Option B: Via CLI
```bash
npm i -g vercel
vercel
# Follow prompts, add env variables when asked
```

## 6. Share the URL

Once deployed, Vercel will provide a public URL. Share that with the school:
```
https://eunice-assessment.vercel.app (or your custom domain)
```

---

## Troubleshooting

- **RLS errors**: Make sure RLS policies allow public inserts
- **Missing table**: Run the SQL script in Supabase SQL Editor
- **Environment variables**: Double-check Vercel has the same keys as local .env.local
- **Form not submitting**: Check browser console for errors, check Vercel logs

---

## Next Steps

Once responses arrive:
1. Export data from Supabase
2. Analyze responses
3. Define 5 learner scenarios
4. Lock MVP scope
5. Start Phase 2 development
