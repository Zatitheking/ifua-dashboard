export enum PipelineStatus {
  LEAD = "lead",
  QUALIFICATION = "qualification",
  PROPOSAL = "proposal",
  SUBMITTED = "submitted",
  NEGOTIATION = "negotiation",
  WON = "won",
  ACTIVE = "active",
  COMPLETED = "completed",
  LOST = "lost",
  ON_HOLD = "on_hold",
}

export enum Industry {
  BANKING = "banking",
  INSURANCE = "insurance",
  TELECOM = "telecom",
  ENERGY = "energy",
  MANUFACTURING = "manufacturing",
  PHARMA = "pharma",
  RETAIL = "retail",
  PUBLIC_SECTOR = "public_sector",
  IT = "it",
  AUTOMOTIVE = "automotive",
  LOGISTICS = "logistics",
  FMCG = "fmcg",
}

export enum ProjectType {
  STRATEGY = "strategy",
  OPERATIONS = "operations",
  IT_DIGITAL = "it_digital",
  FINANCE = "finance",
  HR_CHANGE = "hr_change",
  DATA_AI = "data_ai",
}

export interface Project {
  id: string;
  company: string;
  industry: Industry;
  projectName: string;
  projectType: ProjectType;
  status: PipelineStatus;
  expectedRevenue: number;
  probability: number;
  weightedRevenue: number;
  startDate: string;
  endDate: string;
  sponsorId: string | null;
  projectManagerId: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const PipelineStatusLabels: Record<PipelineStatus, string> = {
  [PipelineStatus.LEAD]: "Érdeklődés",
  [PipelineStatus.QUALIFICATION]: "Igényfelmérés",
  [PipelineStatus.PROPOSAL]: "Ajánlatkészítés",
  [PipelineStatus.SUBMITTED]: "Ajánlat beadva",
  [PipelineStatus.NEGOTIATION]: "Tárgyalás",
  [PipelineStatus.WON]: "Megnyert",
  [PipelineStatus.ACTIVE]: "Futó projekt",
  [PipelineStatus.COMPLETED]: "Befejezett",
  [PipelineStatus.LOST]: "Elveszített",
  [PipelineStatus.ON_HOLD]: "Felfüggesztett",
};

export const PipelineStatusColors: Record<PipelineStatus, string> = {
  [PipelineStatus.LEAD]: "#94A3B8",
  [PipelineStatus.QUALIFICATION]: "#A78BFA",
  [PipelineStatus.PROPOSAL]: "#60A5FA",
  [PipelineStatus.SUBMITTED]: "#38BDF8",
  [PipelineStatus.NEGOTIATION]: "#F59E0B",
  [PipelineStatus.WON]: "#10B981",
  [PipelineStatus.ACTIVE]: "#059669",
  [PipelineStatus.COMPLETED]: "#6366F1",
  [PipelineStatus.LOST]: "#EF4444",
  [PipelineStatus.ON_HOLD]: "#9CA3AF",
};

export const PipelineStatusDefaults: Record<PipelineStatus, number> = {
  [PipelineStatus.LEAD]: 10,
  [PipelineStatus.QUALIFICATION]: 20,
  [PipelineStatus.PROPOSAL]: 35,
  [PipelineStatus.SUBMITTED]: 50,
  [PipelineStatus.NEGOTIATION]: 70,
  [PipelineStatus.WON]: 90,
  [PipelineStatus.ACTIVE]: 95,
  [PipelineStatus.COMPLETED]: 100,
  [PipelineStatus.LOST]: 0,
  [PipelineStatus.ON_HOLD]: 25,
};

export const IndustryLabels: Record<Industry, string> = {
  [Industry.BANKING]: "Bankszektor",
  [Industry.INSURANCE]: "Biztosítás",
  [Industry.TELECOM]: "Telekommunikáció",
  [Industry.ENERGY]: "Energia",
  [Industry.MANUFACTURING]: "Gyártás",
  [Industry.PHARMA]: "Gyógyszeripar",
  [Industry.RETAIL]: "Kiskereskedelem",
  [Industry.PUBLIC_SECTOR]: "Közszféra",
  [Industry.IT]: "IT",
  [Industry.AUTOMOTIVE]: "Autóipar",
  [Industry.LOGISTICS]: "Logisztika",
  [Industry.FMCG]: "FMCG",
};

export const ProjectTypeLabels: Record<ProjectType, string> = {
  [ProjectType.STRATEGY]: "Stratégia",
  [ProjectType.OPERATIONS]: "Operáció",
  [ProjectType.IT_DIGITAL]: "IT & Digitális",
  [ProjectType.FINANCE]: "Pénzügy",
  [ProjectType.HR_CHANGE]: "HR & Change",
  [ProjectType.DATA_AI]: "Adat & AI",
};

export const PIPELINE_ORDER: PipelineStatus[] = [
  PipelineStatus.LEAD,
  PipelineStatus.QUALIFICATION,
  PipelineStatus.PROPOSAL,
  PipelineStatus.SUBMITTED,
  PipelineStatus.NEGOTIATION,
  PipelineStatus.WON,
  PipelineStatus.ACTIVE,
  PipelineStatus.COMPLETED,
];
