import { DOCUMENT_TYPE_LABELS, type DocumentType } from '@/lib/documents/contracts';

export type ApplicationRequirementInput = {
  citizenshipStatus?: string;
  boardingStatus?: string;
  coParentContext?: string;
  financialStatus?: string;
};

export type ApplicationDocumentRequirement = {
  id: string;
  label: string;
  documentType: DocumentType;
  required: boolean;
  reason: string;
  category: 'identity' | 'school' | 'family' | 'medical' | 'financial' | 'legal' | 'supporting';
};

const BASE_REQUIRED_DOCUMENTS: ApplicationDocumentRequirement[] = [
  {
    id: 'birth-cert',
    label: DOCUMENT_TYPE_LABELS.birth_cert,
    documentType: 'birth_cert',
    required: true,
    reason: 'Learner identity and age verification.',
    category: 'identity',
  },
  {
    id: 'learner-photo',
    label: DOCUMENT_TYPE_LABELS.learner_photo,
    documentType: 'learner_photo',
    required: true,
    reason: 'Admissions identity confirmation and school records.',
    category: 'identity',
  },
  {
    id: 'motivation-letter',
    label: DOCUMENT_TYPE_LABELS.motivation_letter,
    documentType: 'motivation_letter',
    required: true,
    reason: 'Principal review requirement in the live Eunice process.',
    category: 'school',
  },
  {
    id: 'school-report',
    label: DOCUMENT_TYPE_LABELS.school_report,
    documentType: 'school_report',
    required: true,
    reason: 'Admissions review and grade placement context.',
    category: 'school',
  },
  {
    id: 'proof-residence',
    label: DOCUMENT_TYPE_LABELS.proof_residence,
    documentType: 'proof_residence',
    required: true,
    reason: 'Residential details and school records.',
    category: 'family',
  },
  {
    id: 'parent-id',
    label: DOCUMENT_TYPE_LABELS.id_copy,
    documentType: 'id_copy',
    required: true,
    reason: 'Parent or guardian identity verification.',
    category: 'identity',
  },
  {
    id: 'income-proof',
    label: DOCUMENT_TYPE_LABELS.income_proof,
    documentType: 'income_proof',
    required: true,
    reason: 'Financial review and fee verification.',
    category: 'financial',
  },
  {
    id: 'medical-aid-card',
    label: DOCUMENT_TYPE_LABELS.medical_aid_card,
    documentType: 'medical_aid_card',
    required: true,
    reason: 'Medical support and emergency-readiness details.',
    category: 'medical',
  },
  {
    id: 'immunisation-record',
    label: DOCUMENT_TYPE_LABELS.immunisation_record,
    documentType: 'immunisation_record',
    required: true,
    reason: 'Health and immunisation records required by the school.',
    category: 'medical',
  },
  {
    id: 'fee-payer-id',
    label: DOCUMENT_TYPE_LABELS.fee_payer_id_copy,
    documentType: 'fee_payer_id_copy',
    required: true,
    reason: 'Separate fee-payer or debtor identity confirmation.',
    category: 'financial',
  },
];

function isYes(value?: string) {
  return value?.trim().toLowerCase().startsWith('yes') ?? false;
}

function isNonSouthAfrican(value?: string) {
  const normalized = value?.trim().toLowerCase();
  return normalized === 'non-sa' || normalized === 'non south african' || normalized === 'non-south african';
}

function isBoarder(value?: string) {
  return value?.trim().toLowerCase() === 'boarder';
}

function isSelfEmployed(value?: string) {
  return value?.trim().toLowerCase() === 'self-employed';
}

export function getApplicationDocumentRequirements(
  input: ApplicationRequirementInput = {},
): ApplicationDocumentRequirement[] {
  const requirements = [...BASE_REQUIRED_DOCUMENTS];
  const conditionalReasons: string[] = [];

  if (isNonSouthAfrican(input.citizenshipStatus)) {
    requirements.push({
      id: 'residency-permit',
      label: DOCUMENT_TYPE_LABELS.residency_permit,
      documentType: 'residency_permit',
      required: true,
      reason: 'Passport, study permit, or permanent residence permit for non-South African applicants.',
      category: 'legal',
    });
  }

  if (isYes(input.coParentContext)) {
    requirements.push({
      id: 'custody-order',
      label: DOCUMENT_TYPE_LABELS.custody_order,
      documentType: 'custody_order',
      required: true,
      reason: 'Divorce, custody, or co-parenting order where applicable.',
      category: 'legal',
    });
  }

  if (isSelfEmployed(input.financialStatus)) {
    conditionalReasons.push('Company registration, VAT registration, SARS, or self-employment proof.');
  }

  if (isBoarder(input.boardingStatus)) {
    conditionalReasons.push('Hostel or boarding supporting documentation where requested by admissions.');
  }

  if (conditionalReasons.length > 0) {
    requirements.push({
      id: 'supporting-documents',
      label: 'Additional supporting documents',
      documentType: 'other',
      required: true,
      reason: conditionalReasons.join(' '),
      category: 'supporting',
    });
  }

  return requirements;
}

export function getRequiredDocumentTypes(input: ApplicationRequirementInput = {}) {
  return Array.from(
    new Set(
      getApplicationDocumentRequirements(input)
        .filter((requirement) => requirement.required)
        .map((requirement) => requirement.documentType),
    ),
  );
}
