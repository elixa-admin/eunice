export type PreviewSurface = 'hub' | 'parent' | 'admin' | 'detail';

type PreviewSurfaceSchema = {
  label: string;
  lead: string;
  chips: string[];
  accent: string;
};

export const previewSurfaceSchema: Record<PreviewSurface, PreviewSurfaceSchema> = {
  hub: {
    label: 'Public admissions site',
    lead: 'A calm, website-like entry point that feels like a real school admissions experience.',
    chips: ['Website-first layout', 'Form-led journey', 'Academic tone'],
    accent: 'Admissions website',
  },
  parent: {
    label: 'Parent portal',
    lead: 'A guided admissions flow that reads like a polished online form, not a wireframe.',
    chips: ['Clear next step', 'Status tracking', 'Submission-ready'],
    accent: 'Application form',
  },
  admin: {
    label: 'Admin workspace',
    lead: 'A denser control surface for admissions staff, with more operational energy.',
    chips: ['Queue review', 'Document triage', 'Fast decisions'],
    accent: 'Review console',
  },
  detail: {
    label: 'Application record',
    lead: 'A structured learner file that balances readability, trust, and review speed.',
    chips: ['Record summary', 'Checklist view', 'Timeline audit'],
    accent: 'Case file',
  },
};
