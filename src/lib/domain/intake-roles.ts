export const INTAKE_ROLES = [
  'submitter',
  'parent',
  'legal_guardian',
  'fee_payer',
] as const;

export type IntakeRole = (typeof INTAKE_ROLES)[number];

export const INTAKE_ROLE_LABELS: Record<IntakeRole, string> = {
  submitter: 'Submitting parent',
  parent: 'Parent or guardian',
  legal_guardian: 'Legal guardian',
  fee_payer: 'Fee-payer or debtor',
};

export type IntakeRoleProfile = {
  role: IntakeRole;
  fullName: string;
  identityNumber: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
  notes: string;
};

export type IntakeRoleProfileField = Exclude<keyof IntakeRoleProfile, 'role'>;

export type IntakeRoleState = {
  submitter: IntakeRoleProfile;
  parent: IntakeRoleProfile;
  legalGuardian: IntakeRoleProfile;
  feePayer: IntakeRoleProfile;
};

export const INTAKE_ROLE_STATE_KEYS = [
  'submitter',
  'parent',
  'legalGuardian',
  'feePayer',
] as const satisfies ReadonlyArray<keyof IntakeRoleState>;

export const EMPTY_INTAKE_ROLE_PROFILE: IntakeRoleProfile = {
  role: 'parent',
  fullName: '',
  identityNumber: '',
  phoneNumber: '',
  emailAddress: '',
  address: '',
  notes: '',
};

export function createIntakeRoleProfile(
  role: IntakeRole,
  overrides: Partial<Omit<IntakeRoleProfile, 'role'>> = {},
): IntakeRoleProfile {
  return {
    ...EMPTY_INTAKE_ROLE_PROFILE,
    ...overrides,
    role,
  };
}

export function createEmptyIntakeRoleState(): IntakeRoleState {
  return {
    submitter: createIntakeRoleProfile('submitter'),
    parent: createIntakeRoleProfile('parent'),
    legalGuardian: createIntakeRoleProfile('legal_guardian'),
    feePayer: createIntakeRoleProfile('fee_payer'),
  };
}

export function createDefaultIntakeRoleState(): IntakeRoleState {
  return {
    submitter: createIntakeRoleProfile('submitter', {
      notes: 'Submitting parent',
    }),
    parent: createIntakeRoleProfile('parent', {
      notes: 'Primary parent or guardian',
    }),
    legalGuardian: createIntakeRoleProfile('legal_guardian', {
      notes: 'Optional unless a legal guardian is involved',
    }),
    feePayer: createIntakeRoleProfile('fee_payer', {
      notes: 'Person responsible for school fees',
    }),
  };
}
