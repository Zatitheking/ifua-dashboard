export enum AssignmentRole {
  SPONSOR = "sponsor",
  PROJECT_MANAGER = "project_manager",
  LEAD_CONSULTANT = "lead_consultant",
  CONTRIBUTOR = "contributor",
  REVIEWER = "reviewer",
  EXTERNAL = "external",
}

export interface ProjectAssignment {
  id: string;
  projectId: string;
  personId: string;
  assignmentRole: AssignmentRole;
  allocatedHoursPerWeek: number;
  allocationPercent: number;
  startDate: string;
  endDate: string;
  notes?: string;
  createdAt: string;
}

export const AssignmentRoleLabels: Record<AssignmentRole, string> = {
  [AssignmentRole.SPONSOR]: "Szponzor",
  [AssignmentRole.PROJECT_MANAGER]: "Projektmenedzser",
  [AssignmentRole.LEAD_CONSULTANT]: "Vezető tanácsadó",
  [AssignmentRole.CONTRIBUTOR]: "Közreműködő",
  [AssignmentRole.REVIEWER]: "Reviewer",
  [AssignmentRole.EXTERNAL]: "Külső",
};

export const AssignmentRoleColors: Record<AssignmentRole, string> = {
  [AssignmentRole.SPONSOR]: "#8B5CF6",
  [AssignmentRole.PROJECT_MANAGER]: "#3B82F6",
  [AssignmentRole.LEAD_CONSULTANT]: "#059669",
  [AssignmentRole.CONTRIBUTOR]: "#10B981",
  [AssignmentRole.REVIEWER]: "#F59E0B",
  [AssignmentRole.EXTERNAL]: "#F97316",
};
