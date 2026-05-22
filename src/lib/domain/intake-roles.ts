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

export type IntakeRoleState = {
  submitter: IntakeRoleProfile;
  parent: IntakeRoleProfile;
  legalGuardian: IntakeRoleProfile;
  feePayer: IntakeRoleProfile;
};

export const EMPTY_INTAKE_ROLE_PROFILE: IntakeRoleProfile = {
  role: 'parent',
  fullName: '',
  identityNumber: '',
  phoneNumber: '',
  emailAddress: '',
  address: '',
  notes: '',
};

export function createEmptyIntakeRoleState(): IntakeRoleState {
  return {
    submitter: { ...EMPTY_INTAKE_ROLE_PROFILE, role: 'submitter' },
    parent: { ...EMPTY_INTAKE_ROLE_PROFILE, role: 'parent' },
    legalGuardian: { ...EMPTY_INTAKE_ROLE_PROFILE, role: 'legal_guardian' },
    feePayer: { ...EMPTY_INTAKE_ROLE_PROFILE, role: 'fee_payer' },
  };
}

