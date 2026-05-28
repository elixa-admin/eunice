export type SchoolKey = 'eunice_primary' | 'royal_blue_academy';

export interface SchoolTenantConfig {
  key: SchoolKey;
  id: string;
  name: string;
  shortName: string;
  crestPath: string | null;
  tagline: string;
  requirementProfileKey: string;
  communicationTemplateSetKey: string;
  colors: {
    primaryLight: string;
    primaryDark: string;
    accent: string;
    gradientFrom: string;
    gradientTo: string;
  };
  admissionsRequirementNote: string;
}

export const EUNICE_CONFIG: SchoolTenantConfig = {
  key: 'eunice_primary',
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Eunice Primary School',
  shortName: 'Eunice',
  crestPath: '/crest_eunice.png',
  tagline: 'She conquers who conquers herself.',
  requirementProfileKey: 'eunice_primary_default',
  communicationTemplateSetKey: 'eunice_primary_default',
  colors: {
    primaryLight: '#f0fdf4',
    primaryDark: '#052e16',
    accent: '#ca8a04',
    gradientFrom: 'rgba(22, 163, 74, 0.09)',
    gradientTo: 'rgba(202, 138, 4, 0.06)',
  },
  admissionsRequirementNote: 'We guide families upfront on required documents to ensure a seamless admissions process.',
};

export const ROYAL_BLUE_CONFIG: SchoolTenantConfig = {
  key: 'royal_blue_academy',
  id: 'b82d3e51-cb8e-4f76-8092-123456789abc',
  name: 'Royal Blue Academy',
  shortName: 'Royal Blue',
  crestPath: '/crest_royalblue.png',
  tagline: 'Excellence in every sphere.',
  requirementProfileKey: 'royal_blue_default',
  communicationTemplateSetKey: 'royal_blue_default',
  colors: {
    primaryLight: '#eff6ff',
    primaryDark: '#1e3a8a',
    accent: '#3b82f6',
    gradientFrom: 'rgba(30, 58, 138, 0.09)',
    gradientTo: 'rgba(59, 130, 246, 0.06)',
  },
  admissionsRequirementNote: 'Welcome to the Royal Blue Academy. Please upload all verified records to complete enrollment.',
};

export const SCHOOL_CONFIGS: SchoolTenantConfig[] = [EUNICE_CONFIG, ROYAL_BLUE_CONFIG];

export const TENANT_CONFIGS: Record<string, SchoolTenantConfig> = Object.fromEntries(
  SCHOOL_CONFIGS.map((config) => [config.id, config]),
) as Record<string, SchoolTenantConfig>;

const TENANT_CONFIGS_BY_KEY: Record<SchoolKey, SchoolTenantConfig> = Object.fromEntries(
  SCHOOL_CONFIGS.map((config) => [config.key, config]),
) as Record<SchoolKey, SchoolTenantConfig>;

export const DEFAULT_TENANT_ID = EUNICE_CONFIG.id;

export function getTenantConfig(schoolId: string | null): SchoolTenantConfig {
  if (!schoolId) return EUNICE_CONFIG;
  return TENANT_CONFIGS[schoolId] || EUNICE_CONFIG;
}

export function getTenantConfigByKey(schoolKey: SchoolKey | null | undefined): SchoolTenantConfig {
  if (!schoolKey) return EUNICE_CONFIG;
  return TENANT_CONFIGS_BY_KEY[schoolKey] || EUNICE_CONFIG;
}

export function resolveTenantConfig(schoolId: string | null | undefined) {
  const config = getTenantConfig(schoolId ?? null);
  return {
    config,
    didFallback: !schoolId || config.id !== schoolId,
  };
}

export function getDefaultTenantId() {
  return DEFAULT_TENANT_ID;
}

export function getDefaultTenantConfig() {
  return EUNICE_CONFIG;
}

