export enum PersonRole {
  PARTNER = "partner",
  SPONSOR = "sponsor",
  PROJECT_MANAGER = "project_manager",
  SENIOR_CONSULTANT = "senior_consultant",
  CONSULTANT = "consultant",
  ANALYST = "analyst",
  EXTERNAL_EXPERT = "external_expert",
}

export enum CompetencyCenter {
  IT_DIGITAL = "it_digital",
  FINANCE = "finance",
  STRATEGY = "strategy",
  OPERATIONS = "operations",
  HR_CHANGE = "hr_change",
  DATA_AI = "data_ai",
}

export interface Person {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: PersonRole;
  title: string;
  competencyCenter: CompetencyCenter | null;
  isExternal: boolean;
  externalOrg?: string;
  availableHoursPerWeek: number;
  skills: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const PersonRoleLabels: Record<PersonRole, string> = {
  [PersonRole.PARTNER]: "Partner",
  [PersonRole.SPONSOR]: "Szponzor",
  [PersonRole.PROJECT_MANAGER]: "Projektmenedzser",
  [PersonRole.SENIOR_CONSULTANT]: "Senior Tanácsadó",
  [PersonRole.CONSULTANT]: "Tanácsadó",
  [PersonRole.ANALYST]: "Analyst",
  [PersonRole.EXTERNAL_EXPERT]: "Külső szakértő",
};

export const PersonRoleBadgeColors: Record<PersonRole, string> = {
  [PersonRole.PARTNER]: "bg-amber-100 text-amber-800 border-amber-300",
  [PersonRole.SPONSOR]: "bg-purple-100 text-purple-800 border-purple-300",
  [PersonRole.PROJECT_MANAGER]: "bg-blue-100 text-blue-800 border-blue-300",
  [PersonRole.SENIOR_CONSULTANT]: "bg-emerald-100 text-emerald-800 border-emerald-300",
  [PersonRole.CONSULTANT]: "bg-green-100 text-green-800 border-green-300",
  [PersonRole.ANALYST]: "bg-gray-100 text-gray-700 border-gray-300",
  [PersonRole.EXTERNAL_EXPERT]: "bg-orange-100 text-orange-800 border-orange-300",
};

export const PersonRoleShort: Record<PersonRole, string> = {
  [PersonRole.PARTNER]: "PART",
  [PersonRole.SPONSOR]: "SPONS",
  [PersonRole.PROJECT_MANAGER]: "PM",
  [PersonRole.SENIOR_CONSULTANT]: "SR CONS",
  [PersonRole.CONSULTANT]: "CONS",
  [PersonRole.ANALYST]: "ANA",
  [PersonRole.EXTERNAL_EXPERT]: "EXT",
};

export const CompetencyCenterLabels: Record<CompetencyCenter, string> = {
  [CompetencyCenter.IT_DIGITAL]: "IT & Digitális",
  [CompetencyCenter.FINANCE]: "Pénzügy",
  [CompetencyCenter.STRATEGY]: "Stratégia",
  [CompetencyCenter.OPERATIONS]: "Operáció",
  [CompetencyCenter.HR_CHANGE]: "HR & Change",
  [CompetencyCenter.DATA_AI]: "Adat & AI",
};
