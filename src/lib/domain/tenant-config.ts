export interface SchoolTenantConfig {
  id: string;
  name: string;
  shortName: string;
  crestPath: string | null;
  tagline: string;
  colors: {
    primaryLight: string; // Tailwind tint
    primaryDark: string;  // Tailwind dark forest / primary background
    accent: string;       // Accent brand color (gold, silver, etc)
    gradientFrom: string;
    gradientTo: string;
  };
  admissionsRequirementNote: string;
}

export const EUNICE_CONFIG: SchoolTenantConfig = {
  id: '00000000-0000-0000-0000-000000000000', // Default UUID
  name: 'Eunice High School',
  shortName: 'Eunice',
  crestPath: '/crest_eunice.png',
  tagline: 'She conquers who conquers herself.',
  colors: {
    primaryLight: '#f0fdf4',
    primaryDark: '#052e16',
    accent: '#ca8a04',
    gradientFrom: 'rgba(22, 163, 74, 0.09)',
    gradientTo: 'rgba(202, 138, 4, 0.06)',
  },
  admissionsRequirementNote: 'We guide families upfront on required documents to ensure a seamless admissions process.'
};

export const ROYAL_BLUE_CONFIG: SchoolTenantConfig = {
  id: 'b82d3e51-cb8e-4f76-8092-123456789abc',
  name: 'Royal Blue Academy',
  shortName: 'Royal Blue',
  crestPath: '/crest_royalblue.png',
  tagline: 'Excellence in every sphere.',
  colors: {
    primaryLight: '#eff6ff',
    primaryDark: '#1e3a8a',
    accent: '#3b82f6',
    gradientFrom: 'rgba(30, 58, 138, 0.09)',
    gradientTo: 'rgba(59, 130, 246, 0.06)',
  },
  admissionsRequirementNote: 'Welcome to the Royal Blue Academy. Please upload all verified records to complete enrollment.'
};

export const TENANT_CONFIGS: Record<string, SchoolTenantConfig> = {
  [EUNICE_CONFIG.id]: EUNICE_CONFIG,
  [ROYAL_BLUE_CONFIG.id]: ROYAL_BLUE_CONFIG,
};

export function getTenantConfig(schoolId: string | null): SchoolTenantConfig {
  if (!schoolId) return EUNICE_CONFIG;
  return TENANT_CONFIGS[schoolId] || EUNICE_CONFIG;
}
